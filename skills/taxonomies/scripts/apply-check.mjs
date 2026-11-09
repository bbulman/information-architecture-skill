#!/usr/bin/env node
// Reports what happens when a taxonomy is applied to real items: gaps, overlaps,
// lopsided terms, drift from the vocabulary and likely duplicate terms.
// Node only, no dependencies. The script counts; a person judges what the counts mean.

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const USAGE = `Usage:
  node apply-check.mjs <assignments.csv> [options]
  node apply-check.mjs --self-test

assignments.csv has one row per item, facet and term. Columns: item, facet, term.
A row with an empty term records an item that has no term in that facet.

Options:
  --terms <file>      Vocabulary CSV. Columns: facet, term. Optional columns:
                      synonyms (split on ; or |) and status (deprecated, merged, retired).
  --required a,b      Facets every item must have a term in.
  --single a,b        Facets where an item may hold only one term.
  --max-share <pct>   Flag terms holding more than this share of a facet's items. Default 40.
  --min-items <n>     Flag terms holding fewer than this many items. Default 2.
  --limit <n>         Lines shown per finding. Default 30. 0 shows all.
  --self-test         Prove the checks on built-in data.

Exit codes: 0 the report ran (read its counts), 1 a self-test failed, 2 bad input.`;

class InputError extends Error {}

// CSV ---------------------------------------------------------------------

function parseCsv(input) {
  const text = input.replace(/^﻿/, '');
  const rows = [];
  let cells = [];
  let cell = '';
  let quoted = false;
  let line = 1;
  let rowLine = 1;
  let quoteLine = 1;

  const endRow = () => {
    cells.push(cell);
    cell = '';
    if (cells.length > 1 || cells[0].trim() !== '') rows.push({ cells, line: rowLine });
    cells = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false;
      } else {
        if (ch === '\n') line++;
        cell += ch;
      }
    } else if (ch === '"' && cell === '') {
      quoted = true;
      quoteLine = line;
    } else if (ch === ',') {
      cells.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      endRow();
      line++;
      rowLine = line;
    } else {
      cell += ch;
    }
  }
  if (quoted) throw new InputError(`A quoted cell that starts on line ${quoteLine} is never closed.`);
  if (cell !== '' || cells.length > 0) endRow();
  return rows;
}

function readTable(text, label, required, optional = []) {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new InputError(`${label} is empty.`);
  const header = rows[0].cells.map((h) => h.trim().toLowerCase());
  const missing = required.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    const raw = rows[0].cells.join(',');
    const hint = /[\t;]/.test(raw) ? ' It looks tab or semicolon separated: save it as comma-separated CSV.' : '';
    throw new InputError(`${label} is missing column(s): ${missing.join(', ')}. Found: ${header.join(', ')}.${hint}`);
  }
  const wanted = [...required, ...optional];
  const out = [];
  const tooWide = [];
  for (const row of rows.slice(1)) {
    if (row.cells.slice(header.length).some((c) => c.trim() !== '')) {
      tooWide.push(row.line);
      continue;
    }
    const record = { line: row.line };
    for (const col of wanted) {
      const at = header.indexOf(col);
      record[col] = at >= 0 ? (row.cells[at] ?? '') : '';
    }
    out.push(record);
  }
  return { header, rows: out, tooWide };
}

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

// Comparing terms ---------------------------------------------------------

const fold = (s) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/&/g, ' and ');
const wordsOf = (s) => fold(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const squash = (s) => wordsOf(s).join('');

function singular(word) {
  if (word.length <= 3) return word;
  if (/ies$/.test(word) && word.length > 4) return `${word.slice(0, -3)}y`;
  if (/ie$/.test(word)) return `${word.slice(0, -2)}y`;
  if (/(ch|sh|ss|x|z)es$/.test(word)) return word.slice(0, -2);
  if (/s$/.test(word) && !/(ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

const singularWords = (s) => wordsOf(s).map(singular);

function editDistance(a, b, cap) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let prevPrev = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const sub = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + sub);
      if (prevPrev && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, prevPrev[j - 2] + 1);
      row[j] = value;
      best = Math.min(best, value);
    }
    if (best > cap) return cap + 1;
    prevPrev = prev;
    prev = row;
  }
  return prev[b.length];
}

const editsAllowed = (a, b) => {
  const shorter = Math.min(a.length, b.length);
  if (shorter < 5) return 0;
  return shorter < 9 ? 1 : 2;
};

function closeSpelling(a, b) {
  const digitsA = a.replace(/\D/g, '');
  const digitsB = b.replace(/\D/g, '');
  if (digitsA !== digitsB) return false;
  const wa = wordsOf(a);
  const wb = wordsOf(b);
  if (wa.length === wb.length) {
    let changed = false;
    for (let i = 0; i < wa.length; i++) {
      if (wa[i] === wb[i]) continue;
      changed = true;
      const allowed = editsAllowed(wa[i], wb[i]);
      if (allowed === 0 || editDistance(wa[i], wb[i], allowed) > allowed) return false;
    }
    return changed;
  }
  const sa = squash(a);
  const sb = squash(b);
  const allowed = editsAllowed(sa, sb);
  return allowed > 0 && editDistance(sa, sb, allowed) <= allowed;
}

// Returns why two different terms look like one, or null.
function nearDuplicateReason(a, b, spelling = true) {
  if (a.toLowerCase() === b.toLowerCase()) return 'case';
  if (squash(a) !== '' && squash(a) === squash(b)) return 'punctuation';
  const sa = singularWords(a);
  const sb = singularWords(b);
  if (sa.length === 0 || sb.length === 0) return null;
  if (sa.join('') === sb.join('')) return 'plural';
  if (sa.length > 1 && [...sa].sort().join(' ') === [...sb].sort().join(' ')) return 'word order';
  if (spelling && closeSpelling(a, b)) return 'edit distance';
  return null;
}

function isJunkTerm(term) {
  const words = wordsOf(term);
  if (words.length === 0) return false;
  const joined = words.join(' ');
  if (words[0] === 'other' || words[0] === 'others' || words[0] === 'misc') return true;
  return ['miscellaneous', 'uncategorized', 'uncategorised', 'general', 'various', 'none', 'n a', 'tbd', 'stuff'].includes(joined);
}

function groupLinks(links) {
  const parent = new Map();
  const find = (x) => {
    if (!parent.has(x)) parent.set(x, x);
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  };
  for (const { a, b } of links) parent.set(find(a), find(b));
  const groups = new Map();
  for (const link of links) {
    const root = find(link.a);
    if (!groups.has(root)) groups.set(root, { members: new Set(), reasons: new Set() });
    const group = groups.get(root);
    group.members.add(link.a);
    group.members.add(link.b);
    group.reasons.add(link.reason);
  }
  return [...groups.values()];
}

// Analysis ----------------------------------------------------------------

const EDIT_DISTANCE_TERM_CAP = 3000;

function analyse(assignText, termsText, options = {}) {
  const opts = { required: [], single: [], maxShare: 40, minItems: 2, ...options };
  const table = readTable(assignText, 'The assignments file', ['item', 'facet', 'term']);
  const facets = new Map();
  const items = new Set();
  const seen = new Set();
  const noItem = [];
  const noFacet = [];
  let duplicateRows = 0;

  const facetFor = (name) => {
    const key = name.toLowerCase();
    if (!facets.has(key)) facets.set(key, { key, name, byTerm: new Map(), byItem: new Map(), vocab: new Map(), variants: new Map() });
    return facets.get(key);
  };

  for (const row of table.rows) {
    const item = clean(row.item);
    const facetName = clean(row.facet);
    const term = clean(row.term);
    if (!item) { noItem.push(row.line); continue; }
    items.add(item);
    if (!facetName) { noFacet.push(row.line); continue; }
    const facet = facetFor(facetName);
    if (!term) continue;
    const key = `${item}\u0000${facet.key}\u0000${term}`;
    if (seen.has(key)) { duplicateRows++; continue; }
    seen.add(key);
    if (!facet.byTerm.has(term)) facet.byTerm.set(term, new Set());
    facet.byTerm.get(term).add(item);
    if (!facet.byItem.has(item)) facet.byItem.set(item, new Set());
    facet.byItem.get(item).add(term);
  }
  if (items.size === 0) throw new InputError('The assignments file has a header but no usable rows.');

  let vocabTooWide = [];
  if (termsText != null) {
    const vocab = readTable(termsText, 'The terms file', ['facet', 'term'], ['synonyms', 'status']);
    vocabTooWide = vocab.tooWide;
    for (const row of vocab.rows) {
      const term = clean(row.term);
      const facetName = clean(row.facet);
      if (!term || !facetName) continue;
      const facet = facetFor(facetName);
      facet.vocab.set(term, clean(row.status));
      for (const variant of String(row.synonyms ?? '').split(/[;|]/).map(clean).filter(Boolean)) {
        facet.variants.set(variant.toLowerCase(), term);
      }
    }
  }

  const known = [...facets.values()].map((f) => f.name);
  for (const [flag, names] of [['--required', opts.required], ['--single', opts.single]]) {
    for (const name of names) {
      if (!facets.has(name.toLowerCase())) {
        throw new InputError(`${flag} names a facet that is not in the data: "${name}". Facets found: ${known.join(', ') || 'none'}.`);
      }
    }
  }

  const result = {
    itemCount: items.size,
    rowCount: table.rows.length,
    duplicateRows,
    noItem,
    noFacet,
    tooWide: table.tooWide,
    vocabTooWide,
    hasVocab: termsText != null,
    distribution: [],
    notes: [],
    missingRequired: [],
    overSingle: [],
    tooBroad: [],
    tooThin: [],
    junk: [],
    unusedVocab: [],
    notInVocab: [],
    variantInUse: [],
    deprecatedInUse: [],
    nearDuplicates: [],
    contained: [],
    sameInTwoFacets: [],
  };
  const isDeprecated = (status) => /deprecat|merged|retired/i.test(status ?? '');
  const requiredKeys = new Set(opts.required.map((n) => n.toLowerCase()));
  const singleKeys = new Set(opts.single.map((n) => n.toLowerCase()));

  for (const facet of facets.values()) {
    const tagged = facet.byItem.size;
    const counts = [...facet.byTerm.entries()]
      .map(([term, set]) => ({ term, count: set.size, share: tagged ? (set.size / tagged) * 100 : 0 }))
      .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
    result.distribution.push({
      facet: facet.name,
      tagged,
      required: requiredKeys.has(facet.key),
      single: singleKeys.has(facet.key),
      terms: counts,
    });

    const capReachable = counts.length * opts.maxShare >= 100;
    if (!capReachable && counts.length > 0) {
      result.notes.push(`${facet.name} has only ${counts.length} term(s) in use, so some term must exceed ${opts.maxShare}%. The too-broad check was skipped for it; read its split in the distribution.`);
    }
    for (const entry of counts) {
      if (capReachable && entry.share > opts.maxShare) result.tooBroad.push({ facet: facet.name, ...entry });
      if (entry.count < opts.minItems) result.tooThin.push({ facet: facet.name, ...entry });
    }

    const countOf = (term) => facet.byTerm.get(term)?.size ?? 0;
    const allTerms = [...new Set([...facet.byTerm.keys(), ...facet.vocab.keys()])];
    for (const term of allTerms) {
      if (isJunkTerm(term)) result.junk.push({ facet: facet.name, term, count: countOf(term) });
    }

    if (result.hasVocab) {
      for (const [term, status] of facet.vocab) {
        if (countOf(term) === 0 && !isDeprecated(status)) result.unusedVocab.push({ facet: facet.name, term });
        if (countOf(term) > 0 && isDeprecated(status)) result.deprecatedInUse.push({ facet: facet.name, term, count: countOf(term), status });
      }
      for (const term of facet.byTerm.keys()) {
        if (facet.vocab.has(term)) continue;
        const preferred = facet.variants.get(term.toLowerCase());
        if (preferred) {
          result.variantInUse.push({ facet: facet.name, term, count: countOf(term), preferred });
          continue;
        }
        let closest = null;
        for (const candidate of facet.vocab.keys()) {
          const reason = nearDuplicateReason(term, candidate);
          if (reason) { closest = `${candidate} (${reason})`; break; }
        }
        result.notInVocab.push({ facet: facet.name, term, count: countOf(term), closest });
      }
    }

    for (const name of [...requiredKeys].filter((k) => k === facet.key)) {
      const missing = [...items].filter((item) => !facet.byItem.has(item));
      if (missing.length > 0) result.missingRequired.push({ facet: facet.name, key: name, items: missing });
    }
    if (singleKeys.has(facet.key)) {
      for (const [item, terms] of facet.byItem) {
        if (terms.size > 1) result.overSingle.push({ facet: facet.name, item, terms: [...terms] });
      }
    }

    const spelling = allTerms.length <= EDIT_DISTANCE_TERM_CAP;
    if (!spelling) result.notes.push(`${facet.name} has ${allTerms.length} terms, so the edit-distance comparison was skipped for it.`);
    const links = [];
    const contained = [];
    for (let i = 0; i < allTerms.length; i++) {
      for (let j = i + 1; j < allTerms.length; j++) {
        const a = allTerms[i];
        const b = allTerms[j];
        const reason = nearDuplicateReason(a, b, spelling);
        if (reason) { links.push({ a, b, reason }); continue; }
        const wa = singularWords(a);
        const wb = singularWords(b);
        if (wa.length === 0 || wb.length === 0 || wa.length === wb.length) continue;
        const [short, long, shortTerm, longTerm] = wa.length < wb.length ? [wa, wb, a, b] : [wb, wa, b, a];
        if (short.every((w) => long.includes(w))) contained.push({ facet: facet.name, shorter: shortTerm, longer: longTerm });
      }
    }
    for (const group of groupLinks(links)) {
      result.nearDuplicates.push({
        facet: facet.name,
        reasons: [...group.reasons],
        terms: [...group.members].map((term) => ({ term, count: countOf(term) })).sort((a, b) => b.count - a.count || a.term.localeCompare(b.term)),
      });
    }
    result.contained.push(...contained);
  }

  const byKey = new Map();
  for (const facet of facets.values()) {
    for (const term of new Set([...facet.byTerm.keys(), ...facet.vocab.keys()])) {
      const key = singularWords(term).join('');
      if (!key) continue;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push({ facet: facet.name, term });
    }
  }
  for (const uses of byKey.values()) {
    if (new Set(uses.map((u) => u.facet)).size > 1) result.sameInTwoFacets.push(uses);
  }

  if (items.size < 20) result.notes.push(`Only ${items.size} items, so shares are rough: one item moves a percentage a long way.`);
  return result;
}

// Report ------------------------------------------------------------------

function listing(lines, limit, indent = '  ') {
  const shown = limit > 0 ? lines.slice(0, limit) : lines;
  const out = shown.map((l) => `${indent}${l}`);
  if (shown.length < lines.length) out.push(`${indent}... and ${lines.length - shown.length} more (--limit 0 shows all)`);
  return out;
}

const pct = (n) => `${Math.round(n)}%`;
const itemsWord = (n) => `${n} item${n === 1 ? '' : 's'}`;

function render(result, file, opts) {
  const out = [];
  out.push(`apply-check: ${file}`);
  out.push(`Items: ${result.itemCount}   Facets: ${result.distribution.length}   Rows read: ${result.rowCount}   Exact duplicate rows ignored: ${result.duplicateRows}`);
  out.push('Only items in this file are checked. Compare the item count with the size of the corpus.');
  const lines = (label, values) => { if (values.length > 0) out.push(`Rows skipped, ${label}: line(s) ${values.slice(0, 20).join(', ')}${values.length > 20 ? ', ...' : ''}`); };
  lines('no item', result.noItem);
  lines('no facet', result.noFacet);
  lines('more cells than the header (often an unquoted comma)', result.tooWide);
  lines('more cells than the header in the terms file', result.vocabTooWide);

  out.push('', 'DISTRIBUTION');
  for (const facet of result.distribution) {
    const tags = [facet.single ? 'single value' : null, facet.required ? 'required' : null].filter(Boolean).join(', ');
    out.push(`${facet.facet}${tags ? ` (${tags})` : ''}: ${facet.tagged} items tagged, ${facet.terms.length} terms in use`);
    out.push(...listing(facet.terms.map((t) => `${String(t.count).padStart(5)}  ${pct(t.share).padStart(4)}  ${t.term}`), opts.limit, '  '));
  }

  const vocabRow = (n) => (result.hasVocab ? n : 'not run (no --terms)');
  const checks = [
    ['Items missing a required facet', opts.required.length ? result.missingRequired.reduce((s, m) => s + m.items.length, 0) : 'not run (no --required)'],
    ['Items with several terms in a single-value facet', opts.single.length ? result.overSingle.length : 'not run (no --single)'],
    [`Terms over ${opts.maxShare}% of a facet`, result.tooBroad.length],
    [`Terms under ${opts.minItems} item(s)`, result.tooThin.length],
    ['"Other" or "Misc" terms', result.junk.length],
    ['Vocabulary terms catching nothing', vocabRow(result.unusedVocab.length)],
    ['Terms used but not in the vocabulary', vocabRow(result.notInVocab.length)],
    ['Variants used instead of the preferred term', vocabRow(result.variantInUse.length)],
    ['Deprecated terms still in use', vocabRow(result.deprecatedInUse.length)],
    ['Near-duplicate groups', result.nearDuplicates.length],
    ['Same term in two facets', result.sameInTwoFacets.length],
    ['One term contains another (a look, not a fault)', result.contained.length],
  ];
  out.push('', 'CHECKS');
  for (const [label, value] of checks) out.push(`  ${label}: ${value}`);

  const section = (title, rows) => {
    if (rows.length === 0) return;
    out.push('', title, ...listing(rows, opts.limit));
  };
  for (const m of result.missingRequired) section(`NO TERM IN REQUIRED FACET: ${m.facet} (${m.items.length} of ${result.itemCount} items)`, m.items);
  section('SEVERAL TERMS IN A SINGLE-VALUE FACET', result.overSingle.map((o) => `[${o.facet}] ${o.item}: ${o.terms.join(' | ')}`));
  section(`TOO BROAD (over ${opts.maxShare}% of the facet): split or tighten`, result.tooBroad.map((t) => `[${t.facet}] ${t.term}: ${itemsWord(t.count)}, ${pct(t.share)}`));
  section(`TOO THIN (under ${opts.minItems} item(s)): merge, or keep with a reason`, result.tooThin.map((t) => `[${t.facet}] ${t.term}: ${t.count}`));
  section('"OTHER" OR "MISC" TERMS: always flagged, retire them', result.junk.map((t) => `[${t.facet}] ${t.term}: ${itemsWord(t.count)}`));
  section('VOCABULARY TERMS CATCHING NOTHING', result.unusedVocab.map((t) => `[${t.facet}] ${t.term}`));
  section('USED BUT NOT IN THE VOCABULARY', result.notInVocab.map((t) => `[${t.facet}] ${t.term}: ${itemsWord(t.count)}${t.closest ? `; closest vocabulary term: ${t.closest}` : ''}`));
  section('VARIANTS USED INSTEAD OF THE PREFERRED TERM: re-tag', result.variantInUse.map((t) => `[${t.facet}] ${t.term}: ${itemsWord(t.count)}; preferred term is ${t.preferred}`));
  section('DEPRECATED TERMS STILL IN USE: re-tag', result.deprecatedInUse.map((t) => `[${t.facet}] ${t.term}: ${itemsWord(t.count)}; status ${t.status}`));
  section('LIKELY NEAR-DUPLICATES: read each one, the script cannot judge meaning', result.nearDuplicates.map((g) => `[${g.facet}] ${g.terms.map((t) => `${t.term} (${t.count})`).join(' ~ ')}   [${g.reasons.join(', ')}]`));
  section('SAME TERM IN TWO FACETS: the dimensions may be mixed', result.sameInTwoFacets.map((uses) => uses.map((u) => `${u.term} in ${u.facet}`).join('; ')));
  section('ONE TERM CONTAINS ANOTHER: a real broader and narrower pair, or a duplicate?', result.contained.map((c) => `[${c.facet}] ${c.longer} contains ${c.shorter}`));
  if (result.notes.length > 0) section('NOTES', result.notes);
  out.push('', 'The script counts. It cannot tell whether a term suits an item, so read a sample of the assignments as well.');
  return out.join('\n');
}

// Command line ------------------------------------------------------------

function parseArgs(argv) {
  const opts = { file: null, terms: null, required: [], single: [], maxShare: 40, minItems: 2, limit: 30, selfTest: false, help: false };
  const list = (v) => v.split(',').map(clean).filter(Boolean);
  for (let i = 0; i < argv.length; i++) {
    let arg = argv[i];
    let value = null;
    const eq = arg.indexOf('=');
    if (arg.startsWith('--') && eq > 0) { value = arg.slice(eq + 1); arg = arg.slice(0, eq); }
    if (arg === '--self-test') { opts.selfTest = true; continue; }
    if (arg === '--help' || arg === '-h') { opts.help = true; continue; }
    if (arg.startsWith('-')) {
      if (!['--terms', '--required', '--single', '--max-share', '--min-items', '--limit'].includes(arg)) throw new InputError(`Unknown option: ${arg}.`);
      if (value === null) value = argv[++i];
      if (value === undefined) throw new InputError(`${arg} needs a value.`);
      if (arg === '--terms') opts.terms = value;
      if (arg === '--required') opts.required = list(value);
      if (arg === '--single') opts.single = list(value);
      if (arg === '--max-share') {
        let n = Number(value.replace(/%$/, ''));
        if (n > 0 && n < 1) n *= 100;
        if (!Number.isFinite(n) || n <= 0 || n > 100) throw new InputError(`--max-share must be a percentage from 1 to 100, not "${value}".`);
        opts.maxShare = n;
      }
      if (arg === '--min-items' || arg === '--limit') {
        const n = Number(value);
        if (!Number.isInteger(n) || n < 0) throw new InputError(`${arg} must be a whole number, not "${value}".`);
        if (arg === '--min-items') opts.minItems = n; else opts.limit = n;
      }
      continue;
    }
    if (opts.file) throw new InputError(`Only one assignments file is allowed. Got "${opts.file}" and "${arg}".`);
    opts.file = arg;
  }
  return opts;
}

function readFile(path, label) {
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    const why = err.code === 'ENOENT' ? 'no such file' : err.code === 'EISDIR' ? 'that is a folder' : err.message;
    throw new InputError(`Cannot read the ${label} "${path}": ${why}.`);
  }
}

// Self-test ---------------------------------------------------------------

function selfTest() {
  const checks = [];
  const check = (name, fn) => checks.push([name, fn]);
  const rejects = (fn, pattern) => assert.throws(fn, (e) => e instanceof InputError && pattern.test(e.message));
  const opts = { required: ['topic', 'format'], single: ['topic'], maxShare: 40, minItems: 2 };

  const messy = [
    '﻿item,facet,term',
    '"Budgets, part 1",topic,Finance',
    '"Budgets, part 1",format,Guide',
    '"She said ""no""",topic,Finance',
    '"She said ""no""",format,Guide',
    '"Line one',
    'line two",topic,Finance',
    '"Line one',
    'line two",format,Video',
    'Alpha,topic,Tips',
    'Alpha,topic,Strategy',
    'Alpha,format,Guide',
    'Alpha,format,Guide',
    'Bravo,topic,tips',
    'Charlie,topic,Tip',
    'Charlie,format,Guide',
    'Delta,topic,Misc',
    'Delta,format,Video',
    'Echo,topic,off-site',
    'Echo,format,Video',
    'Foxtrot,topic,offsite',
    'Foxtrot,format,Video',
    'Golf,topic,Tips and tricks',
    'Golf,format,',
  ].join('\r\n');
  const result = analyse(messy, null, opts);

  check('reads quoted commas, escaped quotes and newlines in cells', () => {
    assert.equal(result.itemCount, 10);
    const finance = result.distribution.find((d) => d.facet === 'topic').terms.find((t) => t.term === 'Finance');
    assert.equal(finance.count, 3);
  });
  check('ignores exact duplicate rows', () => assert.equal(result.duplicateRows, 1));
  check('flags items with no term in a required facet', () => {
    assert.deepEqual(result.missingRequired.find((m) => m.facet === 'format').items, ['Bravo', 'Golf']);
  });
  check('flags several terms in a single-value facet', () => {
    assert.deepEqual(result.overSingle.map((o) => o.item), ['Alpha']);
  });
  check('flags a term over the share limit', () => {
    const rows = ['item,facet,term'];
    for (let i = 0; i < 8; i++) rows.push(`Item ${i},topic,Strategy`);
    rows.push('Item 8,topic,Finance', 'Item 9,topic,Legal');
    const r = analyse(rows.join('\n'), null, {});
    assert.deepEqual(r.tooBroad.map((t) => [t.term, t.count, t.share]), [['Strategy', 8, 80]]);
  });
  check('flags a term under the item minimum', () => {
    assert.ok(result.tooThin.some((t) => t.term === 'Strategy' && t.count === 1));
  });
  check('always flags a Misc term', () => assert.ok(result.junk.some((t) => t.term === 'Misc')));
  check('groups case and plural near-duplicates', () => {
    const group = result.nearDuplicates.find((g) => g.terms.some((t) => t.term === 'Tips'));
    assert.deepEqual(group.terms.map((t) => t.term).sort(), ['Tip', 'Tips', 'tips']);
  });
  check('finds a punctuation near-duplicate', () => {
    const group = result.nearDuplicates.find((g) => g.terms.some((t) => t.term === 'offsite'));
    assert.deepEqual(group.reasons, ['punctuation']);
  });
  check('reports one term containing another', () => {
    assert.ok(result.contained.some((c) => c.longer === 'Tips and tricks' && c.shorter === 'Tips'));
  });
  check('finds a misspelling by edit distance', () => assert.equal(nearDuplicateReason('Onboarding', 'Onbaording'), 'edit distance'));
  check('leaves numbered and short terms alone', () => {
    assert.equal(nearDuplicateReason('Phase 1', 'Phase 2'), null);
    assert.equal(nearDuplicateReason('UI', 'UX'), null);
    assert.equal(nearDuplicateReason('Team A', 'Team B'), null);
    assert.equal(nearDuplicateReason('Internal', 'External'), null);
  });

  const vocab = [
    'facet,term,synonyms,status',
    'topic,Billing,invoices;payments,active',
    'topic,Security,,active',
    'topic,Legacy,,deprecated',
    'topic,Shipping,,active',
  ].join('\n');
  const used = ['item,facet,term', 'A,topic,Billing', 'B,topic,payments', 'C,topic,Legacy', 'D,topic,Shiping', 'E,topic,Billing'].join('\n');
  const checked = analyse(used, vocab, { minItems: 1 });
  check('flags vocabulary terms catching nothing, but not deprecated ones', () => {
    assert.deepEqual(checked.unusedVocab.map((t) => t.term), ['Security', 'Shipping']);
  });
  check('flags used terms missing from the vocabulary and names the closest', () => {
    assert.equal(checked.notInVocab.length, 1);
    assert.equal(checked.notInVocab[0].term, 'Shiping');
    assert.match(checked.notInVocab[0].closest, /Shipping/);
  });
  check('flags a variant used in place of the preferred term', () => assert.equal(checked.variantInUse[0].preferred, 'Billing'));
  check('flags a deprecated term still in use', () => assert.equal(checked.deprecatedInUse[0].term, 'Legacy'));

  check('flags the same term in two facets', () => {
    const r = analyse('item,facet,term\nA,topic,Video\nB,format,Videos\n', null, {});
    assert.equal(r.sameInTwoFacets.length, 1);
  });
  check('skips the share limit when a facet has too few terms to meet it', () => {
    const r = analyse('item,facet,term\nA,format,Long\nB,format,Long\nC,format,Short\n', null, {});
    assert.equal(r.tooBroad.length, 0);
    assert.ok(r.notes.some((n) => n.includes('too-broad check was skipped')));
  });
  check('raises nothing on a clean taxonomy', () => {
    const rows = ['item,facet,term'];
    ['Billing', 'Security', 'Shipping', 'Returns', 'Accounts'].forEach((term) => {
      for (let i = 0; i < 4; i++) rows.push(`${term} ${i},topic,${term}`);
    });
    const r = analyse(rows.join('\n'), null, { required: ['topic'], single: ['topic'] });
    for (const key of ['missingRequired', 'overSingle', 'tooBroad', 'tooThin', 'junk', 'nearDuplicates', 'sameInTwoFacets']) {
      assert.equal(r[key].length, 0, key);
    }
  });
  check('renders a report that names what it did not run', () => {
    const text = render(result, 'sample.csv', { ...opts, limit: 30 });
    assert.match(text, /not run \(no --terms\)/);
    assert.match(text, /Misc/);
  });

  check('reports a missing column clearly', () => rejects(() => analyse('item,term\nA,B\n', null, {}), /missing column\(s\): facet/));
  check('hints at the wrong delimiter', () => rejects(() => analyse('item;facet;term\nA;B;C\n', null, {}), /semicolon/));
  check('reports an unclosed quote with its line', () => rejects(() => analyse('item,facet,term\n"A,topic,B\n', null, {}), /line 2/));
  check('rejects an empty file', () => rejects(() => analyse('', null, {}), /empty/));
  check('rejects a facet name that is not in the data', () => rejects(() => analyse('item,facet,term\nA,topic,B\n', null, { required: ['topics'] }), /Facets found: topic/));
  check('reports rows with too many cells instead of misreading them', () => {
    const r = analyse('item,facet,term\nA,topic,Tips, tricks\nB,topic,Tips\n', null, {});
    assert.deepEqual(r.tooWide, [2]);
    assert.equal(r.itemCount, 1);
  });

  let failed = 0;
  for (const [name, fn] of checks) {
    try {
      fn();
      console.log(`ok    ${name}`);
    } catch (err) {
      failed++;
      console.log(`FAIL  ${name}: ${err.message}`);
    }
  }
  console.log(`\nself-test: ${checks.length - failed} of ${checks.length} passed`);
  return failed === 0 ? 0 : 1;
}

// Main --------------------------------------------------------------------

function main() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) { console.log(USAGE); return 0; }
    if (opts.selfTest) return selfTest();
    if (!opts.file) throw new InputError('Give an assignments CSV. Columns: item, facet, term.');
    const assignText = readFile(opts.file, 'assignments file');
    const termsText = opts.terms ? readFile(opts.terms, 'terms file') : null;
    console.log(render(analyse(assignText, termsText, opts), opts.file, opts));
    return 0;
  } catch (err) {
    if (err instanceof InputError) {
      console.error(`apply-check: ${err.message}\nRun with --help for usage.`);
      return 2;
    }
    console.error(`apply-check: unexpected problem: ${err.message}`);
    return 2;
  }
}

process.exitCode = main();
