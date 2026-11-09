---
name: information-architecture
description: Design, audit or restructure information architecture, meaning how content and features are organized, labelled and found. Covers content inventories, card sorts, taxonomies and metadata, sitemaps, navigation (primary, utility, footer, contextual, app tab bars), URL rules, content models, tree tests, redirect plans, taxonomy governance and findability metrics, for websites, web apps, docs, knowledge bases, content libraries and AI products. Use it whenever someone wants to reorganize a site or app, rethink a menu, nav or app switcher, name or group sections, tag or categorize content, plan URLs or a sitemap, fix "people can't find X", restructure docs, a blog or a knowledge base, or organize a large pile of posts or files, even if they never say "information architecture" or "IA".
---

# Information architecture

Information architecture is how a system's content and functions are grouped, labelled and connected so that people can find what they need and understand what they can do. Jorge Arango puts its purpose as increasing people's agency by making systems legible. Every decision in this skill serves that test: does this structure help the person in front of it make a good choice, quickly, without being told how?

IA is upstream of everything else. A wrong structure taxes content (it has no home), design (it has to invent extra navigation), search engines (URLs churn) and the CMS (it becomes a pile of workarounds). A right one makes the rest of the build fall out of it.

## 1. Scope the job first

Most requests need part of the toolkit, not all of it. Decide which job this is and name the artifacts you will produce, so the user knows what they are getting.

| The job | Artifacts it usually needs |
|---|---|
| Reorganize existing content | Inventory, draft taxonomy (or card sort plan), sitemap, tree test plan, redirect map |
| New site, app area or section | Sitemap, navigation spec, URL rules, content model |
| Rethink a menu, nav or app switcher | Current-state map, navigation spec, tree test plan |
| Tags and categories | Taxonomy and metadata schema, tagging rules, governance plan |
| "People can't find X" | Diagnosis (labels, scent, depth, search), metrics to watch |
| An AI feature or product | The latent questions it answers, and where structure beats an open-ended chat |

The full set for a site build is five linked artifacts: sitemap, URL rules, navigation spec, content model and, for any rebuild, a redirect plan. A sitemap alone is decoration: without the other four, nobody can build from it.

## 2. Map what exists before proposing anything

Never redesign from the homepage alone. Build the current tree from the source of truth first:

- **In a codebase:** read the routes, the navigation components (header, footer, app switcher, side rails, tab bars), `sitemap.xml`, the CMS schema and any category or tag tables. Count items per section; empty and overloaded sections are findings in themselves.
- **In a folder of content** (Markdown posts, exported CMS pages, docs): survey the whole corpus, not one item at a time. Organizing needs the forest view; reading posts one by one never shows how they relate. Start by saying back what the corpus is and who it seems to serve, and let the user correct you before you build on a wrong reading.
- **Content in a database or a dynamic CMS:** export it to plain text, or query titles, types, tags and dates, before reasoning about structure.
- **PDFs and other binaries:** convert to text first, and say how good the conversion was.
- **Very large sets:** survey by type and sample within each type, and say what you sampled, so nobody mistakes a sample for a census.

Also gather what only people know: the audiences and their top tasks, where the organization is heading, analytics, site-search logs, and the questions support keeps answering. Search logs and repeated questions are the cheapest mental-model research there is.

## 3. The workflow

Run the steps the job needs, in this order.

1. **Frame.** Who uses this, what they are trying to do, how much content there is now and in two years, what the business wants from it, and how success will be measured (time to find, task success, search exits, support volume).
2. **Inventory and audit.** List every item with its type, owner, date and current location. Mark duplicates, gaps, and content that is redundant, outdated or trivial; cutting it is often the biggest IA win.
3. **Learn the users' mental model.** An open card sort finds their categories, a closed one tests yours, and a hybrid refines yours. Interviews and search logs fill in vocabulary. The goal is their words and their groupings, not the org chart's.
4. **Choose the shape.** Pick from the content, not the org chart:
   - **Hub and spoke:** a few wide, shallow sections, each one click from home. The default for marketing sites under about 50 pages.
   - **Deep hierarchy:** only when the content really is categorical (large catalogs, industry by industry). Every level costs a click and a little scent.
   - **Hybrid:** hub and spoke at the top, a narrow hierarchy inside one or two sections such as docs or a library. The usual answer for larger sites.
   - **Faceted:** independent dimensions (type, topic, duration, audience) that combine as filters. Use it when items need slicing several ways or a category will grow past what one list can hold.
5. **Label.** Use the users' vocabulary, specific enough that a newcomer can predict what is behind each label. Pick one labelling system per level (task, audience, topic, format or A to Z) rather than mixing them in one menu.
6. **Design the navigation surfaces.** There are four, each with its own entry rule (see the table in section 6). A section that needs more than two levels of navigation usually wants its own side rail or its own home.
7. **Set URL rules and the content model.** Every URL pattern is a template type, and every template type has fields. Write the table; if you can't, the IA isn't finished.
8. **Validate before building.** Tree-test the text-only hierarchy with realistic "where would you find..." tasks, written in the users' words, each with its correct answer and a success target. Cover the problems that prompted the work and every placement you weren't sure of. Tree testing takes about a day. Finding the same problems after launch costs weeks.
9. **Migrate.** For any restructure, map every old URL to its new home and re-tag the old content with the new taxonomy. Re-tagging is the step teams skip, and it is why redesigns decay.
10. **Govern and measure.** Name an owner, a way to propose a new term, and a regular drift check. Without one, taxonomies drift back into disorder: terms multiply, near-duplicates appear, and tags stop matching content.

## 4. Working as an AI on IA

Be clear about where you add value and where you don't.

**What you do well:** read a whole corpus in minutes, propose several alternative organizing schemes, apply a taxonomy consistently to thousands of items, find near-duplicate terms, and spot items that fit nowhere.

**What you can't do:** run a card sort or a tree test with real people, or know the organization's strategy and politics unless told. So:

- **Propose, don't decide.** Defining a taxonomy is a judgment call about the domain, the strategy and the users, and the human owns it. Present your structures as drafts to react to.
- **Always offer alternatives.** Give two or three schemes (for example by task, by audience, by content type) with their trade-offs, then recommend one and say why. A single answer hides the decision.
- **Get the audience and direction first.** A generic brief produces a generic taxonomy. If the user hasn't said who it's for and where the product is heading, ask, or state your assumption at the top.
- **Use application to test a draft.** Tag every item with the draft terms, then report what doesn't fit, which terms catch too much, which catch nothing, and which overlap. Applying a taxonomy at scale is the fastest feedback loop IA has ever had; use it before anyone builds.
- **Place everything you were asked to place.** If the user asks where each item goes, every item gets a home, even one that fits badly. Give a misfit its least-bad home, flag it, and make the case for moving, merging or retiring it as a separate recommendation. Leaving it out silently breaks the request, and usually breaks your own rules too ("every item has exactly one category").
- **Never invent research data.** Don't make up participant counts, success rates, ticket volumes or quotes, and don't state how often something is used unless the user told you. That includes vague frequency words stated as fact ("used every hour", "visited occasionally"): say "probably" and list it as an assumption. Design the study, give the tasks and targets, and analyze the results when the user brings them back.
- **Deliver every artifact the user asked for.** If they ask for categories and tags, give both, even if you'd keep the tag list short. If you think one of them shouldn't exist, deliver it anyway and make the case separately, so the user decides.
- **Don't guess at platform behaviour.** What a host, CMS or redirect file can do (query-string matching, 410 support, case sensitivity) varies. Say what you'd expect and tell the user to confirm it, rather than stating it as fact.
- **Protect the content before changing it.** Before editing content, metadata, routes or redirects in place, make sure the work is in version control or backed up.

## 5. Rules that hold, and why

- **Structure by the user's mental model and tasks, never the org chart.** People don't think in departments; "For developers, APIs" beats "About us, engineering, APIs".
- **Give each item one canonical home.** It can be linked from elsewhere, but it lives in one place, where people expect it. Two homes split search results, links and maintenance.
- **Make labels specific and familiar.** "Resources", "Solutions" and "Discover" hide what's behind them. Test it: could a newcomer predict the contents?
- **Keep scent over click counts.** Five to nine items a level and three to four levels deep is a good default, but people will click further when each step clearly smells like their goal. The "three-click rule" is a myth; dead ends and vague labels are the real cost.
- **Design for ten times the content.** If a category will grow, design facets or sub-sections now rather than retrofitting later.
- **Offer several ways in.** Browse, search, filters, related links, breadcrumbs. Some people know what they want and search; others explore. Support both.
- **Treat URLs as a promise.** Stable, readable, lowercase kebab-case, no file extensions, one canonical form (trailing slash or not, enforced), locale as a path prefix. Every changed slug needs a 301 forever.
- **Put cues where the decision happens.** A good wayfinding cue answers a question the person already has, at the moment they make the choice, in the place they're already looking, quietly and cheaply. The fuel-cap arrow next to a car's fuel gauge is the model.
- **Design for the next larger context.** A page sits in a section, a section in a site, a site in a business. Check that the structure serves the level above it.

## 6. Quick reference

**Navigation surfaces**

| Surface | What belongs | What doesn't |
|---|---|---|
| Primary | The 3 to 6 destinations that matter most to users and the business | Anything that hasn't earned the slot |
| Utility | Sign in, account, search, language, settings | Marketing-ranked items |
| Footer | The fuller sitemap, legal, contact, secondary calls to action | A junk drawer (people and crawlers still read it) |
| Contextual | Side rails, in-page contents, breadcrumbs, related links | Anything global |
| App tab bar | At most 5 tabs; a 6th becomes "More" or gets cut | Rarely used destinations |

More than seven primary items means some aren't earning their place: consolidate them or move them to the footer. Use a mega-menu only when one item has three or more sub-groups with children of their own, and design its keyboard focus and mobile version as separate work.

**Structure by content size**

| Items | Structure |
|---|---|
| Under 50 | Flat, 1 to 2 levels |
| 50 to 500 | 2 to 3 levels |
| 500 to 5,000 | 3 to 4 levels plus facets |
| Over 5,000 | Browse, search and facets together |

**Labelling systems:** task ("Plan a workshop"), audience ("For facilitators"), topic ("Icebreakers"), format ("Videos", "Templates"), A to Z (glossaries and directories). Pick one per level.

**Research methods**

| Method | Use it to | People |
|---|---|---|
| Open card sort | Discover their categories | 15 to 30 |
| Closed card sort | Test your categories | 15 to 30 |
| Tree test | Validate a hierarchy before building | 20 to 50 |
| Interviews | Understand mental models and vocabulary | 5 to 10 |
| Content audit | Know what exists | 1 or 2 analysts |

A quick sort with 8 to 12 people finds the dominant pattern for a small site. Use the larger numbers when the decision is expensive.

**Targets:** tree-test success of at least 70% per task, and 80% for top tasks; directness of at most 1.5 times the shortest path; simple items found in under 30 seconds.

## 7. What to hand back

Unless the user asks for something else, structure the deliverable like this:

1. **Summary:** the recommendation in two or three sentences, and the main reason for it.
2. **What exists now:** the current tree and the problems in it, with counts.
3. **The options:** two or three schemes, each with who it serves, what it costs and where it strains.
4. **The proposal:** the recommended tree in a code block, with every node's template type. Then the labels, the navigation spec and, where relevant, the URL rules and content model.
5. **Migration:** old to new mapping and re-tagging notes, if anything moves.
6. **Assumptions and open questions:** everything you guessed, especially about audience and strategy.
7. **How to validate it:** tree-test tasks with their correct answers and success targets, or the card sort to run first.

**Scale it to the job.** A menu rethink needs the diagnosis, the new tree, one home for each problem task, and the test plan; it doesn't need a content model or a URL policy. Lead with the recommendation, keep each section as short as it can be while still being usable, and push long tables (every item's placement, every redirect) to the end. A longer document is not a more thorough one.

**Check it agrees with itself before handing it over.** Re-count the totals against the placement table, check every rule you state ("each item has one home", "no redirect chains", "every row is in the redirect file") against the tables you wrote, trace any claim about path length ("every task is two clicks") through the tree, and make sure any shippable file (redirects, front matter) implements every row of the plan it comes from. Fix the contradiction rather than leaving the reader to find it.

## 8. Anti-patterns

- **Org-chart navigation:** sections named after departments.
- **Mystery-meat labels:** "Discover", "Solutions" or "Resources" with no context.
- **Everything under one umbrella:** `/services/<thing>` for every section, which is a junk drawer with a URL.
- **Two competing taxonomies:** the side rail, the breadcrumbs and the URL each say something different.
- **Phantom parents:** breadcrumbs that point to pages that don't exist.
- **Slug churn:** renaming `/about` to `/company` to `/team` across three quarters, each rename adding a redirect.
- **Hash navigation:** primary nav built on `/#features` anchors, which breaks history, deep links and search.
- **Placeholder sections:** "Coming soon" pages that ship. Build it or leave it out.
- **Deep pagination as the only path:** item 470 reachable only by clicking "next" 46 times.
- **A hand-kept `sitemap.xml`:** generate it from the routes or the CMS so it can't drift.
- **Locale by IP or cookie only:** the locale belongs in the URL.
- **Tags created on the fly:** new terms with no check for an existing near-duplicate, which is how drift starts.
- **A chat box instead of structure:** an open-ended AI interface where clear options, buttons or menus would answer the question faster and teach people how the system works.

## 9. Going deeper

Read these only when the job needs them:

- `references/methodology.md`: analyzing card sorts, taxonomy design (mutually exclusive and collectively exhaustive categories, facets versus several parents, controlled vocabularies), information scent, search versus browse, URL and redirect rules, the content model and CMS, governance and drift, locales, and IA for AI products.
- `references/templates.md`: fill-in templates for the inventory, card sort plan and analysis, sitemap, navigation spec, URL rules, content model, tree test plan and results, taxonomy and metadata schema, redirect map, and the drift audit.
- `references/rubric.md`: score an IA on twelve criteria, for reviewing your own proposal or someone else's.

## Sources

Combined from two public Claude skills, lyndonkl/claude `information-architecture` (research methods, taxonomy, findability) and mcorbett51090/RavenClaude `web-design/information-architecture` (sitemap shapes, URL rules, navigation surfaces, content model, redirects), rewritten rather than copied. The guidance on working as an AI, drift and wayfinding draws on Jorge Arango's posts at jarango.com: "Using Claude Code for Information Architecture" (2025), "AI and Taxonomies: Creating vs. Applying" (2025), "Why Website Taxonomies Drift" (2025), "Seeing the Forest: Using Graph RAG for IA" (2024), "The Moylan Arrow" (2026) and "What's the Purpose of Information Architecture?" (2026).
