# Reading the results

Read this when turning the script's output into findings.

## How the script measures each thing

| Measure | Definition |
|---|---|
| Similarity | For a pair of cards, the percent of participants who handled both and put them in the same group |
| Clusters | Hierarchical clustering with average linkage on the similarity matrix |
| Cut | Two clusters join only if their average similarity is at least the cut. It is a stated choice and changes the answer. |
| Agreement per cluster | The mean similarity of every pair inside the cluster: how consistently people kept these cards together |
| Between clusters | A card whose own cluster pulls less than 15 points harder than the next cluster, where the next cluster is at 30% or more. A single card with a neighbour at 30% or more also counts. |
| No strong partner | A card whose best pair is under 30% |
| Catch-all pile | Blank, or a name such as "other", "misc", "don't know", "unsure", alone or with filler words ("other stuff", "misc items", "not sure where these go"). These count as not grouped with anything, because a leftover pile says nothing about similarity. |
| Closed: clear home | 70% or more of people put the card in one category |
| Closed: leaning | 50% to 69% |
| Closed: no clear home | No category reaches 50%, or the top two are within 10 points, or most left it unsorted |

The 70% and 30% lines are rules of thumb, as are the 15 and 10 point margins. Treat cards close to a line as borderline, and do not argue from a difference of a few points.

## Reading an open sort

- **Pairs.** Above about 70% belong together, below about 30% belong apart. The middle band is where the real design decisions are, so spend the time there.
- **Clusters.** Cut the tree where the clusters are each meaningful and the count fits the navigation, usually 5 to 9 top-level groups. Look at the cuts either side. If small changes in the cut reshuffle everything, the structure is weak.
- **Agreement per group.** Low agreement means the concept is fuzzy, the label is unclear, or two concepts are hiding in one group.
- **Labels.** Collect the names participants gave each cluster. Their most common words are the first candidates for your labels. Your internal terms are not.

## Outliers and what they mean

| What you see | What it means |
|---|---|
| A card sorted into many different groups | It belongs in two places (one home, one cross-link), or the groups are cut the wrong way |
| A card nobody could place | Its title is unclear, or the content does not fit this site |
| A group with one card | Fold it into its neighbour |
| Labels participants did not recognise | Jargon. Rename before launch. |

## Reading a closed or hybrid sort

Open sorts give the users' model, closed sorts test yours, and hybrid sorts start from yours but let people add groups, which shows where yours falls short. In a hybrid, run `--closed --categories categories.txt`, listing what you offered. Groups you did not offer are then reported as additions, never as categories that failed, and a catch-all pile someone added counts as unsorted. An addition that many people made, or that is the top placement for a card, is the finding. Look for cards that move to it and ask what the offered categories were missing.

A category you offered that is nobody's clear home is usually a sign of an unclear name or two overlapping categories. Look at which categories its cards split with.

## What not to claim

- Do not say people "prefer" a structure. They grouped cards; nobody chose between structures.
- Do not report a percentage without its n. The script prints the interval around a 70% share at your n, so use it when a claim depends on a small difference.
- Do not treat clusters as proof of findability. Hand the resulting tree to `tree-tests`.
- Do not fill a thin study with Claude's own groupings. Keep any hypothesis separate and labelled.
