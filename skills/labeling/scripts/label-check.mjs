#!/usr/bin/env node
// Finds the label faults that can be found mechanically: vague words, repeated
// lead words among siblings, mixed forms, and one thing going by two names.
// Node only, no dependencies. It cannot tell whether people understand a label.

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const USAGE = `Usage:
  node label-check.mjs <labels.csv>
  node label-check.mjs --self-test

labels.csv has one row per label. Columns: group, label. Optional: destination.
group names the labels shown together, such as "primary nav" or "billing side rail".

Exit codes: 0 the report ran (read its counts), 1 a self-test failed, 2 bad input.`;

class InputError extends Error {}

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

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const wordsOf = (s) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

const VAGUE = new Set([
  'resources', 'solutions', 'discover', 'explore', 'more', 'learn more', 'click here', 'read more',
  'services', 'products', 'information', 'info', 'stuff', 'general', 'misc', 'miscellaneous', 'other',
  'overview', 'hub', 'center', 'centre', 'tools', 'what we do', 'get started',
]);
const LEAD_WORDS_TO_IGNORE = new Set(['a', 'an', 'the', 'for', 'my', 'your', 'our', 'how', 'to']);
const STATUS_WORD = /^(kept|renamed|new|tested|untested)$/i;

// Fires only on strong signals: "Pricing" and "Billing" end in -ing but are nouns.
function formOf(label) {
  const words = wordsOf(label);
  const noun = 'noun phrase';
  if (words.length < 2) return noun;
  if (words[0] === 'for') return 'audience ("For ...")';
  if (/^(how|what|why|when|where|who)$/.test(words[0])) return 'question ("How ...")';
  if (/^(a|an|the|your|my|our|their)$/.test(words[1])) return /.{3,}ing$/.test(words[0]) ? 'activity ("Planning a ...")' : 'task ("Plan a ...")';
  return noun;
}

function analyse(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new InputError('The labels file is empty.');
  const header = rows[0].cells.map((h) => h.trim().toLowerCase());
  const missing = ['group', 'label'].filter((c) => !header.includes(c));
  if (missing.length > 0) throw new InputError(`The labels file is missing column(s): ${missing.join(', ')}. Found: ${header.join(', ')}.`);
  const at = { group: header.indexOf('group'), label: header.indexOf('label'), destination: header.indexOf('destination') };

  const labels = [];
  const skipped = [];
  for (const row of rows.slice(1)) {
    const group = clean(row.cells[at.group]);
    const label = clean(row.cells[at.label]);
    const overflow = row.cells.slice(header.length).filter((c) => c.trim() !== '');
    const statusSplitByComma = header.at(-1) === 'status' && overflow.every((c) => STATUS_WORD.test(c.trim()));
    if (!group || !label || (overflow.length > 0 && !statusSplitByComma)) { skipped.push(row.line); continue; }
    labels.push({ group, label, destination: at.destination >= 0 ? clean(row.cells[at.destination]) : '' });
  }
  if (labels.length === 0) throw new InputError('The labels file has a header but no usable rows.');

  const groups = new Map();
  for (const entry of labels) {
    if (!groups.has(entry.group)) groups.set(entry.group, []);
    groups.get(entry.group).push(entry);
  }

  const result = { labelCount: labels.length, groupCount: groups.size, skipped, vague: [], duplicates: [], repeatedLead: [], mixedForms: [], oneLabelManyPlaces: [], onePlaceManyLabels: [], hasDestinations: at.destination >= 0 };

  for (const entry of labels) {
    if (VAGUE.has(wordsOf(entry.label).join(' '))) result.vague.push(entry);
  }
  for (const [group, members] of groups) {
    const seen = new Map();
    for (const { label } of members) {
      const key = wordsOf(label).join(' ');
      seen.set(key, [...(seen.get(key) ?? []), label]);
    }
    for (const same of seen.values()) if (same.length > 1) result.duplicates.push({ group, labels: same });

    if (members.length >= 3) {
      const leads = new Map();
      for (const { label } of members) {
        const words = wordsOf(label).filter((w) => !LEAD_WORDS_TO_IGNORE.has(w));
        if (words.length < 2) continue;
        leads.set(words[0], [...(leads.get(words[0]) ?? []), label]);
      }
      for (const [word, same] of leads) if (same.length >= 2) result.repeatedLead.push({ group, word, labels: same });

      const forms = new Map();
      for (const { label } of members) {
        const form = formOf(label);
        forms.set(form, [...(forms.get(form) ?? []), label]);
      }
      if (forms.size > 1) result.mixedForms.push({ group, forms: [...forms.entries()].map(([form, list]) => ({ form, labels: list })) });
    }
  }

  if (result.hasDestinations) {
    const byLabel = new Map();
    const byDestination = new Map();
    for (const { label, destination } of labels) {
      if (!destination) continue;
      const key = wordsOf(label).join(' ');
      if (!byLabel.has(key)) byLabel.set(key, { label, destinations: new Set() });
      byLabel.get(key).destinations.add(destination);
      if (!byDestination.has(destination)) byDestination.set(destination, new Set());
      byDestination.get(destination).add(label);
    }
    for (const { label, destinations } of byLabel.values()) {
      if (destinations.size > 1) result.oneLabelManyPlaces.push({ label, destinations: [...destinations] });
    }
    for (const [destination, names] of byDestination) {
      const distinct = new Set([...names].map((n) => wordsOf(n).join(' ')));
      if (distinct.size > 1) result.onePlaceManyLabels.push({ destination, labels: [...names] });
    }
  }
  return result;
}

function render(r, file) {
  const out = [`label-check: ${file}`, `Labels: ${r.labelCount}   Groups: ${r.groupCount}`];
  if (r.skipped.length > 0) out.push(`Rows skipped (blank group or label, or too many cells): line ${r.skipped.join(', ')}`);
  const destinationCount = (n) => (r.hasDestinations ? n : 'not run (no destination column)');
  out.push('', 'CHECKS');
  out.push(`  Vague labels: ${r.vague.length}`);
  out.push(`  Duplicate labels in one group: ${r.duplicates.length}`);
  out.push(`  Siblings starting with the same word: ${r.repeatedLead.length}`);
  out.push(`  Groups mixing grammatical forms: ${r.mixedForms.length}`);
  out.push(`  One label, several destinations: ${destinationCount(r.oneLabelManyPlaces.length)}`);
  out.push(`  One destination, several labels: ${destinationCount(r.onePlaceManyLabels.length)}`);
  const section = (title, lines) => { if (lines.length > 0) out.push('', title, ...lines.map((l) => `  ${l}`)); };
  section('VAGUE: could a newcomer predict what is behind it?', r.vague.map((v) => `[${v.group}] ${v.label}`));
  section('DUPLICATES IN ONE GROUP', r.duplicates.map((d) => `[${d.group}] ${d.labels.join(' | ')}`));
  section('SAME LEAD WORD: move the word that tells them apart to the front', r.repeatedLead.map((l) => `[${l.group}] "${l.word}": ${l.labels.join(' | ')}`));
  section('MIXED FORMS: one labelling system per group?', r.mixedForms.map((m) => `[${m.group}] ${m.forms.map((f) => `${f.form}: ${f.labels.join(', ')}`).join('; ')}`));
  section('ONE LABEL, SEVERAL DESTINATIONS', r.oneLabelManyPlaces.map((o) => `${o.label}: ${o.destinations.join(' | ')}`));
  section('ONE DESTINATION, SEVERAL LABELS', r.onePlaceManyLabels.map((o) => `${o.destination}: ${o.labels.join(' | ')}`));
  out.push('', 'These are mechanical checks. A clean run does not show that people understand the labels: only a predictability test does.');
  return out.join('\n');
}

function selfTest() {
  const checks = [];
  const check = (name, fn) => checks.push([name, fn]);
  const rejects = (fn, pattern) => assert.throws(fn, (e) => e instanceof InputError && pattern.test(e.message));
  const data = [
    '﻿group,label,destination',
    'primary,Resources,/resources',
    'primary,Pricing,/pricing',
    'primary,"Terms, privacy",/legal',
    'primary,Pricing,/plans',
    'rail,Report settings,/reports/settings',
    'rail,Report history,/reports/history',
    'rail,Report exports,/reports/exports',
    'audience,For developers,/developers',
    'audience,Planning a launch,/launch',
    'audience,Security,/security',
    'footer,Prices,/pricing',
    'footer,Help,/help',
  ].join('\r\n');
  const r = analyse(data);

  check('reads a quoted comma', () => assert.equal(r.labelCount, 12));
  check('flags a vague label', () => assert.deepEqual(r.vague.map((v) => v.label), ['Resources']));
  check('flags a duplicate in one group', () => assert.deepEqual(r.duplicates[0].labels, ['Pricing', 'Pricing']));
  check('flags siblings that share a lead word', () => assert.equal(r.repeatedLead[0].word, 'report'));
  check('flags a group that mixes forms', () => assert.ok(r.mixedForms.some((m) => m.group === 'audience')));
  check('flags one label pointing at two destinations', () => assert.deepEqual(r.oneLabelManyPlaces[0].destinations, ['/pricing', '/plans']));
  check('flags one destination under two labels', () => assert.deepEqual(r.onePlaceManyLabels[0].labels, ['Pricing', 'Prices']));
  check('raises nothing on a clean group', () => {
    const c = analyse('group,label,destination\nnav,Pricing,/p\nnav,Security,/s\nnav,Integrations,/i\n');
    for (const key of ['vague', 'duplicates', 'repeatedLead', 'mixedForms', 'oneLabelManyPlaces', 'onePlaceManyLabels']) assert.equal(c[key].length, 0, key);
  });
  const statusHeader = 'group,label,destination,system,was,evidence,status\n';
  check('reads an unquoted "renamed, untested" status instead of skipping the row', () => {
    const s = analyse(`${statusHeader}nav,Pricing,/p,topic,Plans,assumption,renamed, untested\n`);
    assert.equal(s.labelCount, 1);
    assert.deepEqual(s.skipped, []);
  });
  check('still skips a row whose extra cell is not a status word', () => {
    const s = analyse(`${statusHeader}nav,Pricing,/p,topic,Plans,assumption,renamed,oops\nnav,Help,/h,topic,,support,kept; tested\n`);
    assert.equal(s.labelCount, 1);
    assert.deepEqual(s.skipped, [2]);
  });
  check('says what it did not run', () => assert.match(render(analyse('group,label\nnav,Pricing\n'), 'x.csv'), /no destination column/));
  check('reports a missing column clearly', () => rejects(() => analyse('name,label\na,b\n'), /missing column\(s\): group/));
  check('reports an unclosed quote with its line', () => rejects(() => analyse('group,label\n"nav,x\n'), /line 2/));
  check('rejects an empty file', () => rejects(() => analyse(''), /empty/));

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

function main() {
  try {
    const args = process.argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) { console.log(USAGE); return 0; }
    if (args.includes('--self-test')) return selfTest();
    const unknown = args.find((a) => a.startsWith('-'));
    if (unknown) throw new InputError(`Unknown option: ${unknown}.`);
    if (args.length !== 1) throw new InputError('Give one labels CSV. Columns: group, label, and optionally destination.');
    let text;
    try {
      text = readFileSync(args[0], 'utf8');
    } catch (err) {
      const why = err.code === 'ENOENT' ? 'no such file' : err.code === 'EISDIR' ? 'that is a folder' : err.message;
      throw new InputError(`Cannot read "${args[0]}": ${why}.`);
    }
    console.log(render(analyse(text), args[0]));
    return 0;
  } catch (err) {
    if (err instanceof InputError) {
      console.error(`label-check: ${err.message}\nRun with --help for usage.`);
      return 2;
    }
    console.error(`label-check: unexpected problem: ${err.message}`);
    return 2;
  }
}

process.exitCode = main();
