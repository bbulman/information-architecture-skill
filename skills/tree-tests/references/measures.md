# What the script measures

Read this when interpreting the output or explaining a number to someone.

| Measure | Definition |
|---|---|
| n | Participants with a row for that task. A repeat row is ignored. |
| Success | The participant's last click landed on an accepted answer. With `--tree`, each click is replayed against the tree from parent links, so a repeated label or a sideways move lands on the right node. Without it, an answer must match the end of the route as a path suffix. A blank path counts as a failure. |
| 95% interval | Adjusted Wald: add 1.92 successes and 3.84 trials, then apply the normal formula, clamped to 0 to 100. It behaves better than the plain formula at small sample sizes. |
| Directness | Participants who reached a correct answer with no backtracking, as a share of everyone on the task |
| Backtracking | With `--tree`, any click on something other than a child of the current node: up, sideways or across. Without it, returning to a node already on the route, returning to the root, or jumping to another top-level node. |
| Path ratio | Every click, including backs and returns to the root, divided by the depth of the node reached, median across successes. 1.0 means straight there. Target: at most 1.5. |
| First clicks | Share of people who clicked anything, per top-level node |
| Correct first click | First click was on a branch leading to an accepted answer. Branches come from full-path answers and from the routes of successful participants, so without `--tree` it reads "unknown" when nobody succeeded and the answer is a bare node. |
| Most common wrong destination | The most frequent final route among failures. "(no answer)" means they gave up. |
| Median time | From the optional `seconds` column. Noted at 30 seconds or more. It is not a flag, because the script cannot tell which items are simple. |

## Verdicts

| Verdict | Meaning |
|---|---|
| Clears target | The whole interval is at or above the target |
| Meets target, within noise | The rate reaches the target, but the interval reaches below it |
| Below target, within noise | The rate misses the target, but the interval reaches it. Flagged. |
| Clearly below target | The whole interval is below the target. Flagged. |

A task is flagged when success is under its target or its path ratio is over 1.5, so a task can clear the target and still be flagged for its path ratio. Every flagged task needs a proposed change.

The script warns when n is under 20 or an interval is wider than 40 points.

## Limits of the data

- Pass `--tree`. Without it, backtracking is found from the path itself: a label that repeats on the same route, or that exists both at the top level and deeper, can register as a backtrack that did not happen, a sideways move can fail a full-path answer, and a bare answer reached sideways reads as direct. The script warns on every run without it.
- With `--tree`, a click on a label not next to where the participant was, and repeated in several branches, is assumed to be the first in tree order. The script warns when that happens.
- If a tool exports only final paths, nothing shows as backtracking. The script warns when no path in the file backtracks. Do not quote directness or path ratio from such a file.
- The target 70% is a line someone chose, not a law. A task at 68% and a task at 72% are not meaningfully different at these sizes.
- The "overall" figure counts tasks meeting their target. It is a summary of these tasks only, and it depends on which tasks were chosen.
