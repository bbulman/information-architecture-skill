# Information architecture: methodology

Depth behind the workflow in `SKILL.md`. Read the section the job needs.

## Contents

1. Analyzing a card sort
2. Designing a taxonomy
3. Depth, breadth and progressive disclosure
4. Information scent
5. Search and browse
6. URL rules
7. Redirect plans
8. The content model and the CMS
9. Governance and drift
10. Locales and culture
11. Personalization
12. IA for AI products, and for agent context

---

## 1. Analyzing a card sort

Raw card sort data is a list of (participant, card, group label) rows. When the user brings it back, compute the numbers with a short script rather than eyeballing it.

- **Similarity matrix.** For every pair of cards, the share of participants who put them in the same group. Pairs above about 70% belong together; pairs below about 30% belong apart. The middle band is where the real design decisions are.
- **Clusters.** Hierarchical clustering on the similarity matrix gives a tree of groupings. Cut it where the clusters are each meaningful and the count fits the navigation (usually 5 to 9 top-level groups).
- **Agreement per group.** For each cluster, how consistently participants used it. Low agreement means the concept is fuzzy, the label is unclear, or two concepts are hiding in one group.
- **Labels.** Collect the names participants gave each cluster. Their most common words are the first candidates for your labels; your internal terms are not.
- **Outliers and what they mean:**
  - A card sorted into many different groups: it belongs in two places (one home, one cross-link), or the groups are cut the wrong way.
  - A card nobody could place: its title is unclear, or the content doesn't fit this site.
  - A group with one card: fold it into its neighbour.
  - Labels participants didn't recognize: jargon. Rename before launch.

Open sorts give the users' model; closed sorts test yours; hybrid sorts start from yours but let people add groups, which shows where yours falls short.

## 2. Designing a taxonomy

**Mutually exclusive, collectively exhaustive.** Within one dimension, every item should fit exactly one category, and every item should fit some category. Overlap ("Guides" and "How-tos") makes people guess; gaps produce "Other", which grows until it is the largest category.

**One dimension per facet.** Don't mix topic, format and audience in one list ("Icebreakers", "Videos", "For managers"). Split them into facets that combine: Topic by Format by Audience. Each facet stays mutually exclusive; the combination handles the rest.

**Several parents or facets?** Letting an item sit under several parents (polyhierarchy) is fine for a handful of genuine cross-cutters, but it doesn't scale: with many of them nobody knows where anything lives. When many items belong in several places, the hierarchy is cut along the wrong axis and you want facets.

**Controlled vocabulary or free tags?** A controlled vocabulary (a fixed list with a preferred term and its synonyms) keeps tagging consistent and search predictable. Free user tags capture fresh vocabulary but drift fast. A common middle path: a controlled list for navigation and filtering, free tags as a source of candidate terms reviewed on a schedule. Record synonyms ("off-site", "offsite", "retreat") so search finds them all under one preferred term.

**Balance.** Watch the distribution: a category holding more than about 40% of items probably needs splitting, and one holding a single item probably needs merging. Balance at the top level matters most, because it is what people scan.

**Evolution.** Taxonomies change. Version them, keep a change log, and when a term is merged or renamed, redirect its pages and re-tag its items in the same change.

**Drafting with an AI.** Draft two or three candidate taxonomies, then apply each one to the whole corpus. For each, report items that fit nothing, terms that catch too much, terms that catch nothing, and terms that overlap. Pick or revise based on that evidence, not on how tidy the list looks.

## 3. Depth, breadth and progressive disclosure

- **Choice cost.** Decision time grows with the number of options, so very long menus slow people down. But too few options per level forces more levels. Five to nine items per level, three to four levels deep, is a sound default.
- **The three-click rule is a myth.** People abandon a path when the scent goes cold, not when they hit click four. Measure success and confidence per step, not raw clicks.
- **Broad and shallow, or narrow and deep?** Broad levels work when labels are clear and scannable, because people see their target sooner. Deep levels work when each step is an obvious, small choice. Mixed: broad at the top, deeper inside one section.
- **Progressive disclosure.** Show the overview first and reveal detail on demand: hub pages with a few clear doors, collapsed sections, "show more", a side rail that expands. The goal is that a newcomer isn't overwhelmed and an expert isn't slowed down.

## 4. Information scent

People follow cues that suggest they're getting closer to what they want, the way an animal follows a scent. Strong scent comes from:

- **Trigger words:** labels that use the words people already have in their heads, ideally the ones they type into search.
- **Specific link text:** "Download the facilitation checklist" rather than "Learn more".
- **Previews:** short descriptions under labels, item counts, sample contents, thumbnails.
- **Breadcrumbs and active states:** confirmation that you're on the path you think you're on.
- **Consistency:** the same thing called the same name everywhere.

Weak scent shows up as pogo-sticking (in, back out, into the next), heavy use of search from navigation pages, and short visits to section pages. Fix the label or the grouping, not the person.

## 5. Search and browse

Support both, because people switch between them. Signals worth reading:

- **Zero-result searches:** vocabulary you lack. Add synonyms, or the content.
- **Searches started from a section page:** the section's navigation failed them.
- **Refinements:** people rewording the same query mean the results or the labels don't match their words.
- **Top queries:** the most-wanted things. They should be reachable in one or two steps from home and appear as curated "best bets" at the top of results.
- **Search exits:** people leaving straight from the results page mean the results are wrong.

A large share of findability problems are cheaper to fix in labels and grouping than in the search engine.

## 6. URL rules

URLs outlive every redesign, and people, other sites and search engines all depend on them.

- **Stable:** once published, a slug changes only with a 301 redirect.
- **Readable:** `/customers/acme-corp`, not `/c/?id=42`. Slugs are content, not database IDs.
- **Hierarchical:** the path mirrors the IA (`/library/icebreakers/two-truths`), so a URL tells you where you are.
- **Lowercase kebab-case:** enforce it at the platform and redirect mixed case and underscores.
- **No file extensions:** `/about`, not `/about.php`. The implementation is not the address.
- **Short slugs:** drop filler words (`/best-way-to-x`, not `/the-best-way-to-x`). Readability is the gain.
- **One canonical form:** decide on trailing slash or none, enforce it, and set canonical tags, or links and rankings split across duplicates.
- **Locales as a prefix:** `/en/`, `/de/`, with `hreflang` siblings and an `x-default`.
- **Query strings for state, not identity:** filters, sorting and pagination can live in the query string; the thing itself shouldn't.

## 7. Redirect plans

Any restructure without a redirect plan breaks bookmarks, links and search rankings on launch day.

- Map **every** old URL. Sources: the current `sitemap.xml`, the CMS, server logs, analytics, and pages other sites link to.
- **301** each to its closest new equivalent, which keeps most of its search value.
- **410** pages that are truly gone, so search engines drop them faster than with a 404.
- **Never 302** a permanent move.
- **No chains:** collapse A to B to C into A to C, and re-check old redirects whenever a new restructure happens.
- **Don't redirect everything to home.** Search engines treat that like a 404 and people find it disorienting.
- Crawl the redirect map **before** cutover and fix loops, chains and misses. Most launch incidents come from redirects added at the last minute.

## 8. The content model and the CMS

Every URL pattern is a template type, and every template type needs fields. Write them together:

```
URL pattern               Template      Fields
/                         home          hero, featured[], calls_to_action[]
/library/<type>/<slug>    library-item  title, summary, duration, group_size, steps[], materials[], tags[]
/blog/<slug>              post          title, author, published_at, body, topics[]
/docs/<section>/<slug>    doc           title, body, prev, next, last_reviewed
```

What the CMS has to provide for the IA to hold:

- A **slug** field with validation (kebab-case, unique within its parent).
- A **parent** relation for hierarchical URLs.
- An automatic **redirect log** when a slug changes.
- **Status:** draft, scheduled, published, archived. Archived is not deleted, and archived pages should answer 410 or redirect.
- **Taxonomy fields** that pick from the controlled list instead of free text.
- **Locale** and links to the item's translations, if the site is multilingual.

Choose the CMS after sketching the content model, not before: the model rules out half the candidates.

## 9. Governance and drift

Taxonomy drift is the slow misalignment between a site's structures and its content: terms multiply, near-duplicates appear, old content keeps old tags, and nobody notices until findability collapses and a redesign "fixes" it for a year. Prevent it with:

- **An owner:** one named person or role who approves changes.
- **A way in for new terms:** propose, check for an existing near-duplicate, approve or merge. Creating a tag on the fly while publishing is the root cause of most drift.
- **A term lifecycle:** proposed, active, deprecated, merged into another term. Deprecated terms keep redirecting.
- **A regular drift audit**, monthly or quarterly depending on publishing volume:
  - terms with no items, and terms with a large share of all items;
  - near-duplicate terms (spelling, plural, synonym);
  - items with no tags, or tags that don't match their content;
  - sections that grew past their balance limits;
  - new search queries with no matching term.
- **Re-tagging on every taxonomy change:** apply the new terms to the old content in the same release. This is exactly the large, repetitive, consistent work an AI is suited to, as long as it applies a predefined list rather than inventing terms.

## 10. Locales and culture

- Put the locale in the URL (a prefix); detecting it by IP or a cookie alone breaks sharing, the back button and search.
- Translate labels for meaning, not word for word, and re-test them with people in that market.
- Some categories don't travel (seasons, holidays, units, business conventions). Check that the structure still makes sense in each market, not just the words.
- Keep one canonical structure across locales where you can, so content and redirects stay manageable.

## 11. Personalization

Role- or behaviour-based entry points (a "For facilitators" door, recently used items, saved views) help, but keep one stable, shared structure underneath. If everyone sees a different menu, people can't give each other directions, support can't describe where things are, and the analytics stop meaning anything. Personalize the shortcuts, not the map.

## 12. IA for AI products, and for agent context

**Before adding AI to a product, ask the IA questions** (adapted from Jorge Arango's "The Moylan Arrow"):

- What job has this person come to do?
- How well do they grasp the way the system works?
- What gets in the way of a good choice?
- Which questions do they bring, and which recur?
- Where do the system's categories blur for them?

Often the answer is a clearer structure, a label or a well-placed cue rather than a chat box. Buttons and menus do two jobs: they let people act, and they show people what the system can do. An open-ended chat does the first slowly and the second not at all. Use chat where the task really is open-ended; elsewhere, use AI behind a structured interface.

**A good cue answers a latent question at the moment of decision.** It is clear, findable (where people are already looking), relevant (exactly the answer needed), contextual (there when needed, quiet otherwise), obvious (no instructions needed) and cheap.

**Context for agents is an IA problem too.** Structuring instructions, documentation and skills for an LLM means giving it the right information at the right time: a short entry file that points to deeper files, one canonical home for each fact, consistent names, and nothing loaded that the task doesn't need. The same principles of grouping, labelling, scent and progressive disclosure apply.
