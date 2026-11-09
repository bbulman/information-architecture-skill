# Northgate Advisory: new site structure, URL scheme and redirect plan

Prepared 24 October 2026 from `current-urls.txt` (34 URLs). This is a draft for Northgate to react to. The structure and the labels are judgment calls that Northgate owns; the redirect rules in Section 5 are the part that has to be exact.

All paths below are relative to `https://www.northgateadvisory.com`, which stays the canonical address.

---

## 1. Summary

Keep the 15 URLs that are already clean exactly as they are, move the 18 that WordPress (or an older site) made messy with one 301 each, and return 410 for the single page that has no equivalent. The new site keeps the shape buyers already use (Services, Industries, Case studies, About us, Contact us) and merges the blog, its categories and the whitepapers into one **Insights** section, so every article and report has one home and one set of tags.

The bigger ranking risk is what the list leaves out. The blog has three listing pages but only three posts are listed, which means roughly 18 to 27 posts are missing from it; WordPress also serves an ID "shortlink" for every post and page, date archives, feeds and a whole uploads folder. Section 5.2 covers all of those with pattern rules, and Section 5.4 lists what to export from WordPress before it is switched off.

What protects rankings, in order of impact:

1. Kept URLs stay byte-for-byte identical, trailing slash included.
2. Every other old URL reaches its true equivalent in one 301 hop. Nothing is sent to the homepage.
3. The pages that rank keep their titles, headings, meta descriptions and body copy at launch. Rebuilds lose more rankings to rewritten copy than to redirects.
4. The URLs missing from the list are found and mapped before cutover, not after.

---

## 2. What exists now

### 2.1 Who the site serves (assumed)

Northgate is a 15-person management consultancy with three service lines (strategy, operations, change management) and two named sectors (healthcare, manufacturing). I have assumed the main readers are senior leaders at mid-sized hospitals, health systems and manufacturers who are deciding whether to shortlist the firm. Their top tasks are to see whether Northgate does the work they need, see proof it has done that work for an organization like theirs, judge the people, and get in touch. Secondary readers are job candidates and people who arrive from search on a single article. Success for the site means contact-form inquiries, and organic search clicks held at or above their pre-launch level.

### 2.2 The 34 URLs, by type

Row numbers are line numbers in `current-urls.txt`.

| Type | Count | Rows | Notes |
|---|---|---|---|
| Home | 1 | 1 | |
| WordPress ID links | 2 | 2, 3 | `?p=` is a post and `?page_id=` is a page. WordPress prints one of these "shortlinks" in the head of every post and page, which is how Search Console finds them. |
| Legacy aliases | 3 | 4, 5, 13 | A `.html` page, a `.php` page and a mixed-case path with an underscore. They look older than the WordPress site and are still linked or indexed somewhere. |
| People | 2 | 6, 7 | Two leadership bios. Their parents, `/about-us/` and `/about-us/leadership/`, are not in the list. |
| Services | 5 | 8 to 12 | A hub, two services and two sub-services. The third service, change management, exists only as the `.php` alias in row 13. |
| Industries | 2 | 14, 15 | No `/industries/` hub in the list. |
| Case studies | 3 | 16 to 18 | A listing and two studies, one per industry. |
| Blog listings | 3 | 19 to 21 | The hub plus pagination pages 2 and 3. |
| Posts | 3 | 22 to 24 | Date-based permalinks, 2019 to 2023. |
| WordPress archives | 4 | 25 to 28 | Two categories, one tag, one author. |
| Whitepapers listing | 1 | 29 | The only page under `/resources/`. |
| Files | 1 | 30 | One PDF in the WordPress uploads folder. |
| Contact, careers, legal, confirmation | 4 | 31 to 34 | |
| **Total** | **34** | | |

At about 50 pages the site is the size where a hub-and-spoke shape (a few wide sections, one or two levels deep) is the right default, and that is roughly what it already has: nothing sits deeper than three levels. The shape is sound. The problems are URL hygiene, thought leadership scattered across four places, and a taxonomy with nothing in it.

### 2.3 Problems found

1. **Most posts are missing from the list.** Three blog listing pages means 21 to 30 posts at WordPress's default of ten per page (check Settings, Reading), but only three post URLs appear. Each missing post would 404 on launch day without a rule. Section 5.2 covers them with pattern rules and Section 5.4 says how to get the full list.
2. **Four parent pages are phantoms.** `/about-us/`, `/about-us/leadership/`, `/industries/` and `/resources/` sit above listed pages but are not listed themselves. Either they do not exist, so breadcrumbs and trimmed URLs dead-end, or the sitemap missed them. The new site makes `/about-us/` and `/industries/` real pages and redirects the other two, so the plan works either way.
3. **The team has two homes and two names.** `/About_Us/Our-Team` calls it a team; the bios sit under `leadership`.
4. **Change management has no clean URL.** Its only address is `/services/change-management.php`, and nothing in the list suggests any article supports it.
5. **The categories carry no information.** `Uncategorized` is WordPress's default bucket and `Insights`, by its name, is everything else. The only real topic signal is one tag, `strategy`. No existing tag can be carried over as it is; the content needs re-tagging (Section 5.7).
6. **Posts are credited to `admin`.** `/author/admin/` means articles are attributed to a login, not a consultant. A firm that sells its people's judgment is wasting its best credibility signal, and the archive also publishes the WordPress administrator's username.
7. **Thought leadership is spread across four paths and three labels:** `/blog/`, `/category/insights/`, `/resources/whitepapers/` and `/wp-content/uploads/`, labelled Blog, Insights and Resources. Someone reading an article never sees the related report.
8. **"Resources" hides what is behind it**, and it has a single child.
9. **Post URLs carry their publish date.** `/2019/04/12/...` makes an evergreen piece look stale in search results and ties the address to a fact the reader does not need.
10. **The confirmation page is indexed.** `/thank-you/` appearing in a sitemap or in Search Console means it can be found in Google without submitting anything.
11. **Only one file is listed.** The uploads folder will hold every image in every post and probably other whitepapers. None are in the list.

---

## 3. The options

| | A. Same sections, clean URLs | B. One Insights section (recommended) | C. Industry-led |
|---|---|---|---|
| Top level | Services, Industries, Case studies, Blog, Resources, About us | Services, Industries, Case studies, Insights, About us | Healthcare and Manufacturing, each holding its own services, case studies and articles |
| Who it serves | Everyone, exactly as today | Buyers who read before they call: one place for all of Northgate's thinking, filterable by topic and sector | Buyers who think of themselves by sector first |
| 301s needed from the list | 14, plus one 410 | 18, plus one 410 | Roughly 28: almost every service, industry and case study URL moves |
| Where it strains | Keeps "Resources" and its single child. Articles and reports stay in two sections with two sets of tags, so related reading never crosses between them | Four more redirects than A (the blog hub, its two pagination pages and the whitepapers listing), each one hop to a direct equivalent. "Insights" has to pass the tree test (Section 7.2) | Every service appears under both sectors, so each has two homes. It moves the URLs that most likely rank. With two sectors and sector-neutral services it is premature |

**Recommendation: B.** The posts have to move anyway, because date permalinks are gone in the new scheme, so the only extra cost over A is four one-hop redirects of listing pages. In exchange the firm gets one listing, one taxonomy and one label for all of its thinking. "Insights" is the word the site already uses for its main category and the convention on consulting sites, so buyers know what is behind it. C becomes worth revisiting only if Northgate decides to sell vertically and adds sector-specific services.

---

## 4. The proposal

### 4.1 Sitemap

```
/                                                     home
├── /services/                                        section-hub
│   ├── /services/strategy-consulting/                service
│   │   └── /services/strategy-consulting/strategic-planning-workshops/   service (sub-offering)
│   ├── /services/operations/                         service
│   │   └── /services/operations/process-improvement/                     service (sub-offering)
│   └── /services/change-management/                  service             (moved from .php)
├── /industries/                                      section-hub         (new: was a missing parent)
│   ├── /industries/healthcare/                       industry
│   └── /industries/manufacturing/                    industry
├── /case-studies/                                    listing             filters: industry, service
│   ├── /case-studies/regional-hospital-network-turnaround/               case-study
│   └── /case-studies/acme-manufacturing-lean-rollout/                    case-study
├── /insights/                                        listing             (new: replaces /blog/, /category/*, /tag/*)
│   │                                                                     filters: topic, industry, format
│   ├── /insights/<slug>/                             article             (moved from /YYYY/MM/DD/<slug>/)
│   └── /insights/reports/                            listing             (moved from /resources/whitepapers/)
│       └── /insights/reports/<slug>/                 report              (new landing page for each PDF)
├── /about-us/                                        about               (new page: replaces /about-us.html)
│   └── /about-us/team/                               team                (moved from /About_Us/Our-Team)
│       └── /about-us/team/<person>/                  person              (moved from /about-us/leadership/<person>/)
├── /careers/                                         page
├── /contact-us/                                      contact
├── /thank-you/                                       confirmation        noindex, left out of the sitemap
├── /privacy-policy/                                  legal
└── (404 page)                                        not-found           real 404 status

Files, not pages:
/downloads/<name>.pdf                                 report PDFs         (moved from /wp-content/uploads/...)
/media/<year>/<month>/<file>                          other migrated WordPress uploads, reached by redirect
```

Depth is at most three levels below home, and only where the content really nests (sub-services, bios, report pages). At launch the site holds about 50 pages, most of them articles.

### 4.2 Labels

Where a URL is new, its label uses the same words, so the menu, the breadcrumb and the address all agree. Where a URL is kept, the label stays as it is.

| Label (menu and page heading) | URL | Was |
|---|---|---|
| Services | `/services/` | Services |
| Strategy consulting | `/services/strategy-consulting/` | same |
| Strategic planning workshops | `/services/strategy-consulting/strategic-planning-workshops/` | same |
| Operations | `/services/operations/` | same |
| Process improvement | `/services/operations/process-improvement/` | same |
| Change management | `/services/change-management/` | same label, `.php` address |
| Industries | `/industries/` | (no page) |
| Healthcare, Manufacturing | `/industries/<sector>/` | same |
| Case studies | `/case-studies/` | same |
| Insights | `/insights/` | Blog; the Insights category |
| Reports | `/insights/reports/` | Resources, Whitepapers. "Whitepaper" is kept as a search synonym |
| About us | `/about-us/` | About Us |
| Team | `/about-us/team/` | Our Team; Leadership. "Leadership" becomes a group heading on the team page |
| Careers | `/careers/` | same |
| Contact us | `/contact-us/` | same |
| Privacy policy | `/privacy-policy/` | same |

### 4.3 Navigation spec

```
Primary (five items and one button, left to right)
  Services       dropdown: Strategy consulting, Operations, Change management, All services
  Industries     dropdown: Healthcare, Manufacturing, All industries
  Case studies   link
  Insights       link
  About us       dropdown: About us, Team
  Contact us     button, right-aligned, always visible

  Why each earns its slot: Services and Industries answer "do they do what I need,
  for organizations like mine"; Case studies answers "have they done it before";
  Insights is how most search visitors arrive and how buyers judge the thinking;
  About us is where they judge the people; Contact us is the business goal.
  Sub-services are reached from their parent service page and the footer, not the
  dropdown, so every dropdown stays one level deep. No mega-menu: no item has three
  or more sub-groups with children of their own.

Utility
  None at launch: no sign-in, one language, and too few pages for site search to
  beat browsing. Add search when Insights passes about 100 items.

Footer (the fuller sitemap)
  Services:   Strategy consulting, Strategic planning workshops, Operations,
              Process improvement, Change management
  Industries: Healthcare, Manufacturing
  Insights:   Articles, Reports, Case studies
  Firm:       About us, Team, Careers, Contact us
  Bottom row: Privacy policy, office address, phone, LinkedIn, copyright

Contextual
  Breadcrumbs on every page except home, each crumb a real page, with
  BreadcrumbList structured data:
    Home > Services > Strategy consulting > Strategic planning workshops
    Home > Industries > Healthcare
    Home > Case studies > Regional hospital network turnaround
    Home > Insights > Why strategic plans fail
    Home > Insights > Reports > Operations benchmark 2022
    Home > About us > Team > Jane Ortiz
    Home > Careers
  Service page:  side rail of the three services with the current one's
                 sub-services open; case studies that used this service; three
                 latest insights on the matching topic; industries served; contact.
  Industry page: case studies in this sector; services most used there; insights
                 tagged with this sector; contact.
  Case study:    its industry and services as links; next case study; contact.
  Article:       author card linking to the bio; up to three related items by topic,
                 then by industry; the matching service page; contact.
  Report:        download button with file size and page count; key findings;
                 related articles.
  Person:        articles they wrote; case studies they worked on.
  Listings:      filter chips for each facet, shown only once a facet has two or
                 more values that hold items (so no filters on Case studies at launch).

Mobile
  Primary items collapse behind a menu button; Contact us stays visible beside it.
  Dropdowns become accordions. The footer stacks in the same group order.

Active state
  The primary item matching the URL's first segment is highlighted, and the current
  page's own link carries aria-current="page".

Rule for adding a top-level item
  It must serve a top buyer task, shown by analytics, search queries or what
  prospects ask on calls; it must not fit under an existing section; and the menu
  stays at six or fewer, so adding one means merging another.
```

### 4.4 URL rules

```
Domain          https://www.northgateadvisory.com is canonical. http:// and the bare
                domain 301 to it, ideally in the same hop as any path redirect,
                never more than two hops in total.
Case            Lowercase kebab-case only. Known legacy variants get explicit rules.
Trailing slash  Yes, as WordPress used. Kept URLs must stay byte-identical, so the
                generator writes directory-style output (services/index.html) and
                the host 301s /services to /services/. Getting this wrong silently
                turns every kept URL into a redirect.
Extensions      None for pages. Files keep theirs (.pdf, .xml).
Hierarchy       The path mirrors the sitemap: /<section>/<slug>/, with a third level
                only for sub-services, bios and report pages.
Slugs           From the title with filler trimmed, at most about 60 characters.
                Existing clean slugs are never shortened for taste: every rename
                costs a permanent redirect.
No dates, no IDs in any path.
Query strings   Only for listing state (?topic=strategy). Listings declare the
                unfiltered URL as canonical.
Reserved        Under /insights/: reports, topics, page, feed.xml. No article may
                take these slugs.
Files           Report PDFs at /downloads/<kebab-name>.pdf. Everything else from the
                WordPress uploads folder at /media/<year>/<month>/<original name>.
Canonical tags  Absolute and self-referencing on every indexable page.
Sitemap         /sitemap.xml is generated by the build from published, indexable
                pages. Never hand-kept. /thank-you/ and redirects never appear in it.
Locales         None today. If added: a /<language>/ prefix with hreflang siblings,
                English at the root as x-default.
Changing a slug Add the old URL to the item's legacy_urls field; the build writes
                the 301. Redirects are never deleted.
404             A real 404 status (not a 200), with links to Services, Case studies,
                Insights and Contact us.
```

### 4.5 Content model

Every item, whatever its template, carries: `title`, `slug`, `meta_description`, `status` (draft, published, archived), `noindex` (true or false), `updated_at`, and `legacy_urls` (old URLs that 301 here). Items migrated from WordPress also keep `wp_id`, so the `?p=` and `?page_id=` redirects can be generated from content rather than typed by hand.

| Template | URL pattern | Fields | Relations |
|---|---|---|---|
| home | `/` | hero heading, hero summary, call to action | featured services (many), featured case studies (many); latest insights derived |
| section-hub | `/services/`, `/industries/` | intro, call to action | children derived from `parent` |
| service | `/services/<slug>/`, `/services/<parent>/<slug>/` | summary, problems we solve (list), approach (body), outcomes (list), call to action | parent service (one, optional), topic (one), industries (many), case studies (many); related insights derived from topic |
| industry | `/industries/<slug>/` | summary, sector challenges (list), body | services (many); case studies and insights derived from the industry tag |
| case-study | `/case-studies/<slug>/` | client descriptor (named only with permission), challenge, approach, results (list of measure and figure), quote (with attribution and permission), published date | industry (one), services (many), team (people, many) |
| listing | `/case-studies/`, `/insights/`, `/insights/reports/` | intro, which facets to offer | items derived; a fixed format filter for `/insights/reports/` |
| article | `/insights/<slug>/` | summary, body, published date, updated date | authors (people, one or more), topics (many), industries (many) |
| report | `/insights/reports/<slug>/` | summary, key findings (list), file path, file size, page count, published date, gated (true or false) | authors (people), topics (many), industries (many) |
| about | `/about-us/` | body, how we work | leadership derived from the team |
| team | `/about-us/team/` | intro | people derived, grouped by `group` (Leadership first) |
| person | `/about-us/team/<slug>/` | name, role, group, photo, bio, LinkedIn URL | expertise (topics, many), industries (many); articles and case studies derived |
| page | `/careers/` | body, openings (list of title, location, type, how to apply) | |
| contact | `/contact-us/` | address, phone, email, form definition, success URL `/thank-you/` | |
| confirmation | `/thank-you/` | body; `noindex` always true | |
| legal | `/privacy-policy/` | body, last reviewed date | |

The build has to enforce four things for this to hold: slugs are lowercase kebab-case and unique within their parent; `parent` exists for every nested item; taxonomy fields only accept terms from the controlled list in 4.6; and `legacy_urls` across the whole site never repeat and never point at another redirect.

Articles also publish an RSS feed at `/insights/feed.xml`, so existing feed subscribers can be redirected to it.

### 4.6 Taxonomy

```
Facet: Topic      Purpose: link every piece of thinking to a service line    Selection: one or more    Owner: marketing lead
  Strategy             Definition: setting direction, strategic plans, planning sessions and retreats.
                       Synonyms: strategic planning, strategy sessions, offsite, retreat
  Operations           Definition: how work gets done: process, lean, root cause, benchmarks.
                       Synonyms: process improvement, lean, 5 whys, efficiency, benchmarking
  Change management    Definition: getting people to adopt new structures, systems and ways of working.
                       Synonyms: transformation, adoption, organizational change

Facet: Industry   Purpose: let a sector buyer see only what applies to them   Selection: zero or more   Owner: marketing lead
  Healthcare           Definition: hospitals, health systems, clinics.   Synonyms: hospital, health system
  Manufacturing        Definition: plants, factories, industrial producers.   Synonyms: factory, plant, industrial
  (No "cross-industry" term: an item with no industry tag applies to all. That avoids an "Other" bucket.)

Facet: Format     Purpose: separate quick reads from downloadable research    Selection: exactly one    Owner: marketing lead
  Article              Definition: a web article.   Synonyms: post, blog post
  Report               Definition: a downloadable study or paper.   Synonyms: whitepaper, benchmark, study

Rules
  - Every article and report gets exactly one format and at least one topic.
  - Topics follow the service lines. A new topic appears only with a new service line.
  - A new term is proposed to the owner, checked against the existing terms and their
    synonyms for a near-duplicate, then approved or merged. Nobody creates terms while
    publishing.
  - Version 1, October 2026. Changes are logged with the date and the reason.
```

**Applied to the content in the list.** These tags come from titles only; I have not read the posts, so treat them as guesses to confirm.

| Item | Topic | Industry | Format |
|---|---|---|---|
| The 5 whys still works (2019) | Operations | none | Article |
| Remote strategy sessions (2021) | Strategy | none | Article |
| Why strategic plans fail (2023) | Strategy | none | Article |
| Operations benchmark report (2022) | Operations | unknown | Report |
| Regional hospital network turnaround (case study) | Operations, probably Strategy | Healthcare | not applicable |
| Acme manufacturing lean rollout (case study) | Operations | Manufacturing | not applicable |

What applying it shows: Strategy and Operations each catch two or three items, Change management catches none, and almost no article carries an industry tag. That makes two gaps worth knowing before launch. The change management service page will have no supporting reading, and the industry pages will have a case study each but no sector-specific articles. Neither is a structure problem; both are a content plan.

### 4.7 Governance and growth

- **Owner:** one named person, probably the marketing lead or a partner, approves new terms, new top-level items and slug changes.
- **Quarterly check** (publishing volume is low): terms with no items (Change management today), any term holding more than 40% of items, untagged items, pages with no inbound links, and a re-run of the old-URL test in Section 7.1.
- **Ten times the content:** at about 100 insights, add site search; at about 300, add static topic pages at `/insights/topics/<topic>/` and re-point `/tag/*` to them by editing the rule, not chaining a new one. New service lines sit at `/services/<slug>/`, new sub-offerings one level below, new sectors at `/industries/<slug>/`. The team page groups by role, and gains an expertise filter once there are more than about 40 people.

---

## 5. Migration

### 5.1 Every URL in the list, mapped

Status 200 means the URL is kept unchanged and needs no rule.

| # | Old URL | Status | New URL | Why |
|---|---|---|---|---|
| 1 | `/` | 200 | `/` | Kept |
| 2 | `/?p=112` | 301 | `/insights/<slug of post 112>/` | WordPress shortlink for a post. Look up the target before switch-off (5.4, step 7). Needs a rule that matches the query string |
| 3 | `/?page_id=7` | 301 | the new URL of page 7 | WordPress shortlink for a page. Look it up the same way. It may be the old About page, which would explain why `/about-us/` is missing from the sitemap; if so, the target is `/about-us/` |
| 4 | `/about-us.html` | 301 | `/about-us/` | Legacy alias; file extension |
| 5 | `/About_Us/Our-Team` | 301 | `/about-us/team/` | Legacy alias; mixed case and underscore |
| 6 | `/about-us/leadership/jane-ortiz/` | 301 | `/about-us/team/jane-ortiz/` | One team page; bios live under it |
| 7 | `/about-us/leadership/sam-reid/` | 301 | `/about-us/team/sam-reid/` | Same |
| 8 | `/services/` | 200 | `/services/` | Kept |
| 9 | `/services/strategy-consulting/` | 200 | `/services/strategy-consulting/` | Kept |
| 10 | `/services/strategy-consulting/strategic-planning-workshops/` | 200 | same | Kept |
| 11 | `/services/operations/` | 200 | `/services/operations/` | Kept |
| 12 | `/services/operations/process-improvement/` | 200 | same | Kept |
| 13 | `/services/change-management.php` | 301 | `/services/change-management/` | File extension |
| 14 | `/industries/healthcare/` | 200 | `/industries/healthcare/` | Kept |
| 15 | `/industries/manufacturing/` | 200 | `/industries/manufacturing/` | Kept |
| 16 | `/case-studies/` | 200 | `/case-studies/` | Kept |
| 17 | `/case-studies/regional-hospital-network-turnaround/` | 200 | same | Kept |
| 18 | `/case-studies/acme-manufacturing-lean-rollout/` | 200 | same | Kept |
| 19 | `/blog/` | 301 | `/insights/` | Section merged into Insights |
| 20 | `/blog/page/2/` | 301 | `/insights/` | Pagination does not map page for page; the listing is the equivalent |
| 21 | `/blog/page/3/` | 301 | `/insights/` | Same |
| 22 | `/2019/04/12/the-5-whys-still-works/` | 301 | `/insights/the-5-whys-still-works/` | Date removed; slug unchanged |
| 23 | `/2021/09/30/remote-strategy-sessions/` | 301 | `/insights/remote-strategy-sessions/` | Same |
| 24 | `/2023/02/14/why-strategic-plans-fail/` | 301 | `/insights/why-strategic-plans-fail/` | Same |
| 25 | `/category/uncategorized/` | 301 | `/insights/` | A list of articles with no topic; the full listing is its equivalent |
| 26 | `/category/insights/` | 301 | `/insights/` | Direct equivalent |
| 27 | `/tag/strategy/` | 301 | `/insights/` | No topic pages at launch. When they exist, edit this rule to point at `/insights/topics/strategy/` |
| 28 | `/author/admin/` | 410 | none | An archive for a login, not a person; nothing on the new site corresponds to it. If Search Console shows clicks or external links to it, 301 it to `/insights/` instead |
| 29 | `/resources/whitepapers/` | 301 | `/insights/reports/` | Direct equivalent |
| 30 | `/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf` | 301 | `/downloads/operations-benchmark-2022.pdf` | File to file, because links to a PDF expect the PDF. The report also gets a landing page at `/insights/reports/operations-benchmark-2022/` |
| 31 | `/contact-us/` | 200 | `/contact-us/` | Kept |
| 32 | `/careers/` | 200 | `/careers/` | Kept |
| 33 | `/privacy-policy/` | 200 | `/privacy-policy/` | Kept |
| 34 | `/thank-you/` | 200 | `/thank-you/` | Kept, but now `noindex` and out of the sitemap, so Google drops it |

Totals: 15 kept, 18 redirected with a 301, 1 gone with a 410. Every target is a page that answers 200 on the new site, so there are no chains and no loops, and nothing is sent to the homepage.

### 5.2 Rules for URLs your list does not show

These cover what WordPress serves beyond its sitemap. Rules for URLs that turn out not to exist cost nothing, so they are included rather than guessed away.

| Old URL pattern | Status | Target | Why |
|---|---|---|---|
| `/<year>/<mm>/<dd>/<slug>/` for every year with posts | 301 | `/insights/<slug>/` | Every post, including the 18 to 27 missing from the list. Works only because slugs carry over unchanged |
| `/<year>/`, `/<year>/<mm>/`, `/<year>/<mm>/<dd>/` | 301 | `/insights/` | WordPress date archives |
| `/?p=<id>` and `/?page_id=<id>` for every published item | 301 | that item's new URL | Every post and page has a shortlink; generate these from the `wp_id` field |
| `/blog/page/<n>/` beyond page 3, and `/page/<n>/` | 301 | `/insights/` | Any further pagination |
| `/category/<any>/`, `/tag/<any>/` | 301 | `/insights/` | Categories and tags not in the list |
| `/author/<user>/` | 410, or 301 to the person's bio | none, or `/about-us/team/<person>/` | Map any real author to their bio first; anything left is gone |
| `/about-us/leadership/` | 301 | `/about-us/team/` | The phantom parent of the bios |
| `/about-us/leadership/<person>/` | 301 | `/about-us/team/<person>/` | Any other bios not in the list |
| `/About_Us/<anything>` | 301 | `/about-us/` | Other pages from the old pre-WordPress About section |
| `/resources/` | 301 | `/insights/reports/` | The phantom parent of whitepapers |
| `/feed/`, `/blog/feed/`, `/comments/feed/` | 301 | `/insights/feed.xml` | Feed subscribers |
| `/sitemap_index.xml`, `/wp-sitemap.xml`, `/post-sitemap.xml`, `/page-sitemap.xml` | 301 | `/sitemap.xml` | Whichever sitemap WordPress or its SEO plugin published |
| `/wp-content/uploads/<path>` | 301 | `/media/<path>` | Every image and file in old posts and on other sites. Copy the uploads folder into `/media/` unchanged. Named downloads get explicit rules above this one, as row 30 does |
| `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/` | 404 | none | No rule. These attract bots, not readers |

### 5.3 The redirect file

This is written in the `_redirects` format that Netlify and Cloudflare Pages read: one rule per line, `old  new  status`, checked top to bottom with the first match winning. Other hosts take the same rules in their own syntax. Before using it, confirm four things in your host's documentation, because they differ by host: whether it matches query strings, whether it can return a 410 from this file, whether matching is case-sensitive, and how it treats trailing slashes. Then test every line on staging (Section 7.1).

```
# Northgate Advisory redirects. Order matters: specific rules first, patterns last.

# 1. People and About (rows 4 to 7, plus precautionary rules)
/about-us.html                          /about-us/                          301
/About_Us/Our-Team                      /about-us/team/                     301
/About_Us/*                             /about-us/                          301
/about-us/leadership/jane-ortiz/        /about-us/team/jane-ortiz/          301
/about-us/leadership/sam-reid/          /about-us/team/sam-reid/            301
/about-us/leadership/                   /about-us/team/                     301
/about-us/leadership/*                  /about-us/team/:splat               301

# 2. Services (row 13)
/services/change-management.php         /services/change-management/        301

# 3. Blog listings and WordPress archives (rows 19 to 21, 25 to 27, 29)
/blog/feed/                             /insights/feed.xml                  301
/blog/                                  /insights/                          301
/blog/page/*                            /insights/                          301
/page/*                                 /insights/                          301
/category/insights/                     /insights/                          301
/category/uncategorized/                /insights/                          301
/category/*                             /insights/                          301
/tag/strategy/                          /insights/                          301
/tag/*                                  /insights/                          301
/resources/whitepapers/                 /insights/reports/                  301
/resources/                             /insights/reports/                  301

# 4. Posts (rows 22 to 24), then every other post by year.
#    Keep one pair of lines for each year from your first post to this year.
#    Year-prefixed rules cannot catch a real page the way /:a/:b/:c/:d would.
/2019/04/12/the-5-whys-still-works/     /insights/the-5-whys-still-works/   301
/2021/09/30/remote-strategy-sessions/   /insights/remote-strategy-sessions/ 301
/2023/02/14/why-strategic-plans-fail/   /insights/why-strategic-plans-fail/ 301
/2015/:month/:day/:slug                 /insights/:slug/                    301
/2016/:month/:day/:slug                 /insights/:slug/                    301
/2017/:month/:day/:slug                 /insights/:slug/                    301
/2018/:month/:day/:slug                 /insights/:slug/                    301
/2019/:month/:day/:slug                 /insights/:slug/                    301
/2020/:month/:day/:slug                 /insights/:slug/                    301
/2021/:month/:day/:slug                 /insights/:slug/                    301
/2022/:month/:day/:slug                 /insights/:slug/                    301
/2023/:month/:day/:slug                 /insights/:slug/                    301
/2024/:month/:day/:slug                 /insights/:slug/                    301
/2025/:month/:day/:slug                 /insights/:slug/                    301
/2026/:month/:day/:slug                 /insights/:slug/                    301
/2015/*                                 /insights/                          301
/2016/*                                 /insights/                          301
/2017/*                                 /insights/                          301
/2018/*                                 /insights/                          301
/2019/*                                 /insights/                          301
/2020/*                                 /insights/                          301
/2021/*                                 /insights/                          301
/2022/*                                 /insights/                          301
/2023/*                                 /insights/                          301
/2024/*                                 /insights/                          301
/2025/*                                 /insights/                          301
/2026/*                                 /insights/                          301

# 5. Files (row 30 first, then everything else in uploads)
/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf   /downloads/operations-benchmark-2022.pdf   301
/wp-content/uploads/*                   /media/:splat                       301

# 6. Feeds and sitemaps
/feed/                                  /insights/feed.xml                  301
/feed/*                                 /insights/feed.xml                  301
/comments/feed/                         /insights/feed.xml                  301
/sitemap_index.xml                      /sitemap.xml                        301
/wp-sitemap.xml                         /sitemap.xml                        301
/post-sitemap.xml                       /sitemap.xml                        301
/page-sitemap.xml                       /sitemap.xml                        301

# 7. Gone (row 28). Return 410 Gone. Some hosts express this here as a rewrite to a
#    small "gone" page with status 410; others only allow 3xx codes in this file, in
#    which case set the 410 in the host's own rules, or let the path fall through to
#    the 404 page (Google drops a 404 too, just more slowly).
# /author/admin/                        (410)
# /author/*                             (410, after any real authors are mapped to their bios)

# 8. WordPress shortlinks (rows 2 and 3). These need query-string matching, which
#    path rules cannot do: without it, /?p=112 simply serves the homepage. Resolve
#    the targets first (5.4, step 7), then add them with your host's query-matching
#    feature, one rule per published post and page ID.
# /?p=112        301  /insights/<slug of post 112>/
# /?page_id=7    301  <new URL of page 7>
```

On a host that supports regular expressions, the post rules collapse to one: match `^/(?:19|20)\d{2}/\d{2}/\d{2}/([a-z0-9-]+)/?$` and send it to `/insights/$1/`.

If a host cannot send server-side 301s at all (GitHub Pages is the common case; it can only fake them with a page that refreshes), choose another host or put a CDN with redirect rules in front of it. A refresh-based redirect is not a substitute.

### 5.4 Before WordPress is switched off

1. **Back up everything**, files and database, and keep the backup. If the old site has to stay online while the new one is built, put it behind a password rather than relying on `noindex`, so Google never sees two copies.
2. **Export every published post and page with its ID.** With WP-CLI: `wp post list --post_type=post,page --post_status=publish --fields=ID,post_type,post_name,post_date --format=csv`. Without it, read the sitemaps WordPress or its SEO plugin publishes (`/wp-sitemap.xml` or `/sitemap_index.xml` and its children). Compare the result against the 34 URLs; every new URL gets a row in the map.
3. **List the uploads folder** over SFTP or the host's file manager, so the `/media/` copy is complete and any other whitepaper PDFs get a clean name and an explicit rule.
4. **Crawl the live site** with a desktop crawler to catch pages linked but missing from the sitemap. Record each URL's status and, for redirects, where it lands.
5. **Carry over existing redirects** from `.htaccess` and any redirect plugin. Point each straight at its final new URL, so an old redirect plus a new one never becomes a chain.
6. **Export from Search Console:** Performance by page for the last 16 months, and Links, top linked pages. Any URL with clicks or external links that is not in the map gets a row. Also check the Pages report's "Not found (404)" list: old URLs that broke long ago but still have links are worth redirecting now.
7. **Resolve the two shortlinks.** Open `/?p=112` and `/?page_id=7` on the live site; WordPress redirects each to its item's permalink. Record the destination and put the new equivalent in rows 2 and 3.
8. **Record a baseline:** organic clicks and impressions for the last 28 days, and the top 20 landing pages with their titles, meta descriptions and main headings. Those 20 pages keep that copy at launch.

### 5.5 Launch day

1. Deploy to a staging address with the redirect file, run the check in Section 7.1 against staging, and fix every failure before going further.
2. Make sure the build does not create a page at any redirected path (an old `blog/index.html`, for example). On some hosts an existing file wins over a redirect rule.
3. Make sure staging's blocks (`noindex`, a disallow-all `robots.txt`, a password) do not ship to production. This is the most common way a rebuild vanishes from Google.
4. Switch DNS, then run Section 7.1 against production within the hour, including the `http://` and bare-domain variants of a few old URLs.
5. Submit `/sitemap.xml` in Search Console and use URL Inspection to request indexing for the top 10 pages from the baseline.
6. Crawl the new site and confirm that no internal link points at a redirecting URL.
7. Update the links Northgate controls: LinkedIn company page, Google Business Profile, email signatures, directory listings, proposal and slide templates. Ask the two or three sites that link most often to update theirs.

### 5.6 After launch

- Check Search Console's Pages report weekly for the first month. Any old URL that shows up as "Not found" gets a rule the same day.
- Expect rankings to wobble for a few weeks while Google recrawls. Compare the top 20 pages against the baseline at four and eight weeks; a page still well down at eight weeks usually lost copy or a redirect, not "trust".
- Keep every redirect permanently, and at the very least for a year, which is Google's own guidance for moves. Re-run the old-URL check after any future restructure, and collapse anything that has become a chain.
- Keep the same analytics property and annotate the launch date.

### 5.7 Re-tagging and content carry-over

This is the step most rebuilds skip, and it is why their structure decays within a year.

1. Tag every article and report with one format, at least one topic and any industries, from the list in 4.6. The `Uncategorized` and `Insights` categories disappear; the `strategy` tag becomes Topic: Strategy.
2. Replace `admin` with the real author of each post. The partners will know who wrote what. Crediting the firm itself is the last resort, not the default.
3. Keep every post's slug exactly as it is, so the pattern rules in 5.2 reach it.
4. Fill each item's `legacy_urls` with its old permalink and its `wp_id`, so the redirects are generated from the content and cannot drift away from it.
5. Rewrite internal links and image paths inside post bodies to the new URLs during the import, rather than leaving them to pass through redirects.
6. Write a landing page for each report: what it covers, three key findings, the download link with file size.

---

## 6. Assumptions and open questions

**Assumptions**

1. The domain and protocol stay `https://www.northgateadvisory.com`. If the domain changes as well, add Search Console's change-of-address step and host-level redirects; the path map above still applies.
2. The static host is not chosen yet, or it can do server-side 301s and 410s, pattern rules, query-string matching, trailing-slash control and a custom 404.
3. The blog shows WordPress's default ten posts per page, so it holds 21 to 30 posts.
4. Rows 2, 3, 4, 5, 13 and 30 are the "odd ones" from Search Console and the rest came from the sitemap. Nothing in the plan depends on which is which.
5. The audience is as described in 2.1. If a different audience matters more, the options in Section 3 should be weighed again.
6. Only Jane Ortiz and Sam Reid have bios today. The team page lists all 15 people with short entries, and further bios are added as they are written. No placeholder bios ship.
7. The whitepapers are not gated. If they are, decide whether the report pages keep a form; the old PDF URL was always reachable directly.
8. `/thank-you/` is the contact form's confirmation page and nothing else uses it.
9. No post is being retired. If some are pruned, give each an explicit 410 (or a 301 to a close replacement) above the pattern rules.
10. The report in row 30 is from 2022, judging by its upload folder.
11. English only.

**Open questions for Northgate**

1. Does "Insights" work for your buyers, or would "Articles" be clearer? The tree test answers this.
2. Who wrote the posts now credited to `admin`?
3. What are posts 112 and page 7 (5.4, step 7)?
4. Is change management a service you want to grow? It has the weakest URL, no supporting content, and no tagged articles.
5. Do you want sector-specific articles, so the industry pages have more than one case study each?
6. Do you want "Strategy consulting" shortened to "Strategy" in the menu for parallel labels? The URL would stay as it is either way.

---

## 7. How to validate it

### 7.1 Redirect check (run on staging, then on production)

Save this as `check-redirects.sh` next to `current-urls.txt` and add every URL from steps 2 and 6 of Section 5.4 to the list file before running it.

```bash
#!/usr/bin/env bash
# Usage: ./check-redirects.sh current-urls.txt [https://staging.example.com]
# For each old URL prints: first status, first Location, number of hops, final status.
list="$1"; base="${2:-}"
while IFS= read -r url; do
  [ -z "$url" ] && continue
  [ -n "$base" ] && url="${base}${url#https://www.northgateadvisory.com}"
  first=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$url")
  final=$(curl -s -o /dev/null -L --max-redirs 5 -w '%{num_redirects} %{http_code}' "$url")
  printf '%s\t%s\t%s\n' "$url" "$first" "$final"
done < "$list"
```

It passes when every row matches Section 5.1:

- Kept URLs: first status 200, zero hops.
- Moved URLs: first status 301, the Location is exactly the mapped URL (trailing slash included), one hop, final status 200.
- Gone URLs: 410 (or 404 if the host cannot send 410), zero hops.
- Rows 2 and 3: 301 once their targets are resolved and the query rules are in. Until then they return 200 with the homepage, which the homepage's canonical tag contains but does not fix.
- `http://northgateadvisory.com/...` versions of a few old URLs reach the right page in no more than two hops.

### 7.2 Tree test of the new structure

No research has been run yet; this is the plan, and there are no results in this document.

- **Tree:** the text of the sitemap in 4.1, with the primary items, their children and the footer-only pages (Careers, Privacy policy) as top-level nodes. Labels only, no design.
- **Participants:** 20 to 30 people who match the buyer profile in 2.1: operations and strategy leaders at hospitals, health systems and manufacturers. Recruit through the partners' networks and past clients' peers, not current staff.
- **Tool:** any online tree-testing tool.
- **Success:** the participant ends on a correct node, first time or after backtracking. Targets are at least 80% success for top tasks and 70% for the rest, with directness no worse than 1.5 times the shortest path.

| # | Task (in the participant's words, not the menu's) | Correct answers | Target |
|---|---|---|---|
| 1 | Your health system's leadership team is going away for two days to agree a three-year plan, and you want someone outside to run the sessions. Where would you check whether Northgate does that? | Services > Strategy consulting > Strategic planning workshops; also Industries > Healthcare | 80% |
| 2 | You want proof that Northgate has cut waste on a factory floor before. Where would you look? | Case studies > Acme manufacturing lean rollout; also Industries > Manufacturing | 80% |
| 3 | You want to know who would actually lead your engagement and what they have done before. | About us > Team | 80% |
| 4 | You want to arrange an introductory call. | Contact us | 80% |
| 5 | A colleague sent you a piece by Northgate on why company plans rarely get carried out. You want to find it again. | Insights > Why strategic plans fail | 70% |
| 6 | You have heard Northgate published comparison figures on how efficiently organizations run, and you want the PDF. | Insights > Reports > Operations benchmark 2022 | 70% |
| 7 | Your organization is restructuring and staff are resisting the new way of working. Does Northgate help with that? | Services > Change management | 70% |
| 8 | Does Northgate have experience with hospitals specifically? | Industries > Healthcare; also Case studies > Regional hospital network turnaround | 70% |
| 9 | Your team keeps fixing the same production problem over and over. Is there anything from Northgate on getting to the real cause? | Insights > The 5 whys still works; also Services > Operations > Process improvement | 70% |
| 10 | You are a consultant thinking about applying to work at Northgate. | Careers | 70% |

**What to do with the results:** if tasks 5, 6 and 9 fall below target and wrong first clicks go to Case studies or Services, the label "Insights" is the likely cause; re-test those three tasks with "Articles" in its place. If tasks 1 and 8 split between Services and Industries, that is expected and fine, because both paths end at the same pages; it only becomes a problem if participants give up.
