---
name: sitemaps
description: Use when someone needs the structure of a website, app or docs set decided, asking for a sitemap, site tree, page hierarchy or list of sections, or saying "what pages do we need", "how should we organise the site", "where should this page live" or "the site is too deep". This is where the structure gets decided. Not for writing the linked sitemap file that later design stages read once the structure is settled (design-os:create-sitemap), for generating sitemap.xml, or for designing the menus.
---

# Sitemaps

A sitemap decides what exists, where each thing lives and how many decisions stand between a person and it. Menus, URLs, templates and redirects are all drawn from this decision, so a wrong tree taxes everything downstream.

## What you need first

| Input | Where it comes from | If it is missing |
|---|---|---|
| The current structure | In a codebase, read the routes, navigation components, `sitemap.xml`, CMS schema and category tables first. Never redesign from the homepage alone. | Ask for a URL list or an export. With nothing to read, label the tree a blank-slate draft. |
| Content size, now and in two years | Count items per section. Empty and overloaded sections are findings. | Ask for a rough figure. Failing that, show which shape each likely size would call for. |
| Audiences and top tasks | The user, analytics, search logs, questions support keeps answering | Ask, or write your assumption at the top of the deliverable. |
| Where the organisation is heading | The user | Ask. A generic brief produces a generic tree. |

A folder of content: survey the whole set before grouping, then say back what it is and who it seems to serve so the user can correct you. A database or dynamic CMS: export titles, types, tags and dates first. PDFs and other binaries: convert to text and say how good the conversion was. A very large set: survey by type, sample within each type, and say what you sampled.

If you can get none of this, say what you would need and hand over the tree format in `references/tree-format.md` with node types suggested for this kind of site.

## Method

1. **Draw what exists.** The current tree, a count on each section, and its problems: overlaps, empties, orphans, anything filed by department.

2. **Size it.** Use the total two years out, not today's.

   | Items | Structure |
   |---|---|
   | Under 50 | Flat, 1 to 2 levels |
   | 50 to 500 | 2 to 3 levels |
   | 500 to 5,000 | 3 to 4 levels plus facets |
   | Over 5,000 | Browse, search and facets together |

3. **Choose the shape from the content, never the org chart.**

   | The content | Shape | What it costs |
   |---|---|---|
   | A few distinct offers, under about 50 pages | **Hub and spoke:** a few wide, shallow sections, each one click from home. The default for marketing sites. | Home does all the routing. Little room to grow before a re-cut. |
   | Truly categorical, such as a large catalogue or industry by industry | **Deep hierarchy** | Every level costs a click and a little scent. One wrong early guess strands people. |
   | Mostly shallow, with one or two dense areas such as docs or a library | **Hybrid:** hub and spoke on top, a narrow hierarchy inside those sections. The usual answer for larger sites. | Two navigation models to build and explain. |
   | Items people slice several ways, or a category that will outgrow one list | **Faceted:** independent dimensions that combine as filters | Clean metadata on every item, and someone to maintain it. |

4. **Draft two or three alternatives**, cut along different axes (by task, by audience, by content type) rather than three versions of one idea. For each, say who it serves, what it costs and where it strains. Recommend one and say why. A single answer hides the decision.

5. **Give each item one canonical home.** It can be linked from elsewhere, but it lives in one place, where people expect it. Two homes split search results, links and maintenance.

   | An item seems to belong in two places | Decision |
   |---|---|
   | A handful of genuine cross-cutters | One home, cross-links from the others |
   | Many items belong in several places | The tree is cut along the wrong axis. Use facets. |
   | You cannot tell where people would look | Pick the likeliest home and mark it for the tree test |

6. **Annotate every node.** Each gets a template type; a node with no template usually means the idea is not finished. Mark new, moved and retired nodes. Use a pattern node such as `/guides/<slug>` for repeating pages, and put `facets:` and `items:` on the nodes that have them.

7. **Stress it.** At ten times the content, would a section become a list nobody can scan? Design sub-sections or facets now, not after. Does the tree serve the next larger context, the product or business around it? Does any section map to a department rather than a task? More than 9 a level or 4 deep needs a reason, and "the three-click rule says so" isn't one, since that rule is a myth: people click further while each step clearly smells like their goal. Read `references/depth-and-shape.md` when depth and breadth are contested, or when reviewing someone else's tree.

## Deliverable

Write `sitemap-tree.txt`, the proposed tree and nothing else, because the check reads it:

```
/                          home
├── /guides                section-hub   items: 40
│   └── /guides/<slug>     guide
├── /products              listing       items: 120  facets: use, price
│   └── /products/<slug>   product
├── /pricing               marketing     (new)
└── /about                 marketing     (moved from /company)
```

Then write `sitemap.md`, in this order:

1. **Recommendation:** two or three sentences and the main reason.
2. **What exists now:** the current tree and its problems, with counts.
3. **Options:** one row per structure, with columns organised by, serves, costs, strains when.
4. **Proposed tree:** the exact text of `sitemap-tree.txt` in a code block.
5. **Placements:** item, home, note. Only when asked where things go.
6. **Assumptions and open questions:** everything you guessed, above all audience and direction.
7. **How to validate:** the riskiest placements, handed to tree-tests.

Scale it down. A 12-page site needs the recommendation, the tree and a three-line options table. A longer document is not a more thorough one. A request to place every item means every item gets a home: give a misfit its least-bad home, flag it, and argue separately for moving, merging or retiring it.

## Check it

```
node "${CLAUDE_SKILL_DIR}/scripts/tree-check.mjs" sitemap-tree.txt
```

It reports depth and breadth per branch, labels appearing twice, nodes with no template, Other or Misc nodes, and items per section. Use its result, not your reading of the tree. Exit 1 means warnings: fix each one, or write one line in `sitemap.md` saying why the exception stands. Pass `--items N` when the tree has no counts.

Then by hand: re-count the placements against the totals, trace any claim about path length through the tree, and confirm the code block in `sitemap.md` matches the file.

## What Claude can't do here

- Know the organisation's strategy or politics unless told. The tree is a draft to react to, and the human owns the decision.
- Invent traffic, usage or research. That includes frequency words stated as fact, such as "used every day". Say "probably" and list it as an assumption.
- Run a tree test or card sort with real people. Design them, and analyse results the user brings back.
- Promise what a CMS can do. Say what you would expect, such as nested routes or facet filtering, and tell the user to confirm it, because what a platform supports varies.

## Where this hands off

A sitemap alone is decoration: nobody can build from it without URL rules, a navigation spec, a content model and, for a rebuild, a redirect plan.

- `information-architecture`: the front door, when the job spans several of these.
- `content-inventory`: when nobody knows what exists yet. `card-sort`: when the groupings should come from users.
- `taxonomies`: when the tree needs facets or tags designed. `labeling`: to word the node names.
- `navigation`, `url-structure` and `content-models`: to turn nodes into menus, addresses and templates.
- `redirect-maps`: when anything moves.
- `tree-tests`: to validate the tree before building. `findability`: to measure it after.
- `design-os:create-sitemap`: to write the agreed tree as the linked file later design stages read.
