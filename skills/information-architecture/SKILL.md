---
name: information-architecture
description: Use when someone wants to organize, restructure or review how a site, app, docs set, knowledge base or content library is grouped and found, and the job spans several pieces or it isn't yet clear which piece is needed, even if they never say "information architecture" or "IA". Not for a job that is clearly one piece, such as only a tree test or only a redirect map, and not for visual design.
---

# Information architecture

Information architecture is how a system's content and functions are grouped, labelled and connected so people can find what they need and understand what they can do. Every decision serves one test: does this structure help the person in front of it make a good choice, quickly, without being told how?

It is upstream of everything else. A wrong structure taxes content, which has no home, design, which has to invent extra navigation, search, where URLs churn, and the CMS, which becomes a pile of workarounds.

This skill scopes the job and holds the rules that apply across it. The work itself lives in the skills below.

## 1. Choose the work

Most requests need part of the toolkit, not all of it. Name what you will produce, so the person knows what they are getting.

| The job | Run these, in order |
|---|---|
| Reorganize existing content | `content-inventory`, `card-sort` or `taxonomies`, `sitemaps`, `url-structure` if addresses change, `tree-tests`, `redirect-maps` |
| New site, app area or section | `sitemaps`, `navigation`, `url-structure`, `content-models` |
| Rethink a menu, nav or app switcher | `navigation`, `labeling`, `tree-tests` |
| Tags and categories | `taxonomies` |
| Names that aren't working | `labeling` |
| "People can't find X" | `findability`, then whichever skill the diagnosis points at |
| Moving or rebuilding a site | `sitemaps`, `navigation`, `url-structure`, `content-models`, `redirect-maps` |
| Checking a structure before building it | `tree-tests` |
| An AI feature or product | Section 5 here, then `findability` |

A sitemap alone is decoration. For a site build, the full set is a sitemap, URL rules, a navigation spec, a content model and, for any rebuild, a redirect map. Without the other four, nobody can build from it.

If a sibling skill isn't available, do that part here using the rules below, and say so.

## 2. Frame it, then map what exists

Before any route, settle who uses this and what they are trying to do, how much content there is now and in two years, what the business wants from it, and how success will be measured. Record today's numbers for those measures before anything changes, or there is nothing to compare against afterward.

Then build the current picture. Never redesign from the homepage alone.

- **In a codebase:** read the routes, navigation components, `sitemap.xml`, the CMS schema and any category or tag tables. Count items per section. Empty and overloaded sections are findings in themselves.
- **In a folder of content:** survey the whole corpus, not one item at a time. Say back what it is and who it seems to serve, and let the person correct you before you build on a wrong reading.
- **Content in a database or CMS:** export titles, types, tags and dates first.
- **Very large sets:** survey by type and sample within each type, and say what you sampled, so nobody mistakes a sample for a census.

Also ask for what only people know: the audiences and their top tasks, where the organization is heading, analytics, site-search logs, and the questions support keeps answering.

## 3. The rules that hold across the work

- **Structure by what people are trying to do, never the org chart.** "For developers, APIs" beats "About us, engineering, APIs".
- **Give each item one canonical home.** It can be linked from elsewhere, but it lives in one place.
- **Keep scent over click counts.** People click further when each step clearly smells like their goal. The three-click rule is a myth. Dead ends and vague labels are the real cost.
- **Design for ten times the content.** If a category will grow, design for that now.
- **Offer several ways in.** Browse, search, filters, related links, breadcrumbs.
- **Put cues where the decision happens.** A good cue answers a question the person already has, at the moment they choose, in the place they are already looking, quietly and cheaply.
- **Design for the next larger context.** A page sits in a section, a section in a site, a site in a business.

## 4. Working as an AI on IA

**What you do well:** read a whole corpus in minutes, propose alternative schemes, apply a taxonomy consistently to thousands of items, find near-duplicate terms, and spot items that fit nowhere.

**What you can't do:** run a card sort or tree test with real people, or know the organization's strategy and politics unless told. So:

- **Propose, don't decide.** Give two or three schemes with their trade-offs, recommend one and say why. A single answer hides the decision.
- **Get the audience and direction first.** If you haven't been told who it's for and where the product is heading, ask, or state your assumption at the top.
- **Place everything you were asked to place.** A misfit gets its least-bad home and a flag, and the case for moving, merging or retiring it is a separate recommendation.
- **Deliver every artifact asked for.** If you think one shouldn't exist, deliver it anyway and make the case separately.
- **Never invent research data.** No made-up participant counts, success rates, ticket volumes, quotes or frequencies. "Used every hour" stated as fact counts. Say "probably" and list it as an assumption.
- **Don't guess at platform behaviour.** What a host or CMS can do varies. Say what you'd expect and tell the person to confirm it.
- **Protect the content.** Before editing content, metadata, routes or redirects in place, make sure the work is in version control or backed up.

## 5. IA for AI products, and for agent context

Before adding AI to a product, look for what is actually in the way. If people can't tell how the system works, can't tell its categories apart, or keep having to ask the same things, a clearer structure, a better label or a well-placed cue will usually fix that more cheaply than a chat box. Buttons and menus do two jobs: they let people act, and they show people what the system can do. An open-ended chat does the first slowly and the second not at all. Use chat where the task really is open-ended, and elsewhere use AI behind a structured interface.

Context for agents is an IA problem too. Give a model the right information at the right time: a short entry file that points to deeper files, one canonical home for each fact, consistent names, and nothing loaded that the task doesn't need.

## 6. When the job spans several skills

Unless asked for something else, hand back one document with:

1. **Summary:** the recommendation in two or three sentences, and the main reason for it.
2. **What exists now:** the current tree and the problems in it, with counts.
3. **The options:** two or three schemes, each with who it serves, what it costs and where it strains.
4. **The proposal:** the recommended tree with every node's template type, then the labels and the navigation spec, and the URL rules and content model where relevant.
5. **Migration:** the old-to-new mapping and re-tagging notes, if anything moves.
6. **Assumptions and open questions:** everything you guessed.
7. **How to validate it:** tree-test tasks with their correct answers and targets, or the card sort to run first.

**Scale it to the job.** Lead with the recommendation, keep each section as short as it can be while still being usable, and push long tables to the end. A longer document is not a more thorough one.

**Check it agrees with itself before handing it over.** Re-count totals against the placement table, check every rule you state against the tables you wrote, trace any claim about path length through the tree, and make sure any shippable file implements every row of the plan it comes from.

To review an information architecture, your own or someone else's, score it with `references/rubric.md`.

## 7. Patterns to name when you see them

- **Org-chart navigation:** sections named after departments.
- **Two competing taxonomies:** the side rail, the breadcrumbs and the URL each say something different.
- **Everything under one umbrella:** `/services/<thing>` for every section, a junk drawer with a URL.
- **Placeholder sections:** "Coming soon" pages that ship. Build it or leave it out.
- **A chat box instead of structure:** an open-ended AI interface where clear options would answer the question faster and teach people how the system works.
