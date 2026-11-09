#!/usr/bin/env node
// Analyses a card sort from a long CSV of participant, card, category.
// Open sorts: similarity matrix, average-linkage clusters, cards between clusters, names people used.
// Closed sorts (--closed): share of people placing each card in each category, cards with no clear home.
// Hybrid sorts (--closed --categories): the same against the offered list, with added groups reported as additions.
// Can also check a card list for wording problems before a study. Run with --self-test to prove it.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

class InputError extends Error {}

const USAGE = `Usage:
  node analyze-sort.mjs <file.csv> [--cut 50] [--json]      open sort
  node analyze-sort.mjs <file.csv> --closed [--json]        closed sort
  node analyze-sort.mjs <file.csv> --closed --categories categories.txt [--json]        closed or hybrid sort against the offered list
  node analyze-sort.mjs --check-cards cards.txt [--categories categories.txt] [--json]
  node analyze-sort.mjs --self-test

The CSV needs the columns participant, card, category, with one row per card per participant.
The check files list one card or category per line.`;

const TOGETHER = 70; // pairs at or above this belong together
const APART = 30; // pairs at or below this belong apart
const BETWEEN_MARGIN = 15; // a card is between clusters when its own cluster pulls less than this much harder
const CLEAR_HOME = 70;
const LEANING_HOME = 50;
const SPLIT_MARGIN = 10;
const MIN_PATTERN = 8; // below this a sort is only a pilot
const MIN_FULL = 15; // below this a sort shows the dominant pattern only
const MAX_CARDS = 60;
const MIN_CARDS = 30;
const SHOWN = 20;
const UNSORTED = '__left_unsorted__';

const CATCH_ALL = new Set([
  'other', 'others', 'misc', 'miscellaneous', 'unknown', 'unsure', 'not sure', 'none', 'n a', 'na', 'idk',
  'don t know', 'dont know', 'do not know', 'no idea', 'uncategorized', 'uncategorised', 'unsorted',
  'does not fit', 'doesn t fit', 'cannot sort', 'can t sort', 'stuff', 'things', 'random', 'random stuff', 'random things',
  'everything else', 'the rest', 'rest', 'leftovers', 'left overs',
]);
const PILE_FILLER = new Set(['stuff', 'things', 'thing', 'items', 'item', 'cards', 'card', 'pages', 'page', 'bits', 'topics', 'content', 'etc', 'and', 'the', 'these', 'some', 'random']);
const UNSURE_PILE = /^(not sure|unsure|don t know|dont know|do not know|no idea|cannot sort|can t sort)( |$)/;

const STOPWORDS = new Set(('a about after all an and any are as at be by can do does for from get has have how i if in into is it its '
  + 'my new no not of on or our out over so some than that the their them then these this to up us we what when where which who why '
  + 'will with you your').split(' '));

// CSV ----------------------------------------------------------------------

function parseCsv(text) {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows = [];
  let cells = [];
  let field = '';
  let quoted = false;
  let line = 1;
  let rowLine = 1;
  let quoteLine = 1;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else {
        if (c === '\n') line++;
        field += c;
      }
    } else if (c === '"' && field === '') {
      quoted = true;
      quoteLine = line;
    } else if (c === ',') {
      cells.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      cells.push(field);
      rows.push({ cells, line: rowLine });
      cells = [];
      field = '';
      line++;
      rowLine = line;
    } else {
      field += c;
    }
  }
  if (quoted) throw new InputError(`A quoted value opened on line ${quoteLine} is never closed. Check for a stray double quote.`);
  if (field !== '' || cells.length) {
    cells.push(field);
    rows.push({ cells, line: rowLine });
  }
  return rows.filter((r) => r.cells.some((c) => c.trim() !== ''));
}

function readTable(text, label) {
  const rows = parseCsv(text);
  if (!rows.length) throw new InputError(`${label} is empty.`);
  const header = rows[0].cells.map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'));
  const records = rows.slice(1).map((r) => {
    const extra = r.cells.slice(header.length).filter((c) => c.trim() !== '');
    if (extra.length) {
      throw new InputError(`${label} line ${r.line} has ${r.cells.length} fields but the header has ${header.length}. Wrap any value containing a comma in double quotes.`);
    }
    const record = { _line: r.line };
    header.forEach((h, i) => { record[h] = (r.cells[i] ?? '').trim(); });
    return record;
  });
  return { header, records };
}

// Helpers ------------------------------------------------------------------

// Keeps the symbols that tell names apart, so C# and C++ stay two cards.
const norm = (s) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}#+&@%$]+/gu, ' ').trim();
const isCatchAll = (key) => key === '' || CATCH_ALL.has(key) || UNSURE_PILE.test(key)
  || CATCH_ALL.has(key.split(' ').filter((word) => !PILE_FILLER.has(word)).join(' '));
const round1 = (x) => Math.round(x * 10) / 10;
const pct = (x) => `${Math.round(x)}%`;
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

function adjustedWald(x, n, z = 1.96) {
  const zz = z * z;
  const p = (x + zz / 2) / (n + zz);
  const margin = z * Math.sqrt((p * (1 - p)) / (n + zz));
  return { low: Math.max(0, p - margin) * 100, high: Math.min(1, p + margin) * 100 };
}

function stem(word) {
  let s = word;
  if (s.length > 4 && s.endsWith('ies')) s = `${s.slice(0, -3)}y`;
  else if (s.length > 4 && s.endsWith('ing')) s = s.slice(0, -3);
  else if (s.length > 3 && s.endsWith('ed')) s = s.slice(0, -2);
  else if (s.length > 3 && s.endsWith('es')) s = s.slice(0, -2);
  else if (s.length > 3 && s.endsWith('s') && !s.endsWith('ss')) s = s.slice(0, -1);
  if (s.length > 3 && s.endsWith('e')) s = s.slice(0, -1);
  if (s.length > 3 && s.at(-1) === s.at(-2)) s = s.slice(0, -1);
  return s;
}

const contentWords = (text) => norm(text).split(' ').filter((w) => w && w.length > 1 && !STOPWORDS.has(w) && !/^\d+$/.test(w));

// Loading ------------------------------------------------------------------

function loadSort(text, label) {
  const { header, records } = readTable(text, label);
  const missing = ['participant', 'card', 'category'].filter((c) => !header.includes(c));
  if (missing.length) {
    throw new InputError(`${label} is missing the column(s): ${missing.join(', ')}. Found: ${header.join(', ')}. Expected long format, one row per card per participant.`);
  }
  if (!records.length) throw new InputError(`${label} has a header but no rows.`);

  const names = new Map();
  const participants = new Map();
  let blank = 0;
  let repeated = 0;
  let conflicting = 0;
  for (const r of records) {
    if (!r.participant || !r.card) { blank++; continue; }
    const cardKey = norm(r.card) || r.card;
    if (!names.has(cardKey)) names.set(cardKey, r.card);
    if (!participants.has(r.participant)) participants.set(r.participant, new Map());
    const placed = participants.get(r.participant);
    const key = norm(r.category);
    if (placed.has(cardKey)) {
      if (placed.get(cardKey).key === key) repeated++; else conflicting++;
    } else {
      placed.set(cardKey, { raw: r.category, key });
    }
  }
  if (!participants.size) throw new InputError(`${label} has no row with both a participant and a card.`);
  const warnings = [];
  if (blank) warnings.push(`${blank} row(s) had no participant or no card and were ignored.`);
  if (repeated) warnings.push(`${repeated} repeated row(s) were ignored.`);
  if (conflicting) warnings.push(`${conflicting} time(s) a participant placed the same card in a second category. Only the first placement was kept.`);

  const cards = [...names].map(([key, name]) => ({ key, name })).sort((a, b) => a.name.localeCompare(b.name));
  if (cards.length < 2) throw new InputError(`${label} has only ${cards.length} card. A sort needs at least two.`);
  const incomplete = [...participants].filter(([, placed]) => placed.size < cards.length).map(([p]) => p);
  if (incomplete.length) {
    warnings.push(`${incomplete.length} of ${participants.size} participants did not sort every card (${incomplete.slice(0, 5).join(', ')}${incomplete.length > 5 ? ', ...' : ''}). Each percentage uses only the people who handled that card or pair.`);
  }
  return { cards, participants, warnings };
}

function sizeWarnings(n, cardCount, what) {
  const warnings = [];
  if (n < MIN_PATTERN) {
    warnings.push(`Only ${n} participant${n === 1 ? '' : 's'}. That is too few for ${what}. Treat this as a pilot of the cards and instructions, and report no pattern from it.`);
  } else if (n < MIN_FULL) {
    warnings.push(`${n} participants is enough to see a dominant pattern on a small site, not for ${what} on an expensive decision. The usual range is ${MIN_FULL} to 30.`);
  }
  if (cardCount > MAX_CARDS) warnings.push(`${cardCount} cards is more than the ${MAX_CARDS} people can usually sort carefully. Late placements may be careless.`);
  return warnings;
}

// Clustering ---------------------------------------------------------------

function averageLinkage(sim) {
  const s = sim.map((row) => row.slice());
  let active = sim.map((_, i) => ({ id: i, members: [i] }));
  const merges = [];
  while (active.length > 1) {
    let best = -Infinity;
    let bi = 0;
    let bj = 1;
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const v = s[active[i].id][active[j].id];
        if (v > best + 1e-9) { best = v; bi = i; bj = j; }
      }
    }
    const a = active[bi];
    const b = active[bj];
    for (const c of active) {
      if (c === a || c === b) continue;
      const v = (a.members.length * s[a.id][c.id] + b.members.length * s[b.id][c.id]) / (a.members.length + b.members.length);
      s[a.id][c.id] = v;
      s[c.id][a.id] = v;
    }
    merges.push({ similarity: best, a: a.members.slice(), b: b.members.slice() });
    active = active.filter((c) => c !== b).map((c) => (c === a ? { id: a.id, members: [...a.members, ...b.members] } : c));
  }
  return { merges, order: active[0].members };
}

function clustersAt(count, merges, cut) {
  let groups = Array.from({ length: count }, (_, i) => [i]);
  for (const m of merges) {
    if (m.similarity + 1e-9 < cut) break;
    const a = groups.find((g) => g.includes(m.a[0]));
    const b = groups.find((g) => g.includes(m.b[0]));
    groups = groups.filter((g) => g !== a && g !== b);
    groups.push([...a, ...b]);
  }
  return groups.sort((x, y) => y.length - x.length || Math.min(...x) - Math.min(...y));
}

// Open sort ----------------------------------------------------------------

function analyzeOpen(data, cut) {
  const { cards, participants } = data;
  const count = cards.length;
  const n = participants.size;
  const index = new Map(cards.map((c, i) => [c.key, i]));
  const zeros = () => Array.from({ length: count }, () => new Array(count).fill(0));
  const together = zeros();
  const handledBoth = zeros();
  const handled = new Array(count).fill(0);
  const parked = new Array(count).fill(0);
  const alone = new Array(count).fill(0);
  const nameStats = new Map();
  const rawNames = new Set();
  const groupCounts = [];

  for (const placed of participants.values()) {
    const entries = [...placed].map(([cardKey, p]) => ({ i: index.get(cardKey), key: isCatchAll(p.key) ? null : p.key, raw: p.raw }));
    const sizes = new Map();
    for (const e of entries) {
      handled[e.i]++;
      if (e.raw) rawNames.add(e.raw);
      if (e.key === null) parked[e.i]++;
      else sizes.set(e.key, (sizes.get(e.key) ?? 0) + 1);
    }
    groupCounts.push(sizes.size);
    for (const e of entries) if (e.key !== null && sizes.get(e.key) === 1) alone[e.i]++;
    for (let a = 0; a < entries.length; a++) {
      for (let b = a + 1; b < entries.length; b++) {
        const x = entries[a];
        const y = entries[b];
        handledBoth[x.i][y.i]++;
        handledBoth[y.i][x.i]++;
        if (x.key !== null && x.key === y.key) {
          together[x.i][y.i]++;
          together[y.i][x.i]++;
        }
      }
    }
    const seen = new Set();
    for (const e of entries) {
      if (e.key === null) continue;
      if (!nameStats.has(e.key)) nameStats.set(e.key, { participants: 0, spellings: new Map() });
      const stat = nameStats.get(e.key);
      stat.spellings.set(e.raw, (stat.spellings.get(e.raw) ?? 0) + 1);
      if (!seen.has(e.key)) { stat.participants++; seen.add(e.key); }
    }
  }

  const display = (key) => [...nameStats.get(key).spellings].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
  const sim = zeros();
  let noOverlap = 0;
  for (let a = 0; a < count; a++) {
    sim[a][a] = 100;
    for (let b = a + 1; b < count; b++) {
      if (!handledBoth[a][b]) noOverlap++;
      const v = handledBoth[a][b] ? (together[a][b] / handledBoth[a][b]) * 100 : 0;
      sim[a][b] = v;
      sim[b][a] = v;
    }
  }

  const { merges, order } = averageLinkage(sim);
  const groups = clustersAt(count, merges, cut);
  const groupOf = new Array(count);
  groups.forEach((g, i) => g.forEach((c) => { groupOf[c] = i; }));

  const clusters = groups.map((g) => {
    const pairs = [];
    for (let a = 0; a < g.length; a++) for (let b = a + 1; b < g.length; b++) pairs.push(sim[g[a]][g[b]]);
    const labelCounts = new Map();
    for (const placed of participants.values()) {
      const used = new Set(g.map((c) => placed.get(cards[c].key)?.key).filter((k) => k && !isCatchAll(k)));
      for (const k of used) labelCounts.set(k, (labelCounts.get(k) ?? 0) + 1);
    }
    return {
      cards: g.map((c) => cards[c].name),
      agreementPct: pairs.length ? round1(mean(pairs)) : null,
      commonNames: [...labelCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3).map(([k, c]) => ({ name: display(k), participants: c })),
    };
  });

  const between = [];
  for (let c = 0; c < count; c++) {
    const own = groups[groupOf[c]].filter((x) => x !== c);
    const ownPull = own.length ? mean(own.map((x) => sim[c][x])) : null;
    let best = -1;
    let bestGroup = null;
    groups.forEach((g, i) => {
      if (i === groupOf[c]) return;
      const v = mean(g.map((x) => sim[c][x]));
      if (v > best) { best = v; bestGroup = i; }
    });
    if (bestGroup === null || best < APART) continue;
    if (ownPull === null || ownPull - best < BETWEEN_MARGIN) {
      between.push({
        card: cards[c].name,
        ownClusterPct: ownPull === null ? null : round1(ownPull),
        nextCluster: clusters[bestGroup].cards.slice(0, 3).join(', '),
        nextClusterPct: round1(best),
      });
    }
  }

  const pairs = [];
  for (let a = 0; a < count; a++) for (let b = a + 1; b < count; b++) pairs.push({ a: cards[a].name, b: cards[b].name, pct: round1(sim[a][b]) });
  pairs.sort((x, y) => y.pct - x.pct || x.a.localeCompare(y.a) || x.b.localeCompare(y.b));

  const scattered = cards.map((card, c) => ({ card: card.name, strongestPct: round1(Math.max(...sim[c].filter((_, i) => i !== c))) }))
    .filter((x) => x.strongestPct < APART);
  const often = (values) => cards.map((card, c) => ({ card: card.name, count: values[c], handled: handled[c] }))
    .filter((x) => x.handled && (x.count / x.handled) * 100 >= APART).sort((a, b) => b.count - a.count);

  const warnings = [...sizeWarnings(n, count, 'clustering'), ...data.warnings];
  if (noOverlap) warnings.push(`${noOverlap} card pair(s) were never seen by the same participant and count as 0%.`);
  const nameSets = [...participants.values()].map((placed) => [...new Set([...placed.values()].map((p) => p.key))].sort().join('|'));
  if (n > 1 && new Set(nameSets).size === 1) warnings.push('Every participant used exactly the same category names. If they were given those names, this is a closed sort: re-run with --closed.');

  const margin = adjustedWald(0.7 * n, n);
  return {
    mode: 'open',
    participants: n,
    cards: count,
    cutPct: cut,
    warnings,
    precision: { sharePct: 70, lowPct: round1(margin.low), highPct: round1(margin.high) },
    clusterCountByCut: [90, 80, 70, 60, 50, 40, 30, 20].map((c) => ({ cutPct: c, clusters: clustersAt(count, merges, c).length })),
    clusters,
    singleCardClusters: clusters.filter((c) => c.cards.length === 1).map((c) => c.cards[0]),
    betweenClusters: between,
    noStrongPartner: scattered,
    parkedInCatchAll: often(parked),
    oftenLeftAlone: often(alone),
    categoryNames: {
      distinctAsTyped: rawNames.size,
      distinctNormalised: nameStats.size,
      groupsPerParticipant: { mean: round1(mean(groupCounts)), min: Math.min(...groupCounts), max: Math.max(...groupCounts) },
      common: [...nameStats.keys()].map((k) => ({ name: display(k), participants: nameStats.get(k).participants }))
        .sort((a, b) => b.participants - a.participants || a.name.localeCompare(b.name)),
    },
    strongPairs: pairs.filter((p) => p.pct >= TOGETHER),
    middlePairs: pairs.filter((p) => p.pct > APART && p.pct < TOGETHER),
    matrix: { order: order.map((c) => cards[c].name), percent: order.map((a) => order.map((b) => round1(sim[a][b]))) },
    merges: merges.map((m) => ({ similarityPct: round1(m.similarity), a: m.a.map((c) => cards[c].name), b: m.b.map((c) => cards[c].name) })),
  };
}

// Closed sort --------------------------------------------------------------

function analyzeClosed(data, offeredText) {
  const { cards, participants } = data;
  const n = participants.size;
  const offered = offeredText === undefined ? null : new Map(lines(offeredText).map((c) => [norm(c), c]));
  if (offered && !offered.size) throw new InputError('The category list is empty. Give one category per line.');
  const spellings = new Map();
  const usedBy = new Map();
  const counts = cards.map(() => new Map());
  const totals = new Array(cards.length).fill(0);
  cards.forEach((card, c) => {
    for (const [person, placed] of participants) {
      const p = placed.get(card.key);
      if (!p) continue;
      totals[c]++;
      const key = p.key === '' || (offered && !offered.has(p.key) && isCatchAll(p.key)) ? UNSORTED : p.key;
      counts[c].set(key, (counts[c].get(key) ?? 0) + 1);
      if (key !== UNSORTED) {
        if (!spellings.has(key)) spellings.set(key, new Map());
        spellings.get(key).set(p.raw, (spellings.get(key).get(p.raw) ?? 0) + 1);
        if (!usedBy.has(key)) usedBy.set(key, new Set());
        usedBy.get(key).add(person);
      }
    }
  });
  const name = (key) => (key === UNSORTED ? '(left unsorted)' : offered?.get(key) ?? [...spellings.get(key)].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0]);
  const categories = (offered ? [...offered.keys()] : [...spellings.keys()]).map(name).sort((a, b) => a.localeCompare(b));

  const rows = cards.map((card, c) => {
    const ranked = [...counts[c]].sort((a, b) => b[1] - a[1] || name(a[0]).localeCompare(name(b[0])))
      .map(([key, count]) => ({ key, category: name(key), count, pct: round1((count / totals[c]) * 100) }));
    const [top, second] = ranked;
    let status;
    let reason;
    if (!top || top.key === UNSORTED) { status = 'none'; reason = 'most people left it unsorted'; }
    else if (second && top.pct - second.pct < SPLIT_MARGIN) { status = 'none'; reason = `split between ${top.category} and ${second.category}`; }
    else if (top.pct < LEANING_HOME) { status = 'none'; reason = `no category reaches ${LEANING_HOME}%`; }
    else if (top.pct < CLEAR_HOME) { status = 'leaning'; reason = `below the ${CLEAR_HOME}% line`; }
    else { status = 'clear'; reason = ''; }
    const ci = top ? adjustedWald(top.count, totals[c]) : null;
    return {
      card: card.name,
      n: totals[c],
      status,
      reason,
      top: top ? { category: top.category, pct: top.pct, lowPct: round1(ci.low), highPct: round1(ci.high) } : null,
      placements: ranked.map(({ category, count, pct: share }) => ({ category, count, pct: share })),
    };
  });

  const clearByCategory = new Map(categories.map((c) => [c, 0]));
  for (const row of rows) if (row.status === 'clear' && clearByCategory.has(row.top.category)) clearByCategory.set(row.top.category, clearByCategory.get(row.top.category) + 1);
  const additions = offered === null ? null : [...spellings.keys()].filter((key) => !offered.has(key)).map((key) => ({
    category: name(key),
    participants: usedBy.get(key).size,
    cards: counts.filter((m) => m.has(key)).length,
    topPlacementFor: rows.filter((r) => r.top?.category === name(key)).map((r) => r.card),
  })).sort((a, b) => b.participants - a.participants || a.category.localeCompare(b.category));
  const warnings = [...sizeWarnings(n, cards.length, 'percentages per category'), ...data.warnings];
  if (!offered && categories.length > 15) warnings.push(`${categories.length} different category names is a lot for a closed sort. If people made up their own, this is an open sort: re-run without --closed. If they added groups to a list you offered, this is a hybrid: add --categories categories.txt.`);
  const margin = adjustedWald(0.7 * n, n);
  return {
    mode: additions?.length ? 'hybrid' : 'closed',
    participants: n,
    cards: cards.length,
    warnings,
    precision: { sharePct: 70, lowPct: round1(margin.low), highPct: round1(margin.high) },
    categories: categories.map((c) => ({ category: c, cardsWithClearHome: clearByCategory.get(c) })),
    categoriesHoldingNothing: categories.filter((c) => clearByCategory.get(c) === 0),
    additions,
    noClearHome: rows.filter((r) => r.status === 'none').map((r) => ({ card: r.card, reason: r.reason, top: r.top })),
    leaning: rows.filter((r) => r.status === 'leaning').map((r) => ({ card: r.card, top: r.top })),
    cardsDetail: rows,
  };
}

// Card list check ----------------------------------------------------------

function lines(text) {
  const all = text.split(/\r?\n/).map((s) => s.trim().replace(/^"(.*)"$/, '$1')).filter(Boolean);
  return all[0]?.toLowerCase() === 'card' || all[0]?.toLowerCase() === 'category' ? all.slice(1) : all;
}

function checkCards(cardsText, categoriesText) {
  const list = lines(cardsText);
  if (!list.length) throw new InputError('The card list is empty. Give one card per line.');
  const notes = [];
  if (list.length > MAX_CARDS) notes.push(`${list.length} cards is more than the ${MAX_CARDS} people can usually sort carefully. Cut or split the set.`);
  else if (list.length < MIN_CARDS) notes.push(`${list.length} cards is below the usual ${MIN_CARDS} to ${MAX_CARDS}. That is fine when the site is that small, but check the set covers every section.`);

  const seen = new Map();
  for (const card of list) {
    const key = norm(card);
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(card);
  }
  const duplicates = [...seen.values()].filter((g) => g.length > 1);

  const stems = new Map();
  for (const card of list) {
    for (const word of contentWords(card)) {
      const stemmed = stem(word);
      if (!stems.has(stemmed)) stems.set(stemmed, { word, cards: new Set() });
      stems.get(stemmed).cards.add(card);
    }
  }
  const sharedWords = [...stems.values()].filter((s) => s.cards.size > 1)
    .map((s) => ({ word: s.word, cards: [...s.cards] })).sort((a, b) => b.cards.length - a.cards.length || a.word.localeCompare(b.word));

  const internalCode = list.filter((c) => /\b[A-Z]{2,}[-_]?\d+\b|\b\w+_\w+\b|\b[A-Z]{3,}\b/.test(c));

  let givesAnswerAway = [];
  if (categoriesText !== undefined) {
    const categoryStems = new Map();
    for (const category of lines(categoriesText)) for (const w of contentWords(category)) categoryStems.set(stem(w), category);
    givesAnswerAway = list.flatMap((card) => {
      const hit = contentWords(card).find((w) => categoryStems.has(stem(w)));
      return hit ? [{ card, word: hit, category: categoryStems.get(stem(hit)) }] : [];
    });
  }
  return { cards: list.length, notes, duplicates, sharedWords, internalCode, givesAnswerAway };
}

// Output -------------------------------------------------------------------

function header(report, out) {
  out.push(`${{ open: 'Open', closed: 'Closed', hybrid: 'Hybrid' }[report.mode]} card sort`, `Participants: ${report.participants}    Cards: ${report.cards}`);
  if (report.warnings.length) out.push('', 'WARNINGS', ...report.warnings.map((w) => `  ! ${w}`));
  out.push('', `Precision: at this n, a ${report.precision.sharePct}% share has a 95% interval of about ${pct(report.precision.lowPct)} to ${pct(report.precision.highPct)}.`);
}

function section(out, title, entries, fmt, empty = 'none') {
  out.push('', `${title}: ${entries.length ? entries.length : empty}`);
  entries.slice(0, SHOWN).forEach((x) => out.push(`  - ${fmt(x)}`));
  if (entries.length > SHOWN) out.push(`  ... and ${entries.length - SHOWN} more (--json lists them all)`);
}

function renderOpen(r) {
  const out = [];
  header(r, out);
  out.push('', 'Clusters at each cut (cut = minimum average similarity to join)');
  out.push(`  ${r.clusterCountByCut.map((c) => `${c.cutPct}%: ${c.clusters}`).join('   ')}`);
  out.push('', `Proposed clusters at a ${r.cutPct}% cut`);
  r.clusters.forEach((c, i) => {
    const names = c.commonNames.map((x) => `${x.name} (${x.participants})`).join(', ') || 'none';
    out.push(`  ${i + 1}. agreement ${c.agreementPct === null ? 'n/a, single card' : `${c.agreementPct}%`}; names people used: ${names}`);
    c.cards.forEach((card) => out.push(`       ${card}`));
  });
  section(out, `Cards between clusters (own cluster pulls less than ${BETWEEN_MARGIN} points harder than the next)`, r.betweenClusters,
    (x) => `${x.card}: own ${x.ownClusterPct === null ? 'n/a' : `${x.ownClusterPct}%`}, next ${x.nextClusterPct}% (${x.nextCluster})`);
  section(out, 'Single-card clusters at this cut', r.singleCardClusters, (x) => x);
  section(out, `Cards with no strong partner (best pair under ${APART}%)`, r.noStrongPartner, (x) => `${x.card}: best pair ${x.strongestPct}%`);
  section(out, `Cards parked in a catch-all pile or left blank by ${APART}% or more`, r.parkedInCatchAll, (x) => `${x.card}: ${x.count} of ${x.handled}`);
  section(out, `Cards left alone in a pile by ${APART}% or more`, r.oftenLeftAlone, (x) => `${x.card}: ${x.count} of ${x.handled}`);
  const names = r.categoryNames;
  out.push('', `Category names: ${names.distinctAsTyped} as typed, ${names.distinctNormalised} after normalising case and punctuation`);
  out.push(`Piles per participant: mean ${names.groupsPerParticipant.mean}, range ${names.groupsPerParticipant.min} to ${names.groupsPerParticipant.max}`);
  names.common.slice(0, SHOWN).forEach((x) => out.push(`  ${String(x.participants).padStart(3)}  ${x.name}`));
  section(out, `Strong pairs (${TOGETHER}% or more)`, r.strongPairs, (x) => `${x.pct}%  ${x.a} + ${x.b}`);
  section(out, `Middle band (between ${APART}% and ${TOGETHER}%), where the decisions are`, r.middlePairs, (x) => `${x.pct}%  ${x.a} + ${x.b}`);
  out.push('', 'Similarity matrix (% of participants who grouped the pair, cards in cluster order)');
  const width = Math.min(30, Math.max(...r.matrix.order.map((c) => c.length)));
  out.push(`  ${''.padEnd(width + 4)}${r.matrix.order.map((_, i) => String(i + 1).padStart(4)).join('')}`);
  r.matrix.order.forEach((card, i) => {
    const cells = r.matrix.percent[i].map((v, j) => (i === j ? '   .' : String(Math.round(v)).padStart(4))).join('');
    out.push(`  ${String(i + 1).padStart(2)}. ${card.slice(0, width).padEnd(width)}${cells}`);
  });
  out.push('', 'This shows how these people grouped these cards. It does not show that anyone can find anything in a structure built from it, and clustering returns a tree even from noise.');
  return out.join('\n');
}

function renderClosed(r) {
  const out = [];
  header(r, out);
  const interval = (t) => `${t.pct}% in ${t.category} (95% interval ${pct(t.lowPct)} to ${pct(t.highPct)})`;
  section(out, `Cards with no clear home`, r.noClearHome, (x) => `${x.card}: ${x.reason}${x.top ? `; top ${interval(x.top)}` : ''}`);
  section(out, `Cards leaning (${LEANING_HOME}% to ${CLEAR_HOME - 1}%)`, r.leaning, (x) => `${x.card}: ${interval(x.top)}`);
  section(out, 'Categories that are the clear home of no card', r.categoriesHoldingNothing, (x) => x);
  if (r.additions) {
    section(out, 'Groups participants added (not on the offered list)', r.additions,
      (x) => `${x.category}: ${x.participants} ${x.participants === 1 ? 'person' : 'people'}, ${x.cards} card${x.cards === 1 ? '' : 's'}${x.topPlacementFor.length ? `; top placement for ${x.topPlacementFor.join(', ')}` : ''}`);
  }
  out.push('', 'Cards with a clear home, per category');
  r.categories.forEach((c) => out.push(`  ${String(c.cardsWithClearHome).padStart(3)}  ${c.category}`));
  out.push('', 'Share of participants placing each card in each category');
  r.cardsDetail.forEach((row) => {
    out.push(`  ${row.card} (n=${row.n}, ${row.status})`);
    out.push(`      ${row.placements.map((p) => `${p.category} ${p.pct}%`).join('   ')}`);
  });
  out.push('', 'This tests the categories offered. It does not show that they are the best available or that people can find anything in them.');
  return out.join('\n');
}

function renderCheck(r) {
  const out = [`Card list check: ${r.cards} cards`];
  r.notes.forEach((n) => out.push(`  ! ${n}`));
  section(out, 'Duplicates', r.duplicates, (g) => g.join('  |  '));
  section(out, 'Words shared by two or more cards (people may group on the word, not the meaning)', r.sharedWords, (x) => `"${x.word}": ${x.cards.join('  |  ')}`);
  section(out, 'Looks like an internal code or abbreviation', r.internalCode, (x) => x);
  section(out, 'Uses a word from a category name (gives the answer away)', r.givesAnswerAway, (x) => `${x.card}: "${x.word}" is in ${x.category}`);
  return out.join('\n');
}

// Self-test ----------------------------------------------------------------

function rowsFrom(spec) {
  const out = ['participant,card,category'];
  for (const [p, groups] of Object.entries(spec)) {
    for (const [name, cards] of Object.entries(groups)) for (const card of cards.split(' ')) out.push(`${p},${card},${name}`);
  }
  return out.join('\n');
}

function selfTest() {
  let failed = 0;
  let passed = 0;
  const check = (name, ok, detail) => {
    if (ok) { passed++; console.log(`ok    ${name}`); } else { failed++; console.log(`FAIL  ${name}${detail === undefined ? '' : `: ${JSON.stringify(detail)}`}`); }
  };
  const near = (a, b, tolerance = 0.06) => Math.abs(a - b) <= tolerance;
  const throws = (fn, pattern) => {
    try { fn(); return false; } catch (e) { return e instanceof InputError && pattern.test(e.message); }
  };

  const tricky = parseCsv('﻿a,b\r\n"x, y","say ""hi"""\r\n"two\nlines",z\n');
  check('CSV keeps a comma inside quotes', tricky[1].cells[0] === 'x, y');
  check('CSV unescapes doubled quotes', tricky[1].cells[1] === 'say "hi"');
  check('CSV keeps a newline inside quotes and strips a byte order mark', tricky[2].cells[0] === 'two\nlines' && tricky[0].cells[0] === 'a');
  check('a missing column is a clear error', throws(() => loadSort('participant,card\np,c\n', 'file'), /missing the column\(s\): category/));
  check('an unquoted comma is a clear error', throws(() => loadSort('participant,card,category\np,a,b,c\n', 'file'), /line 2 has 4 fields/));

  const w = adjustedWald(8, 10);
  check('adjusted Wald matches a hand-worked 8 of 10 (47.9 to 95.4)', near(w.low, 47.9, 0.1) && near(w.high, 95.4, 0.1), w);

  // Linkage: hand-worked values that single, complete or weighted linkage would get wrong.
  const four = [[100, 90, 60, 20], [90, 100, 20, 20], [60, 20, 100, 80], [20, 20, 80, 100]];
  const fourMerges = averageLinkage(four).merges;
  check('average linkage first joins the closest pairs', fourMerges[0].similarity === 90 && fourMerges[1].similarity === 80, fourMerges);
  check('average linkage is the mean of the four cross pairs (30, not 60 or 20)', near(fourMerges[2].similarity, 30, 1e-6), fourMerges);
  const sized = [[100, 90, 70, 10], [90, 100, 70, 10], [70, 70, 100, 40], [10, 10, 40, 100]];
  const sizedMerges = averageLinkage(sized).merges;
  check('average linkage weights by cluster size (20, not 30)', near(sizedMerges[2].similarity, 20, 1e-6), sizedMerges);

  // Clean two-cluster sort, 16 people.
  const cleanSpec = {};
  for (let i = 1; i <= 16; i++) cleanSpec[`P${i}`] = { Money: 'Invoices Refunds Pricing', Help: 'Guides Contact Status' };
  const clean = analyzeOpen(loadSort(rowsFrom(cleanSpec), 'clean'), 50);
  check('reports the participant count', clean.participants === 16, clean.participants);
  check('finds the two clusters', clean.clusters.length === 2 && clean.clusters.every((c) => c.cards.length === 3), clean.clusters);
  check('agreement is 100 when everyone agrees', clean.clusters.every((c) => c.agreementPct === 100), clean.clusters);
  check('no small-sample warning at 16 people', !clean.warnings.some((x) => /too few|dominant pattern/.test(x)), clean.warnings);
  check('nothing is flagged as between clusters in a clean sort', clean.betweenClusters.length === 0, clean.betweenClusters);
  check('names are counted per participant', clean.categoryNames.common[0].participants === 16 && clean.categoryNames.distinctNormalised === 2, clean.categoryNames);

  // Hand-worked similarity, and a card that must be flagged as between clusters.
  const mixed = {
    P1: { Ab: 'A B', Cd: 'C D E' },
    P2: { Ab: 'A B E', Cd: 'C D' },
    P3: { Ab: 'A B', Cd: 'C D E' },
    P4: { Ab: 'A B E', Cd: 'C D' },
  };
  const m = analyzeOpen(loadSort(rowsFrom(mixed), 'mixed'), 50);
  const value = (a, b) => m.matrix.percent[m.matrix.order.indexOf(a)][m.matrix.order.indexOf(b)];
  check('similarity is the share who grouped the pair', value('A', 'B') === 100 && value('A', 'E') === 50 && value('C', 'E') === 50 && value('A', 'C') === 0);
  check('FLAG: the card split evenly between two clusters is reported', m.betweenClusters.some((x) => x.card === 'E'), m.betweenClusters);
  check('FLAG: four participants triggers the too-few warning', m.warnings.some((x) => /Only 4 participants/.test(x)), m.warnings);

  const nine = {};
  for (let i = 1; i <= 9; i++) nine[`P${i}`] = { Money: 'Invoices Refunds', Help: 'Guides Contact' };
  check('FLAG: nine participants warns it shows the dominant pattern only', analyzeOpen(loadSort(rowsFrom(nine), 'nine'), 50).warnings.some((x) => /dominant pattern/.test(x)));

  const parked = {
    P1: { "Don't know": 'X Y', Real: 'A B' },
    P2: { Other: 'X Y', Real: 'A B' },
  };
  const p = analyzeOpen(loadSort(rowsFrom(parked), 'parked'), 50);
  const pValue = p.matrix.percent[p.matrix.order.indexOf('X')][p.matrix.order.indexOf('Y')];
  check('a catch-all pile does not count as grouping its cards', pValue === 0, p.matrix);
  check('FLAG: cards parked in a catch-all pile are reported', p.parkedInCatchAll.length === 2, p.parkedInCatchAll);

  const wordy = {
    P1: { 'Other stuff': 'X Y', Real: 'A B' },
    P2: { 'Misc items': 'X Y', Real: 'A B' },
    P3: { 'Not sure where these go': 'X Y', Real: 'A B' },
  };
  const wp = analyzeOpen(loadSort(rowsFrom(wordy), 'wordy'), 50);
  check('a pile named with a catch-all word and filler does not group its cards', wp.matrix.percent[wp.matrix.order.indexOf('X')][wp.matrix.order.indexOf('Y')] === 0 && wp.parkedInCatchAll.length === 2, wp.matrix);
  check('catch-all names are recognised and real names are left alone', ['other stuff', 'misc items', 'everything else', 'not sure where'].every(isCatchAll) && !['other ways to pay', 'cards', 'billing'].some(isCatchAll));

  const symbolsCsv = 'participant,card,category\nP1,C# guide,Docs\nP1,C++ guide,Docs\nP1,Java guide,Docs\nP1,Go guide,Docs\n';
  const symbols = loadSort(symbolsCsv, 'symbols');
  check('C# and C++ stay separate cards', symbols.cards.length === 4, symbols.cards);
  check('case and punctuation still merge one card', loadSort('participant,card,category\nP1,Sign-up form,A\nP2,sign up form.,A\nP1,B,A\nP2,B,A\n', 'punct').cards.length === 2);
  check('the card check does not call C# and C++ duplicates', checkCards('C# guide\nC++ guide\n').duplicates.length === 0);

  const partial = 'participant,card,category\nP1,A,x\nP1,B,x\nP2,A,x\nP2,B,y\nP2,C,y\n';
  const q = analyzeOpen(loadSort(partial, 'partial'), 50);
  check('a partial sort uses only people who handled the pair', q.matrix.percent[q.matrix.order.indexOf('A')][q.matrix.order.indexOf('B')] === 50 && q.matrix.percent[q.matrix.order.indexOf('B')][q.matrix.order.indexOf('C')] === 100, q.matrix);
  check('FLAG: a partial sort is warned about', q.warnings.some((x) => /did not sort every card/.test(x)), q.warnings);

  // Closed sort, 10 people: Alpha is clear, Beta leans, Gamma is split, Delta scatters.
  const closedRows = ['participant,card,category'];
  const placements = {
    Alpha: ['One', 'One', 'One', 'One', 'One', 'One', 'One', 'One', 'Two', 'Two'],
    Beta: ['One', 'One', 'One', 'One', 'One', 'One', 'Two', 'Two', 'Two', 'Two'],
    Gamma: ['One', 'One', 'One', 'One', 'One', 'Two', 'Two', 'Two', 'Two', 'Two'],
    Delta: ['One', 'One', 'One', 'One', 'Two', 'Two', 'Two', 'Three', 'Three', 'Three'],
  };
  for (const [card, cats] of Object.entries(placements)) cats.forEach((cat, i) => closedRows.push(`P${i + 1},${card},${cat}`));
  const c = analyzeClosed(loadSort(closedRows.join('\n'), 'closed'));
  const row = (name) => c.cardsDetail.find((x) => x.card === name);
  check('closed: percent per category', row('Alpha').placements[0].pct === 80 && row('Alpha').placements[1].pct === 20, row('Alpha'));
  check('closed: 80% is a clear home', row('Alpha').status === 'clear', row('Alpha'));
  check('closed: 60% with a 20 point lead leans', row('Beta').status === 'leaning', row('Beta'));
  check('FLAG closed: a 50/50 split has no clear home', row('Gamma').status === 'none', row('Gamma'));
  check('FLAG closed: a card under 50% everywhere has no clear home', row('Delta').status === 'none', row('Delta'));
  check('closed: the top share carries a 95% interval', near(row('Alpha').top.lowPct, 47.9, 0.1), row('Alpha'));
  check('FLAG closed: a category that is nobody\'s clear home is reported', c.categoriesHoldingNothing.includes('Three') && c.categoriesHoldingNothing.includes('Two'), c.categoriesHoldingNothing);

  // Hybrid: two offered categories, sixteen people each add a group of their own.
  const hybridRows = ['participant,card,category'];
  for (let i = 1; i <= 16; i++) {
    hybridRows.push(`P${i},Alpha,Offered one`, `P${i},Beta,Offered one`, `P${i},Gamma,Own group ${i}`);
  }
  hybridRows.push('P1,Delta,Other stuff', 'P2,Delta,Added home', 'P3,Delta,Added home', 'P4,Delta,Added home');
  const hybridData = () => loadSort(hybridRows.join('\n'), 'hybrid');
  const hybrid = analyzeClosed(hybridData(), 'Offered one\nOffered two\n');
  check('hybrid: added groups are reported as additions', hybrid.additions.filter((x) => /^Own group/.test(x.category)).length === 16 && hybrid.mode === 'hybrid', hybrid.additions);
  check('hybrid: no advice to re-run as an open sort', !hybrid.warnings.some((x) => /re-run without --closed/.test(x)), hybrid.warnings);
  check('hybrid: added groups are not called nobody\'s clear home', hybrid.categoriesHoldingNothing.join() === 'Offered two', hybrid.categoriesHoldingNothing);
  check('hybrid: an offered category nobody used is listed', hybrid.categories.some((x) => x.category === 'Offered two' && x.cardsWithClearHome === 0), hybrid.categories);
  check('hybrid: a catch-all pile someone added is not an addition', !hybrid.additions.some((x) => x.category === 'Other stuff') && hybrid.cardsDetail.find((x) => x.card === 'Delta').placements.some((p) => p.category === '(left unsorted)'), hybrid.additions);
  check('hybrid: an added group that tops a card says so', hybrid.additions.find((x) => x.category === 'Added home').topPlacementFor.join() === 'Delta', hybrid.additions);
  check('hybrid: the report lists the additions', /Groups participants added/.test(renderClosed(hybrid)) && /^Hybrid card sort/.test(renderClosed(hybrid)));
  check('closed with no list still points at both ways out', analyzeClosed(hybridData()).warnings.some((x) => /re-run without --closed.*--categories/.test(x)));
  check('an offered list with no additions is a closed sort', analyzeClosed(loadSort(closedRows.join('\n'), 'closed'), 'One\nTwo\nThree\n').mode === 'closed');
  check('an empty offered list is a clear error', throws(() => analyzeClosed(hybridData(), '\n'), /category list is empty/));

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-sort-'));
  fs.writeFileSync(path.join(dir, 'sort.csv'), hybridRows.join('\n'));
  fs.writeFileSync(path.join(dir, 'categories.txt'), 'Offered one\nOffered two\n');
  const self = fileURLToPath(import.meta.url);
  const hybridCli = spawnSync(process.execPath, [self, path.join(dir, 'sort.csv'), '--closed', '--categories', path.join(dir, 'categories.txt'), '--json'], { encoding: 'utf8' });
  const openCli = spawnSync(process.execPath, [self, path.join(dir, 'sort.csv'), '--categories', path.join(dir, 'categories.txt')], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  check('--categories reaches a closed analysis from the command line', hybridCli.status === 0 && JSON.parse(hybridCli.stdout).mode === 'hybrid', hybridCli.stderr);
  check('--categories without --closed is a clear error', openCli.status === 1 && /--categories/.test(openCli.stderr), openCli.stderr);

  const list = checkCards('Billing FAQ\nBilling settings\nReset a password\nHR-204 form\nReset a password\n', 'Billing\nAccount');
  check('card check finds duplicates', list.duplicates.length === 1, list.duplicates);
  check('FLAG card check: a word shared by two cards', list.sharedWords.some((x) => x.word === 'billing' && x.cards.length === 2), list.sharedWords);
  check('FLAG card check: a card that repeats a category word', list.givesAnswerAway.length === 2, list.givesAnswerAway);
  check('FLAG card check: an internal code', list.internalCode.includes('HR-204 form'), list.internalCode);
  check('stemming treats billing, billed and bills as one word', stem('billing') === stem('billed') && stem('billed') === stem('bills'));

  console.log(`\n${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Main ---------------------------------------------------------------------

function readFile(path, what) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (e) {
    throw new InputError(`Cannot read ${what} "${path}": ${e.code === 'ENOENT' ? 'no such file' : e.message}.`);
  }
}

function main() {
  let args;
  try {
    args = parseArgs({
      allowPositionals: true,
      options: {
        'self-test': { type: 'boolean' }, help: { type: 'boolean' }, json: { type: 'boolean' }, closed: { type: 'boolean' },
        cut: { type: 'string' }, 'check-cards': { type: 'string' }, categories: { type: 'string' },
      },
    });
  } catch (e) {
    throw new InputError(`${e.message}\n\n${USAGE}`);
  }
  const { values, positionals } = args;
  if (values.help) { console.log(USAGE); return; }
  if (values['self-test']) { process.exitCode = selfTest() ? 0 : 1; return; }
  if (values['check-cards']) {
    const report = checkCards(readFile(values['check-cards'], 'the card list'), values.categories ? readFile(values.categories, 'the category list') : undefined);
    console.log(values.json ? JSON.stringify(report, null, 2) : renderCheck(report));
    return;
  }
  if (positionals.length !== 1) throw new InputError(`Give exactly one CSV file.\n\n${USAGE}`);
  if (values.closed && values.cut !== undefined) throw new InputError('--cut applies to open sorts only. Remove it or remove --closed.');
  if (values.categories !== undefined && !values.closed) throw new InputError('--categories names the list offered in a closed or hybrid sort. Add --closed, or use it with --check-cards.');
  const cut = values.cut === undefined ? 50 : Number(values.cut);
  if (!Number.isFinite(cut) || cut < 0 || cut > 100) throw new InputError(`--cut must be a percentage from 0 to 100, got "${values.cut}".`);
  const data = loadSort(readFile(positionals[0], 'the sort'), positionals[0]);
  const report = values.closed
    ? analyzeClosed(data, values.categories === undefined ? undefined : readFile(values.categories, 'the category list'))
    : analyzeOpen(data, cut);
  if (values.json) console.log(JSON.stringify(report, null, 2));
  else console.log(values.closed ? renderClosed(report) : renderOpen(report));
}

try {
  main();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exitCode = 1;
}
