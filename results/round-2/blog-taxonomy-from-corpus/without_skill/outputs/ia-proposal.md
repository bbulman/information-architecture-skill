# Blog reorganization proposal: categories and tags

## The short version

Every post gets **one category** saying where it lives, plus **up to three tags** that cut across categories. That gives five categories in the navigation, one unlisted category for the single post written for professional facilitators, and eight tags, down from today's 26. All 24 posts are placed below.

**Categories (in nav order)**

1. **Team meetings** (5 posts)
2. **Workshops & offsites** (8 posts)
3. **Icebreakers & energizers** (3 posts)
4. **Ideas & decisions** (4 posts)
5. **Tricky situations** (3 posts)
6. *For facilitators* (1 post, unlisted)

**Tags:** `agendas`, `planning-strategy`, `everyone-heard`, `staying-on-track`, `follow-through`, `remote-hybrid`, `meeting-formats`, `large-groups`.

`misc`, `tips`, `Tips` and `facilitation tips` are all retired. None of them told a reader anything.

---

## 1. Who this is built for, and what I assumed

**The reader.** A team lead who has ended up running their own meetings, retros, planning sessions and offsites. They are not a professional facilitator. That shapes two things:

- **They arrive with a situation, not a technique name.** Someone who has never heard of a "fishbowl" or a "premortem" won't go looking for one. They're thinking "I've got a 40-person all-hands" or "we need to stress-test this plan". So categories are named after the job in front of them or the problem they have. Technique names stay in post titles, where search finds them.
- **Plain words over facilitation jargon.** "Tricky situations", not "group dynamics". "Ideas & decisions", not "convergent and divergent methods".

**Assumptions** (I couldn't ask, so these are my calls):

- I filed posts using the title and the one-paragraph summary in each file, which is all the files contain. If a post's full body goes somewhere the summary doesn't hint at, its category may need a second look.
- Your blog engine can handle one `category` field plus a `tags` list in front matter. Jekyll, Hugo, Eleventy and most hosted platforms can.
- Each post has exactly one category. That's its home in the navigation. Tags handle the overlaps.
- Existing post URLs stay the same. I'd keep categories out of URLs so a post can be refiled later without breaking links.
- The freelance pricing post is the only one written for professional facilitators rather than your core readers. I've kept it, but out of the main navigation (see section 8).

---

## 2. What's wrong with the current tags

A count across the 24 posts:

- **26 distinct tags for 24 posts.** 12 of them are used only once, so their tag pages hold a single post and lead nowhere.
- **Three spellings of one idea:** `tips` (2 posts), `Tips` (2) and `facilitation tips` (4). Every post on the blog is a tip, so these tags can't separate anything. "Handling the person who talks too much" carries two of them at once.
- **`misc` on 4 posts**, which really means "not filed". The posts are good: a retro post, a hybrid-meetings post, a meeting-cost post and the pricing post. They just never found a home.
- **Tags that apply to everything:** `leadership` (every reader is a leader), `exercises` (most posts include one).
- **Near-duplicates:** `remote` and `hybrid`, `planning` and `offsites` and `agendas`, `icebreakers` and `energy`.
- **Mixed kinds of label:** some tags name a topic (`conflict`), some a format (`agendas`), some a reader (`beginners`) and some a business area (`business`). With nothing separating these kinds, nobody can tell which tag a new post should get.

---

## 3. The categories

Each category answers the question "what are you trying to do right now?"

| # | Category | Slug | What it's for (landing-page description) | Posts |
|---|---|---|---|---|
| 1 | **Team meetings** | `team-meetings` | Your recurring meetings with your own team, such as weeklies, retros and check-ins. How to run them better, keep them on track, include remote people, or cancel them. | 5 |
| 2 | **Workshops & offsites** | `workshops-offsites` | The bigger sessions you plan ahead for: offsites, planning days, workshops, all-hands. Ready-made agendas, preparation, tools, big-group formats, and closing so things actually happen. | 8 |
| 3 | **Icebreakers & energizers** | `icebreakers-energizers` | Openers, check-in questions and quick activities to warm up a room or wake it up. | 3 |
| 4 | **Ideas & decisions** | `ideas-decisions` | Getting good ideas out of a group, narrowing them down, being clear who decides, and stress-testing a plan before you commit. | 4 |
| 5 | **Tricky situations** | `tricky-situations` | When the people side goes wrong: two people arguing, one person dominating, or a room that won't speak up. | 3 |
| 6 | *For facilitators* (unlisted) | `for-facilitators` | Running facilitation as a job: pricing, clients, engagements. Not in the main nav. | 1 |

**Why this split:**

- **Team meetings vs Workshops & offsites** is the main fork in a team lead's week: the meeting they run every Tuesday, and the session they've been asked to plan. The boundary is *recurring with your own team* vs *one-off, bigger or planned ahead*.
- **Icebreakers & energizers** is the most common thing a non-specialist goes looking for by name, so it earns its own door.
- **Ideas & decisions** follows the arc of most working sessions: generate options, narrow them, decide who decides, then check the decision. "How do we decide?" is one of the most common team-lead problems, so this is where I'd expect the most new writing.
- **Tricky situations** collects problems people search for in a hurry, often the night before or straight after a bad meeting.
- **Remote & hybrid is a tag, not a category.** Being remote is a setting that cuts across everything. A remote icebreaker is still an icebreaker first, and a team lead looking for icebreakers should find it there. The tag, featured on the homepage, gives remote readers their own route through the blog (see section 7).

---

## 4. How to file a new post

Work down this list and stop at the first yes:

1. **Is it a full agenda for a one-off session, or about preparing, running logistics for, or closing one? Or is it a format meant for a big group?** File it in **Workshops & offsites**.
2. **Is it a warm-up, opener, check-in or energizer?** File it in **Icebreakers & energizers**.
3. **Is it about a people problem in the room, such as conflict, someone dominating, or silence?** File it in **Tricky situations**.
4. **Is it about generating options, narrowing them, deciding, or checking a decision?** File it in **Ideas & decisions**.
5. **Otherwise, it's about your recurring team meetings.** File it in **Team meetings**.

**Tie-breaker:** file the post where a team lead would be standing when they need it, then add a tag for the other angle. Example: "Dot voting" could serve a workshop or a team meeting, but the reader's actual need is "we have to pick one", so it goes in Ideas & decisions.

---

## 5. The tags

Tags connect posts across categories. Eight of them, each with at least two posts today.

| Tag (slug) | Display name | Means | Posts |
|---|---|---|---|
| `agendas` | Ready-made agendas | The post includes a full timed agenda you can copy. | 4 |
| `planning-strategy` | Planning & strategy | Setting direction, goals or plans: strategy days, OKRs, annual planning, project risk. | 4 |
| `everyone-heard` | Getting everyone heard | Techniques that spread airtime and stop the loudest or most senior voice from winning by default. | 5 |
| `staying-on-track` | Staying on track | Keeping discussion focused and on time: timeboxes, parking lots, refocusing. | 3 |
| `follow-through` | Follow-through | Making sure a session leads to action: commitments, owners, follow-up. | 3 |
| `remote-hybrid` | Remote & hybrid | Advice for video calls, or for rooms where some people are remote. | 3 |
| `meeting-formats` | Meeting formats | A different structure for the whole conversation, such as Lean Coffee, fishbowl, retro formats or 1-2-4-All. | 4 |
| `large-groups` | Large groups | Works for roughly 20 people or more. | 2 |

**Tag rules**

- **A tag never repeats a category's name.** If it would, the category already does that job. That's why `icebreakers`, `offsites`, `meetings`, `conflict` and `decision making` don't survive as tags.
- **A tag has to separate posts.** If it would fit almost every post (`tips`, `leadership`, `exercises`), it doesn't exist.
- **A tag needs two posts before it's created.** One-post tags make dead-end pages. Candidates are parked in section 9 until a second post arrives.
- **Zero to three tags per post.** Zero is fine. Don't add a tag just to fill the field.
- **Lowercase hyphenated slugs** (`remote-hybrid`), with display names kept in one place, such as a taxonomy data file. That stops `Tips` and `tips` from ever splitting again.
- **Only tags from this list.** A new tag is a decision you make on purpose, not something that appears because a post got typed in a hurry.

---

## 6. Where each post goes

| # | Post | Category | New tags | Old tags |
|---|---|---|---|---|
| 1 | Why your retro feels stale | Team meetings | `meeting-formats` | retros, misc |
| 2 | Running Two Truths and a Lie on Zoom | Icebreakers & energizers | `remote-hybrid` | icebreakers, remote |
| 3 | The parking lot: keep meetings on track | Team meetings | `staying-on-track`, `follow-through` | tips, meetings |
| 4 | Dot voting without the groupthink | Ideas & decisions | `everyone-heard` | Tips, decision making |
| 5 | A half-day strategy offsite agenda | Workshops & offsites | `agendas`, `planning-strategy`, `follow-through` | agendas, offsites |
| 6 | When two people won't stop arguing | Tricky situations | `staying-on-track` | facilitation tips, conflict |
| 7 | Who decides? Using a simple decision rights grid | Ideas & decisions | (none) | decision making, leadership |
| 8 | Energizers for the post-lunch slump | Icebreakers & energizers | (none) | icebreakers, energy |
| 9 | Making hybrid meetings fair to remote people | Team meetings | `remote-hybrid`, `everyone-heard` | remote, hybrid, misc |
| 10 | How to run Lean Coffee | Team meetings | `meeting-formats`, `staying-on-track` | formats, meetings |
| 11 | Your first workshop: a checklist | Workshops & offsites | (none; featured on Start here) | facilitation tips, beginners |
| 12 | Silent brainstorming beats shouting | Ideas & decisions | `everyone-heard`, `meeting-formats`, `large-groups` | tips, ideation |
| 13 | A one-day design sprint agenda | Workshops & offsites | `agendas` | agendas, design sprint |
| 14 | 50 check-in questions for team meetings | Icebreakers & energizers | (none) | icebreakers, meetings |
| 15 | Handling the person who talks too much | Tricky situations | `everyone-heard` | facilitation tips, Tips |
| 16 | Choosing a remote whiteboard tool | Workshops & offsites | `remote-hybrid` | remote, tools |
| 17 | Closing a workshop so things actually happen | Workshops & offsites | `follow-through` | facilitation tips, follow-up |
| 18 | Running an OKR planning workshop | Workshops & offsites | `agendas`, `planning-strategy` | planning, agendas, leadership |
| 19 | Fishbowl discussions for big groups | Workshops & offsites | `meeting-formats`, `large-groups` | formats, exercises |
| 20 | The premortem: imagine the project failed | Ideas & decisions | `planning-strategy` | exercises, risk |
| 21 | What your weekly meeting really costs | Team meetings | (none) | meetings, misc |
| 22 | Psychological safety in five minutes a week | Tricky situations | `everyone-heard` | leadership, team health |
| 23 | How to price a workshop as a freelance facilitator | *For facilitators* (unlisted) | (none) | business, misc |
| 24 | A two-day annual planning offsite | Workshops & offsites | `agendas`, `planning-strategy` | offsites, agendas, planning |

**Posts by category:** Team meetings 1, 3, 9, 10, 21. Workshops & offsites 5, 11, 13, 16, 17, 18, 19, 24. Icebreakers & energizers 2, 8, 14. Ideas & decisions 4, 7, 12, 20. Tricky situations 6, 15, 22. For facilitators 23.

**The judgement calls:**

- **Check-in questions (14)** could have gone in Team meetings, since that's where they get used. I put it with icebreakers because "check-in questions" is something people search for by name, the same way they search for icebreakers. Link to it from the Team meetings landing page.
- **Fishbowl (19)** is a discussion format, not an agenda. It goes in Workshops & offsites because its reader is planning a session for 20 to 60 people, which is never a normal team meeting.
- **Silent brainstorming (12) and the premortem (20)** are activities, but each serves one clear job (generating ideas, stress-testing a plan), so they go with that job in Ideas & decisions. A general "Activities" or "Exercises" bucket would only help readers who already know the technique's name.
- **Psychological safety (22)** is more of an ongoing habit than a crisis, but its reader's problem is "my team won't speak up", which is a tricky situation.
- **Hybrid meetings (9)** is about how you set up your regular meetings, not a people problem, so it goes in Team meetings, with `remote-hybrid` and `everyone-heard` linking it across.

---

## 7. Navigation and key pages

**Top navigation:** Start here · Team meetings · Workshops & offsites · Icebreakers & energizers · Ideas & decisions · Tricky situations

**Start here** is a short curated page for the team lead who has just been handed a meeting or an offsite to run. It replaces the `beginners` tag, which made little sense on a blog where most readers aren't specialists. Suggested reading order:

1. Your first workshop: a checklist (11)
2. 50 check-in questions for team meetings (14)
3. The parking lot: keep meetings on track (3)
4. Handling the person who talks too much (15)
5. Dot voting without the groupthink (4)
6. Closing a workshop so things actually happen (17)
7. A half-day strategy offsite agenda (5)

**Category landing pages:** open each one with the one-line description from section 3, then pin the two or three most useful posts above the date-ordered list. Most of these posts are evergreen, so a newest-first list buries the best ones.

**Remote & hybrid** gets a homepage link and a "Browse by" spot in the sidebar or footer, alongside **Ready-made agendas**. Those are the two tags readers are most likely to browse on their own.

**Post pages:** show the category as a breadcrumb above the title and the tags below the post, plus two or three related posts that share a tag.

---

## 8. The freelance pricing post

"How to price a workshop as a freelance facilitator" is written for professional facilitators, who aren't your core readers. A team lead browsing Workshops & offsites doesn't want a page on day rates. Your options:

- **A (what I've proposed):** keep it in an unlisted *For facilitators* category. It stays live and findable through search and old links, but stays out of the main navigation. If you write more for professionals, that category is ready for them.
- **B:** if you don't plan to write more for professional facilitators, consider whether it belongs on this blog at all. It could move to a personal site or an "about my work" page.

Don't put it in a core category to avoid the awkwardness. That's how `misc` happened.

---

## 9. Tags waiting for a second post

These are real topics, but each has only one post today. Create the tag when the second post arrives, and tag both posts.

| Candidate tag | Current single post |
|---|---|
| `retrospectives` | Why your retro feels stale (1). Likely to grow fast, since retros are a staple for team leads. |
| `conflict` | When two people won't stop arguing (6) |
| `risk` | The premortem (20) |
| `tools` | Choosing a remote whiteboard tool (16) |
| `design-sprint` | A one-day design sprint agenda (13) |

---

## 10. Old tag to new home (for migration and redirects)

If old tag pages are indexed or linked from elsewhere, redirect each one to the new page listed here.

| Old tag | Posts | New home | Redirect `/tags/<old>/` to |
|---|---|---|---|
| misc | 4 | Removed; each post filed properly | homepage |
| tips | 2 | Removed (fits every post) | homepage |
| Tips | 2 | Removed (fits every post) | homepage |
| facilitation tips | 4 | Removed (fits every post) | Start here |
| meetings | 4 | Category: Team meetings | Team meetings |
| agendas | 4 | Tag: `agendas` (kept) | `agendas` tag |
| remote | 3 | Tag: `remote-hybrid` | `remote-hybrid` tag |
| hybrid | 1 | Tag: `remote-hybrid` | `remote-hybrid` tag |
| leadership | 3 | Removed (fits every reader) | homepage |
| icebreakers | 3 | Category: Icebreakers & energizers | Icebreakers & energizers |
| energy | 1 | Category: Icebreakers & energizers | Icebreakers & energizers |
| planning | 2 | Tag: `planning-strategy` | `planning-strategy` tag |
| offsites | 2 | Category: Workshops & offsites | Workshops & offsites |
| formats | 2 | Tag: `meeting-formats` | `meeting-formats` tag |
| exercises | 2 | Removed (too broad) | homepage |
| decision making | 2 | Category: Ideas & decisions | Ideas & decisions |
| conflict | 1 | Category: Tricky situations (candidate tag later) | Tricky situations |
| team health | 1 | Category: Tricky situations, plus `everyone-heard` | Tricky situations |
| follow-up | 1 | Tag: `follow-through` | `follow-through` tag |
| ideation | 1 | Category: Ideas & decisions | Ideas & decisions |
| beginners | 1 | Start here page | Start here |
| retros | 1 | Category: Team meetings (candidate tag later) | Team meetings |
| design sprint | 1 | Removed (title carries it; candidate tag later) | Workshops & offsites |
| tools | 1 | Removed (candidate tag later) | `remote-hybrid` tag |
| risk | 1 | Removed (candidate tag later) | Ideas & decisions |
| business | 1 | Category: For facilitators (unlisted) | For facilitators |

---

## 11. Front matter, before and after

Before:

```yaml
---
title: "Handling the person who talks too much"
date: 2025-05-15
tags: [facilitation tips, Tips]
---
```

After:

```yaml
---
title: "Handling the person who talks too much"
date: 2025-05-15
category: tricky-situations
tags: [everyone-heard]
---
```

Keep the list of allowed categories and tags, with their display names and descriptions, in one data file (for example `_data/taxonomy.yml`). If your engine supports it, have the build fail on any tag that isn't in that file. That one check is what stops `tips`, `Tips` and `facilitation tips` from coming back.

**Optional, later:** a `time_needed` field on activities and agendas (for example "10 min", "half day", "2 days"). Team leads often pick an activity by how much time they have. That's a filter, not a tag, so it shouldn't go in the tag list.

---

## 12. Things to watch

- **Thin categories.** Tricky situations (3) and Icebreakers & energizers (3) are small today. Both are high-demand topics, so I'd expect them to grow. If either still has under five posts in a year, fold Tricky situations into Team meetings, or icebreakers into Workshops & offsites.
- **The biggest category.** Workshops & offsites holds a third of the blog. If it passes about 15 posts, the `agendas` tag is the natural split line ("Ready-made agendas" could become its own category).
- **Review twice a year.** Check every tag still has two or more posts, promote any candidate tag that now has a second post, and confirm no category name has drifted into use as a tag.
