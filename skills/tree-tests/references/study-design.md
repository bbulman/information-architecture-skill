# Study design

Read this when writing tasks, setting up the study or comparing two trees.

## Writing tasks

- Write a goal someone would actually have, ideally taken from search logs, support questions or interviews.
- Do not use the words of the target label, its parents, or close variants. "Billed" gives away "Billing".
- Give enough situation to make the goal real, and no more. One or two sentences.
- Test one thing per task. If the goal could be answered in two unrelated places, it will not tell you which label worked.
- Do not hint at the level ("In your account settings, where would you...").
- Read each task with the tree hidden. If it only makes sense once you have seen the tree, rewrite it.
- Pilot on one or two people. Someone misreading a task looks exactly like someone failing to find the answer.

`--check-tasks` compares words only and cannot judge meaning. A synonym can give the answer away too, so read the list yourself.

## Scoring several right answers

List every accepted node in `answers.csv` before any results exist. Any one of them counts as full success.

The test for accepting a node: will the real product let someone complete the goal from there? A plausible but incorrect node is not an answer. Clicks on it are the most useful thing the test can show, because they say where people expected the item to live.

Do not give partial credit. A half-point for a nearby node has no agreed meaning and makes results impossible to compare.

An accepted answer added after seeing results is a change to the scoring. Say so, say why, and report the numbers both ways.

## Why text only

Removing layout, colour, descriptions, search and in-page links leaves only labels and grouping to carry people. That is the point: a good result can be credited to the structure, and a bad one cannot be blamed on the visual design.

The cost is that the result is not a forecast of real usage. The live product will have other paths and other problems. Do not add helper text to the tree to rescue a weak label, because the label is what is under test.

## Order

- **Task order:** randomise per participant. People learn the tree as they go, so with a fixed order the later tasks always benefit.
- **Task count:** no one should do more than about 12. With more tasks, show each person a random subset and watch n per task, which falls.
- **Branch order:** the first items in a list get more attention. Randomise the order when the real navigation has no meaningful order. When the order is part of the design, keep it fixed and say so.
- **Practice:** start with one unscored practice task so the first real task is not also the tutorial.

## Comparing two trees fairly

| Keep the same | Why |
|---|---|
| Task wording, word for word | Otherwise you are testing the wording. Check it against both trees for label words. |
| The pool, recruiting route and time period | Different people or a different week can be the whole difference |
| The target n per tree (20 to 50 each) | A smaller group has a wider interval |

- Fix the correct answers for each tree before results.
- Assign each person at random to one tree. Someone who has done tree A has learned the content, so they are no longer a fresh test of tree B. If people must do both, counterbalance the order (half A first, half B first), and look at the first-tree results separately.
- Include the current tree as a baseline when one exists.
- Change only what you want to learn about. If labels and grouping both changed, you cannot say which helped.

To read the comparison, run the script separately on each tree and compare task by task, not on one average. The script has no comparison mode, so test each task's two success counts yourself with a two-proportion test, or an interval on the difference.

```
pooled = (x1 + x2) / (n1 + n2)
z = (x1/n1 - x2/n2) / sqrt(pooled * (1 - pooled) * (1/n1 + 1/n2))
```

| Size of z | What you can say |
|---|---|
| 1.96 or more | The difference is unlikely to be chance (95% level) |
| Under 1.96 | Not settled. Do not call it a win or a tie. |

With fewer than about 5 successes or failures in any group, use Fisher's exact test instead.

Do not judge by whether the two intervals overlap. Each interval describes one tree and they do not add up to a test of the gap. 30 of 50 against 42 of 50 has intervals of 46 to 72 and 71 to 92, which overlap, yet z = 2.67 and p < .01.

With ten or so tasks, one may differ by chance alone. Look for differences that are consistent and that you can explain by the label or placement that changed.

## Size

20 to 50 people. Use the larger numbers when the decision is expensive or when you need to tell a pass from a near miss. At any size, more participants narrow the interval, but they cannot repair a task that gives away its own answer.
