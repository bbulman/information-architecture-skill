# information-architecture

Twelve Claude Code skills for working out how content and features get grouped, labelled and found, for sites, apps, docs and content libraries.

They're part of [UX-OS](https://bbulman.github.io/ux-os/), and the first set in it to go through full testing.

## Install

You need Claude Code, and Node for the checking scripts.

```bash
git clone https://github.com/bbulman/information-architecture-skill.git
cd information-architecture-skill
./install.sh
```

Open a new Claude Code session and describe the problem. "Our sidebar has 18 items and nobody can find the export button" is enough. You can also call one by name, such as `/tree-tests`.

If you already have a skill with any of these names, the installer moves it to `~/.claude/backups/` rather than overwriting it. Some of the names are common, `navigation` for one, so read what it says it moved.

The first version, one skill that did all of this, is at the [`single-skill`](https://github.com/bbulman/information-architecture-skill/tree/single-skill) tag.

## The skills

| Skill | What it's for |
| --- | --- |
| `information-architecture` | The front door. Scopes the job, holds the rules across it and sends you to the others |
| `content-inventory` | What a site or corpus actually holds, and what to keep, revise, merge or retire |
| `card-sort` | Planning open, closed and hybrid sorts, and analysing the results |
| `taxonomies` | Categories, tags, facets and controlled vocabularies, tested on the real content |
| `sitemaps` | Deciding the structure: shape, depth, template types and one home for every item |
| `navigation` | Menus, sidebars, footers, breadcrumbs and tab bars |
| `labeling` | Names for sections and menus, in the words people actually use |
| `content-models` | Content types, fields and relations for each template |
| `url-structure` | URL rules a platform can enforce, and an audit of what exists |
| `redirect-maps` | Old-to-new URL maps for migrations, checked for chains, loops and coverage |
| `tree-tests` | Planning tree tests and analysing the results |
| `findability` | Working out why people can't find things, including search logs |

Between them they work out which job you've got and map what exists before proposing anything. They give you two or three structures with their trade-offs and recommend one. Then they check that the proposal agrees with itself and write the tree test that would prove it.

Nine of them run a small Node script with no dependencies, so the counting and checking is done by code rather than by eye: card sort clusters, tree test confidence intervals, redirect chains, near-duplicate tags, search logs. Each script has a `--self-test`.

They won't invent research data. They can't run a card sort with real people, and they say so.

## What happened when I tested it

I ran three realistic jobs with the skill and with no skill at all: a messy blog, an overloaded app sidebar and a WordPress migration. The first round scored 24 out of 25. Claude with no skill scored 23.

One point. Only 3 of the 25 checks separated the two. The other 22 passed either way, because Claude is already decent at the basics of this.

The one check the skill failed was its own doing. It left a post with no category after being asked to place them all. So I fixed that and tightened three other things: check the proposal agrees with itself, scale the write-up to the job, don't guess at what a platform can do. I also added four sharper checks: one home for exporting and for inviting, a correct answer for every tree-test task, a proposal that agrees with itself, and a redirect file that implements every row of the plan.

| | With the skill | No skill |
| --- | --- | --- |
| Round 1, 25 checks | 24 | 23 |
| Round 2, 29 checks | 29 | 22 |
| Round 3, same 29 checks | 28 | 19 |
| Round 3, average run time | 500s | 336s |
| Round 3, average tokens | 209,740 | 176,164 |

That's about 49% longer and about 19% more tokens. In round two it was 73% and 26%. Better answers cost something, so decide when you want to pay.

Without the skill, two failures came up in all three rounds: no alternatives weighed before recommending, and no template types or content model. In rounds two and three it also stated usage as fact and wrote totals or rules that disagreed with its own table. The checks I'd added caught it both times as well: no single home for exporting or inviting, and tree-test tasks with no correct answers.

### Discount this accordingly

Three cases, one run of each per round, on `claude-opus-5-5`. I wrote the skill and the checks, and I added four of those checks after seeing round one. The no-skill score moved from 22 to 19 between rounds two and three with nothing about it changed, so a gap of a few checks is noise.

The graders still had doubts after round two. A claim that every task was one or two clicks was wrong for two tasks, a usage line said "visited occasionally" with nothing behind it, and one blog run proposed almost no topic tags. I made three small edits in response: trace path claims through the tree, mark guessed frequencies as guesses, and deliver every artifact the user asked for.

Round three tested the skill exactly as it's published here, with those edits in. None of the three doubts came back. That's one run each, so it's encouraging and it isn't proof.

The one check the skill failed in round three, the no-skill run failed too. Two old URLs need a WordPress lookup before anyone can say where they go, and both runs said so. The grader read "a destination or a 410" literally. Round two's grader accepted almost the same answer. Count a named lookup as a destination and round three is 29 to 20.

### Splitting it into twelve

Those three rounds tested one skill. On 9 November I split it into a front door and eleven focused skills and added the scripts. Then I ran the same three cases on the old skill and on the split, the same day, grading the file each run produced rather than its transcript, because a judge reading a long transcript can lose the part that matters.

| | Checks passed, of 29 |
| --- | --- |
| The single skill | 25 |
| The split, first build | 26 |
| The split, after a separate review and fixes | 28 |

One run each, so three checks is encouraging and it isn't proof. The grading changed, so these numbers don't compare with the rounds above, and I didn't rerun the no-skill baseline.

The check it still fails is the same kind of literal reading as before. Nineteen URLs should stay exactly where they are, the plan lists them as staying, and the grader wants a destination.

These three cases are about taxonomies, navigation, URLs and redirects. The other skills haven't had cases of their own. The scripts pass their self-tests, but so far only on made-up data, so a real export from a card sort or tree test tool may need a small fix.

## Does Claude pick it?

A skill Claude never opens scores zero. For the single skill I ran 20 requests, 10 it should win and 10 near-misses, with a rival of the same name available. Claude chose it on 9 of the 10, and on none of the near-misses.

The requests are in [`results/trigger-eval.json`](results/trigger-eval.json). I kept the totals and not the per-request results, so you can rerun that test but you can't audit mine.

For the split I ran one typical request per skill with about 500 others installed. Ten of the twelve got the right skill. `sitemaps` lost to another skill I had installed called site-architecture, and `findability` lost to a debugging skill on a request that read like a bug report. Typing the name always works.

## Check my work

- [`skills/information-architecture/evals/`](skills/information-architecture/evals/) has the three cases: the prompt, any input files and one grader file per check.
- [`results/round-1/`](results/round-1/), [`results/round-2/`](results/round-2/) and [`results/round-3/`](results/round-3/) have, for each case with and without the skill, what Claude wrote (`outputs/`), how every check was graded (`grading.json`, with the grader's judgment calls in `eval_feedback`) and the time and tokens (`timing.json`).
- `benchmark.json` in each round has the totals and the notes.
- [`results/split/`](results/split/) has the check-by-check results for the three runs of the split. It doesn't have what Claude wrote.

The cases ran through Anthropic's skill-creator skill. By round three the installed skill was visible to Claude, so I audited every transcript: the no-skill runs never used a skill or opened `SKILL.md` or its references, and read only each case's input files. The transcripts aren't in this repo.

## What's in each skill

`SKILL.md` holds the method. `references/` holds what Claude reads only when the job needs it, and `scripts/` holds the checks.

## Licence

MIT, for the skills and the tests. See [`LICENSE`](LICENSE) and [`NOTICE.md`](NOTICE.md).

Find the menu you've been meaning to fix. Run it with this and without it. If you get 24 to 23, open an issue. I want to know.
