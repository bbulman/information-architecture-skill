#!/usr/bin/env node
// Checks a list of URLs against the URL rules: case, separators, extensions,
// trailing slashes, query-string ids, duplicates, depth and hash navigation.
//
//   node url-check.mjs <urls.txt|urls.csv> [--max-depth N] [--all]
//   node url-check.mjs --self-test
//
// A text file holds one URL or path per line; "# " starts a comment.
// A CSV uses its url, address or loc column, or else its first column.
// Exit codes: 0 no warnings, 1 warnings, 2 bad input.

import { readFileSync } from 'node:fs';

const DEFAULT_MAX_DEPTH = 4;
const LIST_LIMIT = 25;
const LONG_SLUG = 60;
const PAGE_EXT = /\.(html?|xhtml|shtml|php\d?|aspx?|jspx?|cfml?|cgi|pl|do|action)$/i;
const FILE_EXT = /\.[a-z0-9]{1,5}$/i;
const ROOT_FILES = /^\/(sitemap[^/]*\.xml|robots\.txt|favicon\.ico|feed\.xml|rss\.xml|humans\.txt|ads\.txt|\.well-known\/.*)$/i;
const TRACKING = /^(utm_[a-z]+|gclid|fbclid|msclkid|mc_cid|mc_eid)$/i;
const ID_PARAM = /^(id|p|pid|post|cat|cid|nid|node|tid|item|itemid|product|productid|article|articleid|sku|uid|sid|sessionid|phpsessid|jsessionid)$/i;
const LOCALE_PARAM = /^(lang|language|locale|hl)$/i;
const LOCALE_SEGMENT = /^[a-z]{2}(-[a-z]{2,4})?$/i;
const PLACEHOLDER = /<[^>]+>|\{[^}]+\}|\[[^\]]+\]|:[a-zA-Z_]+/g;

const CHECKS = {
  space: ['WARN', 'Spaces in the path', 'Use hyphens. A space has to be escaped in every link.'],
  uppercase: ['WARN', 'Uppercase in the path', 'Paths are lowercase. Redirect the mixed-case form.'],
  underscore: ['WARN', 'Underscores in the path', 'Use hyphens. Redirect the underscored form.'],
  extension: ['WARN', 'File extensions on pages', 'The implementation is not the address. Drop the extension and redirect.'],
  slash: ['WARN', 'Trailing-slash inconsistency', 'Pick one form, enforce it, and set canonical tags. These URLs are the minority form.'],
  queryId: ['WARN', 'Identity in the query string', 'A query string is for state: filters, sort and page. Give the thing a readable path. If this parameter really is paging or filtering, it can stay.'],
  locale: ['WARN', 'Locale in the query string', 'The locale belongs in a path prefix such as /de/.'],
  duplicate: ['WARN', 'Duplicates after normalising', 'These forms read as one page. Keep one canonical form and redirect the others.'],
  depth: ['WARN', 'Overly deep paths', 'Shorten the path, or say why this one needs the depth.'],
  hash: ['WARN', 'Hash navigation', 'A fragment never reaches the server, so this breaks deep links, history and search. Give each destination a real path.'],
  doubleSlash: ['WARN', 'Doubled slashes in the path', 'Collapse them and redirect.'],
  anchor: ['NOTE', 'In-page anchors', 'Fine as links to a place in a page, but these are not separate pages and do not belong in a URL list.'],
  file: ['NOTE', 'Files', 'Not page addresses, so no rule is broken, but each needs a stable home and a row in any redirect map.'],
  pathId: ['NOTE', 'Numbers in the path', 'Slugs are content, not database ids. Check whether these are ids.'],
  longSlug: ['NOTE', `Slugs over ${LONG_SLUG} characters`, 'Trim them to the words that carry the meaning.'],
  filler: ['NOTE', 'Slugs starting with a filler word', 'Drop "the", "a" or "an".'],
  mixedForm: ['NOTE', 'Mixed scheme or host', 'One canonical form means one scheme and one host. Redirect the others.'],
  skipped: ['NOTE', 'Lines that are not URLs', 'Skipped. Expected a full URL or a path starting with /.'],
};

class InputError extends Error {}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quoteLine = 0;
  let line = 1;
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
      rows.push(row);
      row = [];
      field = '';
      line += 1;
    } else field += char;
  }
  if (inQuotes) throw new InputError(`Unclosed quote in the CSV, starting on line ${quoteLine}.`);
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
}

function linesFrom(text, fileName) {
  if (/\.csv$/i.test(fileName)) {
    const rows = parseCsv(text);
    if (!rows.length) return [];
    const header = rows[0].map((cell) => cell.trim().toLowerCase());
    const named = header.findIndex((cell) => ['url', 'address', 'loc', 'link', 'page'].includes(cell));
    if (named >= 0) return rows.slice(1).map((cells) => (cells[named] ?? '').trim()).filter(Boolean);
    const firstIsUrl = /^(\/|https?:)/i.test(rows[0][0].trim());
    return (firstIsUrl ? rows : rows.slice(1)).map((cells) => cells[0].trim()).filter(Boolean);
  }
  return text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^#(\s|$)/.test(line));
}

function parseUrl(line) {
  let text = line;
  if (!text.startsWith('/') && /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#]|$)/i.test(text) && !PAGE_EXT.test(text)) text = `//${text}`;
  const match = text.match(/^(?:(https?):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/i);
  if (!match) return null;
  const [, scheme, host, rawPath, query, fragment] = match;
  if (rawPath && !rawPath.startsWith('/')) return null;
  if (!host && !rawPath && query === undefined && fragment === undefined) return null;
  return {
    raw: line,
    scheme: scheme?.toLowerCase() ?? null,
    host: host?.toLowerCase() ?? null,
    path: rawPath || '/',
    query: query ?? null,
    fragment: fragment ?? null,
  };
}

function safeDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

function normalKey(url, multipleHosts) {
  let path = safeDecode(url.path).toLowerCase().replace(/_/g, '-').replace(/\/{2,}/g, '/');
  path = path.replace(/\/(index|default)(\.[a-z0-9]+)?$/, '/').replace(PAGE_EXT, '').replace(/\/+$/, '') || '/';
  const query = (url.query ?? '')
    .split('&')
    .filter((pair) => pair && !TRACKING.test(pair.split('=')[0]))
    .sort()
    .join('&');
  const host = multipleHosts && url.host ? url.host.replace(/^www\./, '') : '';
  return `${host}${path}${query ? `?${query}` : ''}`;
}

function analyse(lines, options = {}) {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const findings = Object.fromEntries(Object.keys(CHECKS).map((key) => [key, []]));
  const urls = [];
  for (const line of lines) {
    const url = parseUrl(line);
    if (url) urls.push(url);
    else findings.skipped.push(line);
  }

  const withSlash = [];
  const withoutSlash = [];
  for (const url of urls) {
    const path = url.path.replace(PLACEHOLDER, 'x');
    const plain = path.replace(/%[0-9a-f]{2}/gi, '');
    const segments = path.split('/').filter(Boolean);
    const last = segments[segments.length - 1] ?? '';
    const special = ROOT_FILES.test(path);
    const isFile = !special && !PAGE_EXT.test(last) && FILE_EXT.test(last);

    if (/\s|%20/i.test(path)) findings.space.push(url.raw);
    if (/[A-Z]/.test(plain) && !isFile) findings.uppercase.push(url.raw);
    if (plain.includes('_') && !special && !isFile) findings.underscore.push(url.raw);
    if (PAGE_EXT.test(last)) findings.extension.push(url.raw);
    if (isFile) findings.file.push(url.raw);
    if (/\/{2,}/.test(path)) findings.doubleSlash.push(url.raw);

    if (path !== '/' && !special && !FILE_EXT.test(path.replace(/\/+$/, ''))) {
      (path.endsWith('/') ? withSlash : withoutSlash).push(url.raw);
    }

    for (const pair of (url.query ?? '').split('&').filter(Boolean)) {
      const name = pair.split('=')[0];
      if (LOCALE_PARAM.test(name)) findings.locale.push(url.raw);
      else if (ID_PARAM.test(name) || /[_-]id$/i.test(name) || /[a-z]Id$/.test(name)) findings.queryId.push(url.raw);
    }

    const levels = LOCALE_SEGMENT.test(segments[0] ?? '') ? segments.slice(1) : segments;
    if (levels.length > maxDepth && !isFile) findings.depth.push(`${url.raw} (${levels.length} levels)`);

    if (url.fragment !== null) {
      if (url.path === '/' || /^[/!]/.test(url.fragment)) findings.hash.push(url.raw);
      else findings.anchor.push(url.raw);
    }

    if (segments.some((s) => /^\d{3,}$/.test(s) && !/^(19|20)\d\d$/.test(s))) findings.pathId.push(url.raw);
    if (last.length > LONG_SLUG && !isFile) findings.longSlug.push(url.raw);
    if (/^(the|a|an)-/i.test(last)) findings.filler.push(url.raw);
  }

  if (withSlash.length && withoutSlash.length) {
    const minority = withSlash.length <= withoutSlash.length ? withSlash : withoutSlash;
    findings.slash.push(...minority);
  }

  const hosts = new Set(urls.filter((u) => u.host).map((u) => u.host.replace(/^www\./, '')));
  const multipleHosts = hosts.size > 1;
  const groups = new Map();
  for (const url of urls) {
    const key = normalKey(url, multipleHosts);
    groups.set(key, [...(groups.get(key) ?? []), url.raw]);
  }
  for (const group of groups.values()) {
    if (group.length > 1) findings.duplicate.push(group.join('  =  '));
  }

  const schemes = new Set(urls.filter((u) => u.scheme).map((u) => u.scheme));
  if (schemes.size > 1) findings.mixedForm.push(`Both ${[...schemes].join(' and ')} appear.`);
  const hostForms = new Set(urls.filter((u) => u.host).map((u) => u.host));
  for (const host of hostForms) {
    if (!host.startsWith('www.') && hostForms.has(`www.${host}`)) {
      findings.mixedForm.push(`Both ${host} and www.${host} appear.`);
    }
  }

  return {
    findings,
    total: urls.length,
    slashCounts: { withSlash: withSlash.length, withoutSlash: withoutSlash.length },
    hosts: [...hostForms],
  };
}

function printReport(result, fileName, showAll) {
  const { findings, total, slashCounts } = result;
  console.log(`URLs: ${fileName}`);
  console.log(`${total} URLs read. Trailing slash: ${slashCounts.withSlash} with, ${slashCounts.withoutSlash} without.`);

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
  const flags = (line, key) => analyse([line]).findings[key].length > 0;
  const throwsInput = (fn) => {
    try {
      fn();
      return false;
    } catch (error) {
      return error instanceof InputError;
    }
  };

  const clean = [
    '/',
    '/about',
    '/about/team',
    '/guides/getting-started',
    '/products/blue-widget',
    '/products?sort=price&page=2',
    '/de/produkte/blaues-widget',
    '/robots.txt',
    '/sitemap.xml',
  ];
  const cleanResult = analyse(clean);
  check('a clean list has no warnings', Object.keys(CHECKS).every((k) => CHECKS[k][0] !== 'WARN' || !cleanResult.findings[k].length));

  check('uppercase is flagged', flags('/About/team', 'uppercase'));
  check('an uppercase percent-escape is not uppercase', !flags('/caf%C3%A9', 'uppercase'));
  check('an uppercase host is not uppercase', !flags('https://EXAMPLE.com/about', 'uppercase'));
  check('underscores are flagged', flags('/about_us', 'underscore'));
  check('.php is flagged', flags('/services/change-management.php', 'extension'));
  check('.html is flagged', flags('/about-us.html', 'extension'));
  check('a PDF is a file note, not an extension warning', flags('/files/report.pdf', 'file') && !flags('/files/report.pdf', 'extension'));
  check('a file is not held to page rules', !flags('/wp-content/uploads/2022/03/Big_Report.pdf', 'uppercase') && !flags('/wp-content/uploads/2022/03/Big_Report.pdf', 'underscore') && !flags('/wp-content/uploads/2022/03/Big_Report.pdf', 'depth'));
  check('?p= is flagged as an id', flags('https://example.com/?p=112', 'queryId'));
  check('?page_id= is flagged as an id', flags('/?page_id=7', 'queryId'));
  check('?productId= is flagged as an id', flags('/shop?productId=9', 'queryId'));
  check('?page= is not an id', !flags('/blog?page=2', 'queryId'));
  check('?valid=1 is not an id', !flags('/blog?valid=1', 'queryId'));
  check('?lang= is flagged as a locale', flags('/about?lang=de', 'locale'));
  check('/#features is hash navigation', flags('/#features', 'hash'));
  check('#!/route is hash navigation', flags('/app#!/settings', 'hash'));
  check('an in-page anchor is a note', flags('/docs/setup#install', 'anchor') && !flags('/docs/setup#install', 'hash'));
  check('a bare #route line is hash navigation', flags('#/settings', 'hash'));
  check('five levels is overly deep', flags('/a/b/c/d/e', 'depth'));
  check('four levels is fine', !flags('/a/b/c/d', 'depth'));
  check('a locale prefix is not a level', !flags('/de/a/b/c/d', 'depth'));
  check('--max-depth lifts the limit', analyse(['/a/b/c/d/e'], { maxDepth: 5 }).findings.depth.length === 0);
  check('spaces are flagged', flags('/about us', 'space'));
  check('doubled slashes are flagged', flags('/about//team', 'doubleSlash'));
  check('placeholders in patterns are ignored', !flags('/guides/<Slug>', 'uppercase') && !flags('/guides/{slug_name}', 'underscore'));

  const slash = analyse(['/a/', '/b/', '/c']);
  check('mixed trailing slashes flag the minority form', slash.findings.slash.length === 1 && slash.findings.slash[0] === '/c');
  check('consistent trailing slashes are fine', analyse(['/a/', '/b/']).findings.slash.length === 0);
  check('the homepage and files do not count as slash forms', analyse(['/', '/a', '/f.pdf']).findings.slash.length === 0);

  const dupes = analyse([
    'https://www.example.com/About_Us/',
    'http://example.com/about-us',
    '/about-us.html',
    '/about-us?utm_source=mail',
    '/about-us/index.php',
  ]);
  check('forms of one page collapse into one duplicate group', dupes.findings.duplicate.length === 1 && dupes.findings.duplicate[0].split('  =  ').length === 5);
  check('a query string that is not tracking stays distinct', analyse(['/a', '/a?id=3']).findings.duplicate.length === 0);
  check('an exact repeat is a duplicate', analyse(['/a', '/a']).findings.duplicate.length === 1);
  check('mixed http and https is noted', analyse(['http://a.com/x', 'https://a.com/y']).findings.mixedForm.length === 1);
  check('www and bare host are noted', analyse(['https://www.a.com/x', 'https://a.com/y']).findings.mixedForm.length === 1);

  check('a line that is not a URL is skipped and reported', analyse(['mailto:a@b.co', '/a']).findings.skipped.length === 1);
  const quoted = linesFrom('Address,Status\n"https://example.com/a,b",200\n"/c ""d""",404\n', 'crawl.csv');
  check('quoted CSV cells are read whole', quoted[0] === 'https://example.com/a,b' && quoted[1] === '/c "d"');
  check('a CSV with no url column uses its first column', linesFrom('/a,200\n/b,404\n', 'x.csv').length === 2);
  check('an unclosed CSV quote is a clear input error', throwsInput(() => linesFrom('url\n"/a\n', 'x.csv')));
  check('comment lines are ignored', linesFrom('# list\n/a\n\n', 'x.txt').length === 1);

  console.log(`\nself-test: ${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--self-test') options.selfTest = true;
    else if (arg === '--all') options.all = true;
    else if (arg === '--max-depth') {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value < 1) throw new InputError('--max-depth needs a whole number.');
      options.maxDepth = value;
      i += 1;
    } else if (arg.startsWith('--')) throw new InputError(`Unknown option ${arg}.`);
    else positional.push(arg);
  }
  return { options, positional };
}

function main() {
  const { options, positional } = parseArgs(process.argv.slice(2));
  if (options.selfTest) return selfTest();
  if (positional.length !== 1) throw new InputError('Usage: node url-check.mjs <urls.txt|urls.csv> [--max-depth N] [--all]');
  let text;
  try {
    text = readFileSync(positional[0], 'utf8');
  } catch (error) {
    throw new InputError(`Could not read ${positional[0]}: ${error.code === 'ENOENT' ? 'no such file' : error.code === 'EISDIR' ? 'that is a folder, not a file' : error.message}`);
  }
  const lines = linesFrom(text, positional[0]);
  const result = analyse(lines, options);
  if (!result.total) {
    throw new InputError(`No URLs found in ${positional[0]}. Expected one full URL or path starting with / per line.`);
  }
  return printReport(result, positional[0], options.all) ? 1 : 0;
}

try {
  process.exitCode = main();
} catch (error) {
  if (error instanceof InputError) console.error(`url-check: ${error.message}`);
  else console.error(`url-check: could not check this file: ${error.message}`);
  process.exitCode = 2;
}
