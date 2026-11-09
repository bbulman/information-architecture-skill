#!/usr/bin/env node
// Checks a site tree: depth and breadth per branch, repeated labels, missing
// template types, Other or Misc nodes, and item counts per section.
//
//   node tree-check.mjs <tree.txt|tree.json> [--items N] [--max-depth N] [--max-breadth N]
//   node tree-check.mjs --self-test
//
// Exit codes: 0 no warnings, 1 warnings, 2 bad input.

import { readFileSync } from 'node:fs';

const DEFAULT_MAX_DEPTH = 4;
const DEFAULT_MAX_BREADTH = 9;
const SHARE_LIMIT = 0.4;
// With only two real sections one of them must pass 40%, so a higher line applies.
const SHARE_LIMIT_TWO_SECTIONS = 0.75;
const UMBRELLA_SHARE = 0.8;
const UMBRELLA_MIN_NODES = 10;
const SIZE_BANDS = [
  { below: 50, levels: 2, facets: false, text: 'under 50 items: flat, 1 to 2 levels' },
  { below: 500, levels: 3, facets: false, text: '50 to 500 items: 2 to 3 levels' },
  { below: 5000, levels: 4, facets: true, text: '500 to 5,000 items: 3 to 4 levels plus facets' },
  { below: Infinity, levels: 4, facets: true, text: 'over 5,000 items: browse, search and facets together' },
];

const PATTERN = /<[^>]+>|\{[^}]+\}|\[[^\]]+\]|(^|\/):[a-z_]+|\*/i;
const JUNK = /^(other|others|misc|miscellaneous|uncategori[sz]ed|unsorted)( |$)/;
const PLACEHOLDER = /coming soon|under construction|placeholder|\btbd\b/i;
const STATUS_WORD = /^(new|moved|retired)$/i;
const ITEM_COUNT = /\bitems?\s*[:=]\s*(\d[\d,]*)|\b(\d[\d,]*)\s+items?\b/i;

class InputError extends Error {}

function makeNode(label, line) {
  return { label, template: null, items: null, facets: null, notes: [], children: [], line };
}

function readMeta(node, rest) {
  let text = rest.replace(/\(([^)]*)\)/g, (_, inner) => {
    node.notes.push(inner.trim());
    return '  ';
  });
  const facet = text.match(/\bfacets?\s*:\s*(.+?)(?=\s{2,}|$)/i);
  if (facet) {
    node.facets = facet[1].trim();
    text = text.replace(facet[0], '  ');
  }
  for (const source of [text, ...node.notes]) {
    const count = source.match(ITEM_COUNT);
    if (count) {
      node.items = Number((count[1] ?? count[2]).replace(/,/g, ''));
      if (source === text) text = text.replace(count[0], '  ');
      break;
    }
  }
  for (const token of text.split(/\s{2,}|\s+\|\s+/).map((t) => t.trim()).filter(Boolean)) {
    const bracket = token.match(/^\[(.+)\]$/);
    if (STATUS_WORD.test(token)) node.notes.push(token);
    else if (node.template === null) node.template = bracket ? bracket[1] : token;
    else node.notes.push(token);
  }
}

function parseLine(content, lineNumber) {
  const trimmed = content.trim();
  let label;
  let rest;
  if (/^(\/|https?:)/.test(trimmed)) {
    const space = trimmed.search(/\s/);
    label = space < 0 ? trimmed : trimmed.slice(0, space);
    rest = space < 0 ? '' : trimmed.slice(space).trim();
  } else {
    const parts = trimmed.split(/\s{2,}|\s+\|\s+/);
    label = parts[0];
    rest = parts.slice(1).join('  ');
    const inlineTemplate = label.match(/\s\[([^\]]+)\]/);
    if (inlineTemplate) {
      label = label.replace(inlineTemplate[0], '');
      rest = `${inlineTemplate[1]}  ${rest}`;
    }
    const inlineNotes = label.match(/\s\([^)]*\)/g);
    if (inlineNotes) {
      for (const note of inlineNotes) label = label.replace(note, '');
      rest = `${rest}  ${inlineNotes.join('  ')}`;
    }
  }
  const node = makeNode(label.trim(), lineNumber);
  readMeta(node, rest);
  return node;
}

function parseText(text) {
  const roots = [];
  const stack = [];
  const misaligned = [];
  text.replace(/^﻿/, '').split(/\r?\n/).forEach((raw, index) => {
    const line = raw.replace(/\t/g, '    ');
    if (!line.trim() || /^\s*(#|```)/.test(line)) return;
    const prefix = line.match(/^[\s│├└─┬┼┤┌┐┘|+`\\]*(?:-+\s+|[*•]\s+|\d+[.)]\s+)?/)[0];
    const content = line.slice(prefix.length);
    if (!content.trim()) return;
    const indent = prefix.length;
    const node = parseLine(content, index + 1);
    let popped = null;
    while (stack.length && stack[stack.length - 1].indent >= indent) popped = stack.pop();
    if (popped && popped.indent !== indent) misaligned.push(index + 1);
    if (stack.length) stack[stack.length - 1].node.children.push(node);
    else roots.push(node);
    stack.push({ indent, node });
  });
  if (!roots.length) {
    throw new InputError('The tree is empty. Expected one node per line, indented under its parent.');
  }
  return { roots, misaligned };
}

function parseJson(text) {
  let data;
  try {
    data = JSON.parse(text.replace(/^﻿/, ''));
  } catch (error) {
    throw new InputError(`The file is not valid JSON: ${error.message}`);
  }
  const convert = (raw, where) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      throw new InputError(`${where} is not a node. Each node must be an object.`);
    }
    const label = raw.label ?? raw.name ?? raw.title ?? raw.path ?? raw.url;
    if (typeof label !== 'string' || !label.trim()) {
      throw new InputError(`${where} has no label. Give each node a "label", "name", "title", "path" or "url".`);
    }
    const node = makeNode(label.trim(), null);
    node.template = raw.template ?? raw.type ?? null;
    const items = raw.items ?? raw.count ?? null;
    if (items !== null) {
      node.items = Number(items);
      if (!Number.isFinite(node.items) || node.items < 0) {
        throw new InputError(`"${node.label}" has an item count that is not a number: ${items}`);
      }
    }
    node.facets = Array.isArray(raw.facets) ? raw.facets.join(', ') : raw.facets ?? null;
    const notes = raw.notes ?? raw.status ?? [];
    node.notes = Array.isArray(notes) ? notes.map(String) : [String(notes)];
    const kids = raw.children ?? raw.pages ?? raw.nodes ?? [];
    if (!Array.isArray(kids)) throw new InputError(`"${node.label}" has "children" that is not a list.`);
    node.children = kids.map((kid, i) => convert(kid, `Child ${i + 1} of "${node.label}"`));
    return node;
  };
  const list = Array.isArray(data) ? data : [data];
  if (!list.length) throw new InputError('The JSON holds no nodes.');
  return { roots: list.map((raw, i) => convert(raw, `Node ${i + 1}`)), misaligned: [] };
}

function parseTree(text, fileName = '') {
  if (!text.trim()) throw new InputError('The file is empty. Expected an indented text tree or JSON.');
  const looksJson = /\.json$/i.test(fileName) || /^\s*[[{]/.test(text.replace(/^﻿/, ''));
  return looksJson ? parseJson(text) : parseText(text);
}

const isRetired = (node) => node.notes.some((note) => /\bretired\b/i.test(note));
const isPattern = (node) => PATTERN.test(node.label);

function prune(nodes) {
  return nodes.filter((node) => !isRetired(node)).map((node) => ({ ...node, children: prune(node.children) }));
}

function nameKey(node) {
  if (isPattern(node)) return '';
  const label = /^(\/|https?:)/.test(node.label)
    ? node.label.replace(/[?#].*$/, '').split('/').filter(Boolean).pop() ?? ''
    : node.label;
  return label.toLowerCase().replace(/[-_]+/g, ' ').replace(/[^\p{L}\p{N} ]/gu, '').trim();
}

const nodeTotal = (node) => {
  if (node.items !== null) return node.items;
  if (node.children.length) {
    const totals = node.children.map(nodeTotal).filter((n) => n !== null);
    return totals.length ? totals.reduce((a, b) => a + b, 0) : null;
  }
  return isPattern(node) ? null : 1;
};

const countNodes = (node) => 1 + node.children.reduce((sum, kid) => sum + countNodes(kid), 0);

function analyse(parsed, options = {}) {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const maxBreadth = options.maxBreadth ?? DEFAULT_MAX_BREADTH;
  const findings = [];
  const add = (severity, check, text) => findings.push({ severity, check, text });

  const roots = prune(parsed.roots);
  if (!roots.length) throw new InputError('Every node is marked retired, so there is no tree left to check.');
  const home = roots.length === 1 ? roots[0] : null;
  const top = home ? home.children : roots;

  const all = [];
  const walk = (node, depth, trail, branch) => {
    const here = /^(\/|https?:)/.test(node.label) ? node.label : [...trail, node.label].join(' > ');
    const entry = { node, depth, here, branch };
    all.push(entry);
    node.children.forEach((kid) => walk(kid, depth + 1, [...trail, node.label], branch ?? entry));
  };
  if (home) {
    all.push({ node: home, depth: 0, here: home.label, branch: null });
    home.children.forEach((kid) => walk(kid, 1, [home.label], null));
  } else {
    roots.forEach((root) => walk(root, 1, [], null));
  }

  for (const line of parsed.misaligned) {
    add('NOTE', 'indent', `Line ${line} does not line up with any earlier level. Check it sits under the parent you meant.`);
  }

  const branches = top.map((node) => {
    const entries = all.filter((e) => e.node === node || e.branch?.node === node);
    const deepest = entries.reduce((a, b) => (b.depth > a.depth ? b : a));
    const widest = entries.reduce((a, b) => (b.node.children.length > a.node.children.length ? b : a));
    return { node, label: node.label, deepest, widest, nodes: entries.length, items: nodeTotal(node) };
  });

  for (const branch of branches) {
    if (branch.deepest.depth > maxDepth) {
      add('WARN', 'depth', `${branch.deepest.here} is ${branch.deepest.depth} levels below the top; the default limit is ${maxDepth}. Flatten it, or justify it by the scent of each step.`);
    }
  }
  for (const { node, here } of all) {
    if (node.children.length > maxBreadth) {
      add('WARN', 'breadth', `${here} has ${node.children.length} children; the default limit is ${maxBreadth}. Merge them, group them, or turn them into facets.`);
    }
    if (node.children.length === 1 && !isPattern(node.children[0])) {
      add('NOTE', 'only-child', `${here} has one child. A level with one option is a click with no choice.`);
    }
  }

  const byName = new Map();
  for (const entry of all) {
    const key = nameKey(entry.node);
    if (!key) continue;
    byName.set(key, [...(byName.get(key) ?? []), entry.here]);
  }
  for (const [key, places] of byName) {
    if (places.length > 1) {
      add('WARN', 'repeated-label', `"${key}" appears ${places.length} times: ${places.join('; ')}. Either one item has two homes, or two things need different names.`);
    }
  }

  const templated = all.filter((e) => e.node.template);
  if (templated.length) {
    for (const entry of all.filter((e) => !e.node.template)) {
      add('WARN', 'no-template', `${entry.here} has no template type.`);
    }
  } else {
    add('NOTE', 'no-template', 'No template types were given. Every node needs one before this tree is handed over.');
  }

  for (const entry of all) {
    if (JUNK.test(nameKey(entry.node))) {
      add('WARN', 'junk-node', `${entry.here} is a catch-all. Find the items real homes, or give it a name a newcomer could predict.`);
    }
    if (PLACEHOLDER.test([entry.node.label, ...entry.node.notes].join(' '))) {
      add('WARN', 'placeholder', `${entry.here} is a placeholder. Build it or leave it out.`);
    }
  }

  const belowTop = all.filter((e) => e.depth > 0).length;
  if (belowTop >= UMBRELLA_MIN_NODES) {
    for (const branch of branches) {
      if (branch.nodes / belowTop >= UMBRELLA_SHARE) {
        add('WARN', 'umbrella', `${branch.label} holds ${branch.nodes} of ${belowTop} nodes. Unless it is one deliberately dense area such as docs, this is a junk drawer with a URL.`);
      }
    }
  }

  const hasCounts = all.some((e) => e.node.items !== null);
  const hasPatterns = all.some((e) => isPattern(e.node));
  let total = null;
  let totalSource = '';
  if (options.items !== undefined) {
    total = options.items;
    totalSource = 'from --items';
  } else if (hasCounts) {
    total = home && home.items !== null ? home.items : branches.reduce((sum, b) => sum + (b.items ?? 0), 0);
    totalSource = 'from counts in the tree';
  } else if (!hasPatterns) {
    total = all.length;
    totalSource = 'counted from the nodes, since every page is listed';
  } else {
    add('NOTE', 'size', 'The tree has pattern nodes and no item counts, so depth was not checked against content size. Add "items: N" or pass --items N.');
  }

  const deepestOverall = all.reduce((a, b) => (b.depth > a.depth ? b : a));
  if (total !== null) {
    const band = SIZE_BANDS.find((b) => total < b.below);
    if (deepestOverall.depth > band.levels) {
      add('WARN', 'size', `${total} items fits "${band.text}", but ${deepestOverall.here} is ${deepestOverall.depth} levels deep.`);
    }
    if (band.facets && !all.some((e) => e.node.facets)) {
      add('WARN', 'size', `${total} items fits "${band.text}", but no node names any facets.`);
    }
  }

  if (hasCounts) {
    const known = branches.filter((b) => b.items !== null);
    const sum = known.reduce((a, b) => a + b.items, 0);
    const limit = known.filter((b) => b.items > 1).length >= 3 ? SHARE_LIMIT : SHARE_LIMIT_TWO_SECTIONS;
    for (const branch of known) {
      branch.share = sum ? branch.items / sum : 0;
      if (known.length >= 2 && sum >= 10 && branch.share > limit) {
        add('WARN', 'balance', `${branch.label} holds ${Math.round(branch.share * 100)}% of the items, over the ${limit * 100}% line. It probably needs splitting or facets.`);
      }
      if (branch.node.items === 0) add('WARN', 'balance', `${branch.label} is empty. Fill it or leave it out.`);
      if (branch.node.items === 1) add('NOTE', 'balance', `${branch.label} holds one item. It may belong inside a neighbour.`);
    }
  }

  const widestOverall = all.reduce((a, b) => (b.node.children.length > a.node.children.length ? b : a));
  return {
    findings,
    branches,
    hasCounts,
    stats: {
      nodes: all.length,
      sections: top.length,
      depth: deepestOverall.depth,
      breadth: widestOverall.node.children.length,
      total,
      totalSource,
    },
  };
}

function printReport(result, fileName) {
  const { stats, branches, findings, hasCounts } = result;
  console.log(`Tree: ${fileName}`);
  console.log(`${stats.nodes} nodes, ${stats.sections} top-level sections, deepest ${stats.depth} levels below the top, widest ${stats.breadth} children.`);
  if (stats.total !== null) console.log(`Items: ${stats.total} (${stats.totalSource}).`);
  console.log('');

  const headers = ['Branch', 'Deepest', 'Widest', 'Nodes', ...(hasCounts ? ['Items', 'Share'] : [])];
  const rows = branches.map((b) => [
    b.label,
    String(b.deepest.depth),
    String(b.widest.node.children.length),
    String(b.nodes),
    ...(hasCounts ? [b.items === null ? '-' : String(b.items), b.share === undefined ? '-' : `${Math.round(b.share * 100)}%`] : []),
  ]);
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const format = (cells) => cells.map((c, i) => (i === 0 ? c.padEnd(widths[i]) : c.padStart(widths[i]))).join('  ').trimEnd();
  console.log(format(headers));
  rows.forEach((row) => console.log(format(row)));

  const warnings = findings.filter((f) => f.severity === 'WARN');
  const notes = findings.filter((f) => f.severity === 'NOTE');
  for (const [title, list] of [['Warnings', warnings], ['Notes', notes]]) {
    if (!list.length) continue;
    console.log(`\n${title} (${list.length})`);
    list.forEach((f) => console.log(`  [${f.check}] ${f.text}`));
  }
  console.log(`\nResult: ${warnings.length} warning${warnings.length === 1 ? '' : 's'}, ${notes.length} note${notes.length === 1 ? '' : 's'}.`);
  return warnings.length;
}

function selfTest() {
  let failed = 0;
  let passed = 0;
  const check = (name, condition) => {
    if (condition) {
      passed += 1;
      console.log(`ok    ${name}`);
    } else {
      failed += 1;
      console.log(`FAIL  ${name}`);
    }
  };
  const run = (text, options, fileName) => analyse(parseTree(text, fileName), options);
  const has = (result, name, severity = 'WARN') => result.findings.some((f) => f.check === name && f.severity === severity);
  const throwsInput = (fn) => {
    try {
      fn();
      return false;
    } catch (error) {
      return error instanceof InputError;
    }
  };

  const clean = [
    '/                        home',
    '├── /guides              section-hub   items: 40',
    '│   └── /guides/<slug>   guide',
    '├── /products            listing       items: 45  facets: use, size',
    '│   └── /products/<slug> product',
    '├── /pricing             marketing     items: 1',
    '└── /about               marketing     (moved from /company)',
  ].join('\n');
  const cleanResult = run(clean, { items: 300 });
  check('clean box tree has no warnings', cleanResult.findings.every((f) => f.severity !== 'WARN'));
  check('box tree: four sections under one home', cleanResult.stats.sections === 4 && cleanResult.stats.depth === 2);

  const parsed = parseTree(clean);
  const about = parsed.roots[0].children[3];
  check('template, status note and item count are read', about.template === 'marketing' && about.notes[0] === 'moved from /company' && parsed.roots[0].children[0].items === 40);

  const plain = 'Home  home\n  Guides  section-hub\n    Setup  guide\n  About us  marketing\n';
  const plainResult = run(plain);
  check('plain indentation with spaced labels parses', plainResult.stats.nodes === 4 && plainResult.branches[1].label === 'About us');

  const deep = 'Home  home\n A  hub\n  B  hub\n   C  hub\n    D  hub\n     E  page\n';
  check('a tree five levels deep is flagged', has(run(deep), 'depth'));
  check('--max-depth lifts the limit', !has(run(deep, { maxDepth: 5 }), 'depth'));

  const wide = `Home  home\n${Array.from({ length: 10 }, (_, i) => `  Section ${i}  hub`).join('\n')}\n`;
  check('ten children under one node is flagged', has(run(wide), 'breadth'));
  check('--max-breadth lifts the limit', !has(run(wide, { maxBreadth: 10 }), 'breadth'));

  const repeated = '/  home\n  /services  hub\n    /services/strategy  page\n  /industries  hub\n    /industries/strategy  page\n';
  check('a label under two parents is flagged', has(run(repeated), 'repeated-label'));
  const samePath = '/  home\n  /a  page\n  /b  hub\n    /a  page\n';
  check('the same path listed twice is flagged', has(run(samePath), 'repeated-label'));
  const patterns = '/  home\n  /a  hub\n    /a/<slug>  page\n  /b  hub\n    /b/<slug>  page\n';
  check('pattern nodes are not repeated labels', !has(run(patterns), 'repeated-label'));

  const missing = 'Home  home\n  Guides\n  About  marketing\n';
  check('a node with no template is flagged when others have one', has(run(missing), 'no-template'));
  const none = 'Home\n  Guides\n  About\n';
  check('no templates at all is a note, not a warning', has(run(none), 'no-template', 'NOTE') && !has(run(none), 'no-template'));

  for (const label of ['Other', 'Misc.', 'Other resources', 'miscellaneous', 'Uncategorised']) {
    check(`"${label}" is flagged as a catch-all`, has(run(`Home  home\n  ${label}  hub\n  Guides  hub\n`), 'junk-node'));
  }
  check('/misc as a path is flagged', has(run('/  home\n  /misc  hub\n'), 'junk-node'));
  check('"Othello" is not a catch-all', !has(run('Home  home\n  Othello  hub\n'), 'junk-node'));
  check('coming soon is flagged', has(run('Home  home\n  Events  hub  (coming soon)\n'), 'placeholder'));

  const heavy = 'Home  home\n  Blog  hub  items: 90\n  Docs  hub  items: 10\n';
  check('a dominant section is flagged', has(run(heavy), 'balance'));
  check('a section over 40% of items is flagged among three real sections', has(run('Home  home\n  A  hub  items: 50\n  B  hub  items: 30\n  C  hub  items: 20\n'), 'balance'));
  check('two even sections are not flagged', !has(run('Home  home\n  A  hub  items: 50\n  B  hub  items: 50\n'), 'balance'));
  const shares = run(heavy).branches.map((b) => Math.round(b.share * 100));
  check('section shares are computed', shares[0] === 90 && shares[1] === 10);
  check('an empty section is flagged', has(run('Home  home\n  Blog  hub  items: 0\n  Docs  hub  items: 4\n'), 'balance'));

  const tooDeep = 'Home  home\n  A  hub  items: 30\n    B  hub\n      C  page\n';
  check('depth beyond the content-size band is flagged', has(run(tooDeep), 'size'));
  check('500 or more items with no facets is flagged', has(run('Home  home\n  A  listing  items: 600\n'), 'size'));
  check('500 or more items with facets is not flagged', !has(run('Home  home\n  A  listing  items: 600  facets: topic\n'), 'size'));
  check('unknown size with patterns is a note', has(run(patterns), 'size', 'NOTE'));

  const umbrella = `/  home\n  /services  hub\n${Array.from({ length: 12 }, (_, i) => `    /services/s${i}  page`).join('\n')}\n`;
  check('everything under one umbrella is flagged', has(run(umbrella), 'umbrella'));

  const retired = 'Home  home\n  Other  hub  (retired)\n  Guides  hub\n';
  check('retired nodes are left out of the checks', !has(run(retired), 'junk-node'));

  const json = JSON.stringify({
    label: 'Home',
    template: 'home',
    children: [
      { name: 'Misc', type: 'hub', count: 3 },
      { path: '/guides', template: 'hub', children: [{ title: 'Setup' }] },
    ],
  });
  const jsonResult = run(json, {}, 'tree.json');
  check('JSON is read with its label and count aliases', jsonResult.stats.nodes === 4 && jsonResult.branches[0].items === 3);
  check('JSON gets the same checks', has(jsonResult, 'junk-node') && has(jsonResult, 'no-template'));

  check('malformed JSON is a clear input error', throwsInput(() => run('{"label":', {}, 'tree.json')));
  check('a JSON node with no label is a clear input error', throwsInput(() => run('{"children":[]}', {}, 'tree.json')));
  check('an empty file is a clear input error', throwsInput(() => run('   \n')));
  check('a comment-only file is a clear input error', throwsInput(() => run('# nothing here\n')));
  check('misaligned indentation is noted', has(run('Home  home\n    A  hub\n  B  hub\n'), 'indent', 'NOTE'));

  console.log(`\nself-test: ${passed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

function parseArgs(argv) {
  const options = {};
  const positional = [];
  const numeric = { '--items': 'items', '--max-depth': 'maxDepth', '--max-breadth': 'maxBreadth' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--self-test') options.selfTest = true;
    else if (arg in numeric) {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value < 0) throw new InputError(`${arg} needs a whole number.`);
      options[numeric[arg]] = value;
      i += 1;
    } else if (arg.startsWith('--')) throw new InputError(`Unknown option ${arg}.`);
    else positional.push(arg);
  }
  return { options, positional };
}

function main() {
  const { options, positional } = parseArgs(process.argv.slice(2));
  if (options.selfTest) return selfTest();
  if (positional.length !== 1) {
    throw new InputError('Usage: node tree-check.mjs <tree.txt|tree.json> [--items N] [--max-depth N] [--max-breadth N]');
  }
  let text;
  try {
    text = readFileSync(positional[0], 'utf8');
  } catch (error) {
    throw new InputError(`Could not read ${positional[0]}: ${error.code === 'ENOENT' ? 'no such file' : error.code === 'EISDIR' ? 'that is a folder, not a file' : error.message}`);
  }
  const warnings = printReport(analyse(parseTree(text, positional[0]), options), positional[0]);
  return warnings ? 1 : 0;
}

try {
  process.exitCode = main();
} catch (error) {
  if (error instanceof InputError) console.error(`tree-check: ${error.message}`);
  else console.error(`tree-check: could not check this file: ${error.message}`);
  process.exitCode = 2;
}
