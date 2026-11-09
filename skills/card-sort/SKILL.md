---
name: card-sort
description: Use when someone wants a card sort planned or its results analysed, or asks "how would people group these", "what categories would users expect", "open or closed card sort", "test our categories", or has card sort results in a spreadsheet or CSV. Not for checking whether people can find things in a finished structure, or for tagging content.
---

# Card sort

A card sort shows how people group a set of items and what they call the groups. It serves one decision: which groupings and words the new structure should start from, taken from the people who will use it rather than from the org chart.

## Before you start

| You need | If it is missing |
|---|---|
| The items | Run `content-inventory`, or ask for the list. |
| The decision the sort feeds | Ask. A sort that will change nothing should not run. |
| Who will sort, and how they will be reached | Deliver the plan and the results format, and see step 5. |
| Results, when analysing: a long CSV of `participant,card,category`, one row per card per participant | Say exactly what the CSV must look like and deliver the plan. Never reconstruct results from a description. |

## Method

1. **Pick the method.**

   | Situation | Use | Note |
   |---|---|---|
   | No structure yet, or you doubt the current one | Open sort | People make and name their own groups, which gives their model and their words |
   | You have categories and want to know if items land where you expect | Closed sort | Tests yours. It cannot suggest better ones |
   | Your categories are mostly right and you suspect gaps | Hybrid sort | Starts from yours, and people may add groups. Added groups show where yours fall short |
   | You want to know if people can find things in a hierarchy | `tree-tests` | A sort cannot show this |
   | You need vocabulary more than groupings | Interviews (5 to 10 people) and search logs | Fills in the words a sort will not give you |

2. **Set the size.** Use 15 to 30 people, the larger numbers when the decision is expensive. For a small site, a quick sort with 8 to 12 people is usually enough to see the dominant pattern, in our judgment. Recruit real users, not the team.
3. **Choose the cards.** Usually 30 to 60, fewer when the site is that small. Cover every section, the top tasks and the items you are unsure about, at one level of detail. Leave out items that give the answer away: anything naming a category, numbered series, and navigation furniture such as Home or Log in. Write plain titles in users' words with no internal codes. Two cards sharing a distinctive word get grouped on the word, so reword one. Detail is in [references/running-a-sort.md](references/running-a-sort.md).

   `node "${CLAUDE_SKILL_DIR}/scripts/analyze-sort.mjs" --check-cards cards.txt --categories categories.txt`

4. **Set it up.** Randomise card order per participant so late cards are not always the tired ones. Let people leave a card unsorted, because a forced placement is a false one. Write the exact instructions, and pilot them on one or two people.
5. **No participants yet?** Stay useful and say what each option can claim.

   | Situation | Do this | What it can claim |
   |---|---|---|
   | People are coming later | Deliver the plan, card list and CSV format, then stop | Nothing yet |
   | Only a few people available | Run with them as a pilot | The cards and instructions work. No pattern. |
   | A first draft is needed now | Claude groups the cards as a labelled hypothesis, to seed a closed sort or a tree test | A hypothesis to test, never user evidence. It never goes in the results file. |
   | Search logs or support questions exist | Mine them for vocabulary | The words people use, not how they group things |

6. **Analyse with the script, never by eye.** Use its numbers.

   `node "${CLAUDE_SKILL_DIR}/scripts/analyze-sort.mjs" results.csv --cut 50` for an open sort, or `--closed --categories categories.txt` for a closed or hybrid sort, listing what you offered so groups people added are reported as additions. Add `--json` for everything.

   The output lists the cluster count at each cut. Choose a cut where each cluster means something and the count fits the navigation, usually 5 to 9 top-level groups, and state it.

7. **Read the results.** Full detail is in [references/reading-results.md](references/reading-results.md).

   | The output shows | It means | Do this |
   |---|---|---|
   | Pair at 70% or more | By rule of thumb, they belong together | Keep them together unless tasks say otherwise |
   | Pair at 30% or less | By rule of thumb, they belong apart | Keep them apart unless tasks say otherwise |
   | Pair in the middle band | The real design decisions | Decide using tasks, not the sort alone |
   | Low agreement in a cluster | Fuzzy concept, unclear label, or two concepts in one | Split or rename |
   | Card between clusters, or scattered | It needs two ways in, or the groups are cut wrong | One home plus a cross-link, or recut |
   | Parked in a catch-all, no strong partner | Unclear title, or it does not belong here | Reword or cut |
   | Single-card cluster | Not a group | Fold into its neighbour |
   | Common category names | Users' words | First candidates for labels. Internal terms are not. |
   | Closed: no clear home | Your categories do not fit it | Add, split or redefine a category |
   | Closed: category you offered that is nobody's clear home | The category is not working | Rename or remove it |
   | Hybrid: groups people added | Where yours fall short | Consider one many people made, or that tops a card |

## Deliverable

Templates are in [references/templates.md](references/templates.md).

- **`card-sort-plan.md`**, before the study, sections in this order: Goal, Type, Participants, Cards, Categories (closed or hybrid only), Tool, Instructions, Analysis, Decision it feeds.
- **`card-sort-findings.md`**, after it, sections in this order: Participants completed, Strong pairs, Clusters (cards, agreement, common names), Cards that scattered, Unrecognised labels, Single-card groups, Recommendation.

For a small job, give the card list and instructions as the plan, and the clusters, the warnings and one recommendation as the findings. A longer document is not a more thorough one.

## Check it

- Every number in the findings comes from the script. Re-run it and compare.
- The participant count and the cut are stated, and the script's warnings are repeated, not dropped.
- Cards across all clusters add up to the cards in the input.
- The card list passed `--check-cards`, or each remaining flag is deliberate.
- Recommended labels are the participants' words, or the difference is explained.
- Anything that did not come from real participants is labelled as such.

**What the numbers prove.** They show how these people grouped these cards. They do not show that anyone can find anything in a structure built from them; that takes a tree test. Clustering returns a tree even from noise, and the groups depend on the cut. Percentages are rough at these sizes: at 15 people, a pair at 70% could really be anywhere from about 45% to 87%. The script prints that interval for your n.

## What Claude can't do here

It cannot run research with people. It never invents participant counts, success rates, quotes or results, and never adds its own groupings to a results file. It designs the study and analyses what the user brings back.

## Where this hands off

- The job is wider than a sort, or it is unclear what comes next: `information-architecture`.
- No list of items exists yet: `content-inventory`.
- Clusters become a tree in `sitemaps`, and menus in `navigation`.
- Participants' names feed `labeling`. Items that need slicing several ways go to `taxonomies`.
- The new tree needs validating: `tree-tests`.
- Clusters become templates in `content-models`. Anything that moves goes through `url-structure` and `redirect-maps`.
- The problem turns out to be search or wayfinding: `findability`.
