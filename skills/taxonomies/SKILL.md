---
name: taxonomies
description: Use when someone needs categories, tags, facets, a metadata schema or a controlled vocabulary designed, cleaned up or applied to content, when tags have drifted into a mess, or when they say "what categories should we have", "tag all these posts", "merge these duplicate tags" or "our tags are out of control". Not for the page tree, the menu structure or the wording of navigation labels.
---

# Taxonomies

A taxonomy decides how content is classified so it can be browsed, filtered, searched and kept in order. This skill serves one decision: which dimensions exist, which terms each one holds, and how a new term gets in without the list rotting. The fastest test of a draft is to tag the real corpus with it and count what does not fit, so the method is built around that.

## Before you start

| You need | If it is missing |
|---|---|
| The content, or an export of titles, types and current tags | Say which export you need. Deliver the facet plan and an empty `terms.csv`, so the team can tag a sample and run the check themselves. |
| Who uses it and what they are trying to find | Ask. If no answer comes, put your assumption at the top. A generic brief produces a generic taxonomy. |
| Where the organisation is heading and what content is coming | Ask. Otherwise design for ten times the content and list that as an assumption. |
| The users' words: search logs, support questions, card-sort labels | Build from the corpus, say the vocabulary is the authors' and not the readers', and recommend a card sort. |

Survey the whole corpus, not one item at a time: organising needs the forest view. Export a database or CMS to plain text first. Convert PDFs and say how good the conversion was. For a very large set, survey by type, sample within each type and say what you sampled, then still apply the draft to every item.

## Method

1. **Say back what the corpus is.** Count by type, name who it seems to serve, and let the user correct you before you build on a wrong reading. If tags exist, write them to `assignments.csv` and run the check below. That is the baseline.
2. **Separate the dimensions.** List every way the items differ. One facet is one dimension: a list holding "Tutorials", "Videos" and "For managers" is three facets. Test: you can finish "every item has a ___" with one noun. Within a facet, terms are mutually exclusive and together cover everything.
3. **Choose a structure for each dimension.**

   | What you see | Choose | Why |
   |---|---|---|
   | Each item has one obvious place | Flat list or hierarchy | Cheapest to browse and to keep |
   | A handful of genuine cross-cutters | Hierarchy, one home each, cross-links | Several parents works for a few and collapses at scale |
   | Many items belong in several places | Facets | The hierarchy is cut along the wrong axis |
   | People slice by independent dimensions, or a category will outgrow one list | Facets | The combination does the work |
   | Readers need one place to browse and loose links across it | One single-value category plus a many-value tag facet | Categories and tags are two facets with different rules, and a term never sits in both |

4. **Set each facet's rules:** one value or many, required or optional, what it applies to, who owns it, and what uses it. A field nothing filters, searches or reports on is a field to cut.
5. **Decide how terms are controlled.**

   | Option | Use for | Cost |
   |---|---|---|
   | Controlled vocabulary: a preferred term and its variants | Navigation, filters, anything a URL or report depends on | Slower to add to, needs an owner |
   | Free tags | Candidate terms only, reviewed on a schedule | Drift fast |
   | Both | Controlled list in front, free tags feeding the review queue | Someone has to run the queue |

6. **Draft two or three schemes** (for example by task, by audience, by content type). Give every term a preferred label in the users' words, one line on what is in and what is out, and its variants so search finds them all.
7. **Apply each draft to every item.** Use the fixed list and invent nothing while tagging. If you were asked where things go, every item gets a home: give a misfit its least-bad term, say why in `note`, and argue for moving, merging or retiring it separately. Then run the check and use its numbers, not your estimate:

   ```
   node "${CLAUDE_SKILL_DIR}/scripts/apply-check.mjs" assignments.csv --terms terms.csv --required topic,format --single topic
   ```

   `--max-share` (default 40) and `--min-items` (default 2) set the balance limits.
8. **Read the numbers and revise.** Pick between drafts on this evidence, not on how tidy the list looks. Balance matters most at the top level, because that is what people scan.

   | Finding | Usually means | Do |
   |---|---|---|
   | No term in a required facet | A vocabulary gap, or content that does not belong | Add a term only if several items need it |
   | Term over 40% of a facet | Too broad | Split it |
   | Term with one item | Too narrow | Merge it and keep the old word as a variant |
   | Vocabulary term catching nothing | Speculative | Cut it, or keep it and name the content that is coming |
   | Used term not in the vocabulary | Drift | Map it to a preferred term, or propose it properly |
   | Near-duplicates | One concept twice | Merge, keep the loser as a variant |
   | "Other" or "Misc" | A gap that grows until it is the largest category | Retire it and give each item a real home |
   | Several terms in a single-value facet | Overlapping definitions | Tighten them, or make the facet many-value |
   | Same term in two facets | Mixed dimensions | Decide which dimension it belongs to |

9. **Plan the change.** List old term, new term and items affected. Re-tagging old content is part of the change and ships in the same release, or old content stays on terms that no longer exist. Protect the content first: version control or a backup before editing metadata in place.
10. **Set governance.** A named owner, a proposal path (propose, check for a near-duplicate, approve or merge), a term lifecycle (proposed, active, deprecated, merged) and a drift audit monthly or quarterly depending on publishing volume. Creating a tag on the fly while publishing skips that path, so block it where the CMS allows.

Read [references/taxonomy-design.md](references/taxonomy-design.md) when drafting schemes, writing the schema or tagging at scale. Read [references/governance.md](references/governance.md) when setting the governance loop or auditing an existing taxonomy.

## Deliverable

Write these unless the user names other files. If they asked for categories and tags, give both, even if you would keep the tag list short, and make any case against one of them separately.

- `taxonomy.md`, in this order: Recommendation (two or three sentences); What exists now (counts and baseline check); Options (each with who it serves, what it costs, where it strains and its check numbers); Schema (per facet: name, purpose, one or many, required, applies to, owner); Rules for applying; Migration (old term, new term, items affected, redirect needed); Governance; Assumptions and open questions; How to test it with people.
- `terms.csv`: `facet,term,definition,synonyms,status`, with synonyms separated by semicolons.
- `assignments.csv`: `item,facet,term,note`, one row per item, facet and term.

| Job | Hand back |
|---|---|
| Clean up a messy tag list | A merge table (old, new, items), the rule for new tags, an owner, and the check before and after |
| One filter on a small library | A term table with definitions, in the reply |
| A full taxonomy | All three files |

Put long tables last. A longer document is not a more thorough one.

## Check it

Run the script on the final files and quote that run. Then verify:

- The item count it reports equals the size of the corpus. It only sees items in the file.
- Every rule you state is proved by a flag. "Exactly one category" means `--required category --single category` reports zero.
- No "Other" or "Misc" term remains, and the totals in `taxonomy.md` match the latest distribution.
- Every merged term appears in the migration table with its re-tagging.
- You read a sample of assignments against the content. The script counts; it cannot tell whether a term suits an item.

## What Claude can't do here

You cannot run a card sort or tree test with real people, and you cannot know the organisation's strategy, politics or audience unless told. Never invent usage numbers, search volumes, participant counts or quotes, including vague frequency stated as fact ("used constantly"): say "probably" and list it as an assumption. Propose alternatives with their trade-offs, recommend one and say why; defining a taxonomy is a judgment about the domain and the users, and the human owns it. What a CMS can do (many-value fields, merging terms, synonyms) varies, so say what you would expect and ask the user to confirm it.

## Where this hands off

| Next need | Skill |
|---|---|
| A list of what exists, with owners and dates | content-inventory |
| The users' own groupings before you draft | card-sort |
| The words shown on screen | labeling |
| Facets becoming fields on a template | content-models |
| Terms becoming pages or menus | sitemaps, navigation |
| Merged terms changing addresses | url-structure, redirect-maps |
| Testing a hierarchy with people | tree-tests |
| People still cannot find things | findability |
| A whole-site restructure, or unsure where to start | information-architecture |
