# Northgate Advisory website migration plan

Prepared 9 November 2026. Every path below is on `https://www.northgateadvisory.com`.

## The short version

Most of your URLs are already clean, and the surest way to keep a ranking is to leave its URL alone. So the new site keeps every good address and only changes the ones with a reason to change.

| What happens to the 34 URLs in your list | Count |
|---|---|
| Stay exactly the same, no redirect needed | 19 |
| Get a permanent (301) redirect to a new URL | 13 |
| Can't be mapped until someone looks them up on the live WordPress site | 2 |

The one real structural change is that blog posts move from date-based addresses to `/blog/<post-name>/`. Everything else that changes is cleanup of old file-style addresses and pages WordPress generated automatically.

Redirects are not the whole job. Before launch you need to fix the gaps in section 1, and rankings also depend on carrying over page content and titles, which the checklist in section 6 covers.

## 1. Three things to sort out first

### Your list is missing blog posts

The list includes `/blog/page/3/`, so the blog runs to at least three pages. WordPress shows 10 posts per page by default, which means at least 21 posts, yet only 3 posts appear in the list. `/about-us/` is missing too, even though two bios sit underneath it. Treat this list as a starting point, not a full inventory.

The redirect rule in section 4 handles the address of every dated post automatically, but it can only send people to a page that exists. A post that isn't rebuilt will land on a 404.

To close the gap, have someone:

1. Export the full post and page list from WordPress (Tools, Export, or the All Posts and All Pages screens), and mark each one as rebuilt or deliberately dropped.
2. Export from Google Search Console: the Pages report (both indexed and not indexed) and Links, Top linked pages.
3. Export the landing pages report from Google Analytics.
4. Add a row to section 3 for any URL that isn't already covered. The older `.html`, `.php` and `About_Us` addresses suggest an earlier version of the site, so there may be more of those.

### Two links point at WordPress ID numbers

`/?p=112` and `/?page_id=7` refer to a post and a page by database number. Nothing in the URL says which ones, so I have not guessed. A wrong redirect is worse than none.

**This must be done while WordPress is still running.** Open each address in a browser, and WordPress will forward you to the page's real address. Find that address in section 3, then put its new URL into the two commented-out lines at the top of section 4.

If this gets missed, nothing breaks: both addresses will simply show the home page. Whatever value those links carried would be lost, though.

### The host must support real 301 redirects

Redirects have to be issued by the server. A JavaScript or meta-refresh redirect is a poor substitute, and some static hosts offer nothing else. You haven't named a host, so I have assumed Netlify and written section 4 for it.

| Host | Fit for this migration |
|---|---|
| Netlify | Handles everything here, including the two ID links |
| Cloudflare Pages | Uses nearly the same file, but cannot match `?p=` style addresses. Those two need a separate Cloudflare Redirect Rule, and the `!` in section 4 must be removed |
| Apache or Nginx hosting | Handles everything, but the rules must be translated to that server's format |
| Amazon S3 with CloudFront | Possible only with custom edge code. More work than this site justifies |
| GitHub Pages | **Do not use.** It cannot send a 301 |

## 2. New site structure

```
/                                                          Home
/services/                                                 Overview of all services
  /services/strategy-consulting/
    /services/strategy-consulting/strategic-planning-workshops/
  /services/operations/
    /services/operations/process-improvement/
  /services/change-management/                             MOVED from .php address
/industries/                                               NEW hub page
  /industries/healthcare/
  /industries/manufacturing/
/case-studies/
  /case-studies/regional-hospital-network-turnaround/
  /case-studies/acme-manufacturing-lean-rollout/
/blog/                                                     One listing page
  /blog/<post-slug>/                                       MOVED from /YYYY/MM/DD/<post-slug>/
/resources/whitepapers/
  /resources/whitepapers/operations-benchmark-report.pdf   MOVED from /wp-content/uploads/
/about-us/                                                 Replaces /about-us.html
  /about-us/leadership/                                    Replaces /About_Us/Our-Team
    /about-us/leadership/jane-ortiz/
    /about-us/leadership/sam-reid/
/careers/
/contact-us/
/privacy-policy/
/thank-you/                                                Hidden from search, nav and sitemap
```

**Main navigation:** Services, Industries, Case Studies, Insights, About, Contact. Insights is a dropdown holding Blog and Whitepapers. It is a menu label only and has no URL of its own.

**Footer:** Careers, Privacy Policy, and repeats of the main sections.

**Not rebuilt:** tag pages, category pages, author pages and blog pagination. A firm your size has too few posts for these to be anything but thin duplicates of the blog listing.

### URL rules for the new site

1. A URL does not change unless there is a specific reason. Shorter is not a reason, which is why `/about-us/` and `/contact-us/` stay as they are rather than becoming `/about/` and `/contact/`.
2. One version of the domain: `https://www.northgateadvisory.com`. Keep the `www`, since that is what Google has now.
3. Lowercase letters and hyphens only. No underscores and no `.html` or `.php`.
4. Every page ends in a trailing slash, matching what WordPress used. Build each page as `folder/index.html`, and have the version without the slash redirect to the version with it. Many static tools default to no slash, which would quietly change every URL on the site.
5. Blog posts live at `/blog/<slug>/` and keep their existing WordPress slug exactly.
6. New pages follow the existing patterns: `/services/<service>/<sub-service>/`, `/industries/<industry>/`, `/case-studies/<client-and-outcome>/`, `/about-us/leadership/<first-last>/`.

### Why blog posts move

Posts are the only content I would move deliberately. Date-based addresses make a 2019 article look old in search results, and they scatter posts across the top level of the site, so you can't report on `/blog/` as one section in Search Console or Analytics. One rule covers all of them, and a rebuild is the cheapest moment to make the change.

If you would rather take no risk at all on the posts, a static site can reproduce the date-based addresses exactly. In that case, drop the last rule in section 4 and the three post rows in section 3.

## 3. Complete URL map

"Line" is the line number in `current-urls.txt`. All redirects are 301s. Nothing goes to the home page: Google tends to treat a redirect to an unrelated page as a dead link, so each URL goes to its closest true equivalent.

### 3a. Needs a lookup (2)

| Line | Old URL | New URL | Status |
|---|---|---|---|
| 2 | `/?p=112` | Unknown until looked up | Resolve while WordPress is live (section 1) |
| 3 | `/?page_id=7` | Unknown until looked up | Resolve while WordPress is live (section 1) |

### 3b. Permanent redirects (13)

| Line | Old URL | New URL | Why |
|---|---|---|---|
| 4 | `/about-us.html` | `/about-us/` | Old file-style address for the same page |
| 5 | `/About_Us/Our-Team` | `/about-us/leadership/` | Old address with capitals and an underscore. The team content moves to the leadership page |
| 13 | `/services/change-management.php` | `/services/change-management/` | Drops the file extension to match the other services |
| 20 | `/blog/page/2/` | `/blog/` | The new blog is one listing page |
| 21 | `/blog/page/3/` | `/blog/` | The new blog is one listing page |
| 22 | `/2019/04/12/the-5-whys-still-works/` | `/blog/the-5-whys-still-works/` | Post moves into the blog section, slug unchanged |
| 23 | `/2021/09/30/remote-strategy-sessions/` | `/blog/remote-strategy-sessions/` | Post moves into the blog section, slug unchanged |
| 24 | `/2023/02/14/why-strategic-plans-fail/` | `/blog/why-strategic-plans-fail/` | Post moves into the blog section, slug unchanged |
| 25 | `/category/uncategorized/` | `/blog/` | WordPress default archive, not rebuilt. It is a list of posts, so the blog listing is its true equivalent |
| 26 | `/category/insights/` | `/blog/` | Category archive, not rebuilt |
| 27 | `/tag/strategy/` | `/blog/` | Tag archive, not rebuilt. A list of articles should not land on a sales page such as the strategy service |
| 28 | `/author/admin/` | `/blog/` | Auto-generated list of posts, not rebuilt |
| 30 | `/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf` | `/resources/whitepapers/operations-benchmark-report.pdf` | Clean, lowercase address beside the whitepapers page |

The four archive pages probably carry little ranking value. They are worth one line each to catch whatever does link to them.

### 3c. No change (19)

These need no redirect, but each one must exist at this exact address on launch day.

| Line | URL | Note |
|---|---|---|
| 1 | `/` | |
| 6 | `/about-us/leadership/jane-ortiz/` | |
| 7 | `/about-us/leadership/sam-reid/` | |
| 8 | `/services/` | |
| 9 | `/services/strategy-consulting/` | |
| 10 | `/services/strategy-consulting/strategic-planning-workshops/` | |
| 11 | `/services/operations/` | |
| 12 | `/services/operations/process-improvement/` | |
| 14 | `/industries/healthcare/` | |
| 15 | `/industries/manufacturing/` | |
| 16 | `/case-studies/` | |
| 17 | `/case-studies/regional-hospital-network-turnaround/` | |
| 18 | `/case-studies/acme-manufacturing-lean-rollout/` | |
| 19 | `/blog/` | |
| 29 | `/resources/whitepapers/` | |
| 31 | `/contact-us/` | Needs a form service, since a static site can't process forms itself |
| 32 | `/careers/` | |
| 33 | `/privacy-policy/` | |
| 34 | `/thank-you/` | Keep the address so analytics and ad conversion tracking still fire. Add `noindex` and leave it out of the sitemap, because it should never have been in search |

## 4. Redirect file

Save this as `_redirects` in the published root of the site. The first matching rule wins, so exact rules sit above patterns. It covers the 13 redirects in section 3b plus the extra addresses in section 5.

```
# Northgate Advisory redirects (Netlify _redirects format)

# WordPress ID links. Fill in the target after the lookup, then remove the leading #.
# The ! is required, otherwise the home page file wins and the rule never fires.
# /  p=112      /NEW-URL-HERE/   301!
# /  page_id=7  /NEW-URL-HERE/   301!

# Old page addresses
/about-us.html                    /about-us/                      301
/About_Us/Our-Team                /about-us/leadership/           301
/services/change-management.php   /services/change-management/    301

# Whitepaper file. Any other PDF in the media library needs a line like this one.
/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf   /resources/whitepapers/operations-benchmark-report.pdf   301

# Section with only one page
/resources                        /resources/whitepapers/         301

# WordPress list pages not rebuilt on the new site
/blog/page/*                      /blog/                          301
/category/*                       /blog/                          301
/tag/*                            /blog/                          301
/author/*                         /blog/                          301

# WordPress system files
/feed                             /blog/feed.xml                  301
/blog/feed                        /blog/feed.xml                  301
/wp-sitemap.xml                   /sitemap.xml                    301
/sitemap_index.xml                /sitemap.xml                    301

# Blog posts. A post whose slug changes needs its own exact rule above this line.
/:year/:month/:day/:slug          /blog/:slug/                    301
```

The last rule matches any address four levels deep. That is safe because the new site has no pages that deep, and Netlify serves a real page ahead of a rule without the `!`.

## 5. Addresses not in your list

| Address | What to do | Why |
|---|---|---|
| Other dated posts, categories, tags, authors and blog pages | Covered by the patterns in section 4 | The posts themselves must still be rebuilt (section 1) |
| `/about-us/`, `/about-us/leadership/`, `/industries/` | Build these as real pages | Your bios and industry pages sit under them, and people trim URLs |
| `/resources/` | Redirect to `/resources/whitepapers/` | The section has only one page |
| `/feed/`, `/blog/feed/` | Redirect to `/blog/feed.xml` | Keeps RSS subscribers |
| `/wp-sitemap.xml`, `/sitemap_index.xml` | Redirect to `/sitemap.xml` | WordPress sitemap locations |
| Other files in `/wp-content/uploads/` | Copy the images your posts use into the new site. Give any other PDF its own redirect | The word "whitepapers" is plural, and only one file is listed |
| `http://` versions and the non-`www` domain | Redirect to `https://www` at the domain level | Must not add extra hops |
| `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/`, date archives such as `/2023/02/` | Let them return 404 | Mostly bots, no search value |

## 6. Launch checklist

### Before launch

- [ ] Complete the URL inventory and resolve the two ID links (section 1).
- [ ] Save a baseline while WordPress is live: export Search Console performance by page and query (it keeps 16 months), and crawl the old site to record every page's title, meta description and main heading.
- [ ] Carry over titles, meta descriptions, headings and body copy as they are. If you rewrite the copy in the same launch, you won't be able to tell whether a ranking change came from the copy or the move. Rewrite after things settle.
- [ ] Point internal links, including those inside old post text, directly at the new URLs. Redirects are for outside links.
- [ ] Give every page a canonical tag naming its own full URL, in the `https://www...` form with the trailing slash.
- [ ] Set up the contact form, and confirm it lands on `/thank-you/` and that analytics records it.
- [ ] Keep the staging site behind a password, and make sure no `noindex` tag or blocking `robots.txt` ships to production.
- [ ] Run the test below on staging.
- [ ] Lower the DNS time-to-live to about 5 minutes, 48 hours ahead. If nameservers are changing, copy the MX, SPF, DKIM and DMARC records first or company email will stop.

### Launch day

- [ ] Deploy, switch DNS, and confirm HTTPS works on both the `www` and non-`www` addresses.
- [ ] Check `robots.txt` blocks nothing, especially old paths such as `/wp-content/`. Google has to be able to crawl an old URL to see its redirect.
- [ ] Run the test below against production.
- [ ] Submit `/sitemap.xml` in Search Console. It should list only final URLs: no redirected addresses, and not `/thank-you/`.
- [ ] Skip Search Console's Change of Address tool. It is only for moving to a new domain, and yours isn't changing.

### The test

Run this from the folder holding `current-urls.txt`. For staging, swap the domain in the file first.

```
while read -r url; do
  printf '%s  ' "$url"
  curl -s -o /dev/null -L -w '%{http_code} hops=%{num_redirects} final=%{url_effective}\n' "$url"
done < current-urls.txt
```

A pass means every line ends in 200, the URLs in section 3c show 0 hops, the URLs in section 3b show exactly 1 hop, and each final address matches section 3. Look hardest at `/About_Us/Our-Team`, because hosts differ in how they treat capital letters.

### After launch

- [ ] Check the Search Console Pages report and the host's 404 log daily for two weeks, and add a redirect for anything real that turns up.
- [ ] Update the links you control: LinkedIn, Google Business Profile, directory listings, partner sites, email signatures.
- [ ] Compare against the baseline at 4 and 12 weeks. Some movement in the first few weeks is normal even in a clean migration. A lasting drop on a specific page means checking that page's redirect and content.
- [ ] Keep a full WordPress backup (files and database) for at least 6 months.
- [ ] Keep the redirect file permanently. Google advises at least a year, and it costs nothing to leave in place.

## 7. Assumptions to confirm

1. The domain stays `www.northgateadvisory.com`.
2. The site will be hosted on Netlify (section 1 covers the alternatives).
3. You still offer change management. If not, send `/services/change-management.php` to `/services/` instead.
4. The team content from `/About_Us/Our-Team` can live at `/about-us/leadership/`. I chose that over a new `/about-us/team/` address because it leaves both bio URLs untouched.
5. Every post keeps its current WordPress slug.
6. The blog has few enough posts for one listing page. If you would rather keep pagination, generate pages at the same `/blog/page/2/` addresses and remove that rule.
7. The form confirmation step continues to use `/thank-you/`.
8. The Operations Benchmark Report stays a public download. If it goes behind a form, redirect the old PDF address to `/resources/whitepapers/` instead.
9. The new site publishes an RSS feed at `/blog/feed.xml` and a sitemap at `/sitemap.xml`.
