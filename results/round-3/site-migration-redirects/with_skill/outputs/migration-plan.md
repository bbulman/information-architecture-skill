# Northgate Advisory: new site structure, URL scheme and redirect list

Draft for your review, 9 November 2026. All paths are on `https://www.northgateadvisory.com`.

## 1. Summary

**Keep every URL that is already clean, and move only the ones that belong to WordPress or to an older build.** Of the 34 URLs in `current-urls.txt`, 18 stay exactly as they are, 14 get a 301 redirect and 2 get a 410 (gone). The reason is simple: a URL that doesn't change carries no migration risk, and more than half of yours are already readable and in the right place. The full list is in section 8.

Two jobs need doing before WordPress is switched off:

- `/?p=112` and `/?page_id=7` are WordPress ID links. Only your WordPress install can say which pages they are, so those two redirects can't be finished until someone looks them up (section 5).
- The list looks incomplete. It has three pages of blog archive but only three posts, so export the full post list first. The pattern rules in section 8 catch posts you missed, provided each one moves to the new site with its slug unchanged.

A clean 301 passes a page's search value to its new address, but no plan can guarantee rankings. Expect some movement in the weeks after launch.

**Assumption to correct if it's wrong:** the site is for senior leaders choosing an outside advisor, mainly in healthcare and manufacturing, with job seekers as a small second audience. You didn't say, so I inferred it from the URLs.

## 2. What exists now

I worked from the URL list alone. I could not see page content, traffic, rankings or backlinks, so nothing here judges content quality or ranks pages by value.

| Group | URLs | What's there | Condition |
|---|---|---|---|
| Home | 1 | `/` | Clean |
| WordPress ID links | 2 | `/?p=112`, `/?page_id=7` | Destination unknown |
| About | 4 | `/about-us.html`, `/About_Us/Our-Team`, two leadership profiles | Three URL styles in one section. `/about-us/` and `/about-us/leadership/` aren't listed |
| Services | 6 | Hub, two service lines with one child each, `/services/change-management.php` | Clean except the `.php`. No clean change management URL is listed |
| Industries | 2 | Healthcare, Manufacturing | Clean. `/industries/` isn't listed |
| Case studies | 3 | Hub and two studies | Clean |
| Blog listing | 3 | `/blog/` and its pages 2 and 3 | Pagination isn't worth keeping |
| Blog posts | 3 | `/YYYY/MM/DD/<slug>/` | Sit outside `/blog/`, and the date in the address ages them |
| WordPress archives | 4 | Two categories, one tag, one author | Auto-generated, and two are defaults (`uncategorized`, `admin`) |
| Whitepapers | 2 | `/resources/whitepapers/`, one PDF in `/wp-content/` | `/resources/` isn't listed and has this one child |
| Standalone pages | 4 | Contact, careers, privacy, thank-you | Clean, though a thank-you page shouldn't be in a sitemap |
| **Total** | **34** | | |

What this shows:

- **The structure is mostly sound.** It's a shallow hub and spoke, which is the right shape for a site this size. The problems are in the addresses, not the grouping.
- **The list is probably incomplete.** Three archive pages with three posts would mean one post per page, and WordPress defaults to ten. A 15-person firm also shows only two people. Several parent pages are absent too.
- **Old builds left traces.** `.html`, `.php` and `About_Us` don't look like WordPress addresses, so they probably survive from an earlier site and may still have links pointing at them.
- **"Resources" is a vague label** holding a single child.

## 3. The options

| | A. Keep what ranks (recommended) | B. Full URL clean-up | C. Sector first |
|---|---|---|---|
| Shape | Today's sections, WordPress artifacts removed | Today's sections with shorter names: `/about/`, `/contact/`, `/services/strategy/`, `/work/`, `/insights/` | Healthcare and Manufacturing at the top level, services beneath each |
| Serves | Buyers looking for a service or proof, and anyone arriving from search | The same people; addresses read slightly better | Buyers who identify by sector before they know what they need |
| Your 34 URLs | 18 unchanged, 14 at 301, 2 at 410 | 9 unchanged, 23 at 301, 2 at 410 | Every service and case study URL moves |
| Costs | Only the redirects you need anyway | Nine extra moves with no benefit a reader would notice | At least six new pages (three services times two sectors) that don't exist yet |
| Strains | `/contact-us/` and `/about-us/` stay slightly long, permanently | Puts well-placed pages at risk for tidiness | Each service needs one home but belongs to both sectors, and a client in another sector has no way in |

I recommend A because your stated goal is protecting rankings. Within A there are two moves you could skip: the dated blog posts and the whitepapers. I'd still make them, since the redirect file is being written anyway. A flat `/blog/<slug>/` address matches the site structure and stops a 2019 date from advertising the article's age, and `/wp-content/` shouldn't outlive WordPress. If you want the absolute minimum change, keep those URLs and delete their rows.

## 4. The proposal

### Sitemap

27 URLs. `keep` means the address is unchanged, `moved` means it receives a redirect, `new` means nothing at that address was in your list.

```
/                                                                  home          keep
├── /services/                                                     section-hub   keep
│   ├── /services/strategy-consulting/                             service       keep
│   │   └── /services/strategy-consulting/strategic-planning-workshops/
│   │                                                              service       keep
│   ├── /services/operations/                                      service       keep
│   │   └── /services/operations/process-improvement/              service       keep
│   └── /services/change-management/                               service       moved (from .php)
├── /industries/                                                   section-hub   new
│   ├── /industries/healthcare/                                    industry      keep
│   └── /industries/manufacturing/                                 industry      keep
├── /case-studies/                                                 listing       keep
│   ├── /case-studies/regional-hospital-network-turnaround/        case-study    keep
│   └── /case-studies/acme-manufacturing-lean-rollout/             case-study    keep
├── /blog/                                                         listing       keep
│   ├── /blog/the-5-whys-still-works/                              post          moved
│   ├── /blog/remote-strategy-sessions/                            post          moved
│   └── /blog/why-strategic-plans-fail/                            post          moved
├── /whitepapers/                                                  listing       moved
│   └── /whitepapers/operations-benchmark-report.pdf               file          moved
├── /about-us/                                                     page          moved (from .html)
│   └── /about-us/leadership/                                      listing       moved (from Our-Team)
│       ├── /about-us/leadership/jane-ortiz/                       person        keep
│       └── /about-us/leadership/sam-reid/                         person        keep
├── /careers/                                                      page          keep
├── /contact-us/                                                   contact       keep
├── /privacy-policy/                                               legal         keep
└── /thank-you/                                                    confirmation  keep (noindex, not in sitemap.xml)
```

`/industries/` and `/about-us/leadership/` have to be real pages, even if short, because the breadcrumbs point at them.

### Labels

Top-level labels are plain section names: Services, Industries, Case Studies, Blog, About Us, Contact Us, using the words already in your URLs so the label, breadcrumb and address agree. "Resources" goes, replaced by the specific "Whitepapers". Keep each page's current title and heading at launch.

### Navigation

| Surface | Contents |
|---|---|
| Primary (6) | **Services**, what you sell. **Industries**, for buyers who start from their sector. **Case Studies**, the proof. **Blog**, your published thinking and probably a way in from search. **About Us**, who they'd be hiring. **Contact Us**, the conversion, styled as a button |
| Services dropdown | Strategy Consulting, Operations, Change Management. A simple list is enough; a mega-menu isn't justified |
| Utility | None at launch. Add search if the blog grows large |
| Footer | Services (three links). Industries (two). Work and ideas: Case Studies, Blog, Whitepapers. Firm: About Us, Leadership, Careers, Contact Us, Privacy Policy |
| Contextual | Breadcrumbs that follow the path, such as Home > Services > Operations > Process Improvement. Service pages link to related case studies and posts. Case studies link to their industry and service. Posts link to their related service. The Blog page links to Whitepapers |
| Mobile | Primary collapses into a menu; Contact Us stays visible |
| Active state | Current section highlighted, with the breadcrumb as confirmation |
| Rule for a new top-level item | It must serve a top buyer task that no existing section covers, and something else leaves if the count would pass six |

Whitepapers and Careers stay out of the primary menu because the one report in your list and a recruiting page haven't earned a slot ahead of the sales path. `/thank-you/` appears in no navigation.

### URL rules

| Rule | Decision |
|---|---|
| Domain | `https://www.` as today. `http` and non-`www` 301 to it |
| Case and separator | Lowercase kebab-case |
| Trailing slash | Yes, enforced, with a matching canonical tag on every page. It's what your 18 kept URLs already use, so it avoids a site-wide redirect |
| Extensions | None on pages. Downloads such as `.pdf` keep theirs |
| Hierarchy | The path mirrors the sitemap: `/<section>/<slug>/`, with one more level only for a child service |
| Slugs | Existing slugs stay even when imperfect. New ones come from the title, without filler words, about 60 characters at most |
| IDs and query strings | No IDs in paths. Query strings for tracking or filtering only |
| Languages | None today. If added, a `/<locale>/` prefix |
| Changing a slug | Add the 301 in the same change, and repoint older rules so there is never a chain. Redirects stay permanently |

### Content model

| Template | URL pattern | Fields | Relations |
|---|---|---|---|
| home | `/` | hero, featured services, featured case studies, call to action | |
| section-hub | `/services/`, `/industries/` | title, intro | children, generated |
| service | `/services/<slug>/`, `/services/<parent>/<slug>/` | title, summary, problems solved, approach, outcomes, call to action | parent (optional), case studies, posts, lead person |
| industry | `/industries/<slug>/` | title, summary, challenges | case studies, services |
| listing | `/case-studies/`, `/blog/`, `/whitepapers/`, `/about-us/leadership/` | title, intro; items generated | Whitepaper items: title, summary, file, date, topic |
| case-study | `/case-studies/<slug>/` | title, client, summary, challenge, approach, results, date | industry (one), services (one or more) |
| post | `/blog/<slug>/` | title, summary, body, published date, updated date | author (one), topics (one or more) |
| person | `/about-us/leadership/<slug>/` | name, role, bio, photo, LinkedIn | posts, case studies |
| page, contact, legal | `/about-us/`, `/careers/`, `/contact-us/`, `/privacy-policy/` | title, body; contact adds form and office details | |
| confirmation | `/thank-you/` | message, next links; always noindex | |

Every template also has: slug, status (draft, published, archived), SEO title, meta description. The new `sitemap.xml` should be generated by the build, not kept by hand.

### Terms

WordPress's "Uncategorized", "Insights" and the `strategy` tag are replaced by two controlled lists:

- **Topic** (one or more, on posts and whitepapers): Strategy, Operations, Change Management, matching your three service lines.
- **Industry** (one, on case studies; optional elsewhere): Healthcare, Manufacturing.

These drive related links only, with no public archive pages at launch. If the blog grows enough that one list is unwieldy, add `/blog/topics/<topic>/` and pagination, and repoint the `/tag/strategy/` row at the new page directly. One named person (probably whoever owns marketing) approves new terms after checking for near-duplicates, and reviews empty or overloaded terms every quarter.

## 5. Migration

### Finish the two WordPress ID redirects

While WordPress is still live, run these or open the URLs in a browser. WordPress should forward each to the real address.

```
curl -sI "https://www.northgateadvisory.com/?p=112" | grep -i '^location'
curl -sI "https://www.northgateadvisory.com/?page_id=7" | grep -i '^location'
```

If that shows nothing, open `/wp-admin/post.php?post=112&action=edit` (and `post=7`). Then find that page in section 8 and use its **new** URL as the destination, so there's no chain.

Many path-based redirect files ignore query strings and would read `/?p=112` as `/`, so pasting it in unchanged could redirect your home page. If your host can't match on the query string, leave both out. They'll then load the home page, whose canonical tag tells Google the home page is the real one. You lose whatever those two links had earned but nothing breaks. If Search Console shows they get real traffic, ask your developer for an edge rule.

### Get the complete list

Your file covers the sitemap and a few Search Console finds. Before launch, compare it against:

- All published posts and pages: `wp post list --post_type=post,page --post_status=publish --fields=ID,post_type,post_name,post_date --format=csv`, or the All Posts and All Pages screens.
- Search Console's Pages report and its Top linked pages report, since links are what you most want to keep.
- Server logs, if your host keeps them.
- Other uploads. Each PDF gets its own row like line 30. Images usually aren't worth a rule on a site like this unless other sites link to them.
- `/feed/`, which WordPress serves. If anyone subscribes, generate a feed and 301 this to it.

Each URL you find gets a row. If `/about-us/`, `/about-us/leadership/` or `/industries/` turn up, they're already covered, because the new site has pages at those addresses.

### Confirm with your host

You haven't named a host and these vary, so check them rather than relying on my expectation:

| Behavior | Why it matters here |
|---|---|
| Matching on query strings | Lines 2 and 3 |
| Serving a 410 | Lines 25 and 28. Some static hosts' redirect files accept only 3xx codes. If yours does, let these 404, and don't point them at the home page |
| Case-sensitive matching, with and without a trailing slash | Lines 5 and 30. If `/About_Us/Our-Team/` is treated as a separate URL, add a second row |
| Wildcards and rule order | Specific rows must be evaluated before the pattern rules, or `/category/uncategorized/` gets a 301 instead of a 410 |
| Trailing slash enforcement | `/about-us` should reach `/about-us/` in one hop |

### Re-tag the content

Assigned from titles only, so please correct them.

| Item | Topic | Industry |
|---|---|---|
| The 5 Whys Still Works | Operations | |
| Remote Strategy Sessions | Strategy | |
| Why Strategic Plans Fail | Strategy | |
| Operations Benchmark Report | Operations | |
| Regional Hospital Network Turnaround | Operations (least-bad guess; "turnaround" isn't one of your services) | Healthcare |
| Acme Manufacturing Lean Rollout | Operations | Manufacturing |

### Launch checklist

**Before launch**

1. Take a full WordPress backup (database and uploads), and keep the old site reachable privately for a few weeks.
2. Finish the two ID rows and add any URLs found above.
3. Put the redirect file in version control.
4. Carry over page titles, meta descriptions, headings and body text unchanged. Save rewrites until rankings have settled, so that any change can be traced to one cause.
5. Point internal links straight at the new URLs rather than relying on redirects.
6. Crawl every old URL against staging. Each must return the status in section 8 in one hop and end on a 200, with no loops and nothing landing on the home page.

**On the day**

7. Remove any staging `noindex` or `robots.txt` block. Check `/thank-you/` is still noindex.
8. Submit the new `sitemap.xml` in Search Console, and re-crawl the old list on the live domain.

**After launch**

9. Check Search Console's 404s weekly for at least two months, adding a row for anything missed.
10. Compare clicks and impressions against the same period before launch, for the unchanged and the redirected URLs separately, and track contact form completions through `/thank-you/`.
11. Leave the redirects in place permanently.

## 6. Assumptions and open questions

**Assumptions**

- The audience is as stated in section 1.
- The firm expects to keep these three service lines and two sectors for the next couple of years.
- Change management is still offered. If not, line 13 should go to `/services/` and the page should be dropped.
- `/about-us.html` and `/About_Us/Our-Team` hold content that the new `/about-us/` and `/about-us/leadership/` will replace.
- The domain stays the same. Changing it at the same time would add risk and need its own plan.
- Your static generator can output `/path/index.html`, which gives the trailing-slash addresses.
- The blog is a single listing at launch, which is why pagination redirects to `/blog/`.
- `/thank-you/` is probably used by your contact form and possibly by analytics goals, so it stays put.

**Questions for you**

1. Which pages are post 112 and page 7?
2. How many posts and uploads are there in total?
3. Will all 15 people get profiles? If so, `/about-us/team/<name>/` is a better home than `leadership`. Decide now: moving two profiles at launch is cheap, and doing it later is the kind of churn this plan avoids.
4. Which host will you use?
5. Do `/category/uncategorized/` or `/author/admin/` earn any clicks or links in Search Console? If so, change those rows to a 301, to `/blog/` and `/about-us/leadership/` respectively.

## 7. How to validate it

Tree-test the text-only hierarchy before building. I haven't run this; it needs real people. Use 20 or more people who resemble your buyers, such as clients and prospects. It takes about a day.

Tree: Services (Strategy Consulting > Strategic Planning Workshops; Operations > Process Improvement; Change Management), Industries (Healthcare, Manufacturing), Case Studies, Blog, Whitepapers, About Us (Leadership), Careers, Contact Us.

| # | Task | Correct answer | Success target |
|---|---|---|---|
| 1 | Your hospital group is in financial trouble and the board wants outside help. Where would you check whether this firm has fixed that kind of problem before? | Case Studies, or Industries > Healthcare | 80% |
| 2 | Orders at your plant keep getting stuck between departments and you want help smoothing out how work moves. | Services > Operations > Process Improvement | 80% |
| 3 | Your executive team is going away for two days to set next year's direction and you want someone to run the session. | Services > Strategy Consulting > Strategic Planning Workshops | 80% |
| 4 | You're merging two departments and expect people to push back. Where would you look for help? | Services > Change Management | 70% |
| 5 | Before hiring this firm, you want to know who the senior people are and what they've done. | About Us > Leadership | 70% |
| 6 | A colleague mentioned data this firm published comparing how well companies run their operations. Where would you find it? | Whitepapers | 70% |
| 7 | You'd like to read what this firm thinks about why company plans go nowhere. | Blog | 70% |
| 8 | You run a hospital department and want to know if this firm understands your world. | Industries > Healthcare | 70% |
| 9 | You're a consultant looking for your next job. | Careers | 70% |
| 10 | You've decided to talk to someone about a project. | Contact Us | 80% |

Which tasks count as top tasks (80%) is my assumption. Also aim for directness of no more than 1.5 times the shortest path. Tasks 5, 6 and 8 test the placements I'm least sure of. If one fails, change the label or placement and re-test that task before any URLs are finalized.

## 8. Full redirect list

"Line" is the line number in `current-urls.txt`. All 34 lines appear exactly once below: 14 in the 301 table, 2 in the 410 table, 18 in the unchanged table. No row's destination is itself redirected, and none goes to the home page.

### 301: moved permanently (14)

| Line | Old URL | New URL | Status | Why |
|---|---|---|---|---|
| 2 | `/?p=112` | Look up first (section 5) | 301 | WordPress post ID; destination unknown until checked |
| 3 | `/?page_id=7` | Look up first (section 5) | 301 | WordPress page ID; destination unknown until checked |
| 4 | `/about-us.html` | `/about-us/` | 301 | Extension removed |
| 5 | `/About_Us/Our-Team` | `/about-us/leadership/` | 301 | Mixed case and underscore; closest listing of your people |
| 13 | `/services/change-management.php` | `/services/change-management/` | 301 | Extension removed |
| 20 | `/blog/page/2/` | `/blog/` | 301 | Single listing replaces pagination |
| 21 | `/blog/page/3/` | `/blog/` | 301 | Single listing replaces pagination |
| 22 | `/2019/04/12/the-5-whys-still-works/` | `/blog/the-5-whys-still-works/` | 301 | Date removed, slug kept |
| 23 | `/2021/09/30/remote-strategy-sessions/` | `/blog/remote-strategy-sessions/` | 301 | Date removed, slug kept |
| 24 | `/2023/02/14/why-strategic-plans-fail/` | `/blog/why-strategic-plans-fail/` | 301 | Date removed, slug kept |
| 26 | `/category/insights/` | `/blog/` | 301 | Category retired; the blog is the same list of articles |
| 27 | `/tag/strategy/` | `/blog/` | 301 | No topic pages at launch; nearest list of the same articles |
| 29 | `/resources/whitepapers/` | `/whitepapers/` | 301 | Vague parent removed |
| 30 | `/wp-content/uploads/2022/03/Operations-Benchmark-Report.pdf` | `/whitepapers/operations-benchmark-report.pdf` | 301 | Leaves the WordPress path; PDF to PDF, so links still deliver the document |

### 410: gone (2)

| Line | Old URL | Status | Why |
|---|---|---|---|
| 25 | `/category/uncategorized/` | 410 | WordPress default archive with no equivalent |
| 28 | `/author/admin/` | 410 | Default admin account archive with no equivalent |

### Unchanged: no redirect needed (18)

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
| 19 | `/blog/` | Now also the single listing of all posts |
| 31 | `/contact-us/` | |
| 32 | `/careers/` | |
| 33 | `/privacy-policy/` | |
| 34 | `/thank-you/` | Add noindex; leave out of `sitemap.xml` |

### Pattern rules for URLs not in your file

These are a safety net for the posts and archives your list appears to be missing. They go after every specific row above, and wildcard syntax depends on your host.

| Pattern | Goes to | Status | Caveat |
|---|---|---|---|
| `/<yyyy>/<mm>/<dd>/<slug>/` | `/blog/<slug>/` | 301 | Only for posts that move with their slug intact. A retired post needs its own row first. Match digits if your host allows it |
| `/blog/page/<n>/` | `/blog/` | 301 | |
| `/category/<any>/` | `/blog/` | 301 | |
| `/tag/<any>/` | `/blog/` | 301 | |
| `/author/<any>/` | none | 410 | A named author archive, such as one for Jane Ortiz, should instead get its own 301 to that person's profile |
