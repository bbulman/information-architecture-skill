# Taxonomy design

Depth behind the method in `SKILL.md`. Read the section the job needs.

## Mutually exclusive, collectively exhaustive

Within one dimension, every item should fit exactly one category, and every item should fit some category. Overlap ("Guides" and "How-tos") makes people guess. Gaps produce "Other", which grows until it is the largest category.

For a many-value facet the first half relaxes, because an item may hold several terms, but the terms still need definitions that do not overlap. Two tags that are always applied together are one tag.

## One dimension per facet

Don't mix topic, format and audience in one list ("Billing", "Videos", "For managers"). Split them into facets that combine: Topic by Format by Audience. Each facet stays mutually exclusive; the combination handles the rest.

A way to find the dimensions: take twenty varied items and write down how each differs from its neighbours. The differences that recur are the candidate facets. A difference that matters to nobody filtering or searching is metadata you do not need.

## Several parents or facets?

Letting an item sit under several parents (polyhierarchy) is fine for a handful of genuine cross-cutters, but it does not scale: with many of them nobody knows where anything lives. When many items belong in several places, the hierarchy is cut along the wrong axis and you want facets.

Facets have costs of their own. They need clean metadata on every item, a filter interface, and enough items that combining filters still returns something. A library of thirty items rarely earns three facets.

## Controlled vocabulary or free tags?

A controlled vocabulary (a fixed list with a preferred term and its synonyms) keeps tagging consistent and search predictable. Free user tags capture fresh vocabulary but drift fast. A common middle path: a controlled list for navigation and filtering, free tags as a source of candidate terms reviewed on a schedule.

Record synonyms ("sign in", "signin", "log in") so search finds them all under one preferred term.

**Anatomy of a term**

| Field | What it holds |
|---|---|
| Preferred term | The one label shown to people, in their words |
| Definition | One line: what is in and what is out. A term that cannot be defined this way is two terms or none |
| Variants | Spellings, plurals, acronyms and synonyms that map here |
| Broader or narrower term | Only if the facet is hierarchical |
| Status | Proposed, active, deprecated, merged into another term |

Pick one convention and hold it across the list. A common one is plural for things you can count ("Guides") and singular for subjects ("Security").

## Metadata schema

```
Facet: <name>                 Purpose: <what slicing it enables>   Selection: <one | many>   Owner: <role>
Required: <yes | no>          Applies to: <content types>          Used by: <filter, URL, search, report>
  Term: <preferred label>     Definition: <one line: what's in, what's out>
                              Synonyms: <terms that map here>      Status: <active | deprecated -> merged into X>
  ...
Rules:
  - Every item gets exactly one <facet A> term and one or more <facet B> terms.
  - New terms: proposed by <who>, checked for near-duplicates, approved by <owner>.
  - Version: <n>, change log: <where>
```

Beyond terms, note where each value comes from: entered by the author, chosen by an editor, or derived by the system (dates, type, word count). Anything a system can derive should not be asked of a person.

## Balance

Watch the distribution: a category holding more than about 40% of items probably needs splitting, and one holding a single item probably needs merging. Balance at the top level matters most, because it is what people scan. A facet with two legitimate values will exceed 40% by arithmetic, so `apply-check.mjs` skips the limit there and asks you to read the split.

## Evolution

Taxonomies change. Version them, keep a change log, and when a term is merged or renamed, redirect its pages and re-tag its items in the same change.

## Drafting with an AI

Draft two or three candidate taxonomies, then apply each one to the whole corpus. For each, report items that fit nothing, terms that catch too much, terms that catch nothing, and terms that overlap. Pick or revise based on that evidence, not on how tidy the list looks.

The value is in reading a whole corpus in minutes, proposing several schemes, applying a list consistently to thousands of items, finding near-duplicate terms and spotting items that fit nowhere. Defining the list is a different kind of work from applying it. Applying a predefined list is large, repetitive and consistent. Defining one is a judgment about the domain, the strategy and the users, so present structures as drafts to react to.

## Tagging at scale

- Work from the fixed list. If nothing fits, record a misfit in `note` rather than adding a term mid-run. New terms come from reviewing the misfits together afterwards.
- Tag in batches of the same content type, so similar items get similar treatment.
- Check your own consistency: re-tag a sample from scratch without looking at the first pass, and compare. Disagreements usually point at two definitions that overlap, which is worth fixing in the vocabulary rather than in the items.
- Note what you could not read. An item tagged from its title alone is a weaker assignment than one tagged from its body, and the reader should know which is which.

## Failures to look for first

- An "Other" or "Misc" category.
- Tags created on the fly, with no check for an existing near-duplicate. This is how drift starts.
- Two competing taxonomies: the side rail, the breadcrumbs and the URL each say something different. Choose one source and derive the others from it.
- An item that seems to need two homes. Either give it one home and a cross-link, or the cut is wrong.
- Success rates or participant quotes nobody actually collected.

## Judging a draft

Score your own proposal or someone else's, and quote the evidence for each score.

| Criterion | 1 (weak) | 3 (sound) | 5 (strong) |
|---|---|---|---|
| Grounded in evidence | Built on opinion, no look at what exists | Current state mapped, some evidence, assumptions stated | Current state counted, evidence behind each major choice, every guess labelled as one |
| Taxonomy quality | Overlapping categories, an "Other" bucket, mixed dimensions in one list | Mostly mutually exclusive, dimensions mostly separated | Each facet is one dimension, mutually exclusive and complete, tested by applying it to the whole corpus |
| Scale and governance | Breaks if content doubles, nobody owns it | Some room to grow, an owner named | Survives ten times the content, with term lifecycle, approval path and drift audit defined |
