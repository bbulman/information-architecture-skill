# Northgate Advisory: site migration plan (WordPress to static)

Prepared 24 October 2026 from `current-urls.txt` (34 URLs: the old sitemap plus a few from Google Search Console). Every path below is on `https://www.northgateadvisory.com`.

## Summary

Of the 34 URLs, **17 keep their exact address** on the new site and need no redirect, and **17 get a permanent (301) redirect**. Two of those 17, `/?p=112` and `/?page_id=7`, are WordPress ID links: you can't tell from the URL where they should go, but a one-minute lookup on the old site settles both (section 7.1). That lookup has to happen before WordPress is switched off.

The bigger risk is what the list leaves out. `/blog/page/3/` means the blog had a third page of posts, which at WordPress's default of 10 posts per page means 21 or more posts, yet the list names only three. The redirect rules include pattern rules that catch every dated post URL, so the missing posts still land in the right place provided each keeps its slug. Even so, build the full inventory (section 7.2) before launch.

The structure change is deliberately small. Every clean URL that already ranks stays where it is. Four things change:

1. Dated blog URLs move to `/insights/<slug>/`.
2. The blog and the whitepapers section merge into one Insights section.
3. The leftovers from a pre-WordPress site (`.html`, `.php`, mixed case) redirect to their modern equivalents.
4. WordPress's auto-generated archives redirect to the nearest real page.

## 1. Assumptions

You can't be asked questions during this run, so these are the calls I made. Each one is easy to reverse.

1. **The domain stays the same.** That means `www.northgateadvisory.com` over HTTPS, with `www` as the main host. If you're also changing domain, add Search Console's Change of Address step and redirect the old domain as well; the rest of the plan still applies.
2. **Nothing is being dropped.** All current services, industries, case studies and posts carry over. Change management is assumed to still be a service, even though its only known URL is the old `.php` one. If you've stopped offering it, redirect that URL to `/services/` instead.
3. **No host has been chosen yet.** The redirect file is written for Netlify, which handles every rule here in one file. Section 8 covers Vercel, Cloudflare Pages, Apache and nginx. GitHub Pages is ruled out because it can't send real redirects, only page-level refreshes, which pass rankings poorly.
4. **Page URLs end in a slash**, as WordPress's do now, so every kept URL stays exactly the same.
5. **Post slugs don't change.** Only the folder in front of them changes.
6. **Only leaders get bio pages, as now.** The 15-person team appears on one team page.
7. **Copy carries over unchanged at launch.** That covers titles, meta descriptions, headings and body text. Rewrite after rankings settle, not on the same day the URLs change, so that if something drops you know which change caused it.

## 2. What the URL list shows

The 34 URLs come from three generations of the site.

- **A site older than WordPress.** `/about-us.html`, `/About_Us/Our-Team` and `/services/change-management.php` use naming no WordPress install produces. Google still reports them, which usually means something outside the site, such as an old directory listing, a partner page or a press piece, still links to them. They're worth more than they look, so each one gets an exact redirect.
- **WordPress content pages.** Services, industries, case studies, bios, contact, careers and privacy. These are clean and stay as they are.
- **WordPress machinery.**
  - `?p=112` is WordPress's shortlink format, which it prints in the head of every post.
  - `?page_id=7` is how WordPress addresses pages before "pretty" permalinks are switched on, so it probably dates from the site's first days. The low ID fits that.
  - The rest are auto-generated: the pagination at `/blog/page/N/`, the `/category/`, `/tag/` and `/author/` archives, the dated post folders, and the media library file under `/wp-content/uploads/`.

The list also has gaps:

- **Posts are missing.** The pagination implies 21 or more posts, but only three appear. Check Settings > Reading > "Blog pages show at most". If it's set below 10, the gap is smaller, but it's still a gap.
- **`/about-us/` itself is missing**, though two pages sit beneath it. Either it exists and dropped out of the sitemap (it may be page 7), or the about content only ever lived at `about-us.html`. Either way, the new site has a real `/about-us/` page.
- **There are no hub pages for `/industries/` or `/resources/`.** People reach parent folders by trimming URLs, so the new site gets an `/industries/` hub, and `/resources/` redirects.
- **Only one media library file is listed.** There are probably other PDFs.
- **`/thank-you/` shouldn't be in a sitemap or in Google.** It's a form confirmation page.
- **`/author/admin/` reveals the WordPress login name.** This stops mattering once WordPress is gone. If you keep the old install running anywhere, rename that account's author slug.

## 3. New site structure

```
/                                            Home
├── services/                                Services overview
│   ├── strategy-consulting/
│   │   └── strategic-planning-workshops/
│   ├── operations/
│   │   └── process-improvement/
│   └── change-management/                   new address (was change-management.php)
├── industries/                              new hub page
│   ├── healthcare/
│   └── manufacturing/
├── case-studies/
│   ├── regional-hospital-network-turnaround/
│   └── acme-manufacturing-lean-rollout/
├── insights/                                new home for the blog (was /blog/)
│   ├── the-5-whys-still-works/              was /2019/04/12/the-5-whys-still-works/
│   ├── remote-strategy-sessions/            was /2021/09/30/remote-strategy-sessions/
│   ├── why-strategic-plans-fail/            was /2023/02/14/why-strategic-plans-fail/
│   ├── <every other post>/                  same slug as today
│   ├── reports/                             was /resources/whitepapers/
│   │   └── operations-benchmark-report/     new landing page for the PDF
│   └── feed.xml                             RSS feed
├── about-us/                                About
│   ├── team/                                new page (was /About_Us/Our-Team)
│   └── leadership/
│       ├── jane-ortiz/
│       └── sam-reid/
├── careers/
├── contact-us/
├── privacy-policy/
├── thank-you/                               noindex, not in the sitemap
├── downloads/
│   └── operations-benchmark-report-2022.pdf
├── sitemap.xml
├── robots.txt
└── 404.html
```

**Navigation.** The header has six items: Services, Industries, Case Studies, Insights, About, and Contact (styled as a button). Careers goes under About and in the footer, since a firm of 15 hires now and then and candidates look in the footer. The footer repeats the main sections and adds Team, Reports, Careers and Privacy Policy. Every page below the top level shows breadcrumbs that follow its folders, for example Home › Services › Operations › Process improvement. Bios read Home › About › Team › Jane Ortiz.

**Why this much change and no more.**

- **Kept:** every clean URL. A URL that doesn't change can't lose anything. A redirect passes almost all of a page's value, but Google needs time to re-process it, and rankings can wobble while it does. The services naming is slightly inconsistent (`strategy-consulting` against plain `operations`), and I've left it alone. Tidying it would put redirects on your most commercially important pages for no search benefit.
- **Moved:** the posts. WordPress filed them in dated folders at the root of the site, and they need a proper section. A date in the URL makes evergreen advice look old: "the 5 whys still works" sits under 2019. One folder also lets you filter the whole section's performance in Search Console and Analytics with a single rule. One pattern rule moves every post, including the ones missing from the list, so the move is cheap.
- **Merged:** Blog and Resources > Whitepapers become Insights. For a firm your size, your thinking reads better as one section than as two thin ones, and your WordPress category was already called "Insights".
- **Fixed:** the pre-WordPress leftovers and WordPress's archive pages.

**Cross-links to build.** Internal links help the pages they point at rank. These pairings are inferred from the page titles, so adjust them to what the pages actually say.

| Page | Should link to |
|---|---|
| Strategic planning workshops | Why strategic plans fail; Remote strategy sessions |
| Process improvement | Acme lean rollout case study; The 5 whys still works; Operations benchmark report |
| Healthcare | Regional hospital network turnaround |
| Manufacturing | Acme lean rollout case study; Operations benchmark report |
| Each case study | The service and the industry it belongs to |
| Each article | The service it relates to, plus one case study |

## 4. URL rules for the new site

1. **One host.** `http://` and the bare `northgateadvisory.com` redirect to `https://www.northgateadvisory.com` in one hop, keeping the path.
2. **Lowercase letters, digits and hyphens only.** No underscores, capitals, spaces or file extensions on page URLs.
3. **Page URLs end in a slash** (`/services/`). Files keep their extension and have no slash (`/sitemap.xml`, `/downloads/....pdf`).
4. **The first folder says what kind of page it is.** Only these exist: `services`, `industries`, `case-studies`, `insights`, `about-us`, `careers`, `contact-us`, plus `downloads` for files.
5. **No dates in page URLs.** Show the published date and the updated date on the article instead.
6. **At most three folders deep.** `/services/operations/process-improvement/` is the deepest page.
7. **No query strings for content.** Topic filters on the Insights page work within the page and don't create separate URLs. That's why there are no tag pages.
8. **A published URL is permanent.** Renaming a page means adding its 301 in the same change, and no redirect is ever deleted.
9. **Reserved slugs.** `reports`, `page` and `feed.xml` under `/insights/` are reserved, so no article can use them.

Where new content goes:

| New content | URL pattern |
|---|---|
| Service | `/services/<service>/`, or `/services/<service>/<offering>/` for a named offering |
| Industry | `/industries/<industry>/` |
| Case study | `/case-studies/<client-or-sector>-<what-changed>/` |
| Article | `/insights/<short-topic-slug>/` |
| Report | landing page `/insights/reports/<report>/`; file `/downloads/<report>-<year>.pdf` |
| Leader bio | `/about-us/leadership/<first>-<last>/` |
| Job opening | `/careers/<role>/`, only if roles get their own pages |

The Insights hub stays a single page until it holds about 30 articles. After that it paginates as `/insights/page/2/`.

## 5. Redirect map

All redirects are permanent (301; a 308 is equally fine for Google) and go from the old URL **straight to the final URL in one hop**. Every destination must return 200: not another redirect, and not a 404.

The weight column ranks what to test first and watch hardest after launch:

- **High:** a content page or file that can rank or carry backlinks.
- **Medium:** a hub page or a legacy URL that is probably linked from elsewhere.
- **Low:** an archive that Google would drop anyway.

### Table A: every URL in current-urls.txt

| # | Current URL | New URL | Code | Why | Weight |
|---|---|---|---|---|---|
| 1 | `/` | same | 200 | Homepage | |
| 2 | `/?p=112` | the post's new URL, e.g. `/insights/<slug>/` (resolve in 7.1) | 301 | WordPress shortlink for item 112 | Medium |
| 3 | `/?page_id=7` | the page's new URL (resolve in 7.1) | 301 | Early WordPress link to page 7 | Medium |
| 4 | `/about-us.html` | `/about-us/` | 301 | Pre-WordPress about page | Medium |
| 5 | `/About_Us/Our-Team` | `/about-us/team/` | 301 | Pre-WordPress team page; the new team page replaces it | Medium |
| 6 | `/about-us/leadership/jane-ortiz/` | same | 200 | Leader bio; ranks for her name | |
| 7 | `/about-us/leadership/sam-reid/` | same | 200 | Leader bio | |
| 8 | `/services/` | same | 200 | Services overview | |
| 9 | `/services/strategy-consulting/` | same | 200 | Service page | |
| 10 | `/services/strategy-consulting/strategic-planning-workshops/` | same | 200 | Service page | |
| 11 | `/services/operations/` | same | 200 | Service page | |
| 12 | `/services/operations/process-improvement/` | same | 200 | Service page | |
| 13 | `/services/change-management.php` | `/services/change-management/` | 301 | The only known URL for this service; it becomes a normal page | High |
| 14 | `/industries/healthcare/` | same | 200 | Industry page | |
| 15 | `/industries/manufacturing/` | same | 200 | Industry page | |
| 16 | `/case-studies/` | same | 200 | Case study hub | |
| 17 | `/case-studies/regional-hospital-network-turnaround/` | same | 200 | Case study | |
| 18 | `/case-studies/acme-manufacturing-lean-rollout/` | same | 200 | Case study | |
| 19 | `/blog/` | `/insights/` | 301 | The blog becomes Insights | Medium |
| 20 | `/blog/page/2/` | `/insights/` | 301 | Pagination; Insights is a single page for now | Low |
| 21 | `/blog/page/3/` | `/insights/` | 301 | Pagination | Low |
| 22 | `/2019/04/12/the-5-whys-still-works/` | `/insights/the-5-whys-still-works/` | 301 | Dated post, same slug | High |
| 23 | `/2021/09/30/remote-strategy-sessions/` | `/insights/remote-strategy-sessions/` | 301 | Dated post, same slug | High |
| 24 | `/2023/02/14/why-strategic-plans-fail/` | `/insights/why-strategic-plans-fail/` | 301 | Dated post, same slug | High |
| 25 | `/category/uncategorized/` | `/insights/` | 301 | WordPress default category archive | Low |
| 26 | `/category/insights/` | `/insights/` | 301 | Same content as the new hub | Low |
| 27 | `/tag/strategy/` | `/insights/` | 301 | Tag archive; the new site has topic filters, not tag pages | Low |
| 28 | `/author/admin/` | `/insights/` | 301 | Author archive | Low |
| 29 | `/resources/whitepapers/` | `/insights/reports/` | 301 | Whitepapers merge into Insights | Medium |
| 30 | `/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf` | `/downloads/operations-benchmark-report-2022.pdf` | 301 | The same file at a new address; reports collect backlinks | High |
| 31 | `/contact-us/` | same | 200 | Contact | |
| 32 | `/careers/` | same | 200 | Careers | |
| 33 | `/privacy-policy/` | same | 200 | Update the text to name the new form and analytics providers | |
| 34 | `/thank-you/` | same | 200, noindex | Form confirmation. The path stays because form and ad conversion tracking may depend on it. Add `noindex` and keep it out of the sitemap | |

The PDF redirects to the PDF, not to its new landing page, so whatever ranks or is linked today still gets the same document. The landing page links to the file and earns its own rankings over time. Keep the file ungated: putting a form in front of a redirect target loses the ranking.

### Table B: safety-net rules for URLs not in the list

These cover URLs that certainly or very probably exist although the list doesn't name them.

| # | Old URL | New URL | Why |
|---|---|---|---|
| B1 | `/about-us/leadership/` | `/about-us/team/` | Parent of the bios; people trim URLs |
| B2 | `/about_us/our-team`, `/About_Us/Our-Team/` (any case, with or without the slash) | `/about-us/team/` | Older servers often answered in any case |
| B3 | `/About_Us/*`, `/about_us/*` | `/about-us/` | Any other page from the old About_Us folder |
| B4 | `/YYYY/MM/DD/<slug>/` for any year | `/insights/<slug>/` | Posts missing from the list |
| B5 | `/YYYY/`, `/YYYY/MM/`, `/YYYY/MM/DD/`, and anything deeper than a post (`/feed/`, `/amp/`, comment pages) | `/insights/` | Date archives and post sub-pages |
| B6 | `/blog/page/*`, `/category/*`, `/tag/*`, `/author/*` | `/insights/` | Every other archive page |
| B7 | `/feed/`, `/blog/feed/`, `/comments/feed/` | `/insights/feed.xml` | Feed readers and email tools that poll the old feed |
| B8 | `/sitemap_index.xml`, `/wp-sitemap.xml`, `/post-sitemap.xml`, `/page-sitemap.xml` | `/sitemap.xml` | Whichever sitemap Search Console has on file |
| B9 | `/resources/`, `/resources/*` | `/insights/reports/` | Parent of whitepapers, and any other resources page |
| B10 | `/index.php` | `/` | WordPress's front controller, sometimes linked |
| B11 | Every other document under `/wp-content/uploads/` | its new `/downloads/` path | One rule per file, listed from 7.2 |

## 6. URLs that should simply 404

Not everything should redirect. Sending junk to the homepage is treated by Google as a "soft 404" and helps nothing.

- **WordPress internals.** `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*`, `/wp-includes/*`, `/wp-content/themes/*` and `/wp-content/plugins/*` should all 404. Bots will probe these for years, so expect a spike of 404s for them after launch and ignore it.
- **Images in `/wp-content/uploads/`** should 404 too, unless Search Console's Links report shows an outside site linking to a specific image.
- **Search results (`/?s=<term>`) need no rule.** A static host ignores the query string and shows the homepage, and the homepage's canonical tag tells Google to fold the URL in. The same thing happens to any `?p=` or `?page_id=` link you don't add a rule for.
- **Show a useful custom 404 page,** with the navigation and a link to Insights. It must return a real 404 status, not a 200.

## 7. Before launch: close the gaps

### 7.1 Resolve the two ID links (needs the old site still running)

Open `https://www.northgateadvisory.com/?p=112` and `https://www.northgateadvisory.com/?page_id=7` in a browser. WordPress redirects each one to the item's real address, so note where they land. Then map that address through Table A. A post goes to `/insights/<slug>/`, and a page goes to its unchanged or new address.

If a link doesn't redirect, look the IDs up in the database. This read-only query works if your table prefix is `wp_`:

```sql
SELECT ID, post_type, post_status, post_name, post_parent
FROM wp_posts
WHERE ID IN (7, 112);
```

If an ID turns out to be a draft, a revision or a deleted item, there's nothing equivalent to send it to. Leave its rule out, and the URL will show the homepage, which Google folds in. If Search Console shows other `?p=` URLs, resolve them the same way.

### 7.2 Build the full inventory

The list you have covers what Google and the sitemap know about, not everything that exists. Before launch, merge these into one spreadsheet of old URLs:

1. **Every published post and page.** In WordPress, use Tools > Export, or run WP-CLI: `wp post list --post_type=post,page --post_status=publish --fields=ID,post_type,post_name,url --format=csv`.
2. **A crawl of the live site** with Screaming Frog, which is free up to 500 URLs. It also records each page's title, meta description, H1 and canonical tag as Google sees them. This is your content-parity baseline, and it captures what your SEO plugin produced without having to dig it out of the database.
3. **Search Console's Performance > Pages export**, covering the last 16 months, plus the Pages (indexing) report.
4. **Search Console's Links > Top linked pages.** Add Ahrefs or Semrush if you have them.
5. **Analytics landing pages** for the last 12 months.
6. **Every document in the media library:** `find wp-content/uploads -type f \( -iname '*.pdf' -o -iname '*.docx' -o -iname '*.pptx' -o -iname '*.xlsx' \)`.

Every URL that turns up and isn't in Table A gets one of three treatments: a kept page, an exact redirect, or a deliberate 404 from section 6.

### 7.3 Generate a rule for every post

Run this on the old server and paste the output into the `_redirects` file at the marked spot:

```bash
wp post list --post_type=post --post_status=publish \
  --fields=ID,post_name,url --format=csv \
| tail -n +2 \
| while IFS=, read -r id slug url; do
    echo "/${url#*://*/}  /insights/$slug/  301"
  done > post-redirects.txt
```

The pattern rules in section 8 would catch these posts anyway. Exact rules are better because they don't depend on the year list being complete, and they double as the checklist of posts the new site must contain.

### 7.4 Take a benchmark

Before launch, save the Search Console and Analytics exports from 7.2. Also record where you rank today for 15 to 20 terms that bring in work, such as "strategic planning workshop facilitator" and "process improvement consultant", plus your city if you sell locally. Without a "before", nobody can tell after launch whether a dip is real.

## 8. Implementation

### 8.1 Netlify `_redirects` file

Put this file in the root of the published site. Netlify uses the first rule that matches, so keep the order. A status ending in `!` is "forced": it fires even though a page exists at that path. The ID links need it because they sit on `/`. In Netlify's domain settings, make `www.northgateadvisory.com` the primary domain, so the bare domain and `http://` redirect there automatically.

```
# _redirects for www.northgateadvisory.com (Netlify syntax). First match wins.

# 1. WordPress ID links. Uncomment each line once section 7.1 gives its target.
# /  p=112      /insights/SLUG-OF-ITEM-112/   301!
# /  page_id=7  /PATH-OF-PAGE-7/              301!

# 2. Pre-WordPress URLs. Both casings are listed in case the host matches case-sensitively.
/about-us.html                      /about-us/                      301
/About_Us/Our-Team                  /about-us/team/                 301
/about_us/our-team                  /about-us/team/                 301
/About_Us/*                         /about-us/                      301
/about_us/*                         /about-us/                      301
/services/change-management.php     /services/change-management/    301

# 3. About
/about-us/leadership                /about-us/team/                 301

# 4. Posts named in current-urls.txt
/2019/04/12/the-5-whys-still-works    /insights/the-5-whys-still-works/    301
/2021/09/30/remote-strategy-sessions  /insights/remote-strategy-sessions/  301
/2023/02/14/why-strategic-plans-fail  /insights/why-strategic-plans-fail/  301

# 5. Every other post: paste post-redirects.txt from section 7.3 here.

# 6. Safety net for dated posts and date archives, one pair per year.
#    Trim or extend to the years you actually published in.
/2015/:month/:day/:slug   /insights/:slug/   301
/2015/*                   /insights/         301
/2016/:month/:day/:slug   /insights/:slug/   301
/2016/*                   /insights/         301
/2017/:month/:day/:slug   /insights/:slug/   301
/2017/*                   /insights/         301
/2018/:month/:day/:slug   /insights/:slug/   301
/2018/*                   /insights/         301
/2019/:month/:day/:slug   /insights/:slug/   301
/2019/*                   /insights/         301
/2020/:month/:day/:slug   /insights/:slug/   301
/2020/*                   /insights/         301
/2021/:month/:day/:slug   /insights/:slug/   301
/2021/*                   /insights/         301
/2022/:month/:day/:slug   /insights/:slug/   301
/2022/*                   /insights/         301
/2023/:month/:day/:slug   /insights/:slug/   301
/2023/*                   /insights/         301
/2024/:month/:day/:slug   /insights/:slug/   301
/2024/*                   /insights/         301
/2025/:month/:day/:slug   /insights/:slug/   301
/2025/*                   /insights/         301
/2026/:month/:day/:slug   /insights/:slug/   301
/2026/*                   /insights/         301

# 7. Blog archives
/blog                     /insights/          301
/blog/page/*              /insights/          301
/category/insights        /insights/          301
/category/*               /insights/          301
/tag/*                    /insights/          301
/author/*                 /insights/          301

# 8. Feeds and old sitemaps
/feed                     /insights/feed.xml  301
/blog/feed                /insights/feed.xml  301
/comments/feed            /insights/feed.xml  301
/sitemap_index.xml        /sitemap.xml        301
/wp-sitemap.xml           /sitemap.xml        301
/post-sitemap.xml         /sitemap.xml        301
/page-sitemap.xml         /sitemap.xml        301

# 9. Resources and files
/resources/whitepapers    /insights/reports/  301
/resources                /insights/reports/  301
/resources/*              /insights/reports/  301
/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf   /downloads/operations-benchmark-report-2022.pdf   301
# Other documents found in section 7.2: one line each, here.

# 10. WordPress entry point
/index.php                /                   301
```

Two things to confirm on the first deploy preview, because the test in section 9 will show them:

- **The ID rules.** Netlify documents query-string matching using placeholders (`id=:id`), so check that a fixed value like `p=112` matches. If it doesn't, use `/ p=:id /wp-id/:id 301!` together with exact rules such as `/wp-id/112 /insights/<slug>/ 301`. That costs one extra hop, but only for these two URLs.
- **Query strings on the destination.** Check whether `?p=112` gets carried over to the new URL. It's harmless, since the canonical tag folds it in, but it's cleaner without.

### 8.2 Other hosts

Most lines translate one for one. Only the ID links and the date patterns need host-specific syntax.

- **Cloudflare Pages.** The same `_redirects` file works, apart from the two ID lines. Pages can't match query strings, and it doesn't support `!`. Handle the ID links with a Cloudflare Redirect Rule instead, using the expression `http.request.uri.path eq "/" and http.request.uri.query eq "p=112"`, a static 301 target, and "preserve query string" off. This file sits well inside the Pages limits of 2,000 static and 100 dynamic rules.
- **Vercel.** In `vercel.json`, set `"trailingSlash": true` and add rules like these:
  ```json
  { "source": "/", "has": [{ "type": "query", "key": "p", "value": "112" }],
    "destination": "/insights/SLUG-OF-ITEM-112/", "permanent": true },
  { "source": "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
    "destination": "/insights/:slug/", "permanent": true }
  ```
  Vercel's `permanent` sends a 308, which Google treats the same as a 301.
- **Apache (`.htaccess`).** Use mod_rewrite for everything, without mixing in `Redirect` lines, so the order stays predictable:
  ```apache
  RewriteEngine On
  RewriteCond %{QUERY_STRING} (^|&)p=112(&|$)
  RewriteRule ^$ /insights/SLUG-OF-ITEM-112/ [R=301,L,QSD]
  RewriteCond %{QUERY_STRING} (^|&)page_id=7(&|$)
  RewriteRule ^$ /PATH-OF-PAGE-7/ [R=301,L,QSD]
  RewriteRule ^about_us/our-team/?$ /about-us/team/ [R=301,L,NC]
  RewriteRule ^about_us(/.*)?$ /about-us/ [R=301,L,NC]
  RewriteRule ^(?:19|20)\d\d/\d\d/\d\d/([^/]+)(?:/.*)?$ /insights/$1/ [R=301,L]
  RewriteRule ^(?:19|20)\d\d(?:/\d\d){0,2}/?$ /insights/ [R=301,L]
  ```
- **nginx.**
  ```nginx
  location = / {
      if ($arg_p = "112")     { return 301 /insights/SLUG-OF-ITEM-112/; }
      if ($arg_page_id = "7") { return 301 /PATH-OF-PAGE-7/; }
      try_files /index.html =404;
  }
  rewrite "^/(?:19|20)\d\d/\d\d/\d\d/([^/]+)(?:/.*)?$" /insights/$1/ permanent;
  ```

### 8.3 Generator settings

Whatever builds the site has to output each page as `folder/index.html`, so that URLs keep their trailing slash, and has to put posts under `/insights/`.

- **Hugo:** the default pretty URLs, plus `[permalinks] posts = "/insights/:slug/"`.
- **Eleventy:** a `posts.json` directory data file containing `"permalink": "/insights/{{ page.fileSlug }}/"`.
- **Astro:** `trailingSlash: "always"` with `build.format: "directory"`.

## 9. Testing the redirects

Save the following as `redirect-tests.txt`. Each line holds a path and what it must do: `200` means it loads directly, and a path means it must 301 to that path in one hop, onto a page that loads.

```
# Kept URLs: must load at exactly this address
/                                                              200
/about-us/leadership/jane-ortiz/                               200
/about-us/leadership/sam-reid/                                 200
/services/                                                     200
/services/strategy-consulting/                                 200
/services/strategy-consulting/strategic-planning-workshops/    200
/services/operations/                                          200
/services/operations/process-improvement/                      200
/industries/healthcare/                                        200
/industries/manufacturing/                                     200
/case-studies/                                                 200
/case-studies/regional-hospital-network-turnaround/            200
/case-studies/acme-manufacturing-lean-rollout/                 200
/contact-us/                                                   200
/careers/                                                      200
/privacy-policy/                                               200
/thank-you/                                                    200

# New pages and files
/about-us/                                                     200
/about-us/team/                                                200
/services/change-management/                                   200
/industries/                                                   200
/insights/                                                     200
/insights/the-5-whys-still-works/                              200
/insights/remote-strategy-sessions/                            200
/insights/why-strategic-plans-fail/                            200
/insights/reports/                                             200
/insights/reports/operations-benchmark-report/                 200
/insights/feed.xml                                             200
/downloads/operations-benchmark-report-2022.pdf                200
/sitemap.xml                                                   200
/robots.txt                                                    200

# Redirects from current-urls.txt (uncomment the first two after 7.1)
# /?p=112                                                      /insights/SLUG-OF-ITEM-112/
# /?page_id=7                                                  /PATH-OF-PAGE-7/
/about-us.html                                                 /about-us/
/About_Us/Our-Team                                             /about-us/team/
/services/change-management.php                                /services/change-management/
/blog/                                                         /insights/
/blog/page/2/                                                  /insights/
/blog/page/3/                                                  /insights/
/2019/04/12/the-5-whys-still-works/                            /insights/the-5-whys-still-works/
/2021/09/30/remote-strategy-sessions/                          /insights/remote-strategy-sessions/
/2023/02/14/why-strategic-plans-fail/                          /insights/why-strategic-plans-fail/
/category/uncategorized/                                       /insights/
/category/insights/                                            /insights/
/tag/strategy/                                                 /insights/
/author/admin/                                                 /insights/
/resources/whitepapers/                                        /insights/reports/
/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf    /downloads/operations-benchmark-report-2022.pdf

# Safety net
/about-us/leadership/                                          /about-us/team/
/about_us/our-team                                             /about-us/team/
/About_Us/Our-Team/                                            /about-us/team/
/2019/04/12/the-5-whys-still-works                             /insights/the-5-whys-still-works/
/2018/01/01/why-strategic-plans-fail/                          /insights/why-strategic-plans-fail/
/2019/04/                                                      /insights/
/2019/                                                         /insights/
/blog/page/7/                                                  /insights/
/category/news/                                                /insights/
/tag/operations/                                               /insights/
/author/jane/                                                  /insights/
/feed/                                                         /insights/feed.xml
/sitemap_index.xml                                             /sitemap.xml
/resources/                                                    /insights/reports/
/index.php                                                     /
```

The `/2018/01/01/why-strategic-plans-fail/` line is deliberate. It uses a real slug with the wrong date, so it can only pass through the pattern rule, which proves the safety net works.

Save this as `check-redirects.sh`. It runs with the bash and curl that come with macOS. I tested it against a local mock server: it passes correct redirects, and it flags missing pages, redirect chains, wrong targets, temporary 302s and missing rules.

```bash
#!/usr/bin/env bash
# check-redirects.sh: test every line of a redirect test file against a site.
# Usage: ./check-redirects.sh https://www.northgateadvisory.com redirect-tests.txt
# Each line is "<path> <expected>". <expected> is 200 (the page must load
# directly) or the path the URL must 301 to, in one hop, onto a page that loads.
set -u
base="${1%/}"
tests="$2"
pass=0
fail=0

while read -r path expected _; do
  case "$path" in ''|'#'*) continue ;; esac
  out=$(curl -s -o /dev/null --max-time 20 -w '%{http_code} %{redirect_url}' "$base$path")
  code="${out%% *}"
  location="${out#* }"

  if [ "$expected" = "200" ]; then
    if [ "$code" = "200" ]; then
      pass=$((pass + 1))
    else
      fail=$((fail + 1))
      echo "FAIL  $path  expected 200, got $code $location"
    fi
    continue
  fi

  if [ "$code" != "301" ] && [ "$code" != "308" ]; then
    fail=$((fail + 1))
    echo "FAIL  $path  expected a 301 to $expected, got $code $location"
    continue
  fi

  target="/${location#*://*/}"
  if [ "${target%%\?*}" != "$target" ]; then
    echo "NOTE  $path  the redirect keeps a query string: $target"
    target="${target%%\?*}"
  fi
  if [ "$target" != "$expected" ]; then
    fail=$((fail + 1))
    echo "FAIL  $path  redirects to $target, expected $expected"
    continue
  fi

  final=$(curl -s -o /dev/null --max-time 20 -w '%{http_code}' "$base$expected")
  if [ "$final" != "200" ]; then
    fail=$((fail + 1))
    echo "FAIL  $path  redirects correctly, but $expected returns $final"
    continue
  fi
  pass=$((pass + 1))
done < "$tests"

echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
```

Run it against the staging or preview address before launch, and against `https://www.northgateadvisory.com` straight after. Also check the host-level redirects by hand. Each command below should show a single 301 to `https://www.northgateadvisory.com/services/`:

```bash
curl -sI http://northgateadvisory.com/services/ | grep -iE '^(HTTP|location)'
curl -sI https://northgateadvisory.com/services/ | grep -iE '^(HTTP|location)'
```

## 10. Launch checklist

**On staging, before launch**

- Staging is password-protected or marked `noindex`, and the production build is neither. Check the meta robots tag, `robots.txt` and any `X-Robots-Tag` header. Shipping staging's noindex to production is the most common way a migration erases a site from Google.
- Every "same" URL in Table A loads at exactly the same path, trailing slash included.
- Titles, meta descriptions, H1s and body copy on the ranking pages match the old site. Compare them against the crawl from 7.2.
- Every page has an absolute canonical tag that points at itself (`https://www.northgateadvisory.com/...`).
- Internal links point at the new URLs directly. A crawl of staging should find zero internal redirects.
- `sitemap.xml` lists only kept and new URLs that return 200 and can be indexed. Leave out `/thank-you/`.
- `robots.txt` allows everything and names the sitemap.
- The 404 page returns a 404 status.
- Structured data is in place:
  - `Organization` on the homepage.
  - `Article` with `datePublished` and `dateModified` on each post. This matters more now that dates leave the URLs.
  - `Person` on bios.
  - `BreadcrumbList` everywhere.
- Analytics uses the same GA4 property.
- Search Console is verified by DNS record. If it's verified by a WordPress plugin tag or an uploaded file, that verification disappears with WordPress and locks you out of the reports you need most in launch week.
- The contact form works end to end, lands on `/thank-you/`, and fires its conversion.
- The redirect test passes 100% (section 9).
- A full WordPress backup (database plus `wp-content`) is stored safely for at least a year.
- If you're changing host, lower the DNS TTL to 5 minutes two days before launch.

**Launch day** (a Tuesday or Wednesday morning, never a Friday)

- Switch over, then rerun the redirect test against the live domain.
- In Search Console, submit `/sitemap.xml` and remove the old WordPress sitemap.
- Optional: also submit a temporary sitemap listing the old URLs, so Google recrawls them and sees the redirects sooner. Remove it after a month.
- Use URL Inspection to request indexing for the homepage, the service pages, and the top 10 landing pages from your benchmark.
- Don't use Search Console's Change of Address tool. It's only for moving to a new domain.
- Take WordPress offline. Don't leave it running on a subdomain, where Google can index a duplicate of the whole site.

## 11. After launch

- **Daily for two weeks:** check Search Console's Pages report under "Not found (404)", along with the host's 404 log. Any real old URL that shows up gets a redirect the same day. Ignore the bot probes listed in section 6.
- **Old URLs showing as "Page with redirect"** in Search Console is correct, not an error.
- **Weekly for three months:** compare clicks and impressions for each page against the benchmark. A wobble lasting two to six weeks is normal while Google processes the redirects. If a page is still down by more than about 30% after six weeks, check its redirect, its content against the old version, and the internal links pointing at it, in that order.
- **Keep the redirects forever.** They cost nothing, and old links in emails, decks and other people's websites never stop arriving.

## 12. Calls you might want to change

- **"Insights" or "Blog".** If you'd rather keep "Blog", put posts at `/blog/<slug>/`. Every rule works the same way with `/insights/` swapped for `/blog/`, and rows 19 to 21 then disappear.
- **The PDF's address.** The zero-risk alternative is to leave the PDF at its WordPress path in the static build. You lose only tidiness.
- **Where bios live.** Moving them to `/about-us/team/<name>/` would tidy the folders, at the cost of two redirects on pages that rank for your leaders' names. I kept them where they are because the move gains nothing in search.
