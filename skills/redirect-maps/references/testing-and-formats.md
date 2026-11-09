# Testing and formats

The platform questions, when a blanket rule fails, the map format, the re-tagging form, how to test, and what `redirect-check.mjs` flags. Read this before writing rules, when building the CSV, or when planning the launch.

## What to confirm with the platform

| Ask | Why | If it can't |
|---|---|---|
| Can rules match on the query string? | Many static hosts and some rule files match the path alone | An edge function or application route |
| Can it answer 410? | Not all can | A useful 404, and say so |
| Is matching case-sensitive? | `/About_Us` may not match `/about_us` | A row per form, or a lowercase rule |
| Does it normalise slashes first? | Adds a hop before your rule | Write sources in the form it sees |
| Which rule wins, and is there a limit? | Order and rule caps vary | Specific rules first, patterns for bulk |
| Do rules apply to existing files? | Static files can bypass them | Delete the old file, or use a server rule |

## When a blanket rule is wrong

`/blog/*` to `/articles/*` is right only if every slug survives.

| Situation | Instead |
|---|---|
| Some slugs changed | Exceptions before the pattern |
| The section split into several | One row per page, or one pattern per new section |
| Retired pages sit under the pattern | 410 rows before the pattern, or they 301 to a 404 |
| The destination section has a redirect of its own | That makes chains: re-point the pattern |
| Content lives in the query string | A path pattern never sees it |

## The map

```
from,to,status,reason,rule,checked
/company/team,/about/team,301,section renamed,pattern /company/*,2026-03-02
/blog/old-announcement,,410,retired: outdated,own row,2026-03-02
/?p=112,/insights/why-plans-fail,301,resolved from CMS export,own row,
/contact,/contact,200,unchanged,none,
```

- Write sources exactly as they appear in the old list. Paths or full URLs both work.
- Write destinations in the new site's canonical form, so no row picks up a second hop.
- Quote any cell holding a comma.
- `rule` says how the row is implemented: the pattern that covers it, `own row`, or `none` for a 200.
- `checked` holds the date the row was crawled. Empty means not yet.

Column names also accepted: `old_url`, `source` for `from`; `new_url`, `destination`, `target` for `to`; `note`, `comment` for `reason`. A file with no header is read as from, to, status, reason.

A row marked 200 is accounted for and is not a redirect. Leave it out of the shippable file. A pattern row (`/blog/*`, `/blog/:slug`) is fine while drafting, but it stands in for no URL: `--old` warns about any old URL matched only by a pattern, and chains and loops aren't checked through patterns. For the final check, expand patterns to one row per URL. A wildcard never matches a URL with a query string unless the row names one, as in `/blog/*?p=*`.

## The shippable file

Syntax differs by host, so look it up for the actual platform. Then:

1. Generate the file from `redirects.csv` rather than writing it by hand.
2. Put exceptions before patterns.
3. Count them: every redirecting row in the CSV has its own rule in the file, or names a pattern that does.
4. Mark any row the platform can't express as pending, with a reason. A query-string source on a host that matches paths alone is the usual one.

## Re-tagging notes

```
Old term        New term         Items affected   Applied by   Release
Tips            How-to guides    <n or list>      <who>        <same release as the redirects>
Uncategorized   (retire)         <n>              <who>        items need a real term first
```

Term pages are URLs as well: `/tag/<old>` and `/category/<old>` need rows in the map.

## Before launch

1. Run `redirect-check.mjs` until it is clean or every remaining warning is explained in `redirect-plan.md`.
2. Freeze the map. A redirect added at the last minute misses the crawl below.
3. Load the rules on staging.
4. Crawl every old URL against staging. For each, check the status, the number of hops (one) and the final status (200, or 410 as marked).
5. Test by hand: one with a query string, one file, mixed case, each slash form, and something that should 410.

A simple crawl, given one full URL per line:

```
while read -r url; do
  curl -s -o /dev/null -L -w "%{http_code} %{num_redirects} %{url_effective} <- $url\n" "$url"
done < staging-urls.txt
```

Anything other than `200 1` or `410 0` wants a look. Pages that stay put show `200 0`.

## After launch

1. Re-run the crawl against production the same day.
2. Watch server logs and search-engine crawl reports for 404s on old URLs. Add rows for what the list missed.
3. Check the pages the user knows matter most.
4. Confirm internal links, canonical tags and `sitemap.xml` use the new addresses. Internal links should not lean on redirects.
5. Keep the redirects in place. Every changed slug needs its 301 forever.
6. Keep `redirects.csv`. The next restructure starts by re-checking it.

## What `redirect-check.mjs` flags

| Check | Severity | Flags |
|---|---|---|
| Coverage | Warning | An old URL with no row of its own, including one matched only by a pattern or still on the new site, or one covered only by a looser case or slash match |
| Query strings | Warning | An old query-string URL where only the bare path or a wildcard would catch it; a query-string source sent to its own bare path |
| Chains | Warning | Every source whose destination is another source, with the collapsed form. A destination's query string is ignored when following it, so a host that matches paths alone is covered. |
| Into a 410 | Warning | A redirect ending on a page marked gone |
| Loops | Warning | Cycles, and rows leading into them |
| Duplicates | Warning | One source on several rows |
| Self | Warning | Source equals destination, comparing scheme and host when either side has one. www to apex and http to https are moves. |
| Homepage | Warning | 3 or more sources and at least 5% of moves sent home, or 20 or more. Aliases such as `/index.html` don't count. |
| Status | Warning | Blank, or not 301 or 410 with no reason |
| Destination on a 410 | Warning | |
| No destination | Warning | A 3xx with an empty `to` |
| 200 that moves | Warning | A 200 row with a different destination |
| 200 with no destination | Warning | A 200 row with an empty `to` |
| Fragment | Warning | A source containing `#` |
| Missing destination | Warning | With `--new`: a destination not on the new list |
| Query sources, the same path with and without a query string, reasoned statuses, patterns, tracking-only, mixed destination forms | Note | Listed for reading |

When `from` holds paths and `to` holds full URLs, the destinations are read as another site, and a note says so.

Exit codes: 0 no warnings, 1 warnings, 2 bad input.
