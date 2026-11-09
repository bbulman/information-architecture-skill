---
name: content-inventory
description: Use when someone needs to know what a site, app, docs set, knowledge base or folder of files actually holds, or asks for a content inventory, a content audit, "list every page", "what do we have", "what can we cut", "find the duplicates" or a ROT review. Not for deciding the new structure, categories or labels, or for rewriting the content.
---

# Content inventory

An inventory records what exists. An audit judges it and decides what happens to each item. Together they serve one decision: what carries into the next structure, what gets fixed first and what gets cut, and cutting is often the biggest win available. Never propose a structure from the homepage alone.

## Before you start

| You need | If it is missing |
|---|---|
| The source of truth: repo, CMS or database export, content folder, crawl | Say which export or query you need. Deliver an empty `content-inventory.csv` with the header below and the steps to fill it. |
| Who it serves and their top tasks | Ask. If no answer comes, state your assumption at the top of the summary. |
| Why this is being done: rebuild, clean-up, migration | Ask. It decides what "keep" means and whether an audit is needed at all. |
| Analytics, site-search logs, the questions support keeps answering | Carry on, leave `traffic_90d` blank, and say the gaps list rests on the corpus alone. |

## Method

1. **Decide how far to go.** Stop at the inventory unless someone has asked what to fix or cut.

   | | Inventory | Audit |
   |---|---|---|
   | Answers | What exists, where, who owns it | Is it any good, and what happens to it |
   | The work | Extracting and counting facts | Judging against written criteria |
   | Columns | `id` to `traffic_90d` | Adds `status`, `action`, `notes` |
   | Who decides | Nobody: it is a record | Content owners. Claude proposes. |

2. **Build the list from the source of truth.**

   | The content is in | Do this |
   |---|---|
   | A codebase | Read the routes, navigation components (header, footer, app switcher, side rails, tab bars), `sitemap.xml`, CMS schema, and category and tag tables. |
   | A folder of files | Survey the whole corpus, not one item at a time. How items relate only shows in the forest view. |
   | A database or dynamic CMS | Export to plain text, or query titles, types, tags and dates. |
   | PDFs and other binaries | Convert to text first, and say how good the conversion was. |

3. **Say back what the corpus is** and who it seems to serve, and let the user correct you before you build on a wrong reading.
4. **Reconcile two sources where you can**, such as the sitemap against the CMS or server logs. A page found in only one is an orphan or a phantom, and either is a finding.
5. **Census the facts, sample the judgement.** Say which you did. See [references/sampling.md](references/sampling.md) before sampling.

   | Corpus | Facts (`url` to `last_updated`) | Judgement (`status`, `action`) |
   |---|---|---|
   | Small enough to read | Every item | Every item |
   | Too many to read | Every item, by export or query | A stratified sample drawn by the script, plus the top items by traffic read in full |
   | Too many even to export | Survey by type and sample within each type | The same sample |

6. **Gather what only people know:** audiences and their top tasks, where the organisation is heading, analytics, site-search logs, and the questions support keeps answering. Search logs and repeated questions are the cheapest mental-model research there is, and they are where `gap` rows come from.
7. **Count with the script, never by eye.** Use its numbers in everything you write.

   `node "${CLAUDE_SKILL_DIR}/scripts/inventory-stats.mjs" content-inventory.csv`

   Options: `--stale-months 24`, `--overload 40` (section share), `--sections nav.txt` (one section per line, so sections the navigation promises but nothing fills show as empty), `--dates dmy|mdy` for slash dates, `--as-of YYYY-MM-DD`, `--json`. To sample: `--sample 200 --by type --seed 7 --out sample.csv`.

8. **Audit, if asked.** Write the criteria first: accurate, current, needed by a named audience, has an owner. Mark each item `current`, `outdated`, `duplicate` or `trivial`, and add `gap` rows for what should exist and does not. Then propose one action.

   | Action | When | Watch for |
   |---|---|---|
   | `keep` | Accurate, needed, owned | Keeping needs an owner too |
   | `revise` | Right topic, wrong or thin content | Say what has to change in `notes` |
   | `merge into <id>` | Two or more items answer the same need | The survivor is the strongest one, usually with the most traffic and inbound links |
   | `retire` | Redundant, outdated or trivial, and nobody would miss it | Low traffic alone is not enough: legal, safety and rare but critical pages get few visits. Check inbound links. |
   | `create` | A `gap` row | Cite the evidence: a search log, a repeated question |

   Old is not the same as wrong. The stale list says what to read first, not what to retire. An item that fits nowhere still gets a row and an action, with the misfit flagged.

## Deliverable

Two files, templates in [references/templates.md](references/templates.md):

- **`content-inventory.csv`**, one row per item, columns in this order: `id, url, title, type, section, tags, owner, last_updated, traffic_90d, status, action, notes`.
- **`audit-summary.md`**, sections in this order: Corpus, By type, By section, Duplicates, Outdated or trivial, Gaps, Current structure problems, Biggest wins.

For a small job, keep `url, title, type, section`, paste the script's output, and name the three biggest wins. Leave a column out rather than pad it. A longer document is not a more thorough one.

## Check it

- Re-run the script on the final CSV. Every count in the summary matches its output, and section totals add up to the item count.
- Empty sections, sections over 40% of items and sections holding one item are named in the summary. Each is a finding.
- If it is an audit, the script reports no rows without an action, no broken merges and no unrecognised status or action.
- If anything was sampled, the summary gives the sample size, how it was stratified and the seed, and calls quality figures estimates.
- Every assumption about audience or strategy is labelled as one.
- `retire` and `merge` rows are proposals. Before anyone edits or deletes content, it is in version control or backed up.

**What the numbers prove.** They describe the file. They cannot show the file lists everything that exists, that two items with one title really are duplicates, or that an old page is wrong. Those need a person reading the item.

## What Claude can't do here

It can read a whole corpus, extract and count it, and propose. It cannot run research with people, and it does not know the organisation's strategy or politics unless told. It never invents participant counts, success rates, quotes, results, traffic figures, owners or dates. It designs any study and analyses what the user brings back. A blank is a finding, so leave it blank. It says "probably" about how often something is used unless the user supplied the number, and it lists that as an assumption.

## Where this hands off

- The job is wider than an inventory, or it is unclear what comes next: `information-architecture`.
- The items need user groupings: `card-sort`, with this inventory as the source of cards.
- Types and tags are a mess: `taxonomies`. The `type` column feeds `content-models`.
- The current tree is mapped and a new one is needed: `sitemaps`, then `navigation`, and `labeling` for vague section names.
- `merge` and `retire` rows feed `redirect-maps`, under the rules in `url-structure`.
- A draft structure exists and needs validating: `tree-tests`.
- Gaps and search logs show people cannot find what exists: `findability`.
