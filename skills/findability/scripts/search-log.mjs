#!/usr/bin/env node
// Summarises a site-search log: what people look for, what returns nothing,
// what returns results nobody clicks, and which queries should share a synonym.
// Node only, no dependencies. It reports only what the log contains.

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const USAGE = `Usage:
  node search-log.mjs <file.csv> [options]
  node search-log.mjs --self-test

The CSV needs columns query, count and results. clicks is optional.
count is how many times the query was searched and results is how many results it returned.
A log with one row per search works too: use a count of 1 on each row.

Options:
  --top <n>            Lines in each list. Default 20. 0 shows all.
  --min-searches <n>   Below this many searches the log is called too small to rank. Default 100.
  --self-test          Prove the checks on built-in data.

Exit codes: 0 the report ran, 1 a self-test failed, 2 bad input.`;

class InputError extends Error {}

const MIN_TOP_QUERY = 5;
const EDIT_DISTANCE_QUERY_CAP = 2000;
const STOP_WORDS = new Set(['a', 'an', 'the', 'of', 'for', 'my']);

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

// Queries -----------------------------------------------------------------

function normaliseQuery(raw) {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["'`]+/, '')
    .replace(/["'`?!.,;:]+$/, '')
    .trim();
}

const fold = (s) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/&/g, ' and ');
const wordsOf = (s) => fold(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

function singular(word) {
  if (word.length <= 3) return word;
  if (/ies$/.test(word) && word.length > 4) return `${word.slice(0, -3)}y`;
  if (/ie$/.test(word)) return `${word.slice(0, -2)}y`;
  if (/(ch|sh|ss|x|z)es$/.test(word)) return word.slice(0, -2);
  if (/s$/.test(word) && !/(ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

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
  if (a.replace(/\D/g, '') !== b.replace(/\D/g, '')) return false;
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
  const sa = wa.join('');
  const sb = wb.join('');
  const allowed = editsAllowed(sa, sb);
  return allowed > 0 && editDistance(sa, sb, allowed) <= allowed;
}

// Trivial differences, cheapest test first. Each key maps queries that differ only by that kind.
const VARIANT_KEYS = [
  ['punctuation', (q) => wordsOf(q).join('')],
  ['plural', (q) => wordsOf(q).map(singular).join('')],
  ['word order', (q) => { const w = wordsOf(q).map(singular); return w.length > 1 ? [...w].sort().join(' ') : ''; }],
  ['filler word', (q) => { const w = wordsOf(q).filter((x) => !STOP_WORDS.has(x)).map(singular); return w.length > 0 ? [...w].sort().join(' ') : ''; }],
];

function findVariantGroups(queries) {
  const parent = new Map();
  const find = (x) => {
    if (!parent.has(x)) parent.set(x, x);
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  };
  const links = [];
  const link = (a, b, reason) => {
    if (find(a) === find(b)) return;
    parent.set(find(a), find(b));
    links.push({ a, b, reason });
  };

  for (const [reason, keyOf] of VARIANT_KEYS) {
    const firstByKey = new Map();
    for (const q of queries) {
      const key = keyOf(q.query);
      if (!key) continue;
      if (firstByKey.has(key)) link(firstByKey.get(key), q.query, reason);
      else firstByKey.set(key, q.query);
    }
  }

  const byCount = [...queries].sort((a, b) => b.searches - a.searches).slice(0, EDIT_DISTANCE_QUERY_CAP);
  for (let i = 0; i < byCount.length; i++) {
    for (let j = i + 1; j < byCount.length; j++) {
      const a = byCount[i].query;
      const b = byCount[j].query;
      if (Math.abs(a.length - b.length) > 2 || find(a) === find(b)) continue;
      if (closeSpelling(a, b)) link(a, b, 'spelling');
    }
  }

  const groups = new Map();
  for (const { a, b, reason } of links) {
    const root = find(a);
    if (!groups.has(root)) groups.set(root, { members: new Set(), reasons: new Set() });
    const group = groups.get(root);
    group.members.add(a);
    group.members.add(b);
    group.reasons.add(reason);
  }
  return { groups: [...groups.values()], capped: queries.length > EDIT_DISTANCE_QUERY_CAP };
}

// Analysis ----------------------------------------------------------------

function parseNumber(cell) {
  const text = String(cell ?? '').replace(/[,\s]/g, '');
  if (text === '') return null;
  const n = Number(text);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
}

function analyse(text, options = {}) {
  const opts = { minSearches: 100, ...options };
  const rows = parseCsv(text);
  if (rows.length === 0) throw new InputError('The log is empty.');
  const header = rows[0].cells.map((h) => h.trim().toLowerCase());
  const missing = ['query', 'count', 'results'].filter((c) => !header.includes(c));
  if (missing.length > 0) {
    const hint = /[\t;]/.test(rows[0].cells.join(',')) ? ' It looks tab or semicolon separated: save it as comma-separated CSV.' : '';
    throw new InputError(`The log is missing column(s): ${missing.join(', ')}. Found: ${header.join(', ')}.${hint}`);
  }
  const at = {
    query: header.indexOf('query'),
    count: header.indexOf('count'),
    results: header.indexOf('results'),
    clicks: header.indexOf('clicks'),
  };
  const hasClicks = at.clicks >= 0;

  const merged = new Map();
  const rawForms = new Set();
  const dropped = { blankQuery: [], badCount: [], badResults: [], badClicks: [], tooWide: [] };
  let unknownResultSearches = 0;

  for (const row of rows.slice(1)) {
    if (row.cells.slice(header.length).some((c) => c.trim() !== '')) { dropped.tooWide.push(row.line); continue; }
    const raw = row.cells[at.query] ?? '';
    const query = normaliseQuery(raw);
    if (!query) { dropped.blankQuery.push(row.line); continue; }
    const count = parseNumber(row.cells[at.count]);
    if (count === null || Number.isNaN(count)) { dropped.badCount.push(row.line); continue; }
    const results = parseNumber(row.cells[at.results]);
    if (Number.isNaN(results)) { dropped.badResults.push(row.line); continue; }
    const clicks = hasClicks ? parseNumber(row.cells[at.clicks]) : null;
    if (Number.isNaN(clicks)) { dropped.badClicks.push(row.line); continue; }
    if (count === 0) continue;

    rawForms.add(raw.trim());
    if (!merged.has(query)) {
      merged.set(query, { query, searches: 0, zeroSearches: 0, knownSearches: 0, withResults: 0, clicksOnResults: 0, unknownClicks: 0 });
    }
    const entry = merged.get(query);
    entry.searches += count;
    if (results === null) {
      unknownResultSearches += count;
    } else {
      entry.knownSearches += count;
      if (results === 0) entry.zeroSearches += count;
      else {
        entry.withResults += count;
        if (clicks === null) entry.unknownClicks += count;
        else entry.clicksOnResults += clicks;
      }
    }
  }

  const queries = [...merged.values()].sort((a, b) => b.searches - a.searches || a.query.localeCompare(b.query));
  if (queries.length === 0) throw new InputError('The log has a header but no usable rows. Check that count holds numbers and query is not blank.');

  const totalSearches = queries.reduce((s, q) => s + q.searches, 0);
  const knownSearches = queries.reduce((s, q) => s + q.knownSearches, 0);
  const zeroSearches = queries.reduce((s, q) => s + q.zeroSearches, 0);
  const topCount = queries[0].searches;
  const tooSmall = totalSearches < opts.minSearches || topCount < MIN_TOP_QUERY;

  const zeroQueries = queries.filter((q) => q.zeroSearches > 0).sort((a, b) => b.zeroSearches - a.zeroSearches || a.query.localeCompare(b.query));
  const noClicks = hasClicks
    ? queries.filter((q) => q.withResults > 0 && q.unknownClicks === 0 && q.clicksOnResults === 0).sort((a, b) => b.withResults - a.withResults || a.query.localeCompare(b.query))
    : null;

  const bySearch = new Map(queries.map((q) => [q.query, q]));
  const found = findVariantGroups(queries);
  const variants = found.groups
    .map((group) => {
      const forms = [...group.members].map((q) => bySearch.get(q)).sort((a, b) => b.searches - a.searches || a.query.localeCompare(b.query));
      const zeroForms = forms.filter((f) => f.knownSearches > 0 && f.zeroSearches === f.knownSearches);
      const answeredForms = forms.filter((f) => f.withResults > 0);
      return {
        forms,
        reasons: [...group.reasons],
        searches: forms.reduce((s, f) => s + f.searches, 0),
        synonymWouldFix: zeroForms.length > 0 && answeredForms.length > 0 ? zeroForms.map((f) => f.query) : [],
      };
    })
    .sort((a, b) => b.synonymWouldFix.length - a.synonymWouldFix.length || b.searches - a.searches);

  return {
    rowCount: rows.length - 1,
    rawDistinct: rawForms.size,
    distinct: queries.length,
    totalSearches,
    knownSearches,
    unknownResultSearches,
    zeroSearches,
    zeroShare: knownSearches > 0 ? (zeroSearches / knownSearches) * 100 : null,
    topCount,
    tooSmall,
    hasClicks,
    dropped,
    queries,
    zeroQueries,
    noClicks,
    variants,
    variantCapped: found.capped,
  };
}

// Report ------------------------------------------------------------------

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const show = (q) => (EMAIL.test(q) ? '[looks like an email address, hidden]' : q);
const num = (n) => n.toLocaleString('en-US');
const pct = (n) => `${n < 10 ? n.toFixed(1) : Math.round(n)}%`;

function listing(lines, top) {
  const shown = top > 0 ? lines.slice(0, top) : lines;
  const out = shown.map((l) => `  ${l}`);
  if (shown.length < lines.length) out.push(`  ... and ${num(lines.length - shown.length)} more (--top 0 shows all)`);
  return out;
}

function render(r, file, opts) {
  const out = [];
  out.push(`search-log: ${file}`);
  out.push(`Rows: ${num(r.rowCount)}   Searches: ${num(r.totalSearches)}   Distinct queries: ${num(r.distinct)} after normalising, ${num(r.rawDistinct)} before`);
  const dropped = [['blank query', r.dropped.blankQuery], ['count not a number or blank', r.dropped.badCount], ['results not a number', r.dropped.badResults], ['clicks not a number', r.dropped.badClicks], ['more cells than the header', r.dropped.tooWide]];
  for (const [label, lines] of dropped) {
    if (lines.length > 0) out.push(`Rows dropped, ${label}: ${lines.length} (line ${lines.slice(0, 10).join(', ')}${lines.length > 10 ? ', ...' : ''})`);
  }
  if (r.unknownResultSearches > 0) out.push(`Searches with a blank results cell: ${num(r.unknownResultSearches)}. These are left out of the zero-result share, not counted as zero.`);
  const hidden = r.queries.filter((q) => EMAIL.test(q.query)).length;
  if (hidden > 0) out.push(`Queries that look like email addresses: ${hidden}. Hidden below.`);
  if (r.tooSmall) {
    out.push('', `TOO SMALL TO RANK: ${num(r.totalSearches)} searches, and the most frequent query appears ${num(r.topCount)} time(s).`);
    out.push('Use this log as a list of the words people typed. Do not present its order or its percentages as findings.');
  }

  out.push('', r.tooSmall ? 'QUERIES IN THE LOG (not a ranking)' : 'TOP QUERIES');
  out.push(...listing(r.queries.map((q) => `${num(q.searches).padStart(8)}  ${r.tooSmall ? '' : `${pct((q.searches / r.totalSearches) * 100).padStart(6)}  `}${show(q.query)}${q.zeroSearches > 0 ? `   (${num(q.zeroSearches)} returned nothing)` : ''}`), opts.top));

  out.push('', 'ZERO RESULTS');
  if (r.knownSearches === 0) out.push('  The results column is blank on every row, so this cannot be measured.');
  else if (r.tooSmall) out.push(`  ${num(r.zeroSearches)} of ${num(r.knownSearches)} searches returned nothing. Too few to state as a rate.`);
  else out.push(`  ${num(r.zeroSearches)} of ${num(r.knownSearches)} searches returned nothing: ${pct(r.zeroShare)}.`);

  if (r.zeroQueries.length > 0) {
    out.push('', r.tooSmall ? 'ZERO-RESULT QUERIES (not a ranking)' : 'TOP ZERO-RESULT QUERIES');
    out.push(...listing(r.zeroQueries.map((q) => `${num(q.zeroSearches).padStart(8)}  ${show(q.query)}`), opts.top));
  }

  out.push('', 'RESULTS BUT NO CLICKS');
  if (!r.hasClicks) out.push('  Not available: the log has no clicks column.');
  else if (r.noClicks.length === 0) out.push('  None.');
  else out.push(...listing(r.noClicks.map((q) => `${num(q.withResults).padStart(8)}  ${show(q.query)}`), opts.top));

  out.push('', 'QUERIES THAT DIFFER ONLY TRIVIALLY: candidates to share a synonym');
  if (r.variants.length === 0) out.push('  None.');
  else {
    out.push(...listing(r.variants.map((g) => {
      const forms = g.forms.map((f) => `${show(f.query)} (${num(f.searches)})`).join(' ~ ');
      const fix = g.synonymWouldFix.length > 0 ? `   SYNONYM WOULD ANSWER: ${g.synonymWouldFix.map(show).join(', ')}` : '';
      return `${forms}   [${g.reasons.join(', ')}]${fix}`;
    }), opts.top));
  }
  if (r.variantCapped) out.push(`  Spelling comparison covered the ${num(EDIT_DISTANCE_QUERY_CAP)} most-searched queries only.`);

  out.push('', 'This reports the log and nothing else. It cannot say why a search failed, what period the export covers, or what people who never searched wanted.');
  return out.join('\n');
}

// Command line ------------------------------------------------------------

function parseArgs(argv) {
  const opts = { file: null, top: 20, minSearches: 100, selfTest: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    let arg = argv[i];
    let value = null;
    const eq = arg.indexOf('=');
    if (arg.startsWith('--') && eq > 0) { value = arg.slice(eq + 1); arg = arg.slice(0, eq); }
    if (arg === '--self-test') { opts.selfTest = true; continue; }
    if (arg === '--help' || arg === '-h') { opts.help = true; continue; }
    if (arg.startsWith('-')) {
      if (arg !== '--top' && arg !== '--min-searches') throw new InputError(`Unknown option: ${arg}.`);
      if (value === null) value = argv[++i];
      if (value === undefined) throw new InputError(`${arg} needs a value.`);
      const n = Number(value);
      if (!Number.isInteger(n) || n < 0) throw new InputError(`${arg} must be a whole number, not "${value}".`);
      if (arg === '--top') opts.top = n; else opts.minSearches = n;
      continue;
    }
    if (opts.file) throw new InputError(`Only one log file is allowed. Got "${opts.file}" and "${arg}".`);
    opts.file = arg;
  }
  return opts;
}

function readFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch (err) {
    const why = err.code === 'ENOENT' ? 'no such file' : err.code === 'EISDIR' ? 'that is a folder' : err.message;
    throw new InputError(`Cannot read the log "${path}": ${why}.`);
  }
}

// Self-test ---------------------------------------------------------------

function selfTest() {
  const checks = [];
  const check = (name, fn) => checks.push([name, fn]);
  const rejects = (fn, pattern) => assert.throws(fn, (e) => e instanceof InputError && pattern.test(e.message));

  const log = [
    '﻿query,count,results,clicks',
    'Pricing,60,12,40',
    ' pricing ,40,12,25',
    'offsite planning,30,0,0',
    'off-site planning,10,8,6',
    '"refund, partial",25,0,0',
    '"say ""hello"" to support",8,3,0',
    'invoice,20,5,0',
    'invoices,15,5,4',
    'reciept,6,0,0',
    'receipt,12,4,3',
    'export data,9,,',
    'data export,4,3,1',
    'jane.doe@example.com,5,0,0',
    ',3,0,0',
    'broken row,many,1,1',
  ].join('\r\n');
  const r = analyse(log);
  const find = (q) => r.queries.find((x) => x.query === q);
  const group = (q) => r.variants.find((g) => g.forms.some((f) => f.query === q));

  check('normalises case and space, then merges counts', () => assert.equal(find('pricing').searches, 100));
  check('reads quoted commas and escaped quotes', () => {
    assert.ok(find('refund, partial'));
    assert.ok(find('say "hello" to support'));
  });
  check('computes the zero-result share of searches', () => {
    assert.equal(r.zeroSearches, 66);
    assert.equal(r.knownSearches, 235);
  });
  check('treats a blank results cell as unknown, not zero', () => {
    assert.equal(r.unknownResultSearches, 9);
    assert.equal(find('export data').zeroSearches, 0);
  });
  check('ranks zero-result queries by the searches that failed', () => assert.equal(r.zeroQueries[0].query, 'offsite planning'));
  check('flags queries with results and no clicks', () => assert.ok(r.noClicks.some((q) => q.query === 'say "hello" to support')));
  check('does not flag queries that were clicked', () => assert.ok(!r.noClicks.some((q) => q.query === 'pricing')));
  check('does not flag a query whose clicks are unknown', () => {
    const u = analyse('query,count,results,clicks\nalpha,200,5,\n');
    assert.equal(u.noClicks.length, 0);
  });
  check('groups a punctuation variant and says a synonym would answer it', () => {
    assert.deepEqual(group('offsite planning').synonymWouldFix, ['offsite planning']);
  });
  check('groups a plural variant', () => assert.ok(group('invoice').forms.some((f) => f.query === 'invoices')));
  check('groups a misspelling', () => assert.deepEqual(group('reciept').reasons, ['spelling']));
  check('groups a reordered query', () => assert.ok(group('data export').forms.some((f) => f.query === 'export data')));
  check('leaves unrelated and numbered queries apart', () => {
    assert.equal(closeSpelling('plan 2024', 'plan 2025'), false);
    const v = analyse('query,count,results\nui kit,50,1\nux kit,50,1\nbilling,50,1\n');
    assert.equal(v.variants.length, 0);
  });
  check('drops and reports blank queries and bad counts', () => {
    assert.deepEqual(r.dropped.blankQuery, [15]);
    assert.deepEqual(r.dropped.badCount, [16]);
  });
  check('calls a small log too small to rank', () => {
    const small = analyse('query,count,results\nalpha,2,0\nbeta,1,3\n');
    assert.equal(small.tooSmall, true);
    assert.match(render(small, 'x.csv', { top: 20 }), /TOO SMALL TO RANK/);
    assert.doesNotMatch(render(small, 'x.csv', { top: 20 }), /\d%/);
  });
  check('calls a flat log too small to rank however long it is', () => {
    const rows = ['query,count,results'];
    for (let i = 0; i < 300; i++) rows.push(`query number ${i},1,2`);
    assert.equal(analyse(rows.join('\n')).tooSmall, true);
  });
  check('does not warn on a log large enough to rank', () => assert.equal(r.tooSmall, false));
  check('hides email addresses in the report', () => {
    const text = render(r, 'x.csv', { top: 0 });
    assert.doesNotMatch(text, /jane\.doe/);
    assert.match(text, /email address/);
  });
  check('says when there is no clicks column', () => {
    const n = analyse('query,count,results\nalpha,200,0\n');
    assert.equal(n.noClicks, null);
    assert.match(render(n, 'x.csv', { top: 20 }), /no clicks column/);
  });
  check('reports a missing column clearly', () => rejects(() => analyse('query,hits\na,1\n'), /missing column\(s\): count, results/));
  check('hints at the wrong delimiter', () => rejects(() => analyse('query\tcount\tresults\na\t1\t0\n'), /tab or semicolon/));
  check('reports an unclosed quote with its line', () => rejects(() => analyse('query,count,results\n"alpha,1,0\n'), /line 2/));
  check('rejects an empty log', () => rejects(() => analyse(''), /empty/));
  check('rejects a log with no usable rows', () => rejects(() => analyse('query,count,results\nalpha,x,1\n'), /no usable rows/));

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
    if (!opts.file) throw new InputError('Give a search log CSV. Columns: query, count, results, and optionally clicks.');
    console.log(render(analyse(readFile(opts.file), opts), opts.file, opts));
    return 0;
  } catch (err) {
    if (err instanceof InputError) {
      console.error(`search-log: ${err.message}\nRun with --help for usage.`);
      return 2;
    }
    console.error(`search-log: unexpected problem: ${err.message}`);
    return 2;
  }
}

process.exitCode = main();
