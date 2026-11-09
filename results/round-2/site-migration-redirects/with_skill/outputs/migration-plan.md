# Northgate Advisory: new site structure, URL scheme and redirect plan

Prepared 24 October 2026 from `current-urls.txt` (34 URLs). This is a draft to react to: the structure has not been tested with real people yet, and section 7 says how to test it.

## 1. Summary

Keep every URL that is already clean, and change only the ones that break basic URL rules or sit inside WordPress machinery the static site won't have. That keeps 15 of the 34 URLs exactly where they are, including every industry and case study page and all but one of the service pages. All the writing (the blog, its date-based post URLs, the WordPress category, tag and author archives, and the whitepapers page) folds into one **Insights** section at `/insights/`, and the three different styles of about and team URL become one people section under `/about-us/team/`. From the 34 URLs that gives **16 confirmed 301 redirects, 2 that need a quick lookup in WordPress before they can be written, and 1 page retired with a 410.** The reason for this shape: an unchanged URL carries no ranking risk, so every change has to fix a real problem.

**The list is probably missing most of the blog.** `/blog/page/3/` means the blog index runs to at least three pages. At WordPress's default of 10 posts a page that is at least 21 posts, but only 3 are listed. Check the real count in WordPress before cutover: every unlisted post needs its own redirect, and section 5.2 gives the rule and a command that generates them.

**Assumptions this rests on** (the full list is in section 6): the domain stays `https://www.northgateadvisory.com`; the audience is senior buyers of consulting, mainly in healthcare and manufacturing, plus job candidates; page content moves across largely unchanged at launch; and the static host is not chosen yet.

## 2. What exists now

I have seen only the 34 URLs: no page content, WordPress database, analytics or Search Console data. Everything said here about content is inferred from the URLs.

```
Home and WordPress ID links (3)
  /                                   home
  /?p=112                             WordPress post-ID link, post unknown
  /?page_id=7                         WordPress page-ID link, page unknown
About (4 URLs in 3 different URL styles)
  /about-us.html                      about page, .html form
  /About_Us/Our-Team                  team page: capitals, underscore, no trailing slash
  /about-us/leadership/jane-ortiz/    leader profile
  /about-us/leadership/sam-reid/      leader profile
  (implied but not listed: /about-us/, /about-us/leadership/)
Services (6)
  /services/
  /services/strategy-consulting/
    /services/strategy-consulting/strategic-planning-workshops/
  /services/operations/
    /services/operations/process-improvement/
  /services/change-management.php     .php form, unlike its siblings
Industries (2)
  /industries/healthcare/
  /industries/manufacturing/
  (implied but not listed: /industries/)
Case studies (3)
  /case-studies/
  /case-studies/regional-hospital-network-turnaround/
  /case-studies/acme-manufacturing-lean-rollout/
Blog and WordPress archives (10)
  /blog/   /blog/page/2/   /blog/page/3/
  /2019/04/12/the-5-whys-still-works/
  /2021/09/30/remote-strategy-sessions/
  /2023/02/14/why-strategic-plans-fail/
  /category/uncategorized/   /category/insights/   /tag/strategy/   /author/admin/
Resources (2)
  /resources/whitepapers/
  /wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf
  (implied but not listed: /resources/)
Utility (4)
  /contact-us/   /careers/   /privacy-policy/   /thank-you/
```

Of the 34: **15** are clean and already where they belong; **6** break basic URL rules (two query-string IDs, one `.html`, one `.php`, one mixed-case path with an underscore, one capitalised PDF under `/wp-content/`); **13** are clean in form but sit in structures being replaced (blog index and pagination 3, date-based posts 3, WordPress archives 4, leadership profiles 2, whitepapers page 1).

**Problems found**

1. **The blog inventory looks incomplete.** Three posts are listed against at least three pages of blog index. Either WordPress is set to show one post a page (unusual; check Settings, Reading) or at least 18 posts are missing from the list. This is the biggest hole in any redirect plan built from this list.
2. **Four parent pages are implied but not listed:** `/about-us/`, `/about-us/leadership/`, `/industries/` and `/resources/`. In WordPress a nested page URL normally means its parent page exists, so these are probably live but left out of the sitemap, or they are empty shells. Either way the new site needs a page or a redirect at each, or breadcrumbs will point at nothing.
3. **The writing has six ways in and no structure.** A blog index with pagination, posts at date-based URLs off the site root, two categories (one is WordPress's default "Uncategorized", the other just repeats "Insights"), one tag and one author archive. The one report sits apart under "Resources", a label that tells nobody what is behind it. Nothing connects an article to the service it is about.
4. **People pages use three URL styles** (`about-us.html`, `About_Us/Our-Team`, `about-us/leadership/...`), and leadership profiles sit apart from the team page.
5. **`/author/admin/` publishes the WordPress login name "admin"**, which helps anyone trying to break into the site, and the page has no value of its own.
6. **`/thank-you/` is in the sitemap.** A post-form confirmation page should be kept out of search.
7. **I can't tell which URLs came from Search Console rather than the sitemap.** Rows 2, 3, 4, 5 and 13 look like the odd ones; the `.html` and `.php` forms may be left over from a site older than the WordPress one. Some may already redirect or 404 today, which changes nothing about where they should end up but matters for avoiding redirect chains (section 5.5).

## 3. The options

| | A. Keep what's clean (recommended) | B. Clean slate | C. Mirror WordPress |
|---|---|---|---|
| What changes | Fix the 6 broken URLs, move all writing into `/insights/`, unify people pages | Shortest names everywhere: `/about/`, `/contact/`, `/work/`, `/services/strategy/`, services flattened to one level | Only the broken forms and the WordPress archives; posts keep their date URLs and `/blog/` stays |
| Redirects among the 34 | 19 (16 + 2 lookups + 1 retired) | About 32 | About 10 |
| Plus | One per unlisted post | One per unlisted post | None for posts |
| Serves | Prospective clients and search engines: one clear home for each kind of content | Whoever maintains the site: the tidiest URLs | The lowest migration effort |
| Where it strains | 18 or more post redirects to generate and check | Every ranking page rides on a redirect on the same day, for names that are barely shorter | Keeps "2019 › 04 › 12" in search-result breadcrumbs on evergreen advice; `/blog/` can't sensibly hold reports; people pages stay split |

**Recommendation: A.** B spends ranking risk on cosmetic gains: `/about-us/` and `/contact-us/` contain a filler word, but they are readable, consistent and already ranking, so they stay. C saves the post redirects but freezes the structure the new site is meant to fix. A changes only what is broken or structurally wrong.

**Why "Insights" rather than "Blog".** Your own WordPress category is already called Insights, the section will hold reports as well as articles (a benchmark report is not a blog post), and it is the conventional word for a consulting firm's published thinking. It is still an assumption about your buyers' vocabulary; tree-test tasks 5 and 6 check it.

## 4. The proposal

### 4.1 Sitemap

```
/                                              home
├── /services/                                 section-hub        (kept)
│   ├── /services/strategy-consulting/         service            (kept)
│   │   └── .../strategic-planning-workshops/  service, sub-level (kept)
│   ├── /services/operations/                  service            (kept)
│   │   └── .../process-improvement/           service, sub-level (kept)
│   └── /services/change-management/           service            (moved from .php)
├── /industries/                               section-hub        (implied today; build it)
│   ├── /industries/healthcare/                industry           (kept)
│   └── /industries/manufacturing/             industry           (kept)
├── /case-studies/                             listing            (kept)
│   └── /case-studies/<slug>/                  case-study         (kept, 2 today)
├── /insights/                                 listing            (new; replaces /blog/ and the archives)
│   ├── /insights/<slug>/                      article or report  (moved from /YYYY/MM/DD/<slug>/)
│   ├── /insights/topics/<topic>/              topic-listing      (new; 3 topics)
│   ├── /insights/reports/                     listing            (moved from /resources/whitepapers/)
│   └── /insights/feed.xml                     feed               (replaces /feed/)
├── /about-us/                                 page               (kept; replaces /about-us.html)
│   └── /about-us/team/                        people-listing     (moved from /About_Us/Our-Team)
│       └── /about-us/team/<person>/           person             (moved from /about-us/leadership/<person>/)
├── /careers/                                  page               (kept)
├── /contact-us/                               page with form     (kept)
├── /thank-you/                                utility, noindex   (kept; out of the sitemap)
├── /privacy-policy/                           legal              (kept)
└── /files/<name>.pdf                          download           (moved from /wp-content/uploads/)
```

Notes on placements:

- **The report** gets an HTML landing page at `/insights/operations-benchmark-report/` (new) that summarises it and links the PDF, so it has a page that can rank and be shared. The PDF itself moves to `/files/operations-benchmark-report-2022.pdf`, and the old PDF URL redirects to the new PDF, not to the landing page, because people and sites linking to a PDF expect a PDF.
- **One people listing, one profile pattern.** The team page lists everyone, leaders first. Every consultant who writes or leads client work should get a profile, because posts link their author to it and that replaces the author archive.
- **Careers stays top-level in the URL** (it is linked from job boards) and appears under About us in the navigation and in the footer.
- **Case studies** stays a plain list. At around 10 studies, add filtering by industry and service.
- **The Insights listing** shows everything, newest first, with links to the three topic pages and to Reports at the top. Add pagination (`/insights/page/<n>/`) only once it passes about 40 items; topic pages are the main way to narrow it.

### 4.2 Navigation

```
Primary (6):
  Services       dropdown: Strategy consulting (with Strategic planning workshops),
                 Operations (with Process improvement), Change management, All services
  Industries     dropdown: Healthcare, Manufacturing, All industries
  Case studies   link
  Insights       link
  About us       dropdown: Our firm, Team, Careers
  Contact us     styled as a button
  Why each earns its slot: Services is what buyers come to evaluate. Industries is how buyers
  identify themselves, and both industries have a case study behind them; it is the weakest
  slot with two children, and tree-test task 9 checks it (if it fails, fold industries into
  the Services dropdown as a second group). Case studies is the proof a buyer looks for
  before calling. Insights earns search traffic and shows expertise. About us answers "who
  would I be working with", which matters more for a 15-person firm than a large one.
  Contact us is the conversion.

Utility: none at launch. No sign-in, one language, and at this size browsing covers what
  search would; reconsider site search past about 150 pages.

Footer: Services (each service), Industries (each industry), Case studies, Insights,
  Reports, About us, Team, Careers, Contact us, Privacy policy, office address, LinkedIn.

Contextual:
  Breadcrumbs on every page below the top level, for example
    Home > Services > Strategy consulting > Strategic planning workshops
    Home > Insights > Why strategic plans fail
    Home > About us > Team > Jane Ortiz
  Every breadcrumb points at a real page, which is why /industries/ and /about-us/team/ exist.
  Service page: its sub-services, case studies that used it, insights on its topic, the people who lead it.
  Industry page: relevant services, case studies and insights tagged with that industry.
  Case study: the services used and the industry, each linked; the next case study.
  Insight: author bylines linked to profiles, topic links, three related insights on the same
    topic, and a closing link to the matching service.
  Person: their insights and the case studies they worked on.

Mobile: primary collapses into a menu; Contact us stays visible beside the menu button.
Active state: the current section is marked in the primary nav and the breadcrumb.
Rule for a new top-level item: it serves a top task for clients or candidates and holds
  at least three pages of its own; otherwise it goes in the footer or inside an existing section.
```

### 4.3 URL rules

```
Host:            https://www.northgateadvisory.com. http and the bare domain redirect to it at
                 the host, in one hop if the host allows.
Trailing slash:  yes on every page, because every current WordPress URL already has one and
                 dropping it would redirect the whole site. Enforce it (/careers redirects to
                 /careers/) and give every page a self-referencing canonical tag.
Case:            lowercase kebab-case only. Known mixed-case old URLs get explicit redirect rows.
Extensions:      none on pages; downloads keep theirs (.pdf, .xml).
Hierarchy:       the path mirrors the sitemap: /<section>/<slug>/. Services may go one level
                 deeper: /services/<service>/<sub-service>/.
Dates:           never in a URL. The date lives on the page and in the content fields.
Insights:        one flat namespace, /insights/<slug>/, for articles and reports alike, so an
                 item's URL survives a change of type. Reserved slugs: topics, reports, page, feed.xml.
Slugs:           from the title, filler words dropped, about 60 characters at most. Existing
                 slugs are kept as they are, even where a shorter one would read better.
Files:           /files/<kebab-name>.pdf, with the edition year in the name when editions repeat.
Query strings:   tracking (utm_) and state only, never identity.
Locales:         none; English only. If that changes, add a /<locale>/ prefix with hreflang.
Changing a slug: a redirect line in the same commit, and redirect lines are never deleted.
```

### 4.4 Content model

A static site keeps each item as a file with front matter. These are the fields that front matter should carry.

| Template | URL pattern | Fields | Relations |
|---|---|---|---|
| home | `/` | headline, intro, calls to action | featured services (3), featured case studies (2 or 3), latest insights (3, generated) |
| section-hub | `/services/`, `/industries/` | title, intro | children (generated) |
| service | `/services/<slug>/`, `/services/<parent>/<slug>/` | title, summary, problems we solve (list), approach (steps), outcomes (list), call to action | parent (0 or 1), sub-services (generated), topic (exactly 1), lead people (many); case studies (reverse) |
| industry | `/industries/<slug>/` | title, summary, challenges we see (list), how we help | services (many); case studies and insights with this industry (reverse) |
| case-study | `/case-studies/<slug>/` | title, client description, summary, challenge, approach, results (list), client quote (optional), published date | industry (exactly 1), services (1 to 3), people (many) |
| listing | `/case-studies/`, `/insights/`, `/insights/reports/`, `/insights/topics/<topic>/` | title, intro | items (generated by type, topic or industry) |
| article | `/insights/<slug>/` | title, summary, body, published date, updated date, type = article | authors (1 or more people), topics (1 or 2), industries (0 or more) |
| report | `/insights/<slug>/` | title, summary, key findings (list), file path, edition year, published date, type = report | authors, topics (1 or 2), industries (0 or more) |
| topic | `/insights/topics/<slug>/` | label, one-line definition, intro | service (exactly 1) |
| person | `/about-us/team/<slug>/` | name, role, bio, photo, LinkedIn URL, leadership (yes or no), sort order | expertise (topics); insights and case studies (reverse) |
| page | `/about-us/`, `/careers/`, `/contact-us/`, `/privacy-policy/`, `/thank-you/` | title, body | none |

Every template also carries: slug, status (draft, published, archived), SEO title, meta description, noindex (default no) and last updated. Copy the SEO titles and meta descriptions across from WordPress (Yoast or whichever SEO plugin holds them) for every kept and moved page: a redirect carries the old URL's standing, and the page it lands on still has to be the same page.

### 4.5 Taxonomy

The topics are your three service lines, so every insight points at something you sell and every service page can pull in its own writing.

```
Facet: Topic     Purpose: group insights; link writing to services   Selection: 1 or 2 per insight
  Strategy           Setting direction and priorities; strategic plans and planning sessions.
                     Synonyms: strategic planning, corporate strategy, planning offsite.
                     Service: Strategy consulting.
  Operations         How the work gets done: processes, lean, root causes, benchmarks.
                     Synonyms: process improvement, operational excellence, lean, efficiency.
                     Service: Operations.
  Change management  Getting people to adopt a change: reorganisations, new systems, new ways of working.
                     Synonyms: change, transformation, adoption, organisational change.
                     Service: Change management.
Facet: Industry  Purpose: let sector buyers find relevant proof   Selection: 0 or more on insights,
                                                                  exactly 1 on case studies
  Healthcare         Hospitals, health systems, clinics. Synonyms: hospitals, health systems.
  Manufacturing      Plants and factories. Synonyms: industrial, production.
Facet: Type      Selection: exactly 1, insights only
  Article, Report
Rules:
  - The WordPress categories (Uncategorized, Insights) and tags retire; topics replace them.
  - A new topic is added only when a new service line launches, or when applying the list
    (section 5.3) leaves three or more insights that fit no topic. Never add an "Other".
  - A new industry is added when there is at least one case study or service page for it.
  - Owner and change process: section 8.
```

## 5. Migration

### 5.1 What happens to the 34 URLs

| Action | Count | Rows (line numbers in `current-urls.txt`) |
|---|---|---|
| Keep, same URL, no redirect | 15 | 1, 8 to 12, 14 to 18, 31 to 34 |
| 301 to a new URL | 16 | 4 to 7, 13, 19 to 27, 29, 30 |
| 301 once the target is looked up | 2 | 2, 3 |
| 410, retired | 1 | 28 |
| **Total** | **34** | |

Every row, with its target and reason, is in **Appendix A**; the redirect file that implements them is **Appendix C**.

The two lookups: `/?p=112` and `/?page_id=7` are WordPress's raw ID links, and on the live site WordPress redirects each to its pretty URL. To resolve them, open each on the current site and note where it lands (or look up IDs 112 and 7 in the WordPress admin), then point the rule at that content's **new** URL. Two cautions: these rules need a host that can match query strings (5.4); and if the host can't, the request is for `/` with a query string, so visitors simply get the home page, whose canonical tag tells Google it is the home page. That fallback loses nothing that isn't already consolidated, but it is worse than resolving them.

### 5.2 URLs the list doesn't have

Redirect plans fail on the URLs nobody listed. **Appendix B** covers the inferred ones: the four implied parent pages, other leadership profiles, the RSS feed, WordPress's own sitemap URL, other category, tag and author archives, and blog pages past 3.

The big one is the posts. Every published post needs a line of the form `/YYYY/MM/DD/<slug>/  /insights/<slug>/  301`. Generate them from WordPress rather than by hand. With WP-CLI on the current site:

```
wp post list --post_type=post --post_status=publish --fields=post_name,post_date --format=csv \
  | tail -n +2 \
  | awk -F, '{ split($2, d, /[- ]/); printf "/%s/%s/%s/%s/  /insights/%s/  301\n", d[1], d[2], d[3], $1, $1 }'
```

Without WP-CLI, the post sitemap WordPress already publishes lists every post URL (`/post-sitemap.xml` with Yoast, `/wp-sitemap-posts-post-1.xml` with WordPress's own). Two rules for the generated lines: any post you decide to retire gets a 410 line instead, and any post whose slug you change keeps its old date URL on the left and gets the new slug on the right. Do the same for every tag: list them (`wp term list post_tag --fields=slug,count`), and send each to the matching topic page, or to `/insights/` when none fits.

I used explicit lines rather than one wildcard rule such as `/:year/:month/:day/:slug/`, because on most hosts a placeholder matches any path segment, not just digits, so the rule can catch pages it was never meant for.

Leave these without rules, so they 404: date archives (`/2019/`, `/2019/04/`), which are rarely linked and would need wildcards that catch posts; WordPress system paths (`/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`), which only bots request; and other files under `/wp-content/uploads/`, unless Search Console's Links report shows another site linking one, in which case it gets its own line.

### 5.3 Re-tagging

Apply the new taxonomy to every item in the same release, because old content left on old tags is how a new structure decays. Here are draft tags for the items I can see, guessed from titles alone; confirm each against the content.

| Item | Type | Topics or services | Industry | Note |
|---|---|---|---|---|
| the-5-whys-still-works | article | Operations | none | |
| remote-strategy-sessions | article | Strategy | none | Written in 2021; check it still reads as current |
| why-strategic-plans-fail | article | Strategy; Change management | none | Second topic if it is about execution and adoption |
| operations-benchmark-report | report | Operations | check: possibly Manufacturing | |
| regional-hospital-network-turnaround | case study | services: Operations, Strategy consulting | Healthcare | Services guessed from "turnaround" |
| acme-manufacturing-lean-rollout | case study | services: Process improvement, Change management | Manufacturing | "Rollout" suggests change work too |
| WordPress categories Uncategorized, Insights | retired | | | Redirect to `/insights/` |
| WordPress tag strategy | becomes topic Strategy | | | Redirect to `/insights/topics/strategy/` |

Then run the check this taxonomy depends on: after tagging every post, count the items per topic. A topic holding more than about 40% of the insights wants splitting, one holding fewer than three wants merging or a reason to stay, and three or more posts that fit no topic mean the list needs a fourth term (section 4.5).

### 5.4 What the host must do

Check these before choosing a host, because the redirect plan depends on them and hosts differ. I'd expect most static hosts to manage the first two; the rest vary, so confirm each one.

- Permanent 301 redirects from a rules file kept in the repository.
- Splat or placeholder rules (Appendix B uses them for `/category/*`, `/tag/*` and other leadership profiles).
- Redirect matching with and without the trailing slash, and with mixed case (row 5). If matching is exact, add the slashless and lowercase variants of row 5 as their own lines.
- Query-string matching, for rows 2 and 3. Without it, accept the home-page fallback in 5.1.
- A 410 status, for row 28 and other author archives. Without it, drop those lines and let the 404 page answer; search engines drop the page a little more slowly.
- Redirects applied even though a page exists at the path (rows 2 and 3 are on `/`). Some hosts serve an existing file before checking rules unless the rule is forced.

Prefer the host's redirect file over the static generator's own redirect feature. Some generators (Hugo's aliases and the jekyll-redirect-from plugin, for example) write small HTML pages that redirect in the browser rather than sending a real 301; search engines generally follow them, but a server 301 is the clearer signal.

### 5.5 Cutover checklist

Before launch:

1. Export WordPress (posts, pages, categories, tags, media) and check the post count against the list. Generate the post and tag lines (5.2) and add them to the redirect file.
2. Resolve rows 2 and 3.
3. Record what every old URL returns today. Where WordPress or an old `.htaccess` already redirects one, point the new rule straight at the final new URL, so no visitor goes through two hops.
4. From Search Console, export the top pages by clicks over the last 16 months and the most linked pages. Any URL there that isn't in the plan gets a row.
5. Carry each page's content, title tag and meta description across to the page at its new or kept URL.
6. Build the site on a staging address and run every old URL against it (section 7.2). Fix every miss, chain and loop before launch.
7. Make sure staging's "keep out of search" settings (a noindex tag or a robots.txt block) are not deployed to production.
8. Generate `sitemap.xml` from the build so it can't drift, listing only indexable pages: no `/thank-you/`, no redirects.
9. Move Search Console verification to the DNS method if it currently relies on a WordPress plugin's meta tag, because that tag disappears with WordPress. Check that the analytics tag and the contact form's thank-you tracking work on the new build.
10. If DNS is changing, lower its TTL a day or two ahead.

At launch: deploy, run the old-URL check again against production, submit the new `sitemap.xml` in Search Console, and use URL Inspection on a handful of moved pages.

After launch: section 7.3.

## 6. Assumptions and open questions

**Assumptions**

1. The domain, protocol and `www` form stay the same, so this is a URL migration, not a domain move, and Search Console's change-of-address tool doesn't apply.
2. The audience is senior people buying consulting (strategy, operations and change), mostly in healthcare and manufacturing, plus job candidates. Inferred from the services, industries and case studies.
3. Every post, case study and profile carries over with its current slug; nothing is retired except the WordPress archives. If you retire posts, each needs a 410 line above the generated post lines.
4. WordPress shows 10 posts per blog page (its default), so the blog holds 21 to 30 posts.
5. "Our Team" lists everyone; only leaders have profiles today.
6. The three service lines are the firm's whole offer, so they can double as the topic list.
7. Site content moves across largely unchanged at launch; copy rewrites happen after the new URLs have settled, so a ranking change can be traced to one cause.
8. The thank-you page's URL is used by analytics or ad conversion tracking, so it keeps its URL.
9. The static host isn't chosen; Appendix C is written in Netlify-style `_redirects` syntax as a common format to translate from.

**Open questions**

1. What are post 112 and page 7?
2. How many posts are there really, and do you want to retire any (the 2021 remote-sessions post, say)?
3. Did `/resources/whitepapers/` list more than the one report? If it is the only report and none is planned, `/insights/reports/` will be a one-item page; the alternative is to point row 29 at the report's landing page and build the listing when the second report arrives.
4. Are more industries or service lines planned? The structure takes a third industry or a fourth service as one new page each, with no new URLs elsewhere.
5. Is the benchmark report gated behind a form today? If so, decide whether the new PDF URL stays public.
6. Which host? Section 5.4 lists what it has to support.

## 7. How to validate it

### 7.1 Tree test the structure

Run it before building templates. Show participants the sitemap in 4.1 as labels only, with no design. Recruit at least 20 people who resemble your buyers (past clients and their colleagues are the easiest to reach), using any online tree-testing tool. An open card sort isn't needed first: the site is small and the shape is the familiar one for consulting firms, so testing it is the better use of people's time.

Success means choosing a correct node, first time or after backtracking. Targets: at least 80% on top tasks and 70% on the rest, with directness at most 1.5 times the shortest path. Tasks avoid the labels they test.

| # | Task, in the participant's words | Correct answer(s) | Target |
|---|---|---|---|
| 1 | Your hospital group's finances are slipping and the board wants a recovery plan. Where would you check whether this firm has done that before? | Case studies > Regional hospital network turnaround, or Industries > Healthcare | 80% |
| 2 | You want someone to run a two-day session where your leadership team agrees next year's priorities. Where would you look? | Services > Strategy consulting > Strategic planning workshops | 80% |
| 3 | Your factory's output has dropped and you think the way work flows is the problem. Where would you see what the firm offers? | Services > Operations > Process improvement | 80% |
| 4 | You're about to reorganise and you're worried staff won't go along with it. Where would you look for help? | Services > Change management | 70% |
| 5 | A colleague mentioned a study this firm published comparing how companies run their operations. Where would you find it? | Insights > Reports, or Insights | 70% |
| 6 | You want to read the firm's views on why the plans leadership writes each year never get carried out. Where would you go? | Insights, or Insights > Topics > Strategy | 70% |
| 7 | You met Jane Ortiz at a conference and want to check her background. | About us > Team > Jane Ortiz | 80% |
| 8 | You're a consultant thinking of applying to work here. | Careers (under About us, or the footer) | 70% |
| 9 | You run a plastics plant and want to know whether this firm understands businesses like yours. | Industries > Manufacturing | 70% |
| 10 | You want to ask the firm to bid on a project. | Contact us | 80% |

Tasks 5 and 6 test the Insights label and the decision to put reports inside it; task 8 tests Careers living under About us; task 9 tests whether Industries earns its primary slot. If a task fails, change the label or placement it points to and re-test that task.

### 7.2 Crawl the redirect map before cutover

Feed every old URL (the 34, plus the generated post and tag lines and Appendix B) to a crawler or a short script against staging. Pass means: kept URLs return 200; redirected URLs return 301 and land on a 200 page in one hop; retired URLs return 410 (or 404 if the host can't send 410); no target is itself redirected; nothing redirects to the home page. Run it again against production on launch day.

### 7.3 Watch after launch

Weekly for the first eight weeks, then monthly:

- Search Console's Pages report: new "Not found" URLs. Each one that had traffic or links gets a redirect line.
- Clicks and impressions for the moved pages against the same pages before launch. Some movement in the first weeks is normal while Google recrawls; a page that keeps falling usually means its content or title changed, or its redirect is wrong.
- Contact form submissions, as the business measure.

Keep every redirect permanently. On a static host a redirect line costs nothing, and the links pointing at the old URLs never go away.

## 8. Keeping it in order

- **Owner:** one named person, probably whoever runs marketing or a partner, approves new topics, new industries and new top-level sections.
- **New terms:** proposed to the owner, checked against the synonyms in 4.5 for a near-duplicate, then added to the controlled list. No tags created while publishing.
- **Redirects:** every slug change or removal adds a line to the redirect file in the same commit, and lines are never deleted.
- **Quarterly check:** topic counts (any topic over about 40% of insights, or under three items), insights with no topic, Search Console 404s, and a re-run of the redirect crawl.

---

## Appendix A: Full redirect map

Rows follow the line numbers in `current-urls.txt`. Paths are on `https://www.northgateadvisory.com`.

| # | Old URL | Action | New URL | Reason |
|---|---|---|---|---|
| 1 | `/` | Keep | `/` | Home |
| 2 | `/?p=112` | 301, after lookup | New URL of post 112 | WordPress post-ID link; resolve (5.1) |
| 3 | `/?page_id=7` | 301, after lookup | New URL of page 7 | WordPress page-ID link; resolve (5.1) |
| 4 | `/about-us.html` | 301 | `/about-us/` | File extension; duplicate of the about page |
| 5 | `/About_Us/Our-Team` | 301 | `/about-us/team/` | Capitals and underscore; team page moves under About us |
| 6 | `/about-us/leadership/jane-ortiz/` | 301 | `/about-us/team/jane-ortiz/` | One people listing, one profile pattern |
| 7 | `/about-us/leadership/sam-reid/` | 301 | `/about-us/team/sam-reid/` | One people listing, one profile pattern |
| 8 | `/services/` | Keep | `/services/` | Already clean |
| 9 | `/services/strategy-consulting/` | Keep | `/services/strategy-consulting/` | Already clean |
| 10 | `/services/strategy-consulting/strategic-planning-workshops/` | Keep | same | Already clean |
| 11 | `/services/operations/` | Keep | `/services/operations/` | Already clean |
| 12 | `/services/operations/process-improvement/` | Keep | same | Already clean |
| 13 | `/services/change-management.php` | 301 | `/services/change-management/` | File extension; matches its sibling services |
| 14 | `/industries/healthcare/` | Keep | `/industries/healthcare/` | Already clean |
| 15 | `/industries/manufacturing/` | Keep | `/industries/manufacturing/` | Already clean |
| 16 | `/case-studies/` | Keep | `/case-studies/` | Already clean |
| 17 | `/case-studies/regional-hospital-network-turnaround/` | Keep | same | Already clean |
| 18 | `/case-studies/acme-manufacturing-lean-rollout/` | Keep | same | Already clean |
| 19 | `/blog/` | 301 | `/insights/` | Section renamed; it now holds reports as well |
| 20 | `/blog/page/2/` | 301 | `/insights/` | Pagination; its contents shift with every new post, so there is no page-to-page match |
| 21 | `/blog/page/3/` | 301 | `/insights/` | As row 20 |
| 22 | `/2019/04/12/the-5-whys-still-works/` | 301 | `/insights/the-5-whys-still-works/` | Date out of the URL; slug kept |
| 23 | `/2021/09/30/remote-strategy-sessions/` | 301 | `/insights/remote-strategy-sessions/` | Date out of the URL; slug kept |
| 24 | `/2023/02/14/why-strategic-plans-fail/` | 301 | `/insights/why-strategic-plans-fail/` | Date out of the URL; slug kept |
| 25 | `/category/uncategorized/` | 301 | `/insights/` | WordPress default category, retired; the closest page listing the same posts |
| 26 | `/category/insights/` | 301 | `/insights/` | The category becomes the section itself |
| 27 | `/tag/strategy/` | 301 | `/insights/topics/strategy/` | Tag becomes the Strategy topic |
| 28 | `/author/admin/` | 410 | none | No equivalent; exposes the admin login name. Bylines now link to team profiles |
| 29 | `/resources/whitepapers/` | 301 | `/insights/reports/` | "Resources" retired; reports live in Insights (see open question 3) |
| 30 | `/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf` | 301 | `/files/operations-benchmark-report-2022.pdf` | Same file at a clean address |
| 31 | `/contact-us/` | Keep | `/contact-us/` | Already clean |
| 32 | `/careers/` | Keep | `/careers/` | Already clean |
| 33 | `/privacy-policy/` | Keep | `/privacy-policy/` | Already clean |
| 34 | `/thank-you/` | Keep | `/thank-you/` | Add noindex; remove from `sitemap.xml` |

Totals: 15 kept, 16 redirected, 2 redirected after lookup, 1 retired: 34. No target in this table is itself redirected.

## Appendix B: Rules for URLs not in the list

| Old URL | Action | New URL | Why |
|---|---|---|---|
| `/about-us/` | Keep | `/about-us/` | Implied parent of rows 6 and 7; it stays the about page |
| `/industries/` | Keep | `/industries/` | Implied parent of rows 14 and 15; becomes the Industries hub |
| `/about-us/leadership/` | 301 | `/about-us/team/` | Implied parent of rows 6 and 7 |
| `/about-us/leadership/<person>/` (any other) | 301 | `/about-us/team/<person>/` | Other leaders' profiles. A profile not rebuilt gets its own line to `/about-us/team/` above this rule |
| `/resources/` | 301 | `/insights/` | Implied parent of row 29 |
| Every unlisted published post `/YYYY/MM/DD/<slug>/` | 301 | `/insights/<slug>/` | Generated from WordPress (5.2); at least 18 if the blog shows 10 posts a page |
| Every tag `/tag/<tag>/` | 301 | Matching topic page, else `/insights/` | Generated from WordPress (5.2) |
| `/feed/`, `/blog/feed/` | 301 | `/insights/feed.xml` | Feed readers, and any newsletter tool that sends from RSS |
| `/blog/page/<n>/` and anything else under `/blog/` | 301 | `/insights/` | Blog pages past 3 |
| Any other `/category/...` | 301 | `/insights/` | Other categories, their pagination and feeds |
| Any other `/tag/...` | 301 | `/insights/` | Catches tag pagination and feeds after the per-tag lines |
| Any other `/author/...` | 410 | none | As row 28 |
| `/sitemap_index.xml`, `/wp-sitemap.xml` | 301 | `/sitemap.xml` | Whichever sitemap Search Console has on file |
| Date archives, WordPress system paths, other uploads | No rule (404) | none | See 5.2 |

## Appendix C: Redirect file (draft)

Netlify-style `_redirects` syntax: one rule per line, old path, new path, status, and the first matching line wins, so specific lines sit above wildcards. Translate it for your host and check each point in 5.4. It implements every row of Appendix A that needs a rule (16 redirects, 2 pending lookups, 1 retirement) and every rule in Appendix B; the 15 kept URLs need no line.

```
# Northgate Advisory: redirects for the static rebuild (draft)
# Every target is a final page: no chains. Never delete a line.

# Appendix A: rows from current-urls.txt
/about-us.html                                               /about-us/                                   301
/About_Us/Our-Team                                           /about-us/team/                              301
/about-us/leadership/jane-ortiz/                             /about-us/team/jane-ortiz/                   301
/about-us/leadership/sam-reid/                               /about-us/team/sam-reid/                     301
/services/change-management.php                              /services/change-management/                 301
/blog/                                                       /insights/                                   301
/blog/page/2/                                                /insights/                                   301
/blog/page/3/                                                /insights/                                   301
/2019/04/12/the-5-whys-still-works/                          /insights/the-5-whys-still-works/            301
/2021/09/30/remote-strategy-sessions/                        /insights/remote-strategy-sessions/          301
/2023/02/14/why-strategic-plans-fail/                        /insights/why-strategic-plans-fail/          301
/category/uncategorized/                                     /insights/                                   301
/category/insights/                                          /insights/                                   301
/tag/strategy/                                               /insights/topics/strategy/                   301
/resources/whitepapers/                                      /insights/reports/                           301
/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf  /files/operations-benchmark-report-2022.pdf  301
# 410: serves a short "this page has been removed" page with status 410. If the host can't
# send 410, delete the line and let the 404 page answer.
/author/admin/                                               /gone/                                       410

# Rows 2 and 3: RESOLVE BEFORE CUTOVER (section 5.1), then uncomment.
# Needs query-string matching; "!" forces the rule even though a page exists at /.
# /  p=112      /insights/<slug-of-post-112>/   301!
# /  page_id=7  /<new-url-of-page-7>/           301!

# Generated from WordPress (section 5.2): one line per unlisted post, then one per tag.
# Retired posts get a 410 line here instead. These must sit above the wildcards below.
# /YYYY/MM/DD/<slug>/   /insights/<slug>/          301
# /tag/<tag>/           /insights/topics/<topic>/  301

# Appendix B: inferred URLs and wildcards
/about-us/leadership/                                        /about-us/team/                              301
/about-us/leadership/*                                       /about-us/team/:splat                        301
/resources/                                                  /insights/                                   301
/feed/                                                       /insights/feed.xml                           301
/blog/feed/                                                  /insights/feed.xml                           301
/blog/*                                                      /insights/                                   301
/category/*                                                  /insights/                                   301
/tag/*                                                       /insights/                                   301
/author/*                                                    /gone/                                       410
/sitemap_index.xml                                           /sitemap.xml                                 301
/wp-sitemap.xml                                              /sitemap.xml                                 301
```
