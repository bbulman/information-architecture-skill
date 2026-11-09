# Card sort templates

Read this when writing the plan or the findings. Use what the job needs, and leave a field out rather than pad it.

## card-sort-plan.md

```
Goal: <discover categories | test our categories | refine our categories>
Type: <open | closed | hybrid>
Participants: <who, how many, how recruited>
Cards: <30 to 60 items; plain titles, no internal codes; list them>
Categories (closed or hybrid only): <the proposed labels>
Tool: <online sorting tool, a shared board, or paper>
Instructions to participants: <the exact words>
Analysis: similarity matrix, clusters, label frequency, outliers
Decision it feeds: <what we will change based on the result>
```

## Results format

The script reads one CSV in long format, one row per card per participant:

```
participant,card,category
P01,Change my delivery address,My account
P01,Track a parcel,Orders
P02,Change my delivery address,Profile
```

Quote any value that contains a comma. Leave `category` blank, or use a pile called "don't know" or "other", for a card someone could not place. Most online tools can export something close to this. If theirs is one column per participant, reshape it first rather than editing numbers by hand.

## card-sort-findings.md

```
Participants completed: <n>, and every warning the script printed
Strong pairs (70% or more together): <card + card, ...>
Clusters at a <cut>% cut: <cluster: cards, agreement %, most common participant labels>
Cards that scattered: <card: groups it landed in>. Needs a cross-link, or the cut is wrong.
Unrecognised labels: <label>. Rename.
Single-card groups: <group>. Merge.
Recommendation: <the structure and labels this supports>
```

For a closed sort, replace Clusters with: per card, the percent in each category; cards with no clear home; categories that are nobody's clear home. For a hybrid, also list the groups people added.
