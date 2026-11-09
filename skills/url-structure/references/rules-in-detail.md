# URL rules in detail

The reasons behind the rules table, the fill-in form, and what `url-check.mjs` flags. Read this when a rule is disputed, or when writing rules from nothing.

## The rules and why

- **Stable.** Once published, a slug changes only with a 301. Every changed slug needs that 301 forever.
- **Readable.** `/customers/acme-corp`, not `/c/?id=42`. Slugs are content, not database ids.
- **Hierarchical.** The path mirrors the structure, so a URL tells you where you are. `/kitchen/mixers/stand-mixer` says more than `/p/8814`. Stability wins when the two conflict.
- **Lowercase kebab-case.** Enforce it at the platform and redirect mixed case and underscores.
- **No file extensions.** `/about`, not `/about.php`. The implementation is not the address.
- **Short slugs.** Drop filler words: `/best-way-to-x`, not `/the-best-way-to-x`. Readability is the gain.
- **One canonical form.** Decide on trailing slash or none, enforce it, and set canonical tags, or links and rankings split across duplicates.
- **Locales as a prefix.** `/en/`, `/de/`, with `hreflang` siblings and an `x-default`.
- **Query strings for state, not identity.** Filters, sorting and pagination can live in the query string. The thing itself shouldn't.

## Fill-in form

```
Case and separator: lowercase, kebab-case (redirect anything else)
Trailing slash: <yes | no>, enforced, with canonical tags
Extensions: none
Hierarchy: path mirrors the sitemap: /<section>/<type>/<slug>
Slug source: <title, trimmed of filler words, max ~60 characters>
IDs: never in the path; <where they live if needed>
Query strings: filters, sort, page only
Locales: /<locale>/ prefix, hreflang siblings, x-default at /
Changing a slug: automatic 301 from the old one, logged
```

## To confirm with the platform

Expect these to vary between hosts, routers and CMSs. State what you would expect and ask.

- Is matching case-sensitive? What happens to `/About`?
- Does the platform add or strip trailing slashes by itself, and does that count as a redirect?
- Can a slug change write a redirect automatically?
- Can it validate slugs on save?
- Can rules read the query string, or the path only?
- Does it generate `sitemap.xml` and canonical tags from the routes?

## What `url-check.mjs` flags

| Check | Severity | Flags |
|---|---|---|
| Spaces | Warning | A space or `%20` in the path |
| Uppercase | Warning | A capital in the path. Host, query and percent-escapes are ignored. |
| Underscores | Warning | An underscore in the path |
| File extensions | Warning | `.html`, `.php`, `.aspx`, `.jsp` and similar on a page |
| Trailing slash | Warning | Both forms in one list; lists the minority |
| Query-string ids | Warning | `id`, `p`, `cat`, `sku`, session ids, or any parameter ending `_id` or `Id` |
| Locale in query | Warning | `lang`, `language`, `locale`, `hl` |
| Duplicates | Warning | URLs that match after lowering case, swapping `_` for `-`, and dropping host, slash, extension, `index` and tracking parameters |
| Depth | Warning | Over 4 levels. A locale prefix doesn't count. |
| Hash navigation | Warning | A fragment on the homepage, or one starting `/` or `!` |
| Doubled slashes | Warning | `//` in the path |
| In-page anchors | Note | A fragment on an ordinary page |
| Files | Note | `.pdf`, images and the like. Not held to the page rules. |
| Numbers | Note | A segment of three or more digits that isn't a year |
| Long slugs | Note | Over 60 characters |
| Filler words | Note | A slug starting `the-`, `a-` or `an-` |
| Mixed form | Note | Both http and https, or both www and bare host |

A warning on `?p=2` may be paging rather than identity. Read it before acting on it.

Exit codes: 0 no warnings, 1 warnings, 2 bad input.
