# Tree test templates

Read this when writing the plan or the results. Use what the job needs, and leave a field out rather than pad it.

## tree-test-plan.md

The tree is text only: labels and hierarchy, no visual design.

```
Tree: <link or the full text tree>
Participants: <who, how many (20 to 50)>
Randomisation: <task order per participant; branch order fixed or randomised, and why>
Tasks (8 to 12, written as goals, not using the target's label):
  1. "<Your bank sent a replacement debit card. Where would you update it?>"
     Correct answer(s): <Account > Payment methods>
     Target: success >= 80% (top task) | 70% (other); path ratio <= 1.5
  2. ...
Success means: <the participant chose a correct node, first time or after backtracking>
```

Write tasks in the participant's words. A task that repeats the label ("Find the Billing section") tests reading, not the structure.

A plan states targets, never expected results.

## Input files

`results.csv`, one row per participant per task. Paths list every node clicked, in order, including going back. A blank path means the person gave up. `seconds` is optional. Quote any value that contains a comma.

```
participant,task,path,seconds
P01,1,Home > Account > Payment methods,14
P02,1,Home > Shop > Home > Account > Payment methods,38
P03,1,,
```

`answers.csv`, one row per acceptable answer. A value can be a bare end node or a full path, and a full path is safer when a label repeats.

```
task,correct_node
1,Account > Payment methods
2,Shop > Returns
2,Help > Refunds
```

`tree.txt`, the tree exactly as tested, for `--tree`. One node per line, indented under its parent. Box-drawing characters, bullets and the columns `sitemaps` writes are all read. A `(retired)` node and everything under it is left out. A tree with one top node treats it as the root.

```
Home
  Account
    Payment methods
    Support
  Support
```

`tasks.csv`, for `--check-tasks`, one row per acceptable answer:

```
task,text,correct_node
1,Your bank sent a replacement debit card. Where would you update it?,Account > Payment methods
```

## tree-test-results.md

The script prints this table. The verdict column carries its label: clears target, meets target within noise, below target within noise, or clearly below target.

```
Task | n  | Success % (95% interval) | Direct % | Median time | Wrong first click (where, %) | Verdict
1    | 40 | <from the script>        | ...      | ...         | ...                          | ...
Overall: <tasks meeting target, of total>
Warnings: <every warning the script printed>
Changes: <what to change, then re-test the failing tasks>
```

Add a sentence per failing task saying what the wrong clicks suggest, for example: a top-level label draws clicks, so rename or split it.
