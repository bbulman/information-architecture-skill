# information-architecture

A Claude Code skill for working out how content and features get grouped, labelled and found. Sitemaps, navigation, taxonomies, URL rules, content models, tree tests and redirect plans, for sites, apps, docs and content libraries.

It's part of [UX-OS](https://bbulman.github.io/ux-os/), and the first skill in it to go through full testing.

## Install

You need Claude Code.

```bash
git clone https://github.com/bbulman/information-architecture-skill.git
cd information-architecture-skill
./install.sh
```

Open a new Claude Code session and describe the problem. "Our sidebar has 18 items and nobody can find the export button" is enough. You can also call it by name with `/information-architecture`.

If you already have a skill with this name, the installer moves it to `~/.claude/backups/` rather than overwriting it.

## What it does

It works out which job you've got and maps what exists before proposing anything. It gives you two or three structures with their trade-offs and recommends one. Then it checks that the proposal agrees with itself and writes the tree test that would prove it.

It won't invent research data. It can't run a card sort with real people, and it says so.

## What happened when I tested it

I ran three realistic jobs with the skill and with no skill at all: a messy blog, an overloaded app sidebar and a WordPress migration. The first round scored 24 out of 25. Claude with no skill scored 23.

One point. Only 3 of the 25 checks separated the two. The other 22 passed either way, because Claude is already decent at the basics of this.

The one check the skill failed was its own doing. It left a post with no category after being asked to place them all. So I fixed that and tightened three other things: check the proposal agrees with itself, scale the write-up to the job, don't guess at what a platform can do. I also added four sharper checks: one home for exporting and for inviting, a correct answer for every tree-test task, a proposal that agrees with itself, and a redirect file that implements every row of the plan.

| | With the skill | No skill |
| --- | --- | --- |
| Round 1, 25 checks | 24 | 23 |
| Round 2, 29 checks | 29 | 22 |
| Round 2, average run time | 658s | 381s |
| Round 2, average tokens | 229,073 | 181,441 |

That's about 73% longer and about 26% more tokens. Better answers cost something, so decide when you want to pay.

Without the skill, two failures came up in both rounds: no alternatives weighed before recommending, and no template types or content model. In round two it also skipped a test with readers, stated usage as fact and wrote totals that disagreed with its own table. Two of the checks I'd added caught it as well: no single home for exporting or inviting, and tree-test tasks with no correct answers.

### Discount this accordingly

Three cases, one run of each, on `claude-opus-5-5`. I wrote the skill and the checks, and I added four of those checks after seeing round one. A single-check difference at this size is noise.

The graders still had doubts after round two. A claim that every task was one or two clicks was wrong for two tasks, a usage line said "visited occasionally" with nothing behind it, and one blog run proposed almost no topic tags. I made three small edits in response: trace path claims through the tree, mark guessed frequencies as guesses, and deliver every artifact the user asked for.

I haven't rerun the tests since those edits, which breaks my own rule. The published scores are from the version just before them.

## Does Claude pick it?

A skill Claude never opens scores zero. I ran 20 requests, 10 it should win and 10 near-misses, with a rival of the same name available. Claude chose it on 9 of the 10, and on none of the near-misses.

The requests are in [`results/trigger-eval.json`](results/trigger-eval.json). I kept the totals and not the per-request results, so you can rerun that test but you can't audit mine.

## Check my work

- [`skills/information-architecture/evals/`](skills/information-architecture/evals/) has the three cases: the prompt, any input files and one grader file per check.
- [`results/round-1/`](results/round-1/) and [`results/round-2/`](results/round-2/) have, for each case with and without the skill, what Claude wrote (`outputs/`), how every check was graded (`grading.json`) and the time and tokens (`timing.json`).
- `benchmark.json` in each round has the totals and the notes.

The cases ran through Anthropic's skill-creator skill.

## What's in the skill

`SKILL.md` holds the method. `references/` holds what Claude reads only when the job needs it: `methodology.md`, `templates.md` and `rubric.md`.

## Where it came from

Two public skills shared this name and couldn't be installed together, so I combined their ideas into one and rewrote it. Credit goes to [lyndonkl/claude](https://github.com/lyndonkl/claude), [RavenClaude](https://github.com/mcorbett51090/RavenClaude) and [Jorge Arango's essays](https://jarango.com). [`NOTICE.md`](NOTICE.md) has the details.

## Licence

MIT, for the skill and the tests. See [`LICENSE`](LICENSE) and [`NOTICE.md`](NOTICE.md).

Find the menu you've been meaning to fix. Run it with this and without it. If you get 24 to 23, open an issue. I want to know.
