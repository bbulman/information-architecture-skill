---
name: tree-tests
description: Use when someone needs a tree test planned or its results analysed, to check whether people can find things in a proposed structure, or asks about "tree testing", "reverse card sort", "will people find X in this menu", "validate the sitemap" or "test this nav before we build it". Not for choosing the structure, or for testing screens.
---

# Tree tests

A tree test puts a text-only hierarchy in front of people and asks where they would look for things. It serves one decision: whether this structure is good enough to build, and which placements and labels must change first. It is worth doing before anything is built, while a wrong placement is still cheap to move.

## Before you start

| You need | If it is missing |
|---|---|
| The tree as text, with every label | Ask, or run `sitemaps`. Without a tree, deliver the task briefs only. |
| The problems that prompted the work, and the placements you were unsure of | Ask. The tasks must cover them, or the test proves nothing useful. |
| Who will take it, and how they will be reached | Deliver the plan and the results format, and stop there. |
| Results, when analysing: `results.csv` (`participant,task,path`, optional `seconds`), `answers.csv` (`task,correct_node`) and the tree as tested, `tree.txt` | Say exactly what the three files must contain and deliver the plan. Paths must record every node clicked, in order, including going back. |

## Method

1. **Choose what to test.** Write 8 to 12 tasks: the top tasks, the problems that prompted the work and every placement you were unsure of. Easy tasks only will flatter the tree.
2. **Freeze the tree as text only.** Labels and hierarchy, nothing else: no visual design, search, descriptions or in-page links. Any of those would carry people on their own, and you could no longer tell whether the structure worked. Show the whole tree, because wrong turns are the data.
3. **Write tasks as goals, in the participant's words.** A task that repeats the label tests reading, not the structure. More in [references/study-design.md](references/study-design.md).

   | Weak | Why | Better |
   |---|---|---|
   | "Find the Billing section." | Repeats the label | "Your bank sent a replacement debit card. Where would you update it?" |
   | "Where is pricing?" | No goal, one word to match | "You are deciding whether the team plan is worth it for five people. Where would you look?" |

   `node "${CLAUDE_SKILL_DIR}/scripts/analyze-tree-test.mjs" --check-tasks tasks.csv` (columns `task,text,correct_node`) reports words shared with the answer path and an out-of-range task count.

4. **Fix the correct answers before seeing any data.** Score all or nothing, with no partial credit.

   | Case | Score |
   |---|---|
   | The item will really be reachable from two places | Accept both. One row per answer in `answers.csv`. |
   | It has one home and another node merely seems reasonable | Accept only the home. Clicks on the other node are the finding. |
   | The same label appears in two branches | Give the full path: `Account > Overview`. |
   | You find after the test that a correct node was missed | Add it, say so in the results, and report both numbers. |

5. **Set the targets.**

   | Measure | Target |
   |---|---|
   | Success per task | At least 70%, or 80% for top tasks |
   | Path ratio (every click, backs included, over the shortest path) | At most 1.5 |
   | Time on a simple item | Under 30 seconds |

6. **Set it up.** Use 20 to 50 people, the larger numbers when the decision is expensive. Randomise task order per participant, because people learn the tree as they go and a fixed order always helps the same tasks. Add a practice task. Let people go back and let them give up.
7. **Compare two trees fairly, if there are two.** Same tasks word for word, answers fixed for each tree beforehand, people from the same pool randomly assigned to one tree only. Compare each task with a two-proportion test, or an interval on the difference. Overlapping intervals do not settle it either way: a real difference can overlap. See [references/study-design.md](references/study-design.md).
8. **Analyse with the script, never by eye.** Use its numbers.

   `node "${CLAUDE_SKILL_DIR}/scripts/analyze-tree-test.mjs" results.csv --answers answers.csv --tree tree.txt --top-tasks 1,3`

   Always pass `--tree`, an indented text tree as `sitemaps` writes it. Each click is replayed from parent links. Without it, answers match as path suffixes, and sideways moves and duplicate labels can't be resolved. Options: `--target 70`, `--top-target 80`, `--root Home` (or `none`, if it guesses wrong), `--json`.

9. **Read the results, then change the tree and re-test the failing tasks.** Definitions are in [references/measures.md](references/measures.md).

   | You see | It means | Do this |
   |---|---|---|
   | High success, high directness | The structure works here | Leave it |
   | High success, low directness | Found eventually, after a wrong turn | Fix the label drawing the wrong click |
   | Low success, one dominant wrong destination | People have a different home for it | Move it there, cross-link it, or rename |
   | Low success, destinations scattered | Nobody has a model for it, or the task is unclear | Reread the task first, then the placement |
   | Right first click, wrong end | The top level works, lower labels do not | Fix inside that branch |
   | Wrong first click | A top-level label draws it | Rename that label or split it |
   | Target inside the interval | Cannot say | More people, if the decision is expensive |

## Deliverable

Templates are in [references/templates.md](references/templates.md).

- **`tree-test-plan.md`**, sections in this order: Tree, Participants, Randomisation, Tasks (each with wording, correct answers and target), What success means.
- **`tree-test-results.md`**, sections in this order: Participants and warnings, Results table (Task, n, Success % with interval, Direct %, Median time, Wrong first click, Verdict), Overall, Changes.

For a small job, test only the changed branch and the two or three riskiest placements, inside the whole tree, and report the table and the changes. A longer document is not a more thorough one.

## Check it

- Every number comes from the script. Re-run it and compare.
- Every task in the plan has at least one correct answer and a target, and answers were fixed before results.
- `--check-tasks` passes, or each remaining flag is deliberate.
- The tasks cover the problems that prompted the work and every placement you were unsure of.
- n and the interval appear next to each rate, and the script's warnings are repeated, not dropped.
- Every flagged task (success under target, or path ratio over 1.5) has a proposed change and is marked for re-testing. A slow median prints as a note, and needs a change only if the item is simple.

**What the numbers prove.** They show whether these people could find these items in a text tree. They say nothing about visual design, search or content, and they cannot show this is the best tree. Rates are estimates: at 20 people, 70% has a 95% interval of about 48% to 86%, so a task meeting the target can still fall short in practice. The script labels those "within noise". Directness and path ratio depend on the tool recording every click.

## What Claude can't do here

It cannot run research with people. It never invents participant counts, success rates, quotes or results, and a plan never carries expected scores. It designs the study and analyses what the user brings back.

## Where this hands off

- The job is wider than a test, or it is unclear what comes next: `information-architecture`.
- Tasks show the groupings are wrong and users' models are needed: `card-sort`.
- The tree changes in `sitemaps`, and the menus in `navigation`. Labels that draw wrong clicks go to `labeling`.
- Items needing several ways in may want `taxonomies`, with fields in `content-models`.
- `content-inventory` supplies what must have a home. Anything that moves goes through `url-structure` and `redirect-maps`.
- After launch, or for search problems: `findability`.
