---
name: findability
description: Use when people can't find something, when site search returns nothing or the wrong thing, when someone wants a search log analysed, best bets or synonyms set up, a no-results page designed or findability measured, or when a chatbot is proposed because "nobody can find anything". Not for redrawing the whole page tree, renaming a menu on its own, or running a tree test.
---

# Findability

"People can't find it" is a symptom with four usual causes, and each takes a different fix. This skill serves the decision of what to change first: it separates the cause from the complaint, picks the cheapest fix that addresses it, and sets a measure that shows whether it worked.

## Before you start

| You need | If it is missing |
|---|---|
| What people cannot find, who they are, and where they looked | Ask. If it stays vague, list the candidates and treat them as hypotheses. |
| The site, app or at least its navigation | Ask. Without it you can only write the diagnosis plan. |
| A search log as CSV: `query,count,results`, and `clicks` if available | Say what to export and for what period. Deliver the diagnosis plan, the measures and the empty tables. Never estimate what the log would have said. |
| Analytics, support questions, an inventory | Say which conclusions they would change and mark those as unconfirmed. |

## Method

1. **Write the failure as a task.** "A [who] trying to [goal] looks in [where] for [thing], and [what happens]." One line per complaint, in their words.
2. **Read the log and use its numbers.**

   ```
   node "${CLAUDE_SKILL_DIR}/scripts/search-log.mjs" searches.csv
   ```

   If it says the log is too small to rank, use it as a list of the words people typed and state no rates. Say what period the export covers; the script cannot know.

3. **Diagnose before prescribing.** Work the causes in this order, because each rests on the one before. Several can apply at once. Mark each conclusion confirmed or inferred.

   | Cause | How to confirm it | Usual fix | Skill |
   |---|---|---|---|
   | **Missing:** it does not exist | Look under every name people use. Zero-result queries with no matching content anywhere | Create it, or say plainly it is not offered | content-inventory |
   | **Badly labelled:** it exists under another name | Their word gets zero results or no clicks while the content sits under yours; pogo-sticking | Rename, add synonyms | labeling |
   | **Buried:** well named, no route to it | Count steps from home and hubs; look for orphans, dead ends, deep pagination as the only path, searches started on the section page that should have offered it | Link it where people already look, or move it | navigation, sitemaps |
   | **Search is failing:** it exists, the query matches, the results are wrong | Run the top queries yourself and read the results; results with no clicks, rewording, exits from the results page | Best bets, synonyms, index scope, ranking | Step 5 |

   Many findability problems are cheaper to fix in labels and grouping than in the search engine, so do not start with the engine. Depth alone is not a fault: the three-click rule is a myth, and people click further when each step clearly smells like their goal.

4. **Decide which route should work.** Support browse and search, because people switch between them. Top queries should be reachable in one or two steps from home.

   | The person | Route to strengthen |
   |---|---|
   | Knows the exact name | Search, or an A to Z list |
   | Knows the need but not the name | Browse with clear labels, then facets |
   | Is exploring or comparing | Browse, filters, related links |
   | Is coming back to something | Recent items, saved views, shortcuts |
   | Is mid-task | A contextual link or cue in the place they are working |

5. **Fix search where search is the cause.** Put curated best bets at the top of results for the top queries. Build synonym sets from the script's variant groups, starting with those marked `SYNONYM WOULD ANSWER`, then add what only a person spots, such as acronyms and jargon. Never let a no-results page be a dead end. [references/search-tuning.md](references/search-tuning.md) covers all three, and what to export.
6. **Put cues where the decision happens.** A good cue answers a question the person already has, at the moment they make the choice, in the place they are already looking, quietly and cheaply. The arrow beside a car's fuel gauge showing which side the cap is on is the model. Read [references/routes-and-cues.md](references/routes-and-cues.md) before adding a cue, or a personalised entry point.
7. **If someone proposes an AI chat as the fix, test it first.** Buttons and menus let people act and show what the system can do. An open chat box does the first slowly and the second not at all.

   | Situation | Better answer |
   |---|---|
   | A limited, knowable set of options | Buttons, menus or filters |
   | People do not know what the system can do | Visible structure; an empty box teaches nothing |
   | A repeated task with known steps | A direct path |
   | The content is missing or mislabelled | Fix that first; chat cannot retrieve what is not there |
   | Truly open-ended, phrased differently every time | Chat can earn its place, with structure around it |

8. **Set measures you can actually collect.** Take a baseline before changing anything, one measure per problem. If there is no baseline, say so.

   | Measure | Comes from | Target |
   |---|---|---|
   | Time to find a simple item | A timed task test with people | Under 30 seconds |
   | Task success | A task test or tree test | At least 70%, and 80% for top tasks |
   | Zero-result share of searches | Search log | Below its own baseline |
   | Search exits, rewording | Analytics, if the results page is tracked | Below its own baseline |
   | Support volume on this topic | Help desk, if tagged | Below its own baseline |

   [references/measures.md](references/measures.md) says what each can and cannot show.

## Deliverable

Write `findability-diagnosis.md` unless the user names another file, in this order: Recommendation (two or three sentences); The failures, as tasks; Evidence (source, period, numbers from the script); Diagnosis (thing, cause, evidence, confirmed or inferred); Options (two or three, with what each costs and what it leaves unfixed); Fix list in order, with the skill that takes each; Best bets and synonyms (`query`, `action`, `target`); No-results page, if relevant; Measures (name, baseline, target, source, recheck date); Assumptions and what was not available.

| Job | Hand back |
|---|---|
| One thing nobody can find | Failure, cause, evidence, fix and one measure, in the reply |
| A search log to read | Evidence, best bets and synonyms, and the zero-result gaps |
| "Findability is bad across the site" | The full document |

Put long tables last. A longer document is not a more thorough one.

## Check it

- Every number traces to a script run or a source the user gave you. Rerun the script if the log changed.
- Every fix names the cause it addresses, and every cause has evidence or is marked inferred.
- You ran the top queries by hand if you had access, because the log cannot say whether results were good.
- You checked each proposed synonym means the same thing. The script groups by spelling, so it can pair words that differ in meaning.
- Search logs can hold names and emails typed into the box. The script hides email addresses; do not copy other personal details into the report.

## What Claude can't do here

You cannot watch real people search, time them, or know the organisation's strategy unless told. Never invent usage numbers, search volumes, success rates or quotes; a measure with no data is shown as not yet collected. Propose alternatives with their trade-offs, recommend one and say why; the human owns the decision. What a search product can do (synonyms, pinned results, query logging) varies, so say what you would expect and ask the user to confirm it.

## Where this hands off

| Next need | Skill |
|---|---|
| Finding out what exists | content-inventory |
| The name is wrong | labeling |
| Terms and filters need work | taxonomies |
| The groups do not match how people think | card-sort |
| The route to it is missing | navigation, sitemaps |
| Testing a changed hierarchy | tree-tests |
| Fields needed for facets or previews | content-models |
| A page moves | url-structure, redirect-maps |
| A whole-site restructure, or unsure where to start | information-architecture |
