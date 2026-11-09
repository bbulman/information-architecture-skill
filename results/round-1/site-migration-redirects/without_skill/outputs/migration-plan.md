# Northgate Advisory: website migration plan

WordPress to static site. Prepared 24 October 2026 from `current-urls.txt` (34 URLs).

## 1. Summary

Of the 34 URLs in your file, **16 keep exactly the same address and 18 get a permanent (301) redirect** to a new home. Section 6 accounts for every one of the 34. Two of the redirects start from WordPress ID links (`/?p=112` and `/?page_id=7`). Their destination can only be read from your WordPress install, so they need a one-minute lookup before launch. Pattern rules catch the URLs that are not on your list but that WordPress almost certainly published: other blog posts, date and tag archives, feeds and uploaded files.

The plan protects rankings by changing as little as possible. Every URL that is already clean, lowercase and meaningful keeps its address. The URLs that change fall into two groups: WordPress plumbing that a static site cannot or should not reproduce (date-based post URLs, archives, pagination, ID links, `wp-content` files), and leftovers from an older site (`.html`, `.php`, `Mixed_Case`).

**Do these three things while WordPress is still running:**

1. **Look up the two ID links** (rows 2 and 3 in section 6.1). Section 6.1 explains how.
2. **Export the full list of published posts.** Your file has three posts, but `/blog/page/3/` means WordPress was splitting the blog index across at least three pages. At its default of 10 posts per page, that is at least 21 posts. Every post must be rebuilt on the new site with its current slug. The pattern rules then redirect them all, including the ones missing from your list.
3. **Export any redirects the current site already does**, from the Redirection plugin, Yoast Premium or the server's `.htaccess`. They vanish with WordPress unless you copy them into the new rules.

**Assumptions** (I could not ask, so I chose these; change any that are wrong):

- The domain stays `https://www.northgateadvisory.com`: same name, https and www. Changing the domain at the same time would make this a much riskier move.
- No host has been chosen yet. Section 7 gives ready-to-use rules for Netlify (with notes for Cloudflare Pages) and for Apache, plus notes for other hosts.
- Page content stays substantially the same at launch. Rewrite copy afterwards, once rankings have settled.
- Your file contains no `/about-us/` URL, so I have treated `/about-us.html` as the current About page and given it the new address `/about-us/`.
- WordPress used its default of 10 posts per page.

## 2. What the URL list tells us

| What it is | Lines in your file | What happens |
|---|---|---|
| Clean pages: home, services, industries, case studies, whitepapers, contact, careers, privacy, thank-you | 1, 8-12, 14-18, 29, 31-34 | Keep the same URL |
| Blog posts on WordPress date URLs | 22-24 | Move to `/insights/<same slug>/` |
| WordPress lists: blog index, numbered pages, category, tag and author archives | 19-21, 25-28 | Fold into one `/insights/` page |
| WordPress ID links | 2-3 | Redirect to the real page, once looked up |
| Leftovers from an older, pre-WordPress site | 4, 5, 13 | Redirect to the matching new page |
| Leadership bios | 6-7 | Move under `/about-us/team/` |
| A file in WordPress's uploads folder | 30 | Move next to the whitepapers page |

Things worth knowing:

- **Your list is missing posts.** Three blog index pages mean roughly 21 to 30 posts, but only three post URLs appear. Either the sitemap you copied was one of several (Yoast splits its sitemap into post, page and category files) or posts were removed. Section 9 lists where to find the rest.
- **The odd URLs come from two earlier versions of the site.** `.html`, `.php` and `About_Us/Our-Team` look like a hand-built site that predates WordPress. `?p=` and `?page_id=` are WordPress's raw addresses. Google remembers URLs like these for years if anything still links to them, so check your backlinks for others in the same style (section 9).
- **Some folders have no page.** `/about-us/`, `/about-us/leadership/`, `/industries/` and `/resources/` appear only as parents of other URLs. The new site builds a page at each of them or redirects it.
- **`/thank-you/` was in your sitemap.** A form confirmation page should not appear in search results. Visitors who land on it from Google skip the form, and they inflate your conversion figures.
- **`/author/admin/` publishes your WordPress login name.** It disappears with WordPress. Just don't recreate author pages named after login accounts.

## 3. New site structure

```
/                                              Home
/services/                                     Services overview
    /services/strategy-consulting/
        /services/strategy-consulting/strategic-planning-workshops/
    /services/operations/
        /services/operations/process-improvement/
    /services/change-management/               NEW URL (was change-management.php)
/industries/                                   NEW PAGE (overview of both industries)
    /industries/healthcare/
    /industries/manufacturing/
/case-studies/
    /case-studies/regional-hospital-network-turnaround/
    /case-studies/acme-manufacturing-lean-rollout/
/insights/                                     NEW URL (was /blog/)
    /insights/the-5-whys-still-works/          NEW URL (same slug)
    /insights/remote-strategy-sessions/        NEW URL (same slug)
    /insights/why-strategic-plans-fail/        NEW URL (same slug)
    /insights/<slug>/                          every other post, same slug as today
    /insights/feed.xml                         RSS feed
/resources/whitepapers/
    /resources/whitepapers/operations-benchmark-report/       NEW PAGE (landing page, recommended)
    /resources/whitepapers/operations-benchmark-report.pdf    NEW URL for the PDF
/about-us/                                     NEW URL (was about-us.html)
    /about-us/team/                            NEW PAGE (all 15 people)
        /about-us/team/jane-ortiz/             NEW URL (was /about-us/leadership/jane-ortiz/)
        /about-us/team/sam-reid/               NEW URL (was /about-us/leadership/sam-reid/)
/careers/
/contact-us/
/thank-you/                                    kept, but noindex and left out of the sitemap
/privacy-policy/
/media/...                                     old wp-content/uploads files, same folder layout
/404.html   /sitemap.xml   /robots.txt
```

**Main menu:** Services, Industries, Case Studies, Insights, About, and Contact as a button.

- Services: Strategy Consulting (with Strategic Planning Workshops beneath it), Operations (with Process Improvement), Change Management
- Industries: Healthcare, Manufacturing
- Insights: Articles, Whitepapers
- About: Our Firm, Team, Careers

**Footer:** the same sections, plus Whitepapers, Careers, Privacy Policy and your LinkedIn page.

Careers sits under About in the menu and Whitepapers under Insights, while their URLs stay at `/careers/` and `/resources/whitepapers/`. That is deliberate. You can rearrange a menu whenever you like, but a URL should never change.

**How the sections link to each other.** The site earns its keep through cross-links, which help visitors and search engines alike:

- Each service page links to the case studies and two or three articles that show the service in action.
- Each industry page lists its case studies: the hospital turnaround under Healthcare, the Acme lean rollout under Manufacturing.
- Each case study links back to its service and its industry.
- Each article links to the one service it relates to.

## 4. URL rules

These rules apply to every page you add from now on.

1. **Lowercase letters, numbers and hyphens only.** No capitals, no underscores and no file extensions such as `.html` or `.php`. The only exceptions are real files, such as `.pdf` and `.xml`.
2. **Every page URL ends in a slash**, as WordPress's did (`/services/`, not `/services` or `/services.html`). Set your site generator to output `folder/index.html`. This one setting matters more than any other: get it wrong and every page on the site either redirects or exists twice.
3. **Slugs describe the page, with no dates or ID numbers.** An article from 2019 stays relevant without a year in its address.
4. **At most three folders deep.** The deepest page is `/services/strategy-consulting/strategic-planning-workshops/`.
5. **Every parent folder is either a page or a redirect.** Someone who trims a URL back to `/industries/` should land somewhere useful.
6. **A published URL never changes.** If one must, add its 301 in the same deploy and point it straight at the final address. Never chain one redirect into another.
7. **One address per page.** Use `https://www.` everywhere, give every page a canonical tag that points to itself, and redirect `http://` and non-www requests to it.
8. **Six top-level sections:** `services`, `industries`, `case-studies`, `insights`, `resources` and `about-us`, plus the single pages `careers`, `contact-us`, `privacy-policy` and `thank-you`. A new page goes inside one of these sections. A new top-level folder should be a deliberate decision.

## 5. Decisions and why

**5.1 Every clean URL keeps its address.** That is 16 of your 34. A URL that keeps its address keeps its rankings with no risk at all. A redirected URL usually keeps them too, but it can wobble for a few weeks. So nothing is renamed for looks. `/services/operations/` stays, even though `/services/operations-consulting/` would match its sibling. `/about-us/` and `/contact-us/` keep their "-us", which also keeps the pair consistent.

**5.2 Blog posts move to `/insights/<slug>/`.** This is the one place the plan changes URLs that would still work, because a static site could rebuild the date folders. I chose to move them anyway, for three reasons:

- A date in the address makes an evergreen article look stale in search results: a searcher sees "2019" before they read the title.
- Every date URL implies three archive pages (`/2019/`, `/2019/04/`, `/2019/04/12/`) that you would have to build or redirect anyway.
- You are setting up redirects at launch regardless, so this is the cheapest moment to make the change.

Each post keeps its slug, so one pattern rule redirects every post, including the ones not on your list. If you would rather take no risk at all on posts, keep the date URLs instead: your generator can output them, and only the archive rules are then needed.

**5.3 `/blog/` becomes `/insights/`.** Your posts already sit in a category called "Insights", and that is how consulting firms usually label their thinking. Every post URL changes anyway (5.2), so the only extra cost is one redirect for the listing page, which rarely ranks for anything except your firm's name. If you prefer "Blog", replace `/insights/` with `/blog/` everywhere in this document. `/blog/` then becomes a page you keep rather than one you redirect.

**5.4 One Insights page, with no archives.** Categories, tags, author pages and numbered pages were WordPress's way of slicing up a long list. At roughly 20 to 30 posts, a single page that lists every post does the job better and needs no numbered pages. All of those old URLs redirect to `/insights/`. Revisit this once you pass about 50 posts. If you add topic pages then, put them at `/insights/topics/<topic>/`.

**5.5 Bios move from `/about-us/leadership/` to `/about-us/team/`.** A 15-person firm's team page usually lists everyone. If you later add bios for senior consultants who are not "leadership", they would otherwise have no consistent home. The move costs two redirects. People mostly find bio pages by searching a name, and name searches follow a redirect without trouble. If you only ever plan bios for the two leaders, you can keep the old URLs and make `/about-us/leadership/` the people page instead.

**5.6 Change Management becomes a full service page at `/services/change-management/`**, alongside Strategy and Operations, and replaces the old `.php` page. The old URL already sat directly under `/services/`, which is why I have treated it as a third practice area rather than a sub-service.

**5.7 `/thank-you/` keeps its address but is hidden from search.** Keeping the path means any analytics goal or ad conversion keyed to `/thank-you/` keeps working. Add `<meta name="robots" content="noindex">` to the page and leave it out of the sitemap.

**5.8 Uploaded files keep their folder layout under `/media/`.** Copy `wp-content/uploads/` to `/media/` so that one rule redirects every old file link, such as images other sites link to or that appear in Google Images. The benchmark report gets its own address beside a new landing page. That page gives Google an HTML page to rank and gives readers a reason to contact you.

## 6. The redirect list

Every path below is on `https://www.northgateadvisory.com`. "301" means a permanent redirect. A 308 is also fine, because Google treats the two the same. Never use a 302: that one is temporary, and it does not pass the old page's ranking to the new one.

### 6.1 Every URL in your file

| # | Old URL | New URL | Action | Notes |
|---|---|---|---|---|
| 1 | `/` | `/` | Keep | |
| 2 | `/?p=112` | `/insights/<slug of post 112>/` | 301 | WordPress post ID 112. To find it, open `https://www.northgateadvisory.com/?p=112` while WordPress is live: WordPress redirects it to the post's real URL. You can also open post 112 in WP Admin, or run `wp post get 112 --field=post_name`. The stakes are low: WordPress already redirects this link, so Google has credited most of its value to the real URL. |
| 3 | `/?page_id=7` | the new URL of page 7 | 301 | WordPress page ID 7. Look it up the same way, find that page's row in this table, and use its new URL. |
| 4 | `/about-us.html` | `/about-us/` | 301 | Older-site URL. It becomes the About page. |
| 5 | `/About_Us/Our-Team` | `/about-us/team/` | 301 | Older-site URL. Match it in any letter case. |
| 6 | `/about-us/leadership/jane-ortiz/` | `/about-us/team/jane-ortiz/` | 301 | Decision 5.5 |
| 7 | `/about-us/leadership/sam-reid/` | `/about-us/team/sam-reid/` | 301 | Decision 5.5 |
| 8 | `/services/` | `/services/` | Keep | |
| 9 | `/services/strategy-consulting/` | `/services/strategy-consulting/` | Keep | |
| 10 | `/services/strategy-consulting/strategic-planning-workshops/` | same | Keep | |
| 11 | `/services/operations/` | `/services/operations/` | Keep | |
| 12 | `/services/operations/process-improvement/` | same | Keep | |
| 13 | `/services/change-management.php` | `/services/change-management/` | 301 | Older-site URL. Decision 5.6 |
| 14 | `/industries/healthcare/` | same | Keep | A new `/industries/` overview page sits above it. |
| 15 | `/industries/manufacturing/` | same | Keep | |
| 16 | `/case-studies/` | same | Keep | |
| 17 | `/case-studies/regional-hospital-network-turnaround/` | same | Keep | |
| 18 | `/case-studies/acme-manufacturing-lean-rollout/` | same | Keep | |
| 19 | `/blog/` | `/insights/` | 301 | Decision 5.3 |
| 20 | `/blog/page/2/` | `/insights/` | 301 | A single listing page replaces the numbered pages (decision 5.4). |
| 21 | `/blog/page/3/` | `/insights/` | 301 | Same as row 20 |
| 22 | `/2019/04/12/the-5-whys-still-works/` | `/insights/the-5-whys-still-works/` | 301 | Same slug (decision 5.2) |
| 23 | `/2021/09/30/remote-strategy-sessions/` | `/insights/remote-strategy-sessions/` | 301 | Same slug |
| 24 | `/2023/02/14/why-strategic-plans-fail/` | `/insights/why-strategic-plans-fail/` | 301 | Same slug |
| 25 | `/category/uncategorized/` | `/insights/` | 301 | WordPress's default category |
| 26 | `/category/insights/` | `/insights/` | 301 | The category the new section is named after |
| 27 | `/tag/strategy/` | `/insights/` | 301 | Deliberately not the Strategy service page. Someone arriving from a tag link expected a list of articles, not a sales page. |
| 28 | `/author/admin/` | `/insights/` | 301 | An author archive is a list of posts. |
| 29 | `/resources/whitepapers/` | same | Keep | It lists the benchmark report and any future reports. |
| 30 | `/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf` | `/resources/whitepapers/operations-benchmark-report.pdf` | 301 | Redirect the PDF to the PDF, not to the landing page: people and sites that link to it expect the document. |
| 31 | `/contact-us/` | same | Keep | |
| 32 | `/careers/` | same | Keep | |
| 33 | `/privacy-policy/` | same | Keep | Rewrite the text so it describes your new form provider and analytics, not WordPress cookies and comments. |
| 34 | `/thank-you/` | same | Keep | Add noindex and remove it from the sitemap (decision 5.7). |

**Totals:** 16 keep, 18 redirect. Two of the redirects (rows 2 and 3) are waiting on a lookup.

### 6.2 Pattern rules for URLs that are not on your list

| Old URL pattern | Example | New URL | Why |
|---|---|---|---|
| `/YYYY/MM/DD/<slug>/` | `/2020/06/01/any-post/` | `/insights/<slug>/` | Every post missing from your list |
| Anything below a post: `/YYYY/MM/DD/<slug>/...` | `/2019/04/12/the-5-whys-still-works/feed/` | that post (Apache), or `/insights/` (Netlify) | Post feeds, AMP versions and image attachment pages |
| `/YYYY/`, `/YYYY/MM/`, `/YYYY/MM/DD/`, optionally followed by `page/N/` | `/2021/09/` | `/insights/` | Date archives |
| `/blog/page/N/` | `/blog/page/4/` | `/insights/` | Numbered pages beyond the three on your list |
| `/blog/<anything>/` | `/blog/some-post/` | `/insights/<anything>/` | In case posts ever lived under `/blog/` |
| `/category/...`, `/tag/...`, `/author/...` | `/tag/lean/` | `/insights/` | Every other archive. If any posts were published under a real person's account rather than `admin`, add a rule sending `/author/<name>/` to that person's bio first. |
| `/feed/`, `/comments/feed/` | | `/insights/feed.xml` | Keeps RSS readers and aggregators working |
| WordPress sitemaps | `/sitemap_index.xml`, `/wp-sitemap.xml`, `/post-sitemap.xml` | `/sitemap.xml` | Search Console and other tools may still request the old ones |
| `/wp-content/uploads/<path>` | `/wp-content/uploads/2021/09/team.jpg` | `/media/<path>` | Every other uploaded file (decision 5.8) |
| `/about-us/leadership/` | | `/about-us/team/` | Parent folder of the old bios |
| `/resources/` | | `/resources/whitepapers/` | Parent folder with no page of its own |
| `/index.php` | | `/` | An old WordPress alias for the home page |

### 6.3 URLs that should return 404, not redirect

- **WordPress machinery:** `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/`, `/wp-includes/`, and `/wp-content/themes/` and `/wp-content/plugins/`. Only bots request these, and a 404 tells them there is no WordPress here any more.
- **Anything with no real equivalent.** Never send unmatched URLs to the home page. Google treats a mass redirect to the home page as a "soft 404", so it passes on nothing and also hides the problem from your Search Console reports.
- **Other `?p=`, `?page_id=`, `?cat=` and `?s=` links.** A static host ignores the part after the `?` and serves the home page, and the home page's canonical tag tells Google which address is the real one. Add a specific rule only for an ID link that shows up in Search Console with traffic or links.

Build a custom 404 page that links to Services, Case Studies, Insights and Contact, and make sure it returns a real 404 status code, not 200.

## 7. Ready-to-use configuration

Choose the file that matches your host. Both files implement section 6 in full, and section 8 tests whichever one you deploy.

### 7.1 Netlify (`_redirects`)

Save this as `_redirects` in the root of the published folder. Netlify uses the first rule that matches, so specific rules sit above wildcards.

```
# Northgate Advisory: WordPress to static site redirects (Netlify)

# --- WordPress ID links (rows 2-3). Replace the placeholders before launch.
# The "!" forces the rule, because a home page file exists at "/".
/  p=112       /insights/SLUG-OF-POST-112/   301!
/  page_id=7   /NEW-URL-OF-PAGE-7/           301!

# --- Pages from the older site (rows 4, 5, 13). Both letter cases for row 5.
/about-us.html                        /about-us/                      301
/About_Us/Our-Team                    /about-us/team/                 301
/about_us/our-team                    /about-us/team/                 301
/services/change-management.php       /services/change-management/    301
/index.php                            /                               301

# --- Bios move from leadership to team (rows 6-7)
/about-us/leadership/jane-ortiz/      /about-us/team/jane-ortiz/      301
/about-us/leadership/sam-reid/        /about-us/team/sam-reid/        301
/about-us/leadership/                 /about-us/team/                 301
/about-us/leadership/*                /about-us/team/                 301

# --- Blog becomes Insights (rows 19-21)
/blog/                                /insights/                      301
/blog/page/*                          /insights/                      301
/blog/*                               /insights/:splat                301

# --- Posts on your list (rows 22-24)
/2019/04/12/the-5-whys-still-works/     /insights/the-5-whys-still-works/     301
/2021/09/30/remote-strategy-sessions/   /insights/remote-strategy-sessions/   301
/2023/02/14/why-strategic-plans-fail/   /insights/why-strategic-plans-fail/   301

# --- Every other post, plus date archives: two lines per year.
# Netlify cannot restrict a placeholder to digits, so each year is written out.
# Anything deeper under a post (its /feed/, /amp/ or attachment pages) goes to /insights/.
# Delete the years you never published in. Extra years do no harm.
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

# --- WordPress archives (rows 25-28)
/category/*                           /insights/                      301
/tag/*                                /insights/                      301
/author/*                             /insights/                      301

# --- Feeds and WordPress sitemaps
/feed/                                /insights/feed.xml              301
/feed/*                               /insights/feed.xml              301
/comments/feed/*                      /insights/feed.xml              301
/sitemap_index.xml                    /sitemap.xml                    301
/wp-sitemap.xml                       /sitemap.xml                    301
/post-sitemap.xml                     /sitemap.xml                    301
/page-sitemap.xml                     /sitemap.xml                    301

# --- Files (row 30 first, then everything else in uploads)
/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf   /resources/whitepapers/operations-benchmark-report.pdf   301
/wp-content/uploads/*                 /media/:splat                   301

# --- Parent folder with no page of its own
/resources/                           /resources/whitepapers/         301
```

**On Cloudflare Pages**, the same file format works, with one difference that matters here: `_redirects` does not match query strings. Delete the two `?p=` and `?page_id=` lines and recreate them as Cloudflare Redirect Rules in the dashboard. The rest of the file stays well inside Cloudflare's limits on the number of rules.

### 7.2 Apache (`.htaccess`)

Use this version if the static files go onto ordinary shared hosting, which could be your current host. It needs Apache 2.4 (for the `QSD` flag). The targets are full URLs so that old `http://` and non-www links also arrive in a single hop.

```apache
# Northgate Advisory: WordPress to static site redirects (Apache)
RewriteEngine On

# --- WordPress ID links (rows 2-3). Replace the placeholders before launch.
RewriteCond %{QUERY_STRING} (^|&)p=112(&|$)
RewriteRule ^(index\.php)?$ https://www.northgateadvisory.com/insights/SLUG-OF-POST-112/ [R=301,L,QSD]
RewriteCond %{QUERY_STRING} (^|&)page_id=7(&|$)
RewriteRule ^(index\.php)?$ https://www.northgateadvisory.com/NEW-URL-OF-PAGE-7/ [R=301,L,QSD]

# --- Pages from the older site (rows 4, 5, 13), matched in any letter case
RewriteRule ^about-us\.html$ https://www.northgateadvisory.com/about-us/ [R=301,L,NC]
RewriteRule ^about_us/our-team/?$ https://www.northgateadvisory.com/about-us/team/ [R=301,L,NC]
RewriteRule ^services/change-management\.php$ https://www.northgateadvisory.com/services/change-management/ [R=301,L,NC]
RewriteRule ^index\.php$ https://www.northgateadvisory.com/ [R=301,L]

# --- Bios move from leadership to team (rows 6-7)
RewriteRule ^about-us/leadership/([a-z0-9-]+)/?$ https://www.northgateadvisory.com/about-us/team/$1/ [R=301,L]
RewriteRule ^about-us/leadership(/.*)?$ https://www.northgateadvisory.com/about-us/team/ [R=301,L]

# --- Blog becomes Insights (rows 19-21)
RewriteRule ^blog/?$ https://www.northgateadvisory.com/insights/ [R=301,L]
RewriteRule ^blog/page/ https://www.northgateadvisory.com/insights/ [R=301,L]
RewriteRule ^blog/(.+?)/?$ https://www.northgateadvisory.com/insights/$1/ [R=301,L]

# --- Every post (rows 22-24 and the rest), including its /feed/, /amp/ and attachment URLs
RewriteRule ^\d{4}/\d{2}/\d{2}/([^/]+)(/.*)?$ https://www.northgateadvisory.com/insights/$1/ [R=301,L]

# --- Date archives, with or without page numbers
RewriteRule ^\d{4}(/\d{2}){0,2}(/page/\d+)?/?$ https://www.northgateadvisory.com/insights/ [R=301,L]

# --- WordPress archives (rows 25-28)
RewriteRule ^(category|tag|author)(/.*)?$ https://www.northgateadvisory.com/insights/ [R=301,L]

# --- Feeds and WordPress sitemaps
RewriteRule ^(comments/)?feed(/.*)?$ https://www.northgateadvisory.com/insights/feed.xml [R=301,L]
RewriteRule ^(sitemap_index|wp-sitemap[^/]*|[a-z_]+-sitemap\d*)\.xml$ https://www.northgateadvisory.com/sitemap.xml [R=301,L]

# --- Files (row 30 first, then everything else in uploads)
RewriteRule ^wp-content/uploads/2022/03/Operations-Benchmark-Report\.pdf$ https://www.northgateadvisory.com/resources/whitepapers/operations-benchmark-report.pdf [R=301,L,NC]
RewriteRule ^wp-content/uploads/(.+)$ https://www.northgateadvisory.com/media/$1 [R=301,L]

# --- Parent folder with no page of its own
RewriteRule ^resources/?$ https://www.northgateadvisory.com/resources/whitepapers/ [R=301,L]

# --- One canonical address: https and www. Keep this block last.
# Behind Cloudflare or another proxy, %{HTTPS} always reads "off" and this loops;
# test %{HTTP:X-Forwarded-Proto} !https instead.
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} !^www\.northgateadvisory\.com$ [NC]
RewriteRule ^ https://www.northgateadvisory.com%{REQUEST_URI} [R=301,L]

ErrorDocument 404 /404.html
```

### 7.3 Other hosts

- **Vercel:** put the rules in a `redirects` array in `vercel.json` with `"permanent": true`. Vercel sends a 308, which Google treats the same as a 301. It can match query strings with `has`, and it can restrict placeholders to digits, so the year-by-year lines collapse into one rule. Set `"trailingSlash": true`.
- **GitHub Pages:** it cannot send real 301s. Plugins such as `jekyll-redirect-from` write HTML pages that refresh to the new address. Google usually follows them, but they are a weaker signal. Don't use GitHub Pages for this move unless Cloudflare sits in front of it and does the redirects.
- **Amazon S3 and CloudFront:** S3's routing rules handle the simple folder moves, but the pattern rules need a CloudFront Function. That is more work than the other options for a site of this size.

**Whichever generator you use** (Eleventy, Hugo, Astro, Jekyll or another), make it output `folder/index.html` so that URLs end in a slash (rule 2 in section 4). Netlify and Apache both then serve `/services/` and redirect `/services` to it automatically.

## 8. Testing the redirects

Run the test against your staging or preview site before launch, then against the live domain straight after the switch. A line passes only if the old URL sends a single 301 to the expected address and that address loads with a 200. A "Keep" line passes only if it loads with a 200 and no redirect. The list includes edge cases, because hosts differ on details such as whether `/feed/` matches `/feed/*`. If an edge case fails, add an explicit line for it to your redirect file.

Save this as `redirect-tests.txt`:

```
# old path                                                  expected new path, or KEEP
/                                                           KEEP
/?p=112                                                     /insights/SLUG-OF-POST-112/
/?page_id=7                                                 /NEW-URL-OF-PAGE-7/
/about-us.html                                              /about-us/
/About_Us/Our-Team                                          /about-us/team/
/about-us/leadership/jane-ortiz/                            /about-us/team/jane-ortiz/
/about-us/leadership/sam-reid/                              /about-us/team/sam-reid/
/services/                                                  KEEP
/services/strategy-consulting/                              KEEP
/services/strategy-consulting/strategic-planning-workshops/ KEEP
/services/operations/                                       KEEP
/services/operations/process-improvement/                   KEEP
/services/change-management.php                             /services/change-management/
/industries/healthcare/                                     KEEP
/industries/manufacturing/                                  KEEP
/case-studies/                                              KEEP
/case-studies/regional-hospital-network-turnaround/         KEEP
/case-studies/acme-manufacturing-lean-rollout/              KEEP
/blog/                                                      /insights/
/blog/page/2/                                               /insights/
/blog/page/3/                                               /insights/
/2019/04/12/the-5-whys-still-works/                         /insights/the-5-whys-still-works/
/2021/09/30/remote-strategy-sessions/                       /insights/remote-strategy-sessions/
/2023/02/14/why-strategic-plans-fail/                       /insights/why-strategic-plans-fail/
/category/uncategorized/                                    /insights/
/category/insights/                                         /insights/
/tag/strategy/                                              /insights/
/author/admin/                                              /insights/
/resources/whitepapers/                                     KEEP
/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf /resources/whitepapers/operations-benchmark-report.pdf
/contact-us/                                                KEEP
/careers/                                                   KEEP
/privacy-policy/                                            KEEP
/thank-you/                                                 KEEP
# New pages
/about-us/                                                  KEEP
/about-us/team/                                             KEEP
/about-us/team/jane-ortiz/                                  KEEP
/about-us/team/sam-reid/                                    KEEP
/services/change-management/                                KEEP
/industries/                                                KEEP
/insights/                                                  KEEP
/insights/feed.xml                                          KEEP
/resources/whitepapers/operations-benchmark-report.pdf      KEEP
/sitemap.xml                                                KEEP
# Pattern rules and edge cases
/about_us/our-team                                          /about-us/team/
/about-us/leadership/                                       /about-us/team/
/blog/page/4/                                               /insights/
/2019/                                                      /insights/
/2019/04/                                                   /insights/
/category/news/                                             /insights/
/tag/lean/                                                  /insights/
/feed/                                                      /insights/feed.xml
/sitemap_index.xml                                          /sitemap.xml
/resources/                                                 /resources/whitepapers/
/services                                                   /services/
/about-us/team                                              /about-us/team/
```

Save this as `check-redirects.sh` and run it with `bash check-redirects.sh https://www.northgateadvisory.com redirect-tests.txt`:

```bash
#!/usr/bin/env bash
# Checks every line of the test list against a deployed site.
base="${1%/}"
list="$2"
failures=0

while read -r old expected _; do
  [[ -z "$old" || "$old" == \#* ]] && continue
  url="$base$old"
  read -r code location < <(curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "$url")
  read -r final hops < <(curl -s -o /dev/null -L -w '%{http_code} %{num_redirects}\n' "$url")

  if [[ "$expected" == "KEEP" ]]; then
    if [[ "$code" == "200" ]]; then
      echo "ok    $old"
    else
      echo "FAIL  $old: got $code, expected 200 with no redirect"
      failures=$((failures + 1))
    fi
  elif [[ "$code" =~ ^30[18]$ && "$location" == *"$expected" && "$final" == "200" && "$hops" == "1" ]]; then
    echo "ok    $old  redirects to  $expected"
  else
    echo "FAIL  $old: got $code to '${location:-nothing}', ended on $final after $hops hop(s); expected one 301 to $expected"
    failures=$((failures + 1))
  fi
done < "$list"

missing=$(curl -s -o /dev/null -w '%{http_code}' "$base/this-page-should-not-exist/")
if [[ "$missing" == "404" ]]; then
  echo "ok    unknown URLs return 404"
else
  echo "FAIL  unknown URLs return $missing, expected 404"
  failures=$((failures + 1))
fi

echo "$failures failure(s)"
exit $(( failures > 0 ))
```

Rows 2 and 3 will fail until you replace their placeholders, which is a useful reminder. After launch, also check the old address variants by hand. `curl -sIL http://northgateadvisory.com/2019/04/12/the-5-whys-still-works/` should end on `https://www.northgateadvisory.com/insights/the-5-whys-still-works/` with a 200. That takes one hop with the Apache file, or two (address first, then path) on hosts that fix the address before they apply your rules. Two hops are acceptable.

## 9. Migration checklist

### Before launch, while WordPress is still running

- [ ] **Build the complete URL inventory.** Your file is the starting point. Add every URL from these sources that sections 6.1 and 6.2 do not already cover:
  - a WordPress export of all published posts and pages with their slugs and dates (Tools, then Export, or `wp post list --post_type=post,page --post_status=publish --fields=ID,post_name,post_date --format=csv`);
  - Search Console's Pages report, exported for both indexed and not-indexed URLs;
  - Search Console Performance, Pages tab, last 16 months: any URL with clicks;
  - Search Console Links, "Top linked pages": these carry the most ranking value;
  - Google Analytics landing pages for the last 12 months;
  - a crawl of the live site with Screaming Frog, whose free version crawls up to 500 URLs, which is plenty here.
- [ ] Look up and fill in rows 2 and 3, in both the redirect file and the test list.
- [ ] Export the current site's existing redirects (Redirection plugin, Yoast Premium, `.htaccess`). Add each one to the new rules, pointing at its final new URL.
- [ ] Record every page's SEO title, meta description, main heading and structured data, and carry them across unchanged. The Screaming Frog crawl exports all of these, and Yoast stores them for each page.
- [ ] Save a baseline. Export Search Console Performance (queries and pages, last 3 months) and note where you rank for your 10 to 20 most important searches.
- [ ] Download `wp-content/uploads/` and copy it to `/media/` on the new site.
- [ ] Rebuild every post with its exact current slug.
- [ ] Fix the links inside your content. Post and page bodies contain hard-coded links to `/2019/04/12/...`, `/blog/` and `/wp-content/uploads/...`. Point internal links straight at the new URLs, because redirects are for visitors arriving from elsewhere.
- [ ] Confirm the generator outputs trailing-slash URLs (section 4, rule 2).
- [ ] Generate `sitemap.xml` with only final, indexable URLs: no redirects and no `/thank-you/`. Reference it from `robots.txt`.
- [ ] Give every page a self-referencing canonical tag, a title and a meta description.
- [ ] Make sure the custom 404 page returns a 404 status.
- [ ] Set up the contact form on a static-friendly service (Netlify Forms, Formspree or similar) so that it lands on `/thank-you/`.
- [ ] Install your analytics tag, and recreate any conversion goals.
- [ ] Protect the staging site with a password rather than only `noindex`. A forgotten `noindex` at launch is the most common way these migrations lose rankings.
- [ ] Run the redirect test against staging until every line passes.
- [ ] If you are changing host, lower the DNS TTL 24 to 48 hours before launch.

### Launch day

- [ ] Deploy the site and point DNS at it.
- [ ] Remove the staging password or `noindex`, and check that `robots.txt` does not block anything.
- [ ] Run the redirect test against the live domain, then the manual `http://` check in section 8.
- [ ] Submit `https://www.northgateadvisory.com/sitemap.xml` in Search Console.
- [ ] In Search Console's URL Inspection, request indexing for the home page, the service pages and your five most-visited posts.
- [ ] Send a test enquiry through the contact form and confirm that analytics records it.
- [ ] Keep a full WordPress backup (files and database) for at least three months. It is your reference for any URL that was missed.

### After launch

- [ ] For the first two weeks, check Search Console's Pages report for "Not found (404)" every few days. If a URL there used to get traffic or links, add a redirect for it.
- [ ] For weeks 2 to 8, compare clicks and impressions against the baseline. A dip for two to four weeks is normal after a move. A page that stays down usually has a broken redirect, a lost title or lost content, so check those in that order.
- [ ] Update the links you control: Google Business Profile, your LinkedIn company page and staff profiles, directory listings, email signatures and proposal templates. Ask the few sites that link to your PDF or your posts to update their links.
- [ ] Keep the redirects permanently. Google's guidance is at least a year, and keeping them costs nothing.
- [ ] Rewrite page copy only after rankings settle, so you can tell which change caused any movement.
- [ ] Do not use Search Console's Change of Address tool. It is only for moving to a new domain, and you are not doing that.

## 10. Open items

1. **What are post 112 and page 7?** (Rows 2 and 3.)
2. **How many posts, and in which years?** This lets you trim the year lines in the Netlify file and confirms that nothing else is missing from the sitemap.
3. **Which host?** That decides which file in section 7 you use.
4. **Were any posts written under real people's accounts rather than `admin`?** If so, send each `/author/<name>/` to that person's bio.
5. **Will the benchmark report go behind a form?** If it will, send the old PDF URL to the landing page instead (row 30), and accept that the PDF itself will drop out of search results.
6. **Bios for all 15 people, or only the two leaders?** This confirms or reverses decision 5.5.
