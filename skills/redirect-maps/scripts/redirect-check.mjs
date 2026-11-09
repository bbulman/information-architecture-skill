#!/usr/bin/env node
// Checks a redirect map: coverage of the old URLs, chains, loops, duplicate
// sources, self-redirects, homepage dumping, statuses and query strings.
//
//   node redirect-check.mjs <map.csv> [--old old-urls.txt] [--new new-urls.txt] [--all]
//   node redirect-check.mjs --self-test
//
// The map needs from, to and status columns, and may have reason, rule and checked.
// A URL with a query string is a different URL from the same path without one.
// With --old, every old URL needs a row of its own. A pattern row does not stand in for it.
// Exit codes: 0 no warnings, 1 warnings, 2 bad input.

import { readFileSync } from 'node:fs';

const LIST_LIMIT = 25;
const HOME_MIN = 3;
const HOME_SHARE = 0.05;
const HOME_ALWAYS = 20;
const TRACKING = /^(utm_[a-z]+|gclid|fbclid|msclkid|mc_cid|mc_eid)$/i;
const HOME_ALIAS = /^\/(index|default|home)(\.[a-z0-9]+)?\/?$/i;
const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|csv|zip|png|jpe?g|gif|webp|svg|mp3|mp4)$/i;
const HEADER_NAMES = {
  from: ['from', 'old', 'old_url', 'oldurl', 'old url', 'source', 'source_url', 'src'],
  to: ['to', 'new', 'new_url', 'newurl', 'new url', 'destination', 'dest', 'target', 'target_url'],
  status: ['status', 'status_code', 'code', 'http_status', 'type'],
  reason: ['reason', 'note', 'notes', 'comment', 'comments', 'why'],
};

const CHECKS = {
  'bad-row': ['WARN', 'Rows that could not be read', 'Fix these cells. A URL is a full URL or a path starting with /.'],
  uncovered: ['WARN', 'Old URLs with no row', 'Every old URL needs its own row: a 301, a 410, or a 200 with the same URL as its destination.'],
  'uncovered-query': ['WARN', 'Query-string URLs with no row of their own', 'The bare path is mapped, but a query string makes this a different URL. Resolve what it pointed to and give it its own row.'],
  'loosely-covered': ['WARN', 'Old URLs covered only by a looser match', 'Case or a trailing slash differs from the row. Confirm the platform treats them as the same, or add the exact form.'],
  chain: ['WARN', 'Chains', 'Each hop is another request, and crawlers stop following after a limit. Point the first source straight at the final destination.'],
  'into-gone': ['WARN', 'Redirects that end on a 410', 'The destination is marked gone. Send the source somewhere that exists, or mark it 410 too.'],
  loop: ['WARN', 'Loops', 'These never resolve. Decide the real destination and break the cycle.'],
  duplicate: ['WARN', 'Duplicate sources', 'Each source gets one row. Where the destinations differ, only one can win.'],
  self: ['WARN', 'Source equals destination', 'This redirects to itself. If the URL stays put, mark it 200 with the reason "unchanged". If it moves, give the real destination.'],
  'query-loop': ['WARN', 'Query-string source sent to its own bare path', 'These are distinct URLs, so this is not a self-redirect. On a platform that matches the path alone it becomes a loop. Confirm query-string matching before shipping.'],
  'query-pair': ['NOTE', 'Same path mapped with and without a query string', 'These rows are distinct URLs, as they should be. On a platform that matches the path alone they collide and only one can work. Confirm query-string matching before shipping.'],
  homepage: ['WARN', 'Many sources sent to the homepage', 'Search engines tend to treat a mass redirect to home like a 404, and people find it disorienting. Find the closest equivalent, or mark the page 410.'],
  'status-unreasoned': ['WARN', 'Statuses other than 301 or 410 with no reason', 'Use 301 for a permanent move and 410 for gone. Anything else needs a stated reason.'],
  'status-missing': ['WARN', 'Rows with no status', 'Give each row 301, 410, or another status with a reason.'],
  'to-on-gone': ['WARN', 'A destination on a 410', 'A 410 goes nowhere. Clear the destination, or change the status to 301.'],
  'no-destination': ['WARN', 'Redirects with no destination', 'Give the row a destination, or mark it 410.'],
  'moved-200': ['WARN', 'A 200 row with a different destination', 'A 200 means the URL is unchanged. Use 301 if it moves.'],
  'blank-200': ['WARN', 'A 200 row with no destination', 'Write the same URL in the to column, so every row reads the same way.'],
  fragment: ['WARN', 'Sources with a fragment', 'A # fragment never reaches the server, so a server rule cannot match it. Handle these in the page, in script.'],
  'to-missing': ['WARN', 'Destinations not on the new site', 'These redirect to pages the new URL list does not contain.'],
  'query-sources': ['NOTE', 'Sources with a query string', 'Each is treated as a different URL from its bare path. Confirm the platform can match on the query string.'],
  'home-few': ['NOTE', 'Sent to the homepage', 'Few enough not to warn. Check whether each has a closer equivalent.'],
  'status-reasoned': ['NOTE', 'Statuses other than 301 or 410, with a reason', 'Read each reason. A permanent move must not be a 302.'],
  'case-or-slash': ['NOTE', 'Source and destination differ only by case or trailing slash', 'A sound canonical redirect, unless the platform ignores case or normalises slashes first. Then it loops. Confirm.'],
  'possible-chain': ['NOTE', 'Destinations that differ from a source only by case or trailing slash', 'If the platform treats these as the same URL, this is a chain.'],
  pattern: ['NOTE', 'Pattern rows', 'Chains, loops and duplicates are not checked through these. Expand them to one row per URL for the final check.'],
  'pattern-covered': ['WARN', 'Old URLs matched only by a pattern row', 'A pattern is how a row is implemented, not a substitute for the row. Give each URL its own row and name the pattern in the rule column.'],
  'tracking-only': ['NOTE', 'Tracking-only query strings', 'The bare path is mapped and the query string only carries tracking. Confirm the platform still applies the redirect when it is present.'],
  unchanged: ['WARN', 'Old URLs that stay put but have no row', 'Give each its own row: status 200, the same URL as its destination, reason "unchanged".'],
  'mixed-to': ['NOTE', 'Destinations mix trailing slash and none', 'One form will get a second hop through the canonical redirect. Write every destination in the canonical form.'],
  'loose-to': ['NOTE', 'Destinations found only by a looser match', 'Case or a trailing slash differs from the new URL list.'],
  external: ['NOTE', 'Full-host destinations from path-only sources', 'Read as another site, so chains and self-redirects are not checked through them. Use one form in both columns if they are the same site.'],
};

class InputError extends Error {}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quoteLine = 0;
  let line = 1;
  let rowLine = 1;
  const source = text.replace(/^﻿/, '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i += 1;
        } else inQuotes = false;
      } else {
        if (char === '\n') line += 1;
        field += char;
      }
    } else if (char === '"' && field.trim() === '') {
      inQuotes = true;
      field = '';
      quoteLine = line;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push({ cells: row, line: rowLine });
      row = [];
      field = '';
      line += 1;
      rowLine = line;
    } else field += char;
  }
  if (inQuotes) throw new InputError(`Unclosed quote in the CSV, starting on line ${quoteLine}.`);
  if (field !== '' || row.length) {
    row.push(field);
    rows.push({ cells: row, line: rowLine });
  }
  return rows.filter((r) => r.cells.some((cell) => cell.trim() !== ''));
}

function readMap(text) {
  if (!text.trim()) throw new InputError('The map is empty. Expected a CSV with from, to and status columns.');
  const rows = parseCsv(text);
  if (!rows.length) throw new InputError('The map has no rows. Expected a CSV with from, to and status columns.');
  const header = rows[0].cells.map((cell) => cell.trim().toLowerCase());
  const column = (name) => header.findIndex((cell) => HEADER_NAMES[name].includes(cell));
  let indexes = { from: column('from'), to: column('to'), status: column('status'), reason: column('reason') };
  let body = rows.slice(1);
  if (indexes.from < 0 || indexes.to < 0 || indexes.status < 0) {
    const looksHeaderless = /^(\/|https?:)/i.test(rows[0].cells[0].trim()) && rows[0].cells.length >= 3;
    if (!looksHeaderless) {
      throw new InputError(`The map needs from, to and status columns. Found: ${header.join(', ')}.`);
    }
    indexes = { from: 0, to: 1, status: 2, reason: 3 };
    body = rows;
  }
  if (!body.length) throw new InputError('The map has a header and no rows.');
  const cell = (r, index) => (index >= 0 ? (r.cells[index] ?? '').trim() : '');
  return body.map((r) => ({
    line: r.line,
    from: cell(r, indexes.from),
    to: cell(r, indexes.to),
    status: cell(r, indexes.status),
    reason: cell(r, indexes.reason),
  }));
}

function readUrlList(text, fileName) {
  if (/\.csv$/i.test(fileName)) {
    const rows = parseCsv(text);
    if (!rows.length) return [];
    const header = rows[0].cells.map((cell) => cell.trim().toLowerCase());
    const named = header.findIndex((cell) => ['url', 'address', 'loc', 'link', 'page', 'from', 'old_url'].includes(cell));
    if (named >= 0) return rows.slice(1).map((r) => (r.cells[named] ?? '').trim()).filter(Boolean);
    const firstIsUrl = /^(\/|https?:)/i.test(rows[0].cells[0].trim());
    return (firstIsUrl ? rows : rows.slice(1)).map((r) => r.cells[0].trim()).filter(Boolean);
  }
  return text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^#(\s|$)/.test(line));
}

function parseUrl(raw) {
  let text = raw.trim();
  if (!text.startsWith('/') && /^[a-z0-9-]+(\.[a-z]{2,})+([/?#]|$)/i.test(text)) text = `//${text}`;
  const match = text.match(/^(?:(https?):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/i);
  if (!match) return null;
  const [, scheme, host, path, query, fragment] = match;
  if (path && !path.startsWith('/')) return null;
  if (!host && !path && query === undefined) return null;
  return { raw: raw.trim(), scheme: scheme ? scheme.toLowerCase() : null, fullHost: host ? host.toLowerCase() : null, host: host ? host.toLowerCase().replace(/^www\./, '') : null, path: path || '/', query: query ?? null, fragment: fragment ?? null };
}

const pathQuery = (url) => `${url.path}${url.query !== null ? `?${url.query}` : ''}`;
const stripSlash = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path);
const looseQuery = (url) => `${stripSlash(url.path).toLowerCase()}${url.query !== null ? `?${url.query}` : ''}`;
const isPatternRow = (text) => text.includes('*') || /\/:[a-z_]+/i.test(text);
const patternToRegex = (text) =>
  new RegExp(`^${text.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/:[a-z_]+/gi, '[^/]+')}$`, 'i');

function analyse(rows, options = {}) {
  const findings = Object.fromEntries(Object.keys(CHECKS).map((key) => [key, []]));
  const add = (key, text) => findings[key].push(text);

  const parsed = [];
  for (const row of rows) {
    if (!row.from) {
      add('bad-row', `line ${row.line}: no source`);
      continue;
    }
    const fromUrl = parseUrl(row.from);
    if (!fromUrl) {
      add('bad-row', `line ${row.line}: "${row.from}" is not a URL or a path starting with /`);
      continue;
    }
    const toUrl = row.to ? parseUrl(row.to) : null;
    if (row.to && !toUrl) {
      add('bad-row', `line ${row.line}: "${row.to}" is not a URL or a path starting with /`);
      continue;
    }
    parsed.push({ ...row, fromUrl, toUrl, pattern: isPatternRow(row.from) });
  }

  const oldUrls = [];
  for (const line of options.oldLines ?? []) {
    const url = parseUrl(line);
    if (url) oldUrls.push(url);
    else add('bad-row', `old URL list: "${line}" is not a URL or a path starting with /`);
  }

  const sourceHosts = new Set([...parsed.map((r) => r.fromUrl.host), ...oldUrls.map((u) => u.host)].filter(Boolean));
  const multiple = sourceHosts.size > 1;
  const keyOf = (url, inherit = null) => `${multiple ? `${url.host ?? inherit ?? ''}|` : ''}${pathQuery(url)}`;
  const looseOf = (url, inherit = null) => `${multiple ? `${url.host ?? inherit ?? ''}|` : ''}${looseQuery(url)}`;
  const internal = (url) => !url.host || sourceHosts.has(url.host);
  // Rows compare whole addresses once they spell more than one origin, so www to apex and
  // http to https are moves. A path-only URL inherits its row's origin, or has none.
  const originOf = (url) => `${url.scheme ?? 'https'}://${url.fullHost}`;
  const originsVary = new Set(parsed.flatMap((row) => [row.fromUrl, row.toUrl]).filter((url) => url?.host && sourceHosts.has(url.host)).map(originOf)).size > 1;
  const addressOf = (url, inherit = null) => {
    if (!originsVary) return keyOf(url, inherit?.host);
    const base = url.host ? url : inherit;
    return `${base?.host ? originOf(base) : ''}|${pathQuery(url)}`;
  };
  const fromKey = (row) => addressOf(row.fromUrl);
  const toKey = (row) => addressOf(row.toUrl, row.fromUrl);

  const exact = parsed.filter((row) => !row.pattern);
  const patterns = parsed.filter((row) => row.pattern);
  patterns.forEach((row) => add('pattern', `line ${row.line}: ${row.from}`));

  if (!sourceHosts.size && parsed.some((row) => row.toUrl?.host)) {
    const count = parsed.filter((row) => row.toUrl?.host).length;
    add('external', `${count} row${count === 1 ? '' : 's'}, for example ${parsed.find((row) => row.toUrl?.host).to}`);
  }

  const counts = { total: parsed.length, '301': 0, '410': 0, '200': 0, other: 0, query: 0, files: 0 };
  for (const row of parsed) {
    if (row.status in counts) counts[row.status] += 1;
    else counts.other += 1;
    if (row.fromUrl.query !== null) counts.query += 1;
    if (FILE_EXT.test(row.fromUrl.path)) counts.files += 1;

    if (!row.status) add('status-missing', `line ${row.line}: ${row.from}`);
    else if (row.status !== '301' && row.status !== '410') {
      if (row.reason) {
        if (row.status !== '200') add('status-reasoned', `line ${row.line}: ${row.status} ${row.from} (${row.reason})`);
      } else add('status-unreasoned', `line ${row.line}: ${row.status} ${row.from}`);
    }
    if (row.status === '410' && row.to) add('to-on-gone', `line ${row.line}: ${row.from} -> ${row.to}`);
    if (/^3\d\d$/.test(row.status) && !row.to) add('no-destination', `line ${row.line}: ${row.from}`);
    if (row.status === '200' && row.toUrl && toKey(row) !== fromKey(row)) {
      add('moved-200', `line ${row.line}: ${row.from} -> ${row.to}`);
    }
    if (row.status === '200' && !row.to) add('blank-200', `line ${row.line}: ${row.from}`);
    if (row.fromUrl.fragment !== null) add('fragment', `line ${row.line}: ${row.from}`);
  }

  const isMove = (row) => row.toUrl && row.status !== '410' && row.status !== '200';

  const bySource = new Map();
  for (const row of exact) {
    const key = fromKey(row);
    bySource.set(key, [...(bySource.get(key) ?? []), row]);
  }
  for (const list of bySource.values()) {
    if (list.length < 2) continue;
    const lines = list.map((row) => row.line).join(', ');
    const agree = new Set(list.map((row) => `${row.to}|${row.status}`)).size === 1;
    add('duplicate', `${list[0].from} on lines ${lines}${agree ? ', same destination each time' : `, with different outcomes: ${list.map((row) => row.to || row.status).join(' versus ')}`}`);
  }

  const graph = new Map();
  const gone = new Set();
  for (const row of exact) {
    if (row.status === '410') gone.add(fromKey(row));
    if (!isMove(row) || !internal(row.toUrl)) continue;
    if (fromKey(row) === toKey(row)) {
      add('self', `line ${row.line}: ${row.from} -> ${row.to}`);
      continue;
    }
    const looseForm = (url) => ({ ...url, path: stripSlash(url.path).toLowerCase() });
    if (addressOf(looseForm(row.fromUrl)) === addressOf(looseForm(row.toUrl), row.fromUrl)) add('case-or-slash', `line ${row.line}: ${row.from} -> ${row.to}`);
    if (!graph.has(fromKey(row))) graph.set(fromKey(row), row);
  }

  // Where a row lands, for following it. A host that matches the path alone never sees the
  // destination's query string, and a path-only source applies on every origin.
  const landing = (row) => {
    const known = (key) => graph.has(key) || gone.has(key);
    for (const url of row.toUrl.query === null ? [row.toUrl] : [row.toUrl, { ...row.toUrl, query: null }]) {
      const key = addressOf(url, row.fromUrl);
      if (known(key)) return key;
      if (originsVary && known(`|${pathQuery(url)}`)) return `|${pathQuery(url)}`;
    }
    return toKey(row);
  };

  const loopsSeen = new Set();
  for (const row of graph.values()) {
    const hops = [row];
    const keys = [fromKey(row)];
    let current = landing(row);
    while (graph.has(current) && !keys.includes(current)) {
      const next = graph.get(current);
      hops.push(next);
      keys.push(current);
      current = landing(next);
    }
    const trail = [...hops.map((hop) => hop.from), hops[hops.length - 1].to].join(' -> ');
    if (keys.includes(current)) {
      const start = keys.indexOf(current);
      const id = keys.slice(start).sort().join(' ');
      if (start === 0) {
        if (!loopsSeen.has(id)) add('loop', trail);
        loopsSeen.add(id);
      } else add('loop', `${trail} (${row.from} leads into the loop)`);
      continue;
    }
    if (hops.length > 1) add('chain', `${trail}. Collapse: ${row.from} -> ${hops[hops.length - 1].to}`);
    if (gone.has(current)) add('into-gone', `${[...hops.map((hop) => hop.from), hops[hops.length - 1].to].join(' -> ')} (410)`);
  }

  const looseSources = new Map();
  for (const row of exact) looseSources.set(looseOf(row.fromUrl), row.from);
  for (const row of graph.values()) {
    const lands = landing(row);
    const key = [row.toUrl, { ...row.toUrl, query: null }].map((url) => looseOf(url, row.fromUrl.host)).find((k) => looseSources.has(k));
    if (!graph.has(lands) && !gone.has(lands) && key && key !== looseOf(row.fromUrl)) {
      add('possible-chain', `line ${row.line}: ${row.from} -> ${row.to}, and ${looseSources.get(key)} is also a source`);
    }
  }

  const bare = new Set(exact.filter((row) => row.fromUrl.query === null).map((row) => keyOf(row.fromUrl)));
  const anyQueryOnPath = new Set();
  for (const row of exact) {
    if (row.fromUrl.query === null) continue;
    const bareKey = keyOf({ ...row.fromUrl, query: null });
    anyQueryOnPath.add(bareKey);
    add('query-sources', `${row.from} -> ${row.to || row.status}`);
    if (row.toUrl && internal(row.toUrl) && row.toUrl.query === null && keyOf(row.toUrl, row.fromUrl.host) === bareKey) {
      add('query-loop', `line ${row.line}: ${row.from} -> ${row.to}`);
    }
    if (bare.has(bareKey)) add('query-pair', `${row.from} and ${row.fromUrl.path}`);
  }

  const moves = parsed.filter(isMove);
  const homeRows = moves.filter((row) => row.toUrl.path === '/' && row.toUrl.query === null && !HOME_ALIAS.test(row.fromUrl.path) && !(row.fromUrl.path === '/' && row.fromUrl.query === null));
  if (homeRows.length >= HOME_ALWAYS || (homeRows.length >= HOME_MIN && homeRows.length / Math.max(moves.length, 1) >= HOME_SHARE)) {
    homeRows.forEach((row) => add('homepage', `line ${row.line}: ${row.from}`));
  } else {
    homeRows.forEach((row) => add('home-few', `line ${row.line}: ${row.from}`));
  }

  const withSlash = moves.filter((row) => row.toUrl.path !== '/' && row.toUrl.path.endsWith('/')).length;
  const withoutSlash = moves.filter((row) => row.toUrl.path !== '/' && !row.toUrl.path.endsWith('/') && !/\.[a-z0-9]{1,5}$/i.test(row.toUrl.path)).length;
  if (withSlash && withoutSlash) add('mixed-to', `${withSlash} with a trailing slash, ${withoutSlash} without`);

  const newUrls = (options.newLines ?? []).map(parseUrl).filter(Boolean);
  const newPaths = new Set(newUrls.map((url) => url.path));
  const newExact = new Set(newUrls.map(pathQuery));
  const newLoose = new Set(newUrls.map((url) => stripSlash(url.path).toLowerCase()));
  if (options.newLines) {
    for (const row of moves) {
      if (row.pattern) continue;
      if (newPaths.has(row.toUrl.path)) continue;
      if (newLoose.has(stripSlash(row.toUrl.path).toLowerCase())) add('loose-to', `line ${row.line}: ${row.to}`);
      else add('to-missing', `line ${row.line}: ${row.from} -> ${row.to}`);
    }
  }

  let covered = null;
  if (options.oldLines) {
    covered = 0;
    const seen = new Set();
    const listed = new Set(exact.map((row) => keyOf(row.fromUrl)));
    const compiled = patterns.map((row) => ({
      path: patternToRegex(row.fromUrl.path),
      query: row.fromUrl.query === null ? null : patternToRegex(row.fromUrl.query),
    }));
    // A wildcard in the path says nothing about the query string: a row must name one to match one.
    const inPattern = (url) => compiled.some((p) => p.path.test(url.path) && (url.query === null ? p.query === null : p.query !== null && p.query.test(url.query)));
    for (const url of oldUrls) {
      const key = keyOf(url);
      if (seen.has(key)) continue;
      seen.add(key);
      const bareUrl = { ...url, query: null };
      if (listed.has(key)) {
        covered += 1;
      } else if (newExact.has(pathQuery(url))) {
        add('unchanged', url.raw);
      } else if (looseSources.has(looseOf(url))) {
        covered += 1;
        add('loosely-covered', `${url.raw} (nearest row: ${looseSources.get(looseOf(url))})`);
      } else if (inPattern(url)) {
        add('pattern-covered', url.raw);
      } else if (url.query !== null && (listed.has(keyOf(bareUrl)) || inPattern(bareUrl))) {
        const names = url.query.split('&').filter(Boolean).map((pair) => pair.split('=')[0]);
        if (names.length && names.every((name) => TRACKING.test(name))) {
          covered += 1;
          add('tracking-only', url.raw);
        } else add('uncovered-query', url.raw);
      } else if (url.query === null && anyQueryOnPath.has(key)) {
        add('uncovered', `${url.raw} (only forms with a query string are mapped)`);
      } else add('uncovered', url.raw);
    }
    covered = { covered, total: seen.size };
  }

  return { findings, counts, coverage: covered };
}

function printReport(result, fileName, showAll) {
  const { findings, counts, coverage } = result;
  console.log(`Map: ${fileName}`);
  console.log(`${counts.total} rows: ${counts['301']} at 301, ${counts['410']} at 410, ${counts['200']} unchanged, ${counts.other} other. ${counts.query} with a query string, ${counts.files} files.`);
  if (coverage) console.log(`Old URLs: ${coverage.covered} of ${coverage.total} covered.`);

  const flagged = (severity) => Object.keys(CHECKS).filter((key) => CHECKS[key][0] === severity && findings[key].length);
  for (const [title, severity] of [['Warnings', 'WARN'], ['Notes', 'NOTE']]) {
    const keys = flagged(severity);
    if (!keys.length) continue;
    console.log(`\n${title}`);
    for (const key of keys) {
      const list = findings[key];
      console.log(`\n  ${CHECKS[key][1]} (${list.length})`);
      console.log(`  ${CHECKS[key][2]}`);
      const shown = showAll ? list : list.slice(0, LIST_LIMIT);
      shown.forEach((entry) => console.log(`    ${entry}`));
      if (shown.length < list.length) console.log(`    ... and ${list.length - shown.length} more (use --all)`);
    }
  }
  const warnings = flagged('WARN').reduce((sum, key) => sum + findings[key].length, 0);
  const notes = flagged('NOTE').reduce((sum, key) => sum + findings[key].length, 0);
  console.log(`\nResult: ${warnings} warning${warnings === 1 ? '' : 's'}, ${notes} note${notes === 1 ? '' : 's'}.`);
  return warnings;
}

function selfTest() {
  let passed = 0;
  let failed = 0;
  const check = (name, condition) => {
    if (condition) {
      passed += 1;
      console.log(`ok    ${name}`);
    } else {
      failed += 1;
      console.log(`FAIL  ${name}`);
    }
  };
  const run = (csv, old, fresh) =>
    analyse(readMap(csv), { oldLines: old ? old.split('\n').filter(Boolean) : undefined, newLines: fresh ? fresh.split('\n').filter(Boolean) : undefined });
  const count = (result, key) => result.findings[key].length;
  const warningTotal = (result) => Object.keys(CHECKS).filter((k) => CHECKS[k][0] === 'WARN').reduce((sum, k) => sum + result.findings[k].length, 0);
  const head = 'from,to,status,reason\n';
  const throwsInput = (fn) => {
    try {
      fn();
      return false;
    } catch (error) {
      return error instanceof InputError;
    }
  };

  const clean = `${head}/company,/about,301,renamed\n/old-news,,410,retired\n/contact,/contact,200,unchanged\n`;
  check('a clean map has no warnings', warningTotal(run(clean, '/company\n/old-news\n/contact')) === 0);
  check('a clean map covers every old URL', run(clean, '/company\n/old-news\n/contact').coverage.covered === 3);

  const quoted = 'from,to,status,reason\n"/a,b","/c ""d""",301,"split, then merged"\n';
  const quotedRows = readMap(quoted);
  check('quoted cells with commas and escaped quotes are read whole', quotedRows[0].from === '/a,b' && quotedRows[0].to === '/c "d"' && quotedRows[0].reason === 'split, then merged');
  const multiline = readMap('from,to,status,reason\n/a,/b,302,"line one\nline two"\n/c,/d,301,\n');
  check('a newline inside quotes stays in its row', multiline.length === 2 && multiline[1].line === 4);
  check('CRLF line endings are read', readMap('from,to,status\r\n/a,/b,301\r\n').length === 1);
  check('header aliases are read', readMap('old_url,new_url,status,reason,checked\n/a,/b,301,,\n')[0].to === '/b');
  check('a headerless map is read', readMap('/a,/b,301\n').length === 1);

  check('an old URL with no row is flagged', count(run(clean, '/company\n/missing'), 'uncovered') === 1);
  const full = run(`${head}/about-us,/about,301,\n`, 'https://www.example.com/about-us\nhttps://www.example.com/gone');
  check('full old URLs match path rows', full.coverage.covered === 1 && count(full, 'uncovered') === 1);
  check('a looser match is flagged, not silently counted', count(run(`${head}/about/,/x,301,\n`, '/about'), 'loosely-covered') === 1);

  const chain = run(`${head}/a,/b,301,\n/b,/c,301,\n/c,/d,301,\n`);
  check('every hop of a chain is flagged', count(chain, 'chain') === 2);
  check('a chain says how to collapse it', chain.findings.chain[0].includes('Collapse: /a -> /d'));
  const queryChain = run(`${head}/a,/b?ref=old,301,\n/b,/c,301,\n`);
  check('a chain through a query-string destination is found', count(queryChain, 'chain') === 1 && queryChain.findings.chain[0].includes('Collapse: /a -> /c'));
  const queryLoop = run(`${head}/a,/b?ref=old,301,\n/b,/a,301,\n`);
  check('a loop through a query-string destination is a loop, with no collapse offered', count(queryLoop, 'loop') === 1 && count(queryLoop, 'chain') === 0);
  check('a redirect into a 410 is found through a query-string destination', count(run(`${head}/a,/b?x=1,301,\n/b,,410,gone\n`), 'into-gone') === 1);
  check('a path sent to itself with a query string added is a loop', count(run(`${head}/a,/a?ref=1,301,\n`), 'loop') === 1);
  check('an exact query-string source still wins over its bare path', (() => {
    const result = run(`${head}/x,/p?id=3,301,\n/p?id=3,/q,301,\n/p,/r,301,\n`);
    return result.findings.chain[0].includes('Collapse: /x -> /q');
  })());

  const loop = run(`${head}/a,/b,301,\n/b,/a,301,\n`);
  check('a loop is flagged once', count(loop, 'loop') === 1);
  const tail = run(`${head}/x,/a,301,\n/a,/b,301,\n/b,/a,301,\n`);
  check('a row leading into a loop is flagged', count(tail, 'loop') === 2);

  check('a duplicate source is flagged', count(run(`${head}/a,/b,301,\n/a,/c,301,\n`), 'duplicate') === 1);
  check('a source equal to its destination is flagged', count(run(`${head}/a,/a,301,\n`), 'self') === 1);
  const absSelf = run(`${head}https://example.com/a,/a,301,\n`);
  check('a self-redirect across forms is flagged', count(absSelf, 'self') === 1);
  check('case-only moves are a note', count(run(`${head}/About,/about,301,\n`), 'case-or-slash') === 1);
  const apex = run('from,to,status\nhttps://www.example.com/a,https://example.com/a,301\n');
  check('www to apex is a move, not a self-redirect or a loop', count(apex, 'self') === 0 && count(apex, 'loop') === 0 && count(apex, 'case-or-slash') === 0 && warningTotal(apex) === 0);
  const tls = run('from,to,status\nhttp://example.com/a,https://example.com/a,301\n');
  check('http to https is a move, not a self-redirect or a loop', count(tls, 'self') === 0 && count(tls, 'loop') === 0 && warningTotal(tls) === 0);
  check('a full URL sent to the identical full URL is still a self-redirect', count(run('from,to,status\nhttps://example.com/a,https://example.com/a,301\n'), 'self') === 1);
  check('a self-redirect is still found in a map that changes origin elsewhere', count(run('from,to,status\nhttp://example.com/a,https://example.com/a,301\nhttps://example.com/b,/b,301\n'), 'self') === 1);
  check('a www and apex pair pointing at each other is a loop', count(run('from,to,status\nhttps://www.example.com/a,https://example.com/a,301\nhttps://example.com/a,https://www.example.com/a,301\n'), 'loop') === 1);
  const hostChain = run('from,to,status\nhttp://example.com/a,https://example.com/a,301\nhttps://example.com/a,https://example.com/b,301\n');
  check('a chain through a host change is found', count(hostChain, 'chain') === 1 && hostChain.findings.chain[0].includes('Collapse: http://example.com/a -> https://example.com/b'));
  check('a path-only source catches a full-URL destination in a map that changes origin', count(run('from,to,status\nhttp://example.com/a,https://example.com/b,301\n/b,/c,301\n'), 'chain') === 1);
  check('the same path on two origins is not a duplicate source', count(run('from,to,status\nhttp://example.com/a,https://example.com/x,301\nhttps://www.example.com/a,https://example.com/x,301\n'), 'duplicate') === 0);
  check('a 200 that changes origin is not unchanged', count(run('from,to,status,reason\nhttp://example.com/a,https://example.com/a,200,kept\n'), 'moved-200') === 1);

  const home = run(`${head}/a,/,301,\n/b,/,301,\n/c,/,301,\n/d,/e,301,\n`);
  check('many sources sent home are flagged', count(home, 'homepage') === 3);
  const alias = run(`${head}/index.html,/,301,\n/home,/,301,\n/default.aspx,/,301,\n`);
  check('homepage aliases are not dumping', count(alias, 'homepage') === 0 && count(alias, 'home-few') === 0);
  check('one source sent home is only a note', count(run(`${head}/a,/,301,\n/b,/c,301,\n`), 'home-few') === 1);

  check('a 302 with no reason is flagged', count(run(`${head}/a,/b,302,\n`), 'status-unreasoned') === 1);
  const reasoned = run(`${head}/a,/b,302,seasonal page returns in June\n`);
  check('a 302 with a reason is a note', count(reasoned, 'status-unreasoned') === 0 && count(reasoned, 'status-reasoned') === 1);
  check('an unchanged row with a reason is not listed', count(run(`${head}/a,/a,200,unchanged\n`), 'status-reasoned') === 0);
  check('a 200 with no reason is flagged', count(run(`${head}/a,/a,200,\n`), 'status-unreasoned') === 1);
  check('a blank status is flagged', count(run(`${head}/a,/b,,\n`), 'status-missing') === 1);
  check('a destination on a 410 is flagged', count(run(`${head}/a,/b,410,gone\n`), 'to-on-gone') === 1);
  check('a 301 with no destination is flagged', count(run(`${head}/a,,301,\n`), 'no-destination') === 1);
  check('a redirect into a 410 is flagged', count(run(`${head}/a,/b,301,\n/b,,410,gone\n`), 'into-gone') === 1);

  const queryPair = run(`${head}/shop,/store,301,\n/shop?id=3,/store/blue,301,\n`);
  check('a path with and without a query string are not duplicates', count(queryPair, 'duplicate') === 0);
  check('the pair is reported', count(queryPair, 'query-pair') === 1 && count(queryPair, 'query-sources') === 1);
  check('the pair the skill requires raises no warning', warningTotal(queryPair) === 0);
  const queryOld = run(`${head}/shop,/store,301,\n`, '/shop\n/shop?id=3');
  check('an old query-string URL is not covered by its bare path', count(queryOld, 'uncovered-query') === 1 && queryOld.coverage.covered === 1);
  const bareOld = run(`${head}/shop?id=3,/store,301,\n`, '/shop');
  check('a bare old URL is not covered by a query-string row', count(bareOld, 'uncovered') === 1);
  check('a query-string source sent to its own path is not a self-redirect but is reported', (() => {
    const result = run(`${head}/p?id=3,/p,301,\n`);
    return count(result, 'self') === 0 && count(result, 'query-loop') === 1;
  })());
  check('tracking-only query strings are noted', count(run(`${head}/a,/b,301,\n`, '/a\n/a?utm_source=mail'), 'tracking-only') === 1);
  check('home with a query string is its own URL', count(run(`${head}/,/start,301,\n`, '/?p=112'), 'uncovered-query') === 1);

  check('a fragment source is flagged', count(run(`${head}/#pricing,/pricing,301,\n`), 'fragment') === 1);
  check('a bad path is flagged', count(run(`${head}about,/b,301,\n`), 'bad-row') === 1);

  const patternMap = run(`${head}/blog/*,/articles/:splat,301,\n`, '/blog/one');
  check('a pattern row does not stand in for an old URL\'s own row', count(patternMap, 'pattern-covered') === 1 && patternMap.coverage.covered === 0 && warningTotal(patternMap) === 1);
  check('a row of its own beside a pattern row covers the URL', run(`${head}/blog/*,/articles/:splat,301,\n/blog/one,/articles/one,301,\n`, '/blog/one').coverage.covered === 1);
  const blogQuery = run(`${head}/blog/*,/articles/:splat,301,\n`, '/blog/?p=112');
  check('a wildcard does not cover a URL with a query string', count(blogQuery, 'pattern-covered') === 0 && count(blogQuery, 'uncovered-query') === 1 && blogQuery.coverage.covered === 0 && warningTotal(blogQuery) === 1);
  const namedQuery = run(`${head}/blog/*?p=*,/articles/:splat,301,\n`, '/blog/?p=112\n/blog/plain');
  check('a pattern that names a query string matches only URLs with one', namedQuery.findings['pattern-covered'].join() === '/blog/?p=112' && count(namedQuery, 'uncovered') === 1);
  check('a tracking-only query string under a wildcard is only a note', count(run(`${head}/blog/*,/articles/:splat,301,\n`, '/blog/one?utm_source=mail'), 'tracking-only') === 1);

  const fresh = run(`${head}/a,/b,301,\n/c,/nope,301,\n`, null, '/b');
  check('a destination missing from the new list is flagged', count(fresh, 'to-missing') === 1);
  const stayed = run(`${head}/a,/b,301,\n`, '/a\n/keep', '/b\n/keep');
  check('an old URL still on the new site with no row is flagged, not covered', count(stayed, 'unchanged') === 1 && stayed.coverage.covered === 1 && warningTotal(stayed) === 1);
  const kept = run(`${head}/a,/b,301,\n/keep,/keep,200,unchanged\n`, '/a\n/keep', '/b\n/keep');
  check('a staying URL with its own 200 row is covered', kept.coverage.covered === 2 && warningTotal(kept) === 0);
  check('a 200 row with no destination is flagged', count(run(`${head}/keep,,200,unchanged\n`), 'blank-200') === 1);
  check('mixed destination forms are noted', count(run(`${head}/a,/b/,301,\n/c,/d,301,\n`), 'mixed-to') === 1);

  const domain = run('from,to,status\n/a,https://new.example/a,301\n');
  check('a move to another site is not a self-redirect', count(domain, 'self') === 0 && count(domain, 'external') === 1);

  check('a missing column is a clear input error', throwsInput(() => readMap('foo,bar\n1,2\n')));
  check('an unclosed quote is a clear input error', throwsInput(() => readMap('from,to,status\n"/a,/b,301\n')));
  check('an empty file is a clear input error', throwsInput(() => readMap('  \n')));
  check('a header with no rows is a clear input error', throwsInput(() => readMap('from,to,status\n')));

  console.log(`\nself-test: ${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const flag = arg.split('=')[0];
    if (arg === '--self-test') options.selfTest = true;
    else if (arg === '--all') options.all = true;
    else if (flag === '--old' || flag === '--new') {
      const value = arg.includes('=') ? arg.slice(arg.indexOf('=') + 1) : argv[(i += 1)];
      if (!value) throw new InputError(`${flag} needs a file.`);
      options[flag.slice(2)] = value;
    } else if (arg.startsWith('--')) throw new InputError(`Unknown option ${arg}.`);
    else positional.push(arg);
  }
  return { options, positional };
}

function readFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    throw new InputError(`Could not read ${path}: ${error.code === 'ENOENT' ? 'no such file' : error.code === 'EISDIR' ? 'that is a folder, not a file' : error.message}`);
  }
}

function main() {
  const { options, positional } = parseArgs(process.argv.slice(2));
  if (options.selfTest) return selfTest();
  if (positional.length !== 1) throw new InputError('Usage: node redirect-check.mjs <map.csv> [--old old-urls.txt] [--new new-urls.txt] [--all]');
  const rows = readMap(readFile(positional[0]));
  const oldLines = options.old ? readUrlList(readFile(options.old), options.old) : undefined;
  const newLines = options.new ? readUrlList(readFile(options.new), options.new) : undefined;
  if (oldLines && !oldLines.length) throw new InputError(`No URLs found in ${options.old}.`);
  if (newLines && !newLines.length) throw new InputError(`No URLs found in ${options.new}.`);
  return printReport(analyse(rows, { oldLines, newLines }), positional[0], options.all) ? 1 : 0;
}

try {
  process.exitCode = main();
} catch (error) {
  if (error instanceof InputError) console.error(`redirect-check: ${error.message}`);
  else console.error(`redirect-check: could not check this file: ${error.message}`);
  process.exitCode = 2;
}
