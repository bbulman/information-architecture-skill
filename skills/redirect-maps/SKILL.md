---
name: redirect-maps
description: Use when someone needs a redirect map or plan for moving URLs in a site migration, rebuild, replatform, domain change or restructure, so links and rankings survive, or says "we need 301s", "set up our redirects", "we're moving to a new CMS" or "don't lose our Google rankings". Not for designing the new URL scheme or the new page tree.
---

# Redirect maps

Any restructure without a redirect plan breaks bookmarks, links and search rankings on launch day. The map says what every old URL becomes; the plan says how it is tested and when old content is re-tagged to match.

## What you need first

| Input | Where it comes from | If it is missing |
|---|---|---|
| Every old URL | The current `sitemap.xml`, the CMS, server logs, analytics, pages other sites link to. In a codebase, read the routes, existing redirect files and navigation components first. | Map what you have and say which sources you lacked. With no list, produce the plan and the empty map, and name the exports to get. |
| The new URLs | The new tree and URL rules | Use `sitemaps` and `url-structure` first. A map with no destination is a list. |
| The platform | Host, CMS, redirect mechanism | Ask. Then confirm the items in step 2. |
| What old query-string URLs pointed to | The old CMS or database | Get it before the old site goes dark. Afterwards it may be unrecoverable. |

Before editing routes or redirects in place, make sure the work is in version control or backed up.

## Method

1. **Build one old-URL list.** Merge the sources and keep every form. A URL with a query string is a different URL from the same path without one. Files are URLs too.

2. **Confirm what the platform can do. Never guess at platform behaviour.** Query-string matching, 410 support, case sensitivity, slash handling, rule order and limits, and whether rules apply to existing files all vary. Say what you would expect and tell the user to confirm it. `references/testing-and-formats.md` has the questions and what to do if the answer is no; read it before writing any rules.

3. **Map at scale in layers.** Exceptions go first, because in most rule files the first match wins.

   | Layer | What | How |
   |---|---|---|
   | Exceptions | Renames, merges, splits | One row each |
   | Patterns | A section moved with slugs intact | One rule, expanded to one row per URL in the map |
   | Long tail | Everything left | Closest equivalent, or 410 with a reason |

   If the user gives you traffic or inbound links, read the highest-value rows by hand first. Otherwise read them all.

4. **Decide each URL.**

   | Situation | Status | To |
   |---|---|---|
   | Same content at a new address | 301 | The new page |
   | Merged into another page | 301 | The page that absorbed it |
   | Retired, but a parent page answers the same need | 301 | The closest parent |
   | Truly gone, nothing close | 410 | Empty, with a reason. A clearer signal than a 404, and search engines tend to drop it a little sooner. |
   | Staying where it is | 200 | The same URL, reason "unchanged". Accounted for, and left out of the shipped file. |
   | Back soon at the same address | 302 with a reason | Never for a permanent move |

   Don't redirect everything to home. Search engines treat that like a 404, and people find it disorienting.

5. **Handle query strings and files on purpose.**

   | Old URL | What it is | Do |
   |---|---|---|
   | `?p=112`, `?page_id=7`, `?id=42` | Identity | Resolve each from the old CMS. One row each. Never send them home. |
   | `?page=2`, `/page/2/` | Paging | The listing, or its new page |
   | `?sort=`, `?filter=` | State | The listing, with the filter if it survives |
   | `?utm_source=` and other tracking | Not a page | No row, but confirm the redirect still fires with it present |
   | PDFs and downloads | Files people have linked and saved | Keep the address if you can. Otherwise 301 to the file's new address, or to the page that replaced it. |
   | `/#section` | A fragment the server never sees | A server rule can't match it; handle it in script on the page |

6. **Know when a blanket rule is wrong.** `/blog/*` to `/articles/*` is right only if every slug survives. It is wrong when slugs changed, the section split, retired pages sit under it, the destination redirects again, or the content lives in the query string. The reference says what to do instead for each.

7. **Collapse chains and re-check old redirects.** A to B to C becomes A to C. Existing redirects are part of the map, so re-check them whenever a new restructure happens.

8. **Write the re-tagging notes.** Every merged or renamed term: old term, new term, items affected, who applies it. Re-tag in the same release, or old content stays on terms that no longer exist. Applying a predefined list across old content is work an AI does well, as long as it applies the list rather than inventing terms.

9. **Plan the tests.** Before cutover, crawl the map against staging and fix loops, chains and misses. After, re-crawl production and watch the logs for 404s. Freeze the map first, because a redirect added at the last minute misses this crawl. Also update internal links, canonical tags and `sitemap.xml` to the new addresses.

## Deliverable

`redirects.csv`, with columns in this order: `from`, `to`, `status`, `reason`, `rule`, `checked`. One table, one row per old URL, including every URL a pattern implements (`rule` names the pattern) and every URL that stays put (status `200`, the same URL as `to`). A pattern is how a row is implemented, not a substitute for the row.

`redirect-plan.md`, in this order:

1. **Summary:** counts by status, and the biggest risk.
2. **Sources used,** and what wasn't available.
3. **Platform:** what you expect, and what is confirmed.
4. **Rules:** patterns, exceptions and their order. If two or three approaches are viable, compare them here, with what each costs.
5. **Decisions for a person:** rows you couldn't resolve, or where the destination is a judgment.
6. **Re-tagging notes.**
7. **Test plan:** before and after.
8. **Assumptions and open questions.**

Scale it down. A 30-page site needs the CSV and half a page. A longer document is not a more thorough one, but every old URL still gets a row, even a bad fit. Any shippable file (`.htaccess`, `_redirects`, host config) implements every redirecting row of `redirects.csv`, or marks each missing row as pending with a reason.

## Check it

```
node "${CLAUDE_SKILL_DIR}/scripts/redirect-check.mjs" redirects.csv --old old-urls.txt --new new-urls.txt
```

It reports old URLs with no row, chains and how to collapse them, loops, duplicate sources, a source equal to its destination, many sources sent home, statuses other than 301 or 410 with no reason, and a destination on a 410. A URL with a query string counts as distinct from its bare path, and it reports each one. `--old` wants a row per URL, so a URL matched only by a pattern, or still on the new site with no row, is a warning. `--new` also catches destinations that don't exist. Use its result; don't trace chains by eye. Fix every warning, or explain it in `redirect-plan.md`, before calling the map done, and re-run after each fix.

The script checks the map, not the site. It proves nothing about what the server does, so still crawl it. By hand: compare the shippable file against the CSV row by row.

## What Claude can't do here

- Know which pages matter to the organisation unless told, or decide what is truly gone.
- Invent traffic, inbound links or rankings. Don't say how much value a redirect keeps beyond what you can show.
- Say what a host supports. Query-string matching, 410s and case handling vary. Say what you would expect and tell the user to confirm it.
- Test production unless given access. Write the tests, and say which you ran.

## Where this hands off

- `information-architecture`: the front door, when the job spans several of these.
- `sitemaps` and `url-structure`: for the new tree and the new address rules. If pages also move to a new structure, say the sitemap needs a template type on every node and hand that to `sitemaps`.
- `content-inventory`: for the full list of what exists, and what to retire.
- `taxonomies`: for the term changes behind the re-tagging notes. `content-models`: for the archived status and CMS redirect log.
- `navigation` and `labeling`: to update menus and names that point at moved pages.
- `card-sort`, `tree-tests` and `findability`: for the research around the move, and to confirm people can still find things after it.
