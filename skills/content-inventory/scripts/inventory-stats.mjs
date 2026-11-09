#!/usr/bin/env node
// Counts a content inventory CSV: rows, coverage, staleness, likely duplicates and section balance.
// Can also draw a reproducible stratified sample. Run with --self-test to prove it on built-in data.

import fs from 'node:fs';
import { parseArgs } from 'node:util';

class InputError extends Error {}

const USAGE = `Usage:
  node inventory-stats.mjs <file.csv> [--stale-months 24] [--overload 40] [--sections list.txt]
                                      [--dates dmy|mdy] [--as-of YYYY-MM-DD] [--json]
  node inventory-stats.mjs <file.csv> --sample N --out sample.csv [--by type] [--seed 1]
  node inventory-stats.mjs --self-test

The CSV needs a header row with a title or url column. These columns are used when present:
id, url, title, type, section, owner, last_updated, status, action.`;

const DATE_COLUMNS = ['last_updated', 'updated', 'last_modified', 'modified', 'updated_at', 'date'];
const STATUSES = new Set(['current', 'outdated', 'duplicate', 'trivial', 'gap']);
const ACTIONS = new Set(['keep', 'revise', 'update', 'merge', 'retire', 'create']);
const TRACKING_PARAM = /^(utm_[a-z]+|gclid|fbclid|mc_cid|mc_eid)$/;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const SHOWN = 15;

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
  const repeated = header.find((h, i) => h && header.indexOf(h) !== i);
  if (repeated) throw new InputError(`${label} has the column "${repeated}" twice.`);
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

const csvCell = (v) => (/[",\r\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);

// Normalising --------------------------------------------------------------

function normTitle(s) {
  return s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/^(the|a|an) /, '');
}

function normUrl(s) {
  const raw = s.trim().toLowerCase();
  if (!raw) return '';
  const noScheme = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//, '').replace(/^www\./, '').replace(/#.*$/, '');
  const q = noScheme.indexOf('?');
  const pathPart = q === -1 ? noScheme : noScheme.slice(0, q);
  const query = q === -1 ? '' : noScheme.slice(q + 1);
  const path = pathPart.replace(/\/(index|default)\.[a-z0-9]+$/, '/').replace(/\.(html?|php|aspx?)$/, '').replace(/\/+$/, '');
  const params = query.split('&').filter((p) => p && !TRACKING_PARAM.test(p.split('=')[0])).sort();
  return (path || '/') + (params.length ? `?${params.join('&')}` : '');
}

// Dates --------------------------------------------------------------------

function ymd(y, m, d) {
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : null;
}

const endOfMonth = (y, m) => (m >= 1 && m <= 12 ? new Date(Date.UTC(y, m, 0)) : null);
const monthNumber = (name) => MONTHS.indexOf(name.slice(0, 3).toLowerCase()) + 1;

function parseDate(raw, order) {
  const s = raw.trim();
  let m;
  if ((m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s].*)?$/))) return { date: ymd(+m[1], +m[2], +m[3]) };
  if ((m = s.match(/^(\d{4})-(\d{1,2})$/))) return { date: endOfMonth(+m[1], +m[2]) };
  if ((m = s.match(/^(\d{4})$/))) return { date: ymd(+m[1], 12, 31) };
  if ((m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/))) {
    const [a, b, y] = [+m[1], +m[2], +m[3]];
    if (order === 'dmy' || (!order && a > 12)) return { date: ymd(y, b, a) };
    if (order === 'mdy' || (!order && b > 12)) return { date: ymd(y, a, b) };
    return { ambiguous: true };
  }
  if ((m = s.match(/^(\d{1,2})\s+([a-z]+)\.?,?\s+(\d{4})$/i)) && monthNumber(m[2])) return { date: ymd(+m[3], monthNumber(m[2]), +m[1]) };
  if ((m = s.match(/^([a-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/i)) && monthNumber(m[1])) return { date: ymd(+m[3], monthNumber(m[1]), +m[2]) };
  if ((m = s.match(/^([a-z]+)\.?\s+(\d{4})$/i)) && monthNumber(m[1])) return { date: endOfMonth(+m[2], monthNumber(m[1])) };
  return { date: null };
}

function monthsBefore(date, months) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() - months;
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(date.getUTCDate(), lastDay)));
}

const isoDay = (d) => d.toISOString().slice(0, 10);

// Analysis -----------------------------------------------------------------

function tally(rows, column) {
  const counts = new Map();
  for (const r of rows) {
    const key = r[column] || '(blank)';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts].map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function duplicateGroups(rows, keyOf) {
  const groups = new Map();
  for (const r of rows) {
    const key = keyOf(r);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  return [...groups].filter(([, g]) => g.length > 1).map(([key, g]) => ({ key, items: g.map(describe) }));
}

function describe(r) {
  const name = r.title || r.url || '(untitled)';
  return `${r.id ? `${r.id}: ` : ''}${name} [line ${r._line}]`;
}

function analyze({ header, records }, opts) {
  const has = (c) => header.includes(c);
  const dateColumn = DATE_COLUMNS.find(has) ?? null;
  const notes = [];
  for (const c of ['type', 'section', 'owner', 'status']) {
    if (!has(c)) notes.push(`No "${c}" column, so ${c} checks were skipped.`);
  }
  if (!dateColumn) notes.push(`No date column (looked for ${DATE_COLUMNS.join(', ')}), so date checks were skipped.`);

  const isGap = (r) => (r.status ?? '').toLowerCase() === 'gap';
  const items = records.filter((r) => !isGap(r) && (r.title || r.url));
  const gaps = records.filter(isGap);
  const cutoff = monthsBefore(opts.asOf, opts.staleMonths);

  const missingOwner = has('owner') ? items.filter((r) => !r.owner).map(describe) : [];
  const missingDate = [];
  const ambiguousDate = [];
  const unreadableDate = [];
  const futureDate = [];
  const stale = [];
  if (dateColumn) {
    for (const r of items) {
      const raw = r[dateColumn];
      if (!raw) { missingDate.push(describe(r)); continue; }
      const parsed = parseDate(raw, opts.dateOrder);
      if (parsed.ambiguous) { ambiguousDate.push(`${describe(r)}: ${raw}`); continue; }
      if (!parsed.date) { unreadableDate.push(`${describe(r)}: ${raw}`); continue; }
      if (parsed.date > opts.asOf) futureDate.push(`${describe(r)}: ${raw}`);
      else if (parsed.date < cutoff) stale.push({ item: describe(r), date: isoDay(parsed.date) });
    }
    stale.sort((a, b) => a.date.localeCompare(b.date));
  }

  const sectionNames = new Set(records.map((r) => r.section).filter(Boolean));
  const spelled = new Map([...sectionNames].map((s) => [s.toLowerCase(), s]));
  for (const s of opts.expectedSections) sectionNames.add(spelled.get(s.toLowerCase()) ?? s);
  const named = items.filter((r) => r.section);
  const sectionCounts = new Map([...sectionNames].map((s) => [s, 0]));
  for (const r of named) sectionCounts.set(r.section, sectionCounts.get(r.section) + 1);
  const empty = [...sectionCounts].filter(([, c]) => c === 0).map(([s]) => s).sort();
  const single = [...sectionCounts].filter(([, c]) => c === 1).map(([s]) => s).sort();
  const populated = [...sectionCounts].filter(([, c]) => c > 0).length;
  const overloaded = populated < 3 ? [] : [...sectionCounts]
    .filter(([, c]) => named.length && (c / named.length) * 100 > opts.overload)
    .map(([section, count]) => ({ section, count, sharePct: round1((count / named.length) * 100) }))
    .sort((a, b) => b.count - a.count);
  if (has('section') && populated > 0 && populated < 3) notes.push(`Only ${populated} section(s) hold items, so the ${opts.overload}% overload rule was not applied.`);

  const audit = { noAction: [], badMerge: [], unknownStatus: [], unknownAction: [] };
  const usingActions = has('action') && records.some((r) => r.action);
  const ids = has('id') ? new Set(records.map((r) => r.id).filter(Boolean)) : null;
  for (const r of records) {
    const status = (r.status ?? '').toLowerCase();
    if (status && !STATUSES.has(status)) audit.unknownStatus.push(`${describe(r)}: ${r.status}`);
    if (!usingActions) continue;
    const action = (r.action ?? '').trim();
    if (!action) { audit.noAction.push(describe(r)); continue; }
    const verb = action.split(/\s+/)[0].toLowerCase();
    if (!ACTIONS.has(verb)) { audit.unknownAction.push(`${describe(r)}: ${action}`); continue; }
    if (verb === 'merge' && ids) {
      const target = action.replace(/^merge\s*(into)?\s*/i, '').trim();
      if (!target) audit.badMerge.push(`${describe(r)}: names no target`);
      else if (target === r.id) audit.badMerge.push(`${describe(r)}: merges into itself`);
      else if (!ids.has(target)) audit.badMerge.push(`${describe(r)}: target ${target} is not in the id column`);
    }
  }

  return {
    asOf: isoDay(opts.asOf),
    staleMonths: opts.staleMonths,
    staleBefore: isoDay(cutoff),
    rows: records.length,
    items: items.length,
    gaps: gaps.length,
    notes,
    byType: has('type') ? tally(items, 'type') : [],
    bySection: has('section') ? tally(items, 'section') : [],
    byStatus: has('status') ? tally(records, 'status') : [],
    byAction: usingActions ? tally(records.map((r) => ({ verb: (r.action ?? '').split(/\s+/)[0].toLowerCase() })), 'verb') : [],
    missingOwner,
    missingDate,
    ambiguousDate,
    unreadableDate,
    futureDate,
    stale,
    duplicates: {
      byTitle: has('title') ? duplicateGroups(records, (r) => normTitle(r.title ?? '')) : [],
      byUrl: has('url') ? duplicateGroups(records, (r) => normUrl(r.url ?? '')) : [],
    },
    sections: { empty, overloaded, single, overloadPct: opts.overload },
    audit,
  };
}

// Sampling -----------------------------------------------------------------

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

function drawSample(table, n, by, seed) {
  if (!table.header.includes(by)) throw new InputError(`--by ${by}: there is no "${by}" column. Found: ${table.header.join(', ')}.`);
  const items = table.records.filter((r) => (r.status ?? '').toLowerCase() !== 'gap' && (r.title || r.url));
  if (n >= items.length) throw new InputError(`--sample ${n} would take all ${items.length} items, so there is nothing to sample. Audit every item instead.`);
  const strata = new Map();
  for (const r of items) {
    const key = r[by] || '(blank)';
    if (!strata.has(key)) strata.set(key, []);
    strata.get(key).push(r);
  }
  const keys = [...strata.keys()].sort();
  const sizes = keys.map((k) => strata.get(k).length);
  let base = sizes.map((s) => Math.min(s, 5));
  if (sum(base) > n) base = sizes.map((s) => Math.min(s, 1));
  if (sum(base) > n) throw new InputError(`--sample ${n} is smaller than the ${keys.length} groups in "${by}". Ask for at least ${keys.length}.`);
  const room = sizes.map((s, i) => s - base[i]);
  const left = n - sum(base);
  const exact = room.map((r) => (sum(room) ? (left * r) / sum(room) : 0));
  const extra = exact.map(Math.floor);
  let spare = left - sum(extra);
  const byRemainder = exact.map((e, i) => [e - Math.floor(e), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (const [, i] of byRemainder) {
    if (spare === 0) break;
    if (extra[i] < room[i]) { extra[i]++; spare--; }
  }
  const rand = mulberry32(seed);
  const chosen = new Set();
  const groups = keys.map((key, i) => {
    const pool = strata.get(key).slice();
    const take = base[i] + extra[i];
    for (let k = 0; k < take; k++) {
      const j = k + Math.floor(rand() * (pool.length - k));
      [pool[k], pool[j]] = [pool[j], pool[k]];
      chosen.add(pool[k]);
    }
    return { group: key, population: pool.length, sampled: take };
  });
  return { by, seed, requested: n, population: items.length, groups, rows: table.records.filter((r) => chosen.has(r)) };
}

// Output -------------------------------------------------------------------

function round1(x) { return Math.round(x * 10) / 10; }

function renderText(r) {
  const out = [];
  const list = (title, entries, fmt = (x) => x) => {
    out.push(`${title}: ${entries.length}`);
    entries.slice(0, SHOWN).forEach((x) => out.push(`  - ${fmt(x)}`));
    if (entries.length > SHOWN) out.push(`  ... and ${entries.length - SHOWN} more (--json lists them all)`);
  };
  const counts = (title, rows) => {
    if (!rows.length) return;
    out.push('', title);
    const width = Math.max(...rows.map((x) => x.value.length));
    rows.forEach((x) => out.push(`  ${x.value.padEnd(width)}  ${x.count}`));
  };
  out.push(`Content inventory as of ${r.asOf}`);
  out.push(`Rows: ${r.rows}  (items: ${r.items}, gap rows: ${r.gaps})`);
  counts('By type (items)', r.byType);
  counts('By section (items)', r.bySection);
  counts('By status (all rows)', r.byStatus);
  counts('By action (all rows)', r.byAction);
  out.push('', 'Coverage');
  list('Items missing an owner', r.missingOwner);
  list('Items missing a date', r.missingDate);
  if (r.ambiguousDate.length) list('Dates that could be day-first or month-first (pass --dates dmy or mdy)', r.ambiguousDate);
  if (r.unreadableDate.length) list('Dates that could not be read', r.unreadableDate);
  if (r.futureDate.length) list('Dates in the future', r.futureDate);
  out.push('', `Age (older than ${r.staleMonths} months means before ${r.staleBefore})`);
  list('Stale items', r.stale, (x) => `${x.date}  ${x.item}`);
  out.push('', 'Likely duplicates');
  const dup = (x) => x.items.join('  |  ');
  list('Same title after normalising', r.duplicates.byTitle, dup);
  list('Same URL after normalising', r.duplicates.byUrl, dup);
  out.push('', 'Sections');
  list('Empty (no real items)', r.sections.empty);
  list(`Overloaded (over ${r.sections.overloadPct}% of items)`, r.sections.overloaded, (x) => `${x.section}: ${x.count} items, ${x.sharePct}%`);
  list('Holding a single item', r.sections.single);
  const a = r.audit;
  if (a.noAction.length || a.badMerge.length || a.unknownStatus.length || a.unknownAction.length) {
    out.push('', 'Audit consistency');
    if (a.noAction.length) list('Rows with no action', a.noAction);
    if (a.badMerge.length) list('Broken merges', a.badMerge);
    if (a.unknownStatus.length) list('Unrecognised status', a.unknownStatus);
    if (a.unknownAction.length) list('Unrecognised action', a.unknownAction);
  }
  if (r.notes.length) out.push('', 'Notes', ...r.notes.map((n) => `  - ${n}`));
  out.push('', 'These counts describe the file. They do not show that the file lists everything that exists.');
  return out.join('\n');
}

function renderSample(s, outPath) {
  const out = [`Sampled ${s.requested} of ${s.population} items, stratified by ${s.by}, seed ${s.seed}. Rows written to ${outPath}.`, ''];
  const width = Math.max(5, ...s.groups.map((g) => g.group.length));
  out.push(`  ${'Group'.padEnd(width)}  Population  Sampled`);
  s.groups.forEach((g) => out.push(`  ${g.group.padEnd(width)}  ${String(g.population).padStart(10)}  ${String(g.sampled).padStart(7)}`));
  out.push('', `Say this in the audit summary: "Quality judgements come from a stratified sample of ${s.requested} of ${s.population} items (by ${s.by}, seed ${s.seed}). They are estimates, not counts."`);
  return out.join('\n');
}

// Self-test ----------------------------------------------------------------

function selfTest() {
  let failed = 0;
  let passed = 0;
  const check = (name, ok, detail) => {
    if (ok) { passed++; console.log(`ok    ${name}`); } else { failed++; console.log(`FAIL  ${name}${detail === undefined ? '' : `: ${JSON.stringify(detail)}`}`); }
  };
  const throws = (fn, pattern) => {
    try { fn(); return false; } catch (e) { return e instanceof InputError && pattern.test(e.message); }
  };

  const tricky = parseCsv('﻿a,b\r\n"x, y","say ""hi"""\r\n"two\nlines",z\n');
  check('CSV strips a byte order mark and reads the header', tricky[0].cells[0] === 'a');
  check('CSV keeps a comma inside quotes', tricky[1].cells[0] === 'x, y');
  check('CSV unescapes doubled quotes', tricky[1].cells[1] === 'say "hi"');
  check('CSV keeps a newline inside quotes', tricky[2].cells[0] === 'two\nlines');
  check('CSV reports the unclosed quote', throws(() => parseCsv('a,b\n"oops,1\n'), /line 2 is never closed/));
  check('an unquoted comma is a clear error', throws(() => readTable('title,type\nA, B,post\n', 'file'), /line 2 has 3 fields/));

  check('title normalising ignores case, punctuation and a leading article', normTitle('The  "Café" & Bar!') === normTitle('cafe and bar'));
  check('URL normalising ignores scheme, www, slash, tracking and extension',
    normUrl('https://www.Example.com/About/index.html?utm_source=x#top') === normUrl('http://example.com/about'));
  check('URL normalising keeps a query that names different content', normUrl('/p?id=1') !== normUrl('/p?id=2'));

  const asOf = ymd(2026, 11, 9);
  check('leap-day month arithmetic clamps to month end', isoDay(monthsBefore(ymd(2024, 8, 31), 6)) === '2024-02-29');
  check('impossible dates are rejected', parseDate('2024-02-30').date === null);
  check('slash dates are not guessed', parseDate('03/04/2024').ambiguous === true);
  check('--dates dmy settles a slash date', isoDay(parseDate('03/04/2024', 'dmy').date) === '2024-04-03');
  check('a month name is read', isoDay(parseDate('4 March 2024').date) === '2024-03-04');

  const flagged = `id,url,title,type,section,owner,last_updated,status,action
1,https://www.example.com/about/,"About us, the team",page,Company,Ana,2026-01-10,current,keep
2,http://example.com/about,"about us the team",page,Company,Ana,2026-02-01,duplicate,merge into 1
3,/blog/a,Post A,post,Blog,,2020-05-01,outdated,retire
4,/blog/b,Post B,post,Blog,Ben,,current,keep
5,/blog/c,Post C,post,Blog,Ben,2025-11-30,current,merge into 99
6,/blog/d,Post D,post,Blog,Ben,2024-11-09,current,keep
7,/blog/e,Post E,post,Blog,Ben,2024-11-08,current,
8,/blog/f,Post F,post,Blog,Ben,2026-10-01,current,keep
9,/legal,Terms,page,Legal,Dana,2026-03-03,current,keep
10,,Careers overview,page,Careers,,,gap,create
`;
  const opts = { asOf, staleMonths: 24, overload: 40, dateOrder: undefined, expectedSections: ['Support'] };
  const r = analyze(readTable(flagged, 'test'), opts);
  check('counts rows, items and gaps', r.rows === 10 && r.items === 9 && r.gaps === 1, r);
  check('counts by type', r.byType[0].value === 'post' && r.byType[0].count === 6 && r.byType[1].count === 3, r.byType);
  check('counts by section', r.bySection[0].value === 'Blog' && r.bySection[0].count === 6, r.bySection);
  check('flags the item missing an owner', r.missingOwner.length === 1 && r.missingOwner[0].includes('Post A'), r.missingOwner);
  check('flags the item missing a date', r.missingDate.length === 1 && r.missingDate[0].includes('Post B'), r.missingDate);
  check('stale cutoff excludes the exact boundary day', r.stale.length === 2 && !r.stale.some((s) => s.item.includes('Post D')), r.stale);
  check('flags items older than the threshold', r.stale.some((s) => s.item.includes('Post A')) && r.stale.some((s) => s.item.includes('Post E')), r.stale);
  check('flags duplicate titles', r.duplicates.byTitle.length === 1 && r.duplicates.byTitle[0].items.length === 2, r.duplicates);
  check('flags duplicate URLs', r.duplicates.byUrl.length === 1 && r.duplicates.byUrl[0].items.length === 2, r.duplicates);
  check('flags the overloaded section', r.sections.overloaded.length === 1 && r.sections.overloaded[0].section === 'Blog', r.sections);
  check('flags a section holding only a gap as empty', r.sections.empty.includes('Careers'), r.sections);
  check('flags an expected section with no rows as empty', r.sections.empty.includes('Support'), r.sections);
  check('flags the single-item section', r.sections.single.length === 1 && r.sections.single[0] === 'Legal', r.sections);
  const caseOnly = analyze(readTable(flagged, 'test'), { ...opts, expectedSections: ['BLOG'] });
  check('an expected section matches regardless of case', !caseOnly.sections.empty.includes('BLOG'), caseOnly.sections);
  check('flags a merge into a missing id', r.audit.badMerge.length === 1 && r.audit.badMerge[0].includes('99'), r.audit);
  check('flags a row with no action once actions are in use', r.audit.noAction.length === 1 && r.audit.noAction[0].includes('Post E'), r.audit);

  const clean = `id,url,title,type,section,owner,last_updated,status,action
1,/a,Alpha,page,One,Ana,2026-10-01,current,keep
2,/b,Beta,page,One,Ana,2026-10-02,current,revise
3,/c,Gamma,post,Two,Ben,2026-10-03,current,keep
4,/d,Delta,post,Two,Ben,2026-10-04,current,keep
5,/e,Epsilon,post,Three,Cy,2026-10-05,current,keep
6,/f,Zeta,post,Three,Cy,2026-10-06,current,keep
`;
  const q = analyze(readTable(clean, 'clean'), { ...opts, expectedSections: [] });
  const quiet = !q.missingOwner.length && !q.missingDate.length && !q.stale.length && !q.duplicates.byTitle.length
    && !q.duplicates.byUrl.length && !q.sections.empty.length && !q.sections.overloaded.length && !q.sections.single.length
    && !q.audit.badMerge.length && !q.audit.noAction.length;
  check('a clean inventory raises no flags', quiet, q);

  const big = ['id,title,type'];
  for (let i = 1; i <= 90; i++) big.push(`${i},Page ${i},page`);
  for (let i = 91; i <= 100; i++) big.push(`${i},Video ${i},video`);
  const table = readTable(big.join('\n'), 'sample test');
  const a = drawSample(table, 20, 'type', 7);
  const b = drawSample(table, 20, 'type', 7);
  check('a sample has exactly the size asked for', a.rows.length === 20, a.rows.length);
  check('the same seed draws the same sample', a.rows.map((x) => x.id).join() === b.rows.map((x) => x.id).join());
  check('a small group still gets at least five', a.groups.find((g) => g.group === 'video').sampled >= 5, a.groups);
  check('a different seed draws a different sample', drawSample(table, 20, 'type', 8).rows.map((x) => x.id).join() !== a.rows.map((x) => x.id).join());

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

function numberOption(value, name, fallback, integer = false) {
  if (value === undefined) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || (integer && !Number.isInteger(n))) {
    throw new InputError(`--${name} must be a ${integer ? 'whole ' : ''}number of zero or more, got "${value}".`);
  }
  return n;
}

function main() {
  let args;
  try {
    args = parseArgs({
      allowPositionals: true,
      options: {
        'self-test': { type: 'boolean' }, help: { type: 'boolean' }, json: { type: 'boolean' },
        'stale-months': { type: 'string' }, overload: { type: 'string' }, sections: { type: 'string' },
        dates: { type: 'string' }, 'as-of': { type: 'string' },
        sample: { type: 'string' }, out: { type: 'string' }, by: { type: 'string' }, seed: { type: 'string' },
      },
    });
  } catch (e) {
    throw new InputError(`${e.message}\n\n${USAGE}`);
  }
  const { values, positionals } = args;
  if (values.help) { console.log(USAGE); return; }
  if (values['self-test']) { process.exitCode = selfTest() ? 0 : 1; return; }
  if (positionals.length !== 1) throw new InputError(`Give exactly one CSV file.\n\n${USAGE}`);

  const table = readTable(readFile(positionals[0], 'the inventory'), positionals[0]);
  if (!table.header.includes('title') && !table.header.includes('url')) {
    throw new InputError(`${positionals[0]} needs a title or url column. Found: ${table.header.join(', ')}.`);
  }
  if (!table.records.length) throw new InputError(`${positionals[0]} has a header but no rows.`);

  if (values.sample !== undefined) {
    const n = numberOption(values.sample, 'sample', 0, true);
    if (n < 1) throw new InputError('--sample must be at least 1.');
    if (!values.out) throw new InputError('--sample needs --out <file.csv> to say where the sampled rows go.');
    const drawn = drawSample(table, n, values.by ?? 'type', numberOption(values.seed, 'seed', 1, true));
    const lines = [table.header.join(','), ...drawn.rows.map((r) => table.header.map((h) => csvCell(r[h])).join(','))];
    try {
      fs.writeFileSync(values.out, `${lines.join('\n')}\n`);
    } catch (e) {
      throw new InputError(`Cannot write "${values.out}": ${e.message}.`);
    }
    if (values.json) {
      const { rows, ...summary } = drawn;
      console.log(JSON.stringify({ ...summary, out: values.out }, null, 2));
    } else console.log(renderSample(drawn, values.out));
    return;
  }

  if (values.dates && !['dmy', 'mdy'].includes(values.dates)) throw new InputError(`--dates must be dmy or mdy, got "${values.dates}".`);
  let asOf = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
  if (values['as-of']) {
    asOf = parseDate(values['as-of']).date;
    if (!asOf) throw new InputError(`--as-of must be a date such as 2026-11-09, got "${values['as-of']}".`);
  }
  const expectedSections = values.sections
    ? readFile(values.sections, 'the section list').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    : [];
  const report = analyze(table, {
    asOf,
    staleMonths: numberOption(values['stale-months'], 'stale-months', 24, true),
    overload: numberOption(values.overload, 'overload', 40),
    dateOrder: values.dates,
    expectedSections,
  });
  console.log(values.json ? JSON.stringify(report, null, 2) : renderText(report));
}

try {
  main();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exitCode = 1;
}
