#!/usr/bin/env node
// Analyses tree test results: success with a 95% adjusted Wald interval, directness, path ratio,
// first clicks and wrong destinations per task, flagged against the targets.
// Can also check task wording before a study. Run with --self-test to prove it on built-in data.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

class InputError extends Error {}

const USAGE = `Usage:
  node analyze-tree-test.mjs <results.csv> --answers answers.csv --tree tree.txt
       [--top-tasks 1,3] [--target 70] [--top-target 80] [--root Home|none] [--json]
  node analyze-tree-test.mjs --check-tasks tasks.csv [--json]
  node analyze-tree-test.mjs --self-test

results.csv: participant, task, path (nodes in click order, separated by " > "), optional seconds.
answers.csv: task, correct_node. One row per acceptable answer. A correct_node may be a bare end
             node ("Payment methods") or a full path ("Account > Payment methods").
tree.txt:    the tree as tested, one node per line, indented under its parent. The shape tree-check.mjs
             reads. Without it, sideways moves and duplicate labels cannot be resolved.
tasks.csv:   task, text, correct_node. One row per acceptable answer.`;

const SUCCESS_TARGET = 70;
const TOP_TASK_TARGET = 80;
const PATH_RATIO_TARGET = 1.5;
const SIMPLE_ITEM_SECONDS = 30;
const MIN_PARTICIPANTS = 20;
const MAX_INTERVAL_WIDTH = 40;
const MIN_TASKS = 8;
const MAX_TASKS = 12;
const NO_ANSWER = '(no answer)';

const STOPWORDS = new Set(('a about after all an and any are as at be been before by can could do does for from get go has have how i if in into is it '
  + 'its just like look looking make me more most my need needs new next no not of on one or our out over own please see should so some someone '
  + 'something than that the their them then there these they this to up us use using want wanted wants was way we were what when where which '
  + 'who why will with would you your find').split(' '));

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

function readTable(text, label, required) {
  const rows = parseCsv(text);
  if (!rows.length) throw new InputError(`${label} is empty.`);
  const header = rows[0].cells.map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'));
  const missing = required.filter((c) => !header.includes(c));
  if (missing.length) throw new InputError(`${label} is missing the column(s): ${missing.join(', ')}. Found: ${header.join(', ')}.`);
  const records = rows.slice(1).map((r) => {
    const extra = r.cells.slice(header.length).filter((c) => c.trim() !== '');
    if (extra.length) {
      throw new InputError(`${label} line ${r.line} has ${r.cells.length} fields but the header has ${header.length}. Wrap any value containing a comma in double quotes.`);
    }
    const record = { _line: r.line };
    header.forEach((h, i) => { record[h] = (r.cells[i] ?? '').trim(); });
    return record;
  });
  if (!records.length) throw new InputError(`${label} has a header but no rows.`);
  return { header, records };
}

// Helpers ------------------------------------------------------------------

const key = (s) => s.trim().replace(/\s+/g, ' ').toLowerCase();
const splitPath = (s) => s.split(/\s+>\s+/).map((x) => x.trim()).filter(Boolean);
const compareTasks = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const round1 = (x) => Math.round(x * 10) / 10;
const pct = (x) => `${Math.round(x)}%`;

function adjustedWald(x, n, z = 1.96) {
  const zz = z * z;
  const p = (x + zz / 2) / (n + zz);
  const margin = z * Math.sqrt((p * (1 - p)) / (n + zz));
  return { low: Math.max(0, p - margin) * 100, high: Math.min(1, p + margin) * 100 };
}

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
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

const contentWords = (text) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
  .split(' ').filter((w) => w.length > 1 && !STOPWORDS.has(w));

// Walking a path -----------------------------------------------------------

function walk(nodes, topLevel, root, knownEdges = new Set()) {
  const stack = [];
  let backtracks = 0;
  nodes.forEach((node, i) => {
    const k = key(node);
    if (root && k === root) {
      if (stack.length) backtracks++;
      stack.length = 0;
      return;
    }
    const at = stack.lastIndexOf(k);
    if (at !== -1) {
      backtracks++;
      stack.length = at + 1;
      return;
    }
    if (i > 0 && stack.length && topLevel.has(k) && !knownEdges.has(`${stack.at(-1)}>${k}`)) {
      backtracks++;
      stack.length = 0;
    }
    stack.push(k);
  });
  return { route: stack, backtracks, clicks: nodes.length };
}

function detectRoot(paths) {
  const nonEmpty = paths.filter((p) => p.length);
  if (nonEmpty.length < 2) return null;
  const first = key(nonEmpty[0][0]);
  if (!nonEmpty.every((p) => key(p[0]) === first)) return null;
  const second = new Set(nonEmpty.filter((p) => p.length > 1).map((p) => key(p[1])));
  return second.size >= 2 ? first : null;
}

const tailMatches = (route, parts) => parts.length <= route.length && parts.every((part, i) => route[route.length - parts.length + i] === part);

// Replaying a path against the tree ----------------------------------------

function treeKey(label) {
  const text = label.trim();
  if (!/^(\/|https?:)/i.test(text)) return key(text);
  const tail = text.replace(/^https?:\/\/[^/]*/i, '').replace(/[?#].*$/, '').split('/').filter(Boolean).pop();
  return tail ? key(tail.replace(/[-_]+/g, ' ')) : 'home';
}

function parseTree(text) {
  const top = { key: null, label: null, parent: null, children: [] };
  const stack = [{ indent: -1, node: top }];
  text.replace(/^\ufeff/, '').split(/\r?\n/).forEach((raw) => {
    const line = raw.replace(/\t/g, '    ');
    if (!line.trim() || /^\s*(#|```)/.test(line)) return;
    const prefix = line.match(/^[\s│├└─┬┼┤┌┐┘|+`\\]*(?:-+\s+|[*•]\s+|\d+[.)]\s+)?/)[0];
    const content = line.slice(prefix.length).trim();
    if (!content) return;
    const end = content.search(/^(\/|https?:)/i.test(content) ? /\s/ : /\s{2,}|\s+\|\s+/);
    const label = (end < 0 ? content : content.slice(0, end)).replace(/\s\[[^\]]*\]|\s\([^)]*\)/g, '').trim();
    while (stack.at(-1).indent >= prefix.length) stack.pop();
    const parent = stack.at(-1).node;
    const node = { key: treeKey(label), label, parent, children: [] };
    if (!/\bretired\b/i.test(content.slice(label.length))) parent.children.push(node);
    stack.push({ indent: prefix.length, node });
  });
  if (!top.children.length) throw new InputError('The tree is empty. Expected one node per line, indented under its parent.');
  const root = top.children.length === 1 ? top.children[0] : top;
  root.parent = null;
  const nodes = [];
  const byKey = new Map();
  const index = (node, depth) => {
    node.depth = depth;
    if (node !== root) {
      nodes.push(node);
      if (!byKey.has(node.key)) byKey.set(node.key, []);
      byKey.get(node.key).push(node);
    }
    node.children.forEach((child) => index(child, depth + 1));
  };
  index(root, 0);
  return { root, nodes, byKey };
}

function treePath(node) {
  const out = [];
  for (let at = node; at.parent; at = at.parent) out.unshift(at);
  return out;
}

// A repeated label resolves to the nearest one the participant could see: a child of where they
// are, then a sibling, then a sibling of each ancestor in turn.
function locate(tree, here, k, root) {
  for (let at = here; at; at = at.parent) {
    const child = at.children.find((c) => c.key === k);
    if (child) return { node: child, ambiguous: false };
  }
  if (k === root) return { node: tree.root, ambiguous: false };
  const anywhere = tree.byKey.get(k) ?? [];
  return { node: anywhere[0] ?? null, ambiguous: anywhere.length > 1 };
}

function replay(tree, clicks, root) {
  let here = tree.root;
  let backtracks = 0;
  let ambiguous = 0;
  let stranded = null;
  const unknown = [];
  for (const click of clicks) {
    const found = locate(tree, here, treeKey(click), root);
    if (found.ambiguous) ambiguous++;
    stranded = found.node ? null : click;
    if (!found.node) {
      unknown.push(click);
      backtracks++;
      continue;
    }
    if (found.node.parent !== here && !(found.node === tree.root && here === tree.root)) backtracks++;
    here = found.node;
  }
  const trail = treePath(here);
  return {
    node: here,
    route: trail.map((n) => n.key),
    backtracks,
    clicks: clicks.length,
    unknown,
    ambiguous,
    stranded,
    destination: stranded ? `${stranded} (not in the tree)` : trail.map((n) => n.label).join(' > ') || NO_ANSWER,
  };
}

// Analysis -----------------------------------------------------------------

function analyze(resultsText, answersText, opts) {
  const results = readTable(resultsText, opts.resultsLabel ?? 'results file', ['participant', 'task', 'path']);
  const answerTable = readTable(answersText, opts.answersLabel ?? 'answers file', ['task', 'correct_node']);
  const warnings = [];
  const tree = opts.treeText === undefined ? null : parseTree(opts.treeText);

  const answersRaw = new Map();
  for (const r of answerTable.records) {
    if (!r.task || !r.correct_node) continue;
    if (!answersRaw.has(r.task)) answersRaw.set(r.task, []);
    answersRaw.get(r.task).push(r.correct_node);
  }

  const attempts = new Map();
  let repeated = 0;
  let blankId = 0;
  const hasSeconds = results.header.includes('seconds');
  for (const r of results.records) {
    if (!r.participant || !r.task) { blankId++; continue; }
    if (!attempts.has(r.task)) attempts.set(r.task, new Map());
    const byPerson = attempts.get(r.task);
    if (byPerson.has(r.participant)) { repeated++; continue; }
    byPerson.set(r.participant, { nodes: splitPath(r.path), seconds: hasSeconds && r.seconds !== '' ? Number(r.seconds) : null, line: r._line });
  }
  if (!attempts.size) throw new InputError('The results file has no row with both a participant and a task.');
  if (blankId) warnings.push(`${blankId} row(s) had no participant or no task and were ignored.`);
  if (repeated) warnings.push(`${repeated} repeat attempt(s) by the same participant on the same task were ignored. Only the first counts.`);
  if (hasSeconds) {
    const bad = [...attempts.values()].flatMap((m) => [...m.values()]).find((a) => a.seconds !== null && !Number.isFinite(a.seconds));
    if (bad) throw new InputError(`The seconds value on results line ${bad.line} is not a number.`);
  }

  const unscored = [...attempts.keys()].filter((t) => !answersRaw.has(t)).sort(compareTasks);
  if (unscored.length) throw new InputError(`Task(s) ${unscored.join(', ')} have results but no correct answer in the answers file. Add them, because a task cannot be scored without one.`);
  const noResults = [...answersRaw.keys()].filter((t) => !attempts.has(t)).sort(compareTasks);
  if (noResults.length) warnings.push(`Task(s) ${noResults.join(', ')} are in the answers file but have no results.`);
  for (const t of opts.topTasks) {
    if (!attempts.has(t)) throw new InputError(`--top-tasks names task "${t}", which is not in the results.`);
  }

  const allPaths = [...attempts.values()].flatMap((m) => [...m.values()].map((a) => a.nodes));
  if (!allPaths.some((p) => p.length > 1)) warnings.push('No path has more than one node. Check that nodes are separated by " > " with a space each side.');

  let root = null;
  let rootNote = null;
  const detected = opts.root ? null : detectRoot(allPaths);
  if (opts.root && key(opts.root) !== 'none') root = key(opts.root);
  else if (detected && !(tree && (tree.root.key === detected || tree.byKey.has(detected)))) {
    root = detected;
    rootNote = `Every path starts at "${allPaths.find((p) => p.length)[0]}", so it was treated as the root and is not counted as a click. Pass --root none if that is wrong.`;
  } else if (tree?.root.key) root = tree.root.key;
  const strip = (nodes) => (root && nodes.length && key(nodes[0]) === root ? nodes.slice(1) : nodes);

  const answers = new Map([...answersRaw].map(([t, list]) => [t, list.map((a) => {
    const parts = splitPath(a).map(tree ? treeKey : key);
    const entry = { text: a, parts: root && parts.length > 1 && parts[0] === root ? parts.slice(1) : parts };
    if (tree) {
      entry.nodes = tree.nodes.filter((n) => tailMatches(treePath(n).map((x) => x.key), entry.parts));
      if (!entry.nodes.length) throw new InputError(`Task ${t}'s correct answer "${a}" is not in the tree. Fix the spelling, or pass the tree the study used.`);
      if (entry.nodes.length > 1) warnings.push(`Task ${t}'s answer "${a}" matches ${entry.nodes.length} nodes in the tree (${entry.nodes.map((n) => treePath(n).map((x) => x.label).join(' > ')).join('; ')}). All of them count as correct. Give the full path if only one is right.`);
    }
    return entry;
  })]));

  const knownEdges = new Set();
  if (!tree) {
    for (const list of answers.values()) {
      for (const a of list) a.parts.slice(1).forEach((part, i) => knownEdges.add(`${a.parts[i]}>${part}`));
    }
    warnings.unshift('No --tree given, so answers were matched as path suffixes. Sideways moves and duplicate labels cannot be resolved without --tree: a sideways move can fail a full-path answer or pass a bare one as direct, and a repeated label can land on the wrong branch. Pass --tree tree.txt before quoting these numbers.');
  }

  const topLevel = new Set();
  for (const nodes of tree ? [] : allPaths) {
    const clicks = strip(nodes);
    if (clicks.length) topLevel.add(key(clicks[0]));
  }

  const labels = new Map();
  for (const nodes of allPaths) for (const node of nodes) if (!labels.has(key(node))) labels.set(key(node), node);
  const show = (k) => labels.get(k) ?? k;

  let anyBacktrack = false;
  const visited = new Set(allPaths.flatMap((p) => p.map(key)));
  const unreached = [];
  for (const [t, list] of tree ? [] : answers) {
    for (const a of list) if (!visited.has(a.parts[a.parts.length - 1])) unreached.push(`task ${t}: "${a.text}"`);
  }
  if (unreached.length) warnings.push(`These correct answers never appear in any path, so check the spelling against the tree: ${unreached.join('; ')}.`);

  const unknownClicks = new Map();
  let ambiguousClicks = 0;
  let resolvedClicks = 0;

  const tasks = [...attempts.keys()].sort(compareTasks).map((task) => {
    const list = answers.get(task);
    const n = attempts.get(task).size;
    const isTop = opts.topTasks.includes(task);
    const target = isTop ? opts.topTarget : opts.target;
    const firstClicks = new Map();
    const wrong = new Map();
    const correctFirst = new Set();
    if (tree) {
      for (const a of list) a.nodes.forEach((n) => correctFirst.add(treePath(n)[0].key));
    } else {
      list.filter((a) => a.parts.length > 1).forEach((a) => correctFirst.add(a.parts[0]));
      list.filter((a) => a.parts.length === 1 && topLevel.has(a.parts[0])).forEach((a) => correctFirst.add(a.parts[0]));
    }
    const ratios = [];
    const seconds = [];
    let successes = 0;
    let direct = 0;
    let noAnswer = 0;
    let clicked = 0;
    const firsts = [];

    for (const attempt of attempts.get(task).values()) {
      const clicks = strip(attempt.nodes);
      if (attempt.seconds !== null) seconds.push(attempt.seconds);
      if (!clicks.length) {
        noAnswer++;
        wrong.set(NO_ANSWER, (wrong.get(NO_ANSWER) ?? 0) + 1);
        continue;
      }
      clicked++;
      const first = key(clicks[0]);
      firstClicks.set(first, (firstClicks.get(first) ?? 0) + 1);
      firsts.push(first);
      const outcome = tree ? replay(tree, clicks, root) : walk(clicks, topLevel, root, knownEdges);
      const { route, backtracks } = outcome;
      if (tree) {
        outcome.unknown.forEach((u) => unknownClicks.set(u, (unknownClicks.get(u) ?? 0) + 1));
        ambiguousClicks += outcome.ambiguous;
        resolvedClicks += clicks.length - outcome.unknown.length;
      }
      if (backtracks) anyBacktrack = true;
      const reached = route.length > 0 && !outcome.stranded && list.some((a) => (tree ? a.nodes.includes(outcome.node) : tailMatches(route, a.parts)));
      if (reached) {
        successes++;
        if (backtracks === 0) direct++;
        ratios.push(outcome.clicks / route.length);
        correctFirst.add(route[0]);
      } else {
        const destination = outcome.destination ?? (route.map(show).join(' > ') || NO_ANSWER);
        wrong.set(destination, (wrong.get(destination) ?? 0) + 1);
      }
    }

    const ci = adjustedWald(successes, n);
    const successPct = (successes / n) * 100;
    let verdict;
    if (ci.low >= target) verdict = 'clears target';
    else if (successPct >= target) verdict = 'meets target, within noise';
    else if (ci.high >= target) verdict = 'below target, within noise';
    else verdict = 'clearly below target';

    const pathRatio = median(ratios);
    const medianSeconds = median(seconds);
    const flags = [];
    if (successPct < target) flags.push(`success under ${target}%`);
    if (pathRatio !== null && pathRatio > PATH_RATIO_TARGET) flags.push(`path ratio over ${PATH_RATIO_TARGET}`);
    const notes = [];
    if (medianSeconds !== null && medianSeconds >= SIMPLE_ITEM_SECONDS) notes.push(`median ${SIMPLE_ITEM_SECONDS}s or more, which matters only if this is a simple item`);
    const width = ci.high - ci.low;

    const firstClickShares = [...firstClicks].map(([k, c]) => ({ node: show(k), count: c, pct: round1((c / clicked) * 100) }))
      .sort((a, b) => b.count - a.count || a.node.localeCompare(b.node));
    const wrongFirst = [...firstClicks].filter(([k]) => !correctFirst.has(k)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    const correctFirstCount = firsts.filter((k) => correctFirst.has(k)).length;
    const branchKnown = correctFirst.size > 0;
    const topWrong =[...wrong].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

    return {
      task,
      n,
      topTask: isTop,
      targetPct: target,
      correctAnswers: list.map((a) => a.text),
      success: { count: successes, pct: round1(successPct), lowPct: round1(ci.low), highPct: round1(ci.high) },
      verdict,
      flagged: flags.length > 0,
      flags,
      notes,
      intervalWide: width > MAX_INTERVAL_WIDTH,
      direct: { count: direct, pct: round1((direct / n) * 100) },
      pathRatioMedian: pathRatio === null ? null : Math.round(pathRatio * 100) / 100,
      medianSeconds: medianSeconds === null ? null : round1(medianSeconds),
      noAnswer,
      firstClicks: firstClickShares,
      correctBranchKnown: branchKnown,
      correctFirstClickPct: branchKnown && clicked ? round1((correctFirstCount / clicked) * 100) : null,
      topWrongFirstClick: branchKnown && wrongFirst ? { node: show(wrongFirst[0]), pct: round1((wrongFirst[1] / clicked) * 100) } : null,
      topWrongDestination: topWrong ? { destination: topWrong[0], count: topWrong[1], pct: round1((topWrong[1] / n) * 100) } : null,
    };
  });

  if (tree) {
    if (!resolvedClicks && unknownClicks.size) throw new InputError('No click in the results matches a node in the tree. Check that this is the tree the study used.');
    if (unknownClicks.size) {
      const total = [...unknownClicks.values()].reduce((a, b) => a + b, 0);
      warnings.push(`${total} click(s) name a node that is not in the tree (${[...unknownClicks.keys()].slice(0, 5).join(', ')}${unknownClicks.size > 5 ? ', ...' : ''}). They cannot count as direct, and an attempt ending on one is a failure. Check that this is the tree the study used.`);
    }
    if (ambiguousClicks) warnings.push(`${ambiguousClicks} click(s) jumped to a label that exists in several branches, none of them next to where the participant was. The first in tree order was assumed.`);
  }

  const counts = tasks.map((t) => t.n);
  const small = tasks.filter((t) => t.n < MIN_PARTICIPANTS).map((t) => t.task);
  if (small.length) warnings.push(`n is below ${MIN_PARTICIPANTS} on task(s) ${small.join(', ')}. The usual range is ${MIN_PARTICIPANTS} to 50, so treat these as rough signals.`);
  const wide = tasks.filter((t) => t.intervalWide).map((t) => t.task);
  if (wide.length) warnings.push(`The 95% interval is wider than ${MAX_INTERVAL_WIDTH} points on task(s) ${wide.join(', ')}. Do not quote those rates without the interval.`);
  if (!anyBacktrack && tasks.some((t) => t.success.count > 0)) warnings.push('No path in this file shows any backtracking. Either everyone went straight there or the tool exported only final paths. Check before quoting directness or path ratio.');
  if (rootNote) warnings.push(rootNote);

  const participants = new Set([...attempts.values()].flatMap((m) => [...m.keys()]));
  return {
    participants: participants.size,
    nPerTask: { min: Math.min(...counts), max: Math.max(...counts) },
    targets: { successPct: opts.target, topTaskPct: opts.topTarget, pathRatio: PATH_RATIO_TARGET, simpleItemSeconds: SIMPLE_ITEM_SECONDS },
    warnings,
    overall: { tasks: tasks.length, meetingTarget: tasks.filter((t) => t.success.pct >= t.targetPct).length, flagged: tasks.filter((t) => t.flagged).map((t) => t.task) },
    hasSeconds,
    tasks,
  };
}

function checkTasks(text, label) {
  const { records } = readTable(text, label, ['task', 'text', 'correct_node']);
  const tasks = new Map();
  for (const r of records) {
    if (!r.task) continue;
    if (!tasks.has(r.task)) tasks.set(r.task, { text: r.text, answers: [] });
    if (r.correct_node) tasks.get(r.task).answers.push(r.correct_node);
  }
  const notes = [];
  if (tasks.size < MIN_TASKS) notes.push(`${tasks.size} tasks is below the usual ${MIN_TASKS} to ${MAX_TASKS}. Check that the problem areas and uncertain placements are covered.`);
  if (tasks.size > MAX_TASKS) notes.push(`${tasks.size} tasks is more than the ${MAX_TASKS} one person should do, because people learn the tree as they go. Give each participant a random subset.`);
  const leaks = [];
  const noAnswer = [];
  for (const [task, t] of [...tasks].sort((a, b) => compareTasks(a[0], b[0]))) {
    if (!t.answers.length) noAnswer.push(task);
    const words = new Map(contentWords(t.text).map((w) => [stem(w), w]));
    const hits = new Map();
    for (const answer of t.answers) {
      for (const node of splitPath(answer)) {
        for (const w of contentWords(node)) if (words.has(stem(w))) hits.set(words.get(stem(w)), node);
      }
    }
    if (hits.size) leaks.push({ task, text: t.text, words: [...hits].map(([word, node]) => ({ word, label: node })) });
  }
  return { tasks: tasks.size, notes, labelWordsInTask: leaks, tasksWithNoAnswer: noAnswer };
}

// Output -------------------------------------------------------------------

function renderText(r) {
  const out = [];
  out.push('Tree test results');
  out.push(`Participants: ${r.participants}    n per task: ${r.nPerTask.min === r.nPerTask.max ? r.nPerTask.min : `${r.nPerTask.min} to ${r.nPerTask.max}`}`);
  out.push(`Targets: success ${r.targets.successPct}%, top tasks ${r.targets.topTaskPct}%, path ratio ${r.targets.pathRatio} times shortest, simple items under ${r.targets.simpleItemSeconds}s`);
  if (r.warnings.length) out.push('', 'WARNINGS', ...r.warnings.map((w) => `  ! ${w}`));
  out.push('', `Overall: ${r.overall.meetingTarget} of ${r.overall.tasks} tasks meet the success target. Flagged: ${r.overall.flagged.length ? r.overall.flagged.join(', ') : 'none'}.`);

  const columns = ['Task', 'n', 'Success % (95% interval)', 'Direct %', 'Path ratio'];
  if (r.hasSeconds) columns.push('Median time');
  columns.push('Wrong first click', 'Verdict');
  const rows = r.tasks.map((t) => {
    const row = [`${t.task}${t.topTask ? '*' : ''}`, String(t.n), `${Math.round(t.success.pct)} (${Math.round(t.success.lowPct)} to ${Math.round(t.success.highPct)})`,
      String(Math.round(t.direct.pct)), t.pathRatioMedian === null ? 'n/a' : t.pathRatioMedian.toFixed(2)];
    if (r.hasSeconds) row.push(t.medianSeconds === null ? 'n/a' : `${t.medianSeconds}s`);
    const wrongFirstCell = !t.correctBranchKnown ? 'unknown' : t.topWrongFirstClick ? `${t.topWrongFirstClick.node} (${Math.round(t.topWrongFirstClick.pct)}%)` : 'none';
    row.push(wrongFirstCell, `${t.flagged ? `FLAG${t.success.pct >= t.targetPct ? ' (path ratio)' : ''}: ` : ''}${t.verdict}`);
    return row;
  });
  const widths = columns.map((c, i) => Math.max(c.length, ...rows.map((row) => row[i].length)));
  const fmt = (row) => row.map((cell, i) => cell.padEnd(widths[i])).join(' | ').trimEnd();
  out.push('', fmt(columns), widths.map((w) => '-'.repeat(w)).join('-|-'), ...rows.map(fmt));
  if (r.tasks.some((t) => t.topTask)) out.push('* top task');

  out.push('', 'Per task');
  for (const t of r.tasks) {
    out.push(`Task ${t.task} (n=${t.n}, target ${t.targetPct}%)${t.flagged ? `  FLAGGED: ${t.flags.join('; ')}` : ''}`);
    if (t.notes.length) out.push(`  Note: ${t.notes.join('; ')}`);
    out.push(`  Success ${t.success.count} of ${t.n}: ${t.success.pct}%, 95% interval ${pct(t.success.lowPct)} to ${pct(t.success.highPct)}, ${t.verdict}`);
    out.push(`  Direct success ${t.direct.count} of ${t.n}: ${t.direct.pct}%${t.pathRatioMedian === null ? '' : `; median path ratio ${t.pathRatioMedian}`}${t.noAnswer ? `; ${t.noAnswer} gave no answer` : ''}`);
    out.push(`  First clicks: ${t.firstClicks.map((f) => `${f.node} ${f.pct}%`).join(', ') || 'none'}`);
    out.push(`  Correct first click: ${t.correctFirstClickPct === null ? 'unknown (nobody succeeded and the answer is a bare node; give it as a full path)' : `${t.correctFirstClickPct}%`}`);
    out.push(`  Most common wrong destination: ${t.topWrongDestination ? `${t.topWrongDestination.destination} (${t.topWrongDestination.count}, ${t.topWrongDestination.pct}%)` : 'none'}`);
  }
  out.push('', 'This shows whether these people could find these items in the text tree. It says nothing about the visual design, search or content, and it cannot show the tree is the best one available.');
  return out.join('\n');
}

function renderCheck(r) {
  const out = [`Task check: ${r.tasks} tasks`];
  r.notes.forEach((n) => out.push(`  ! ${n}`));
  out.push('', `Tasks that use a word from their own answer path: ${r.labelWordsInTask.length || 'none'}`);
  r.labelWordsInTask.forEach((t) => out.push(`  - Task ${t.task}: ${t.words.map((w) => `"${w.word}" (in ${w.label})`).join(', ')}`, `      ${t.text}`));
  out.push('', `Tasks with no correct answer: ${r.tasksWithNoAnswer.length ? r.tasksWithNoAnswer.join(', ') : 'none'}`);
  return out.join('\n');
}

// Self-test ----------------------------------------------------------------

function selfTest() {
  let failed = 0;
  let passed = 0;
  const check = (name, ok, detail) => {
    if (ok) { passed++; console.log(`ok    ${name}`); } else { failed++; console.log(`FAIL  ${name}${detail === undefined ? '' : `: ${JSON.stringify(detail)}`}`); }
  };
  const near = (a, b, tolerance = 0.1) => Math.abs(a - b) <= tolerance;
  const throws = (fn, pattern) => {
    try { fn(); return false; } catch (e) { return e instanceof InputError && pattern.test(e.message); }
  };
  const defaults = { topTasks: [], target: SUCCESS_TARGET, topTarget: TOP_TASK_TARGET };

  const tricky = parseCsv('﻿a,b\r\n"x, y","say ""hi"""\r\n"two\nlines",z\n');
  check('CSV keeps a comma inside quotes', tricky[1].cells[0] === 'x, y');
  check('CSV unescapes doubled quotes', tricky[1].cells[1] === 'say "hi"');
  check('CSV keeps a newline inside quotes and strips a byte order mark', tricky[2].cells[0] === 'two\nlines' && tricky[0].cells[0] === 'a');

  let ci = adjustedWald(8, 10);
  check('adjusted Wald 8 of 10 is 47.9 to 95.4', near(ci.low, 47.9) && near(ci.high, 95.4), ci);
  ci = adjustedWald(14, 20);
  check('adjusted Wald 14 of 20 is 47.9 to 85.7', near(ci.low, 47.9) && near(ci.high, 85.7), ci);
  ci = adjustedWald(0, 5);
  check('adjusted Wald lower bound stops at 0', ci.low === 0 && near(ci.high, 48.9), ci);
  ci = adjustedWald(10, 10);
  check('adjusted Wald upper bound stops at 100', ci.high === 100 && near(ci.low, 67.9), ci);

  check('a straight path has no backtrack', walk(['A', 'B', 'C'], new Set(['a']), null).backtracks === 0);
  const back = walk(['A', 'B', 'A', 'D'], new Set(['a']), null);
  check('returning to a visited node is a backtrack', back.backtracks === 1 && back.route.join() === 'a,d' && back.clicks === 4, back);
  const jump = walk(['A', 'B', 'X', 'Y'], new Set(['a', 'x']), null);
  check('jumping to another top-level node is a backtrack', jump.backtracks === 1 && jump.route.join() === 'x,y', jump);
  const viaRoot = walk(['A', 'Home', 'X', 'Y'], new Set(['a', 'x']), 'home');
  check('returning to the root is a backtrack and still a click', viaRoot.backtracks === 1 && viaRoot.clicks === 4 && viaRoot.route.join() === 'x,y', viaRoot);

  const results = ['participant,task,path'];
  // Task 1: 18 of 20 go straight to Account > Payment methods. Two fail in Shop.
  for (let i = 1; i <= 18; i++) results.push(`P${i},1,Home > Account > Payment methods`);
  results.push('P19,1,Home > Shop > Orders', 'P20,1,Home > Shop > Orders');
  // Task 2: must be flagged. 8 of 20 succeed, 12 end in Help > Contact.
  for (let i = 1; i <= 8; i++) results.push(`P${i},2,Home > Account > Plans`);
  for (let i = 9; i <= 20; i++) results.push(`P${i},2,Home > Help > Contact`);
  // Task 3: two acceptable answers. 16 reach one or the other, 8 of them after backtracking, 4 give up.
  for (let i = 1; i <= 8; i++) results.push(`P${i},3,Home > Shop > Returns`);
  for (let i = 9; i <= 16; i++) results.push(`P${i},3,Home > Account > Home > Help > Refunds`);
  for (let i = 17; i <= 20; i++) results.push(`P${i},3,`);
  const answers = 'task,correct_node\n1,Account > Payment methods\n2,Plans\n3,Shop > Returns\n3,Help > Refunds\n';
  const r = analyze(results.join('\n'), answers, { ...defaults, topTasks: ['1'] });
  const t = (id) => r.tasks.find((x) => x.task === id);

  check('reports n per task', r.nPerTask.min === 20 && r.nPerTask.max === 20, r.nPerTask);
  check('detects the root and says so', r.warnings.some((w) => /treated as the root/.test(w)), r.warnings);
  check('success rate and interval', t('1').success.count === 18 && t('1').success.pct === 90 && near(t('1').success.lowPct, 68.7) && near(t('1').success.highPct, 98.4), t('1').success);
  check('directness is the share reaching the answer with no backtracking', t('1').direct.pct === 90, t('1').direct);
  check('first-click shares per top-level node', t('1').firstClicks[0].node === 'Account' && t('1').firstClicks[0].pct === 90, t('1').firstClicks);
  check('most common wrong destination', t('1').topWrongDestination.destination === 'Shop > Orders' && t('1').topWrongDestination.count === 2, t('1').topWrongDestination);
  check('a top task uses the higher target', t('1').targetPct === 80 && t('2').targetPct === 70);
  check('FLAG: a task under target is flagged', t('2').flagged && /success under 70/.test(t('2').flags[0]), t('2'));
  check('FLAG: wrong destination on the failing task', t('2').topWrongDestination.destination === 'Help > Contact' && t('2').topWrongDestination.pct === 60, t('2').topWrongDestination);
  check('FLAG: wrong first click on the failing task', t('2').topWrongFirstClick.node === 'Help' && t('2').topWrongFirstClick.pct === 60, t('2').topWrongFirstClick);
  check('a clearly failing task says so', t('2').verdict === 'clearly below target', t('2').verdict);
  check('any of several answers counts as success', t('3').success.count === 16, t('3').success);
  check('backtracking lowers directness but not success', t('3').direct.count === 8, t('3').direct);
  check('a blank path counts as a failure with no answer', t('3').noAnswer === 4 && t('3').topWrongDestination.destination === NO_ANSWER, t('3'));
  check('median path ratio over successes counts every click', t('3').pathRatioMedian === 1.5, t('3').pathRatioMedian);
  check('a passing rate whose interval reaches below target is labelled within noise', t('3').verdict === 'meets target, within noise', t('3').verdict);

  const ratioRows = ['participant,task,path'];
  for (let i = 1; i <= 20; i++) ratioRows.push(`P${i},1,A > B > A > X > Y`);
  ratioRows.push('P21,2,B > C');
  const ratio = analyze(ratioRows.join('\n'), 'task,correct_node\n1,X > Y\n2,C\n', { ...defaults, root: 'none' });
  check('FLAG: a median path over 1.5 times the shortest is flagged', ratio.tasks[0].flagged && ratio.tasks[0].flags.some((f) => /path ratio/.test(f)), ratio.tasks[0]);

  const small = analyze('participant,task,path\nP1,1,A > B\nP2,1,A > C\nP3,1,D > E\n', 'task,correct_node\n1,B\n', defaults);
  check('FLAG: a small n is warned about', small.warnings.some((w) => /n is below 20/.test(w)), small.warnings);
  check('FLAG: a wide interval is warned about', small.tasks[0].intervalWide && small.warnings.some((w) => /wider than 40/.test(w)), small.warnings);
  check('FLAG: a file with no backtracking is warned about', small.warnings.some((w) => /No path in this file shows any backtracking/.test(w)), small.warnings);

  const typo = analyze('participant,task,path\nP1,1,A > B\n', 'task,correct_node\n1,Bb\n', defaults);
  check('FLAG: an answer that never appears in any path is reported', typo.warnings.some((w) => /never appear/.test(w)), typo.warnings);

  const lost = analyze('participant,task,path\nP1,1,A > B\nP2,1,C > D\n', 'task,correct_node\n1,Z\n', { ...defaults, root: 'none' });
  check('with no success and a bare answer the correct branch is reported as unknown', lost.tasks[0].correctFirstClickPct === null && lost.tasks[0].topWrongFirstClick === null, lost.tasks[0]);

  const timed = analyze('participant,task,path,seconds\nP1,1,A > B,40\nP2,1,A > B,50\n', 'task,correct_node\n1,B\n', { ...defaults, root: 'none' });
  check('median time and the slow note', timed.tasks[0].medianSeconds === 45 && timed.tasks[0].notes.some((f) => /median 30s/.test(f)), timed.tasks[0]);

  const slowRows = ['participant,task,path,seconds'];
  for (let i = 1; i <= 20; i++) slowRows.push(`P${i},1,A > B,35`);
  const slow = analyze(slowRows.join('\n'), 'task,correct_node\n1,A > B\n', { ...defaults, root: 'none' });
  check('a 100% task at 35 seconds is noted, not flagged', !slow.tasks[0].flagged && slow.tasks[0].notes.length === 1 && slow.overall.flagged.length === 0, slow.tasks[0]);
  check('a task that is only slow prints no FLAG', !/FLAG/.test(renderText(slow)), renderText(slow));

  const wrongTurnRows = ['participant,task,path'];
  for (let i = 1; i <= 20; i++) wrongTurnRows.push(`P${i},1,X > W > X > Y`);
  const wrongTurn = analyze(wrongTurnRows.join('\n'), 'task,correct_node\n1,X > Y\n', { ...defaults, root: 'none' });
  check('a wrong turn at depth 2 has a path ratio of 2.0, counting the back click', wrongTurn.tasks[0].pathRatioMedian === 2, wrongTurn.tasks[0].pathRatioMedian);
  check('FLAG: that wrong turn is flagged, and the row says why when success is fine', wrongTurn.tasks[0].flagged && /FLAG \(path ratio\): /.test(renderText(wrongTurn)), renderText(wrongTurn));

  // The tree study: Support is a top-level node and also sits under Account.
  const tree = ['# as tested', 'Home', '├── Account', '│   ├── Profile', '│   ├── Billing', '│   └── Support', '├── Support', '└── Shop', '    └── Orders'].join('\n');
  const study = (path, answer, treeText, n = 20) => {
    const rows = ['participant,task,path'];
    for (let i = 1; i <= n; i++) rows.push(`P${i},1,${path}`, `P${i},2,Home > Support`, `P${i},3,Home > Shop > Orders`);
    return analyze(rows.join('\n'), `task,correct_node\n1,${answer}\n2,Support\n3,Orders\n`, { ...defaults, treeText });
  };
  const nested = study('Home > Account > Support', 'Account > Support', tree).tasks[0];
  check('tree: a label repeated at the top level lands under its parent', nested.success.count === 20 && nested.direct.count === 20 && nested.pathRatioMedian === 1, nested);
  const noTree = study('Home > Account > Support', 'Account > Support');
  check('no tree: a full-path answer matches as a path suffix despite a top-level twin', noTree.tasks[0].success.count === 20 && noTree.tasks[0].direct.count === 20, noTree.tasks[0]);
  check('no tree: the warning is plain about what cannot be resolved', /Sideways moves and duplicate labels cannot be resolved without --tree/.test(noTree.warnings[0]), noTree.warnings);
  check('tree: no missing-tree warning', !study('Home > Account > Support', 'Account > Support', tree).warnings.some((w) => /--tree/.test(w)));
  const sideways = study('Home > Account > Profile > Billing', 'Account > Billing', tree).tasks[0];
  check('tree: a sideways move lands on the sibling and is correct', sideways.success.count === 20, sideways);
  check('tree: a sideways move is not direct and every click counts', sideways.direct.count === 0 && sideways.pathRatioMedian === 1.5, sideways);
  check('tree: a bare answer reached sideways is not direct', study('Home > Account > Profile > Billing', 'Billing', tree).tasks[0].direct.count === 0);
  check('no tree: a sideways move cannot satisfy a full-path answer', study('Home > Account > Profile > Billing', 'Account > Billing').tasks[0].success.count === 0);
  check('no tree: a sideways move passes a bare answer, which is what the warning is for', study('Home > Account > Profile > Billing', 'Billing').tasks[0].direct.count === 20);
  const viaHome = study('Home > Account > Home > Support', 'Account > Support', tree).tasks[0];
  check('tree: going back to the root then clicking the twin lands at the top level', viaHome.success.count === 0 && viaHome.topWrongDestination.destination === 'Support', viaHome.topWrongDestination);
  const fromShop = study('Home > Shop > Support', 'Support', tree);
  check('tree: a click on a top-level node from another branch moves there', fromShop.tasks[0].success.count === 20 && fromShop.tasks[0].direct.count === 0, fromShop.tasks[0]);
  check('tree: a bare answer on a repeated label is warned about', fromShop.warnings.some((w) => /matches 2 nodes/.test(w)), fromShop.warnings);
  check('tree: the correct first click is known even when nobody succeeded', study('Home > Shop > Orders', 'Account > Billing', tree).tasks[0].correctFirstClickPct === 0);
  check('tree: an answer that is not in the tree is a clear error', throws(() => study('Home > Account', 'Account > Nope', tree), /"Account > Nope" is not in the tree/));
  check('tree: a tree no click matches is a clear error', throws(() => analyze('participant,task,path\nP1,1,Q > R\n', 'task,correct_node\n1,Billing\n', { ...defaults, treeText: tree }), /No click in the results matches/));
  const stray = study('Home > Account > Billingg', 'Account > Billing', tree);
  check('tree: a click not in the tree is warned about and fails the attempt', stray.tasks[0].success.count === 0 && stray.warnings.some((w) => /not in the tree \(Billingg\)/.test(w)), stray.warnings);
  const renamed = study('Home > Account > Billing', 'Account > Billing', tree.replace('Home', 'Acme')).tasks[0];
  check('tree: paths starting at a root the tree names differently still count from the root', renamed.success.count === 20 && renamed.direct.count === 20, renamed);
  const allAccount = analyze('participant,task,path\nP1,1,Account > Billing\nP2,1,Account > Support\n', 'task,correct_node\n1,Account > Billing\n', { ...defaults, treeText: 'Account\n  Billing\n  Support\nShop\n' });
  check('tree: a real top-level node that everyone clicked first is not mistaken for the root', allAccount.tasks[0].success.count === 1 && !allAccount.warnings.some((w) => /treated as the root/.test(w)), allAccount.warnings);
  const pathTree = parseTree(['/                       home', '├── /account             section-hub', '│   └── /account/payment-methods  form', '├── /old                 listing  (retired)', '│   └── /old/thing       post', '└── /shop | listing'].join('\n'));
  check('tree: reads URL paths, columns and retired branches', pathTree.root.key === 'home' && pathTree.nodes.map((n) => n.key).join() === 'account,payment methods,shop', pathTree.nodes.map((n) => n.key));
  const forest = parseTree('Account\n  Billing\nShop\n');
  check('tree: several top-level nodes share an implied root', forest.root.key === null && forest.nodes.map((n) => n.depth).join() === '1,2,1', forest.nodes.map((n) => n.depth));

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tree-test-'));
  fs.writeFileSync(path.join(dir, 'results.csv'), 'participant,task,path\nP1,1,Home > Account > Profile > Billing\nP2,1,Home > Account > Billing\nP1,2,Home > Shop\n');
  fs.writeFileSync(path.join(dir, 'answers.csv'), 'task,correct_node\n1,Account > Billing\n2,Shop\n');
  fs.writeFileSync(path.join(dir, 'tree.txt'), tree);
  const cli = spawnSync(process.execPath, [fileURLToPath(import.meta.url), path.join(dir, 'results.csv'), '--answers', path.join(dir, 'answers.csv'), '--tree', path.join(dir, 'tree.txt'), '--json'], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  check('--tree reaches the analysis from the command line', cli.status === 0 && JSON.parse(cli.stdout).tasks[0].success.count === 2, cli.stderr);

  check('a task with no answer key is a clear error', throws(() => analyze('participant,task,path\nP1,9,A > B\n', 'task,correct_node\n1,B\n', defaults), /Task\(s\) 9 have results but no correct answer/));
  check('a missing column is a clear error', throws(() => analyze('participant,path\nP1,A\n', 'task,correct_node\n1,B\n', defaults), /missing the column\(s\): task/));

  const plan = checkTasks('task,text,correct_node\n1,Change your billing details,Account > Billing\n2,Your bank sent a replacement debit card. Where would you update it?,Account > Payment methods\n', 'plan');
  check('FLAG task check: a task using the words of its label', plan.labelWordsInTask.length === 1 && plan.labelWordsInTask[0].task === '1', plan.labelWordsInTask);
  check('task check passes a task in the participant\'s own words', !plan.labelWordsInTask.some((x) => x.task === '2'), plan.labelWordsInTask);
  check('FLAG task check: too few tasks', plan.notes.some((n) => /below the usual 8 to 12/.test(n)), plan.notes);

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

function percentOption(value, name, fallback) {
  if (value === undefined) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100) throw new InputError(`--${name} must be a percentage from 0 to 100, got "${value}".`);
  return n;
}

function main() {
  let args;
  try {
    args = parseArgs({
      allowPositionals: true,
      options: {
        'self-test': { type: 'boolean' }, help: { type: 'boolean' }, json: { type: 'boolean' },
        answers: { type: 'string' }, 'top-tasks': { type: 'string' }, target: { type: 'string' }, 'top-target': { type: 'string' },
        root: { type: 'string' }, 'check-tasks': { type: 'string' }, tree: { type: 'string' },
      },
    });
  } catch (e) {
    throw new InputError(`${e.message}\n\n${USAGE}`);
  }
  const { values, positionals } = args;
  if (values.help) { console.log(USAGE); return; }
  if (values['self-test']) { process.exitCode = selfTest() ? 0 : 1; return; }
  if (values['check-tasks']) {
    const report = checkTasks(readFile(values['check-tasks'], 'the task list'), values['check-tasks']);
    console.log(values.json ? JSON.stringify(report, null, 2) : renderCheck(report));
    return;
  }
  if (positionals.length !== 1) throw new InputError(`Give exactly one results CSV.\n\n${USAGE}`);
  if (!values.answers) throw new InputError(`--answers answers.csv is required: a task cannot be scored without its correct nodes.\n\n${USAGE}`);
  const report = analyze(readFile(positionals[0], 'the results'), readFile(values.answers, 'the answers'), {
    resultsLabel: positionals[0],
    answersLabel: values.answers,
    topTasks: (values['top-tasks'] ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    target: percentOption(values.target, 'target', SUCCESS_TARGET),
    topTarget: percentOption(values['top-target'], 'top-target', TOP_TASK_TARGET),
    root: values.root,
    treeText: values.tree === undefined ? undefined : readFile(values.tree, 'the tree'),
  });
  console.log(values.json ? JSON.stringify(report, null, 2) : renderText(report));
}

try {
  main();
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exitCode = 1;
}
