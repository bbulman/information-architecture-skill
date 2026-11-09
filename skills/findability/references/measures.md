# Measures

Read when setting the measures, or when someone asks how they will know it worked.

Pick the one or two that speak to the failure at hand. A measure nobody can collect is a wish, so check the source exists before naming it.

| Measure | How it is collected | What it shows | What it cannot show |
|---|---|---|---|
| Time to find | People given realistic tasks and timed | How long a known item takes | Whether they would have looked at all |
| Task success | The same test, or a tree test of the hierarchy | Whether people get there | Why they failed, without watching or asking |
| Path ratio | A tree test | Whether they went straight there: every click over the shortest path, at most 1.5 | Anything about the visual design |
| Zero-result share | `search-log.mjs` | How often vocabulary or content is missing | Whether results that did appear were any good |
| Results with no clicks | `search-log.mjs`, if clicks are logged | Which results look wrong | Answers read on the results page without a click |
| Search exits | Analytics on the results page | Searches that ended in leaving | Whether they left satisfied |
| Rewording | Analytics or session data | Queries that did not work first time | Why |
| Searches from section pages | Analytics, if the page is recorded with the search | Where navigation falls short | What they would have preferred |
| Support volume on the topic | Help desk tags | Whether the problem still costs people time | Volume changes for unrelated reasons |

Default targets: tree-test success of at least 70% per task and 80% for top tasks; path ratio of at most 1.5; simple items found in under 30 seconds. Treat these as defaults, and write down any you change. For log and analytics measures there is no general target worth quoting, so compare with the site's own baseline.

## Plan

```
Failure: <the task line>
Measure: <one or two>
Source: <where the number comes from, and who pulls it>
Baseline: <number, period> or "not yet collected"
Target: <number>, because <reason>
Recheck: <date, long enough for the change to show>
Changes in the same period that could also move it: <list>
```

## Reading a change

A falling zero-result share can mean better content, or fewer people searching because they gave up. Read one number against another: search volume alongside zero-result share, and support volume alongside both. If several changes shipped together, say the result cannot be pinned on any one of them.

Fill a number only from a source someone actually has. Where there is none, write "not yet collected".
