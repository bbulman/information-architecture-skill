# Governance and drift

Read when setting up the governance loop or auditing a taxonomy already in use.

## What drift is

Taxonomy drift is the slow misalignment between a site's structures and its content: terms multiply, near-duplicates appear, old content keeps old tags, and nobody notices until findability collapses and a redesign "fixes" it for a year.

## What prevents it

- **An owner:** one named person or role who approves changes. A committee is not an owner.
- **A way in for new terms:** propose, check for an existing near-duplicate, approve or merge. Creating a tag on the fly while publishing skips that path. Where the CMS allows it, make taxonomy fields pick from the controlled list rather than accept free text.
- **A term lifecycle:** proposed, active, deprecated, merged into another term. Deprecated terms keep redirecting.
- **A regular drift audit**, monthly or quarterly depending on publishing volume.
- **Re-tagging on every taxonomy change:** apply the new terms to the old content in the same release. This is exactly the large, repetitive, consistent work an AI is suited to, as long as it applies a predefined list rather than inventing terms.

## The proposal path

| Step | Who | Check |
|---|---|---|
| Propose | Anyone publishing | Term, definition, three or more items that need it |
| Screen | Owner | Is there a near-duplicate, plural, synonym or a broader term that would do? Run `apply-check.mjs` with the proposed term included |
| Decide | Owner | Approve, merge into an existing term as a variant, or decline with the reason recorded |
| Apply | Owner or delegate | Add to `terms.csv`, re-tag affected items, log the change with a version number |

The "three or more items" bar is a starting point. Set it from the size of the library and write down what you chose.

## Running the audit

Export the current state to `assignments.csv` and `terms.csv`, then run `scripts/apply-check.mjs` from this skill's folder, as shown in `SKILL.md`, with `--terms` and the facets that are required or single-value.

Search queries with no matching term come from the search log: run the findability skill's log report and compare its zero-result queries with `terms.csv`.

Record the counts so the next audit can compare.

```
Date:
Terms with no items: <list>                      -> deprecate or keep (with reason)
Terms over ~40% of items: <list>                 -> split
Near-duplicate terms: <a ~ b>                    -> merge, keep synonyms
Items with no terms: <count>                     -> tag
Items whose terms don't match the content: <sample, count>  -> re-tag
Sections past their balance limits: <list>
Search queries with no matching term: <top 10>   -> candidate terms
Actions taken:
```

"Items whose terms don't match the content" cannot be counted by a script. Read a sample and say how large it was.

## Audit triggers outside the schedule

Run one early after a merger of content sets, a new content type, a change of owner, a change of CMS, or a spike in zero-result searches.
