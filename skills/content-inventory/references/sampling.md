# Sampling a large corpus

Read this when there are too many items for anyone to read each one.

## What to sample

Sample the judgement, not the facts. Titles, types, sections and dates can usually be exported for every item, and then counts by type and section are true counts. Only the columns that need someone to read the item (`status`, `action`, `notes`) are limited by reading time.

## How to draw it

1. Choose what to stratify by. Use `type` by default, because types differ most in quality. Use `section` when the decision is about sections.
2. Set the size by how many items someone can really read. Do not pick a number because it sounds statistically respectable.
3. Draw it with the script, using the command in `SKILL.md` with `--sample 200 --by type --seed 7 --out sample.csv`. Claude cannot draw a random sample by picking rows, and neither can a person scanning a list.

   Each group gets at least five items, or all of them if it has fewer. The rest is shared out in proportion to group size. The same seed draws the same rows, so someone else can repeat it.
4. Add the top items by traffic and read them in full. A random draw will usually miss them, and they matter most. Keep them separate from the random sample when reporting rates.

## Do not

- Take the first N rows of an export. Exports are often sorted by date or path.
- Choose "typical" items by hand. That finds what you expected.
- Sample from one section and describe the whole corpus.

## Say what you did

The script prints a sentence to use. Put it in `Corpus` in the audit summary:

> Quality judgements come from a stratified sample of 200 of 8,400 items (by type, seed 7). They are estimates, not counts.

Then keep the two kinds of figure apart:

| Figure | How to write it |
|---|---|
| Counts from a full export | As counts: "6,120 posts". Say which export. |
| Rates from the sample | As estimates, with the sample: "about a third of the sampled guides were outdated (31 of 90)". |
| Anything multiplied up to the whole corpus | Do not, unless asked. If asked, label it a rough estimate and show the sample it came from. |

An export can be incomplete. If items reach the public by a route the export does not cover, say so in `Corpus`.
