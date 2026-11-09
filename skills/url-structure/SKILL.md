---
name: url-structure
description: Use when someone needs URL rules, a URL scheme, slug conventions, a permalink structure or a URL audit, or asks "what should our URLs look like", "trailing slash or not", "how do we put languages in the URL", "should the category be in the URL" or "our URLs are a mess". Not for mapping old URLs to new ones in a migration, or for deciding the page tree.
---

# URL structure

URLs outlive every redesign, and people, other sites and search engines all depend on them. A URL is a promise. This skill writes the rules for what addresses look like and names what makes the platform keep them.

## What you need first

| Input | Where it comes from | If it is missing |
|---|---|---|
| The current URLs | In a codebase, read the routes and navigation components first, then `sitemap.xml`, the CMS, a crawl or analytics. Never work from the homepage alone. | Ask for an export. With none, write rules for a new site and say nothing has been audited. |
| The tree | A sitemap | Use `sitemaps` first, or derive patterns from the routes and mark them assumed. |
| The platform | Router, CMS, host | Ask. Rules a platform can't enforce are wishes, so produce the rules with the list of what to confirm. |
| Locales, now and planned | The user | Ask. Adding a prefix later moves every URL. |

If you can get none of this, say what you would need and hand over the rule table from `references/rules-in-detail.md` with the defaults filled in.

## Method

1. **Audit what exists.** Run `url-check` on the current list. The counts go in the deliverable as the baseline.

2. **Decide what the path carries.** Stability beats cleverness and beats tidiness. Put in the path only what will still be true in five years.

   | Candidate | In the path when | Keep out when |
   |---|---|---|
   | Section | It is stable and appears in the tree | It is a team name, campaign or product code |
   | Category | The item has one permanent category | Items move or sit in several. Then use `/blog/<slug>` and show the category on the page. |
   | Date | The item really is dated, such as news or an event | Evergreen content. The date ages it and adds nothing. |
   | Locale | Always, as a prefix: `/de/` | Never by IP or cookie alone |
   | Database id | Never | Always. Slugs are content: `/customers/acme`, not `/c/?id=42`. |
   | Filters, sort, page | Never | Always. They go in the query string, which is for state, not identity. |
   | Implementation | Never | Always: `.php`, `.html`, a framework's name. The implementation is not the address. |

   The path mirrors the tree, so a URL tells you where you are. Where the tree is likely to be re-cut, mirror only the stable part.

3. **Offer two or three schemes,** each with what it costs: for example full hierarchy (`/products/kitchen/mixers/<slug>`, most readable, breaks when categories change), shallow (`/products/<slug>`, survives re-cuts, says less), or section plus type (`/guides/setup/<slug>`). Recommend one and say why.

4. **Write the rules, each with what enforces it.** A rule nobody enforces is a wish.

   | Rule | Default | What should enforce it |
   |---|---|---|
   | Case and separator | Lowercase, kebab-case | CMS slug validation, plus a redirect rule for anything else |
   | Trailing slash | Choose one, with canonical tags | Router or host setting |
   | Extensions | None | Routes |
   | Hierarchy | Path mirrors the stable part of the tree | Route definitions, parent field |
   | Slug source | Title, trimmed of filler words, about 60 characters at most | CMS slug generation, editable before publishing |
   | Ids | Never in the path | Route definitions |
   | Query strings | Filters, sort and page only | Code review, `url-check` in CI |
   | Locales | `/<locale>/` prefix, `hreflang` siblings, `x-default` at `/` | Internationalised routing |
   | Changing a slug | Automatic 301 from the old one, logged | CMS redirect log |
   | `sitemap.xml` | Generated from the routes or CMS, never by hand | Build step or CMS |

5. **Set the slug-change policy.** Once published, a slug changes only with a 301, and that 301 stays forever. Change it when the old address is wrong or misleading, never for tidiness. Slug churn is the failure to design against: `/about` to `/company` to `/team` across three quarters, each rename adding a redirect.

6. **Design locales,** if there are any, from `references/locales.md`. Keep one canonical structure across locales where you can.

7. **Keep navigation on real addresses.** Primary navigation built on `/#features` anchors breaks history, deep links and search. Fragments are for places within a page.

## Deliverable

`url-rules.md`, in this order:

1. **Recommendation:** the scheme in two or three sentences, and why.
2. **What exists now:** `url-check` counts on the current list.
3. **Options:** one row per scheme, with what it costs.
4. **Rules:** rule, setting, what enforces it, what happens to violations.
5. **Patterns:** URL pattern, template type, example.
6. **Locales,** if any.
7. **Slug-change policy:** who may change one, and what fires when they do.
8. **To confirm with the platform.**
9. **Assumptions and open questions.**

Scale it down. A small site needs the recommendation, the rules table and the patterns. A longer document is not a more thorough one. A request to place every URL means every URL gets a pattern, or a line saying why it is the exception.

## Check it

```
node "${CLAUDE_SKILL_DIR}/scripts/url-check.mjs" urls.txt
```

`urls.txt` holds one URL or path per line; a crawler's CSV works too. It flags uppercase, underscores, file extensions, trailing-slash inconsistency, ids in the query string, duplicates after normalising, paths over 4 levels (`--max-depth N` changes it) and hash navigation. Use its result rather than reading the list by eye. Run it twice: once on the current URLs for the baseline, and once on the proposed list or patterns, which should come back clean or with each exception explained. A pattern like `/guides/<slug>` is understood. `--all` lists every match.

By hand: every pattern maps to a template in the tree, and every rule in the table names what enforces it.

## What Claude can't do here

- Know the organisation's plans unless told, and the plans decide what is stable enough for the path.
- Invent traffic, usage or rankings to justify changing a URL. Say what you would need to see.
- State what a host or CMS does. Case sensitivity, slash handling and redirect logging vary. Say what you would expect and tell the user to confirm it.

## Where this hands off

- `information-architecture`: the front door, when the job spans several of these.
- `sitemaps`: for the tree the path mirrors. `navigation`: for the labels and menus that link to these addresses.
- `content-models`: for the slug, parent and locale fields behind each pattern.
- `taxonomies`: when facets become filters in the query string, or term pages need an address.
- `labeling`: when a slug should follow a label. A renamed label does not by itself justify a new slug.
- `redirect-maps`: for any URL that changes. `content-inventory`: for the full list when nobody has one.
- `card-sort`, `tree-tests` and `findability`: for how people group, reach and find these pages.
