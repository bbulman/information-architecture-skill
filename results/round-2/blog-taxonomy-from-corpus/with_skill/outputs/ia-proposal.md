# Reorganizing the blog: categories and tags

A draft proposal to react to, not a decision. It covers all 24 posts in `posts/`. Every post gets a home in Appendix A, and the front matter values to apply are in Appendix B.

## 1. Summary

Give every post exactly one of five categories, each named for a job a team lead arrives with: **Run team meetings**; **Plan offsites & workshops**; **Open, energize & close**; **Brainstorm & decide**; and **Handle tricky dynamics**. Replace the 26 free-form tags with two small closed fields: **Format** (Agenda, Activity or Guide) and a **Remote & hybrid** flag. No topic tags for now.

The main reason is that the mess is not only spelling. Your one `tags` field is doing five different jobs at once: format, topic, setting, audience and "don't know". That is why `tips`, `Tips` and `facilitation tips` keep multiplying and why `misc` exists. Your readers come with a problem ("my weekly meeting is flat", "I have an offsite in March"), so the structure they browse should be cut by problem, with format and setting kept as separate, fixed lists that can't drift.

## 2. What exists now

### How I read the blog

24 posts dated 1 January to 22 August 2025, about three a month. Each post is a title plus a single short paragraph (12 to 23 words). They are practical how-tos for someone running a session with their own team: 4 timed agendas (three hours to two days), 10 posts built around something you run with the group (Lean Coffee, dot voting, the premortem), and 10 advice posts about a situation (a stale retro, two people arguing, your first workshop).

That matches your description of the readers as team leads who run their own meetings and offsites, with one exception: "How to price a workshop as a freelance facilitator" is written for professional facilitators. The blog's centre of gravity is clear: 5 posts are about recurring team meetings and 6 are about planning or preparing a bigger session. I couldn't ask you to correct this reading, so if it is wrong, everything below should be revisited from here.

### The tags today

There are no categories; the front matter has only `title`, `date` and `tags`.

| What the tag describes | Tags (posts using it) | Tags |
|---|---|---|
| Format, what kind of post it is | tips (2), Tips (2), facilitation tips (4), agendas (4), formats (2), exercises (2), icebreakers (3) | 7 |
| Topic | leadership (3), decision making (2), planning (2), retros, conflict, energy, ideation, design sprint, tools, follow-up, risk, team health, business (1 each) | 13 |
| Occasion or setting | meetings (4), remote (3), offsites (2), hybrid (1) | 4 |
| Audience or level | beginners (1) | 1 |
| Nothing | misc (4) | 1 |
| **Total** | 51 tag uses on 24 posts | **26** |

### The problems, with counts

- **26 tags for 24 posts, and 12 of them are used once.** A tag on one post is a label, not a way to find anything.
- **"Tips" in three spellings on 7 posts.** `tips`, `Tips` and `facilitation tips` carry 8 uses between them, and "Handling the person who talks too much" has two of the variants at once. Every post on this blog is a tip, so the tag can't tell a reader anything.
- **`misc` on 4 posts (17%), and 3 of those 4 are about team meetings**, the blog's core subject. The fourth is the freelance pricing post. `misc` was hiding the main topic, not holding leftovers.
- **Five dimensions in one field.** Because format, topic, setting and audience share one list, nothing stops a writer from inventing a new term for each post, which is how drift starts.
- **The vocabulary is a facilitator's, not a team lead's.** Five posts say "facilitator" or "facilitation" in the title or body, plus the `facilitation tips` tag. Team leads mostly don't think of themselves as facilitators, so that word stays out of the navigation labels below.
- **One post speaks to a different audience** (freelance pricing). It is covered in section 4.5.

## 3. Three ways to organize it

I applied each scheme to all 24 posts before choosing, rather than judging the lists on how tidy they look.

| | A. By the reader's job (recommended) | B. By format | C. By occasion |
|---|---|---|---|
| Categories | Run team meetings 5; Plan offsites & workshops 7; Open, energize & close 4; Brainstorm & decide 5; Handle tricky dynamics 3 | Agendas 4; Icebreakers & energizers 3; Exercises & methods 7; Guides 10 | Team meetings 6; Workshops 10; Offsites & planning 3; Remote & hybrid 2; Leading your team 2; Freelancing 1 |
| Largest category | 7 of 24 (29%) | 10 of 24 (42%) | 10 of 24 (42%) |
| Posts that fit nowhere | 1 (freelance pricing, given a least-bad home) | 0 | 0, but only by creating a one-post category |
| Posts with two plausible homes | 5 close calls, all resolved by an ordered rule (section 4.2) | Several: is "Handling the person who talks too much" a method or a guide? | 3 that want two homes: hybrid meetings (meetings or remote), Two Truths on Zoom (remote or icebreakers), check-in questions (meetings or workshops) |
| Who it serves | A team lead who arrives with a problem and wants the answer | Someone who already knows they want "an agenda" or "an exercise" | Someone who thinks in events |
| Where it strains | Category labels are longer, and two are guesses I want tested (section 8) | "Guides" is `tips` under a new name and holds 42% of the blog | Dot voting works in a meeting, a workshop and an offsite, so most techniques fall into "Workshops" by default. Remote is a setting, not an occasion, so it collides with the others |

**Why A.** It is the only scheme where every category is a question a team lead already has, no category passes 40%, and nothing needs two homes. B and C both recreate today's problem: B turns `tips` into "Guides", and C turns `misc` into "Workshops". What B does well, knowing you're getting a ready-made agenda, survives in A as the Format field and an Agendas page. What C does well, finding remote content, survives as the Remote & hybrid flag.

## 4. The proposal

### 4.1 Categories: one per post

Labels are verb-led, one labelling system for the whole level. The description line under each label is shown on the category page and in any menu preview, because that is where a reader decides.

| Label | Slug | Posts | What goes here | Description shown to readers |
|---|---|---|---|---|
| Run team meetings | `team-meetings` | 5 | The recurring meeting itself: its format, focus, fairness, cost, and retros | Your regular meetings and retros: keeping them on track, fair to remote people, and worth what they cost. |
| Plan offsites & workshops | `offsites-and-workshops` | 7 | Planning or preparing a whole session longer than a regular meeting | Ready-made agendas from three hours to two days, plus the prep: checklists and tools. |
| Open, energize & close | `openers-and-closers` | 4 | The start of any session, the energy dip in the middle, and the end | Icebreakers and check-in questions, energizers for the afternoon slump, and closings that turn talk into commitments. |
| Brainstorm & decide | `ideas-and-decisions` | 5 | A method for producing ideas, structuring a discussion, or reaching and testing a decision | Getting ideas out, discussing them in a big group, voting, settling who decides, and testing a plan before you commit. |
| Handle tricky dynamics | `group-dynamics` | 3 | A person or relationship in the room is the problem | Arguments, the person who talks too much, and a team that won't speak up. |

Total: 24 posts, each in exactly one category. The slugs are nouns and the labels are tasks on purpose: if the tree test changes a label, the URL doesn't have to change.

### 4.2 The placement rule

Ask these questions in order; the first "yes" decides. Overlaps are settled by the order, not by the writer's mood on the day.

1. Is it a plan for, or preparation of, a whole session longer than a regular meeting? **Plan offsites & workshops.**
2. Is it about the start, the mid-session slump or the end of a session? **Open, energize & close.**
3. Is it about the recurring meeting itself: its format, focus, fairness, cost, or its retro? **Run team meetings.**
4. Is a person or a relationship in the room the problem? **Handle tricky dynamics.**
5. Is it a method for producing ideas, running a discussion or reaching a decision? **Brainstorm & decide.**

The navigation shows the categories in a different order (meetings first, because that is what team leads run most often). The rule order only exists to resolve overlaps.

### 4.3 Tags: two closed fields instead of free tags

**Format**, exactly one per post. Shown as a badge on every post card.

| Value | Rule | Posts |
|---|---|---|
| Agenda | A full, timed plan for a whole session. Check this first. | 4 |
| Activity | Otherwise, if the title names something you run with the group (Lean Coffee, dot voting, the premortem, the parking lot) | 10 |
| Guide | Otherwise: the title names a situation or problem (a stale retro, two people arguing, your first workshop) | 10 |

Only Agenda gets its own page, `/agendas/`, because "give me an agenda for my offsite" is a request team leads make in exactly those words. Activity and Guide are badges, not destinations. A "Guides" page would be `tips` with a new name.

Agenda posts also get an optional `length` value shown on their cards: 3 hours (OKR planning), half day (strategy offsite), 1 day (design sprint) and 2 days (annual planning).

**Setting**, zero or one per post. The only value is **Remote & hybrid**, applied only when the post is specifically about running something on a call or with a split room, not when it merely works online. It applies to 3 posts (Two Truths on Zoom, fair hybrid meetings, choosing a remote whiteboard) and has its own page, `/remote-and-hybrid/`. I merged `remote` and `hybrid` into one value because someone running a hybrid meeting also needs the remote advice, and three posts can't support two terms.

**No topic tags for now.** I tested every topic that could gather more than one post, and each either repeats a category or can't be defined:

| Candidate | Posts | Why it fails |
|---|---|---|
| icebreakers | Two Truths, energizers, check-in questions | All three are already in Open, energize & close |
| planning | strategy offsite, OKR workshop, annual planning | All three are already in Plan offsites & workshops |
| decisions | dot voting, decision rights, premortem | All three are already in Brainstorm & decide |
| leadership | decision rights, OKR workshop, psychological safety | Spans three categories, but every post here is for a leader, so it has no definition that excludes most posts |
| retros, conflict, risk, tools, business | 1 each | One post each |

Add a topic tag later only when it would gather at least 3 posts across at least 2 categories and has a one-line definition that excludes most posts.

**What happens to the old tags.** All 26 retire. `tips`, `Tips`, `facilitation tips` and `misc` vanish completely: their posts are placed by the rule above and given a Format by the table above. Topic words such as "icebreakers", "retro" and "brainstorming" live on as search synonyms (section 4.6), so a reader who types them still lands in the right category. Appendix A lists each post's old and new values side by side, and Appendix C says where each old tag page goes.

### 4.4 Site tree

```
/                                      home           Start here, Ready-made agendas, Latest posts
├── /category/team-meetings/           category       Run team meetings            5 posts
├── /category/offsites-and-workshops/  category       Plan offsites & workshops    7 posts
├── /category/openers-and-closers/     category       Open, energize & close       4 posts
├── /category/ideas-and-decisions/     category       Brainstorm & decide          5 posts
├── /category/group-dynamics/          category       Handle tricky dynamics       3 posts
├── /agendas/                          facet listing  Ready-made agendas (Format = Agenda)          4 posts
├── /remote-and-hybrid/                facet listing  Remote & hybrid (Setting = Remote & hybrid)   3 posts
├── <each post's current URL>          post           unchanged
└── /tags/<old tag>/                   retired        301 or 410 (Appendix C)
```

One level is right for this size: under 50 posts, a flat structure with one click to each category beats any hierarchy.

### 4.5 The misfit and the close calls

**"How to price a workshop as a freelance facilitator" fits nowhere.** It is for professional facilitators selling workshops, not team leads running their own. Its least-bad home is Plan offsites & workshops, because it is about scoping and quoting a workshop, from the seller's side; that is where Appendix A puts it. Then decide one of two things:

- If freelancers are not an audience you want, keep the post live at its URL so links don't break, but leave it out of "Start here" and of related links.
- If they are, and you plan more posts like it, add a category for them once there are 3. Don't create a one-post category now.

**Five placements I'm least sure of**, each covered by a tree-test task in section 8:

- "50 check-in questions for team meetings" sits in Open, energize & close, though its title says team meetings.
- "Fishbowl discussions for big groups" sits in Brainstorm & decide, though it could pass as group dynamics.
- "The premortem" sits in Brainstorm & decide, though planners might look for it next to the agendas.
- "Choosing a remote whiteboard tool" sits in Plan offsites & workshops; remote readers also reach it through `/remote-and-hybrid/`.
- "Closing a workshop so things actually happen" sits in Open, energize & close, though it is also offsite follow-through.

### 4.6 Navigation

- **Primary:** the five categories, in this order: Run team meetings; Plan offsites & workshops; Open, energize & close; Brainstorm & decide; Handle tricky dynamics. Each earns its slot because it is a job readers arrive with, and together they hold every post. If the five labels don't fit your header at a given width, collapse them into one menu that keeps the full labels; don't shorten them.
- **Utility:** Search (if your platform has it), Subscribe, About.
- **Homepage:** a "Start here" block for someone about to run their first session (first workshop checklist, check-in questions, the parking lot, the person who talks too much, closing a workshop), a "Ready-made agendas" block showing each agenda's length, then the latest posts.
- **Category page:** the label and description line, agendas first where there are any, and a "Remote & hybrid only" link on the three categories that hold such posts.
- **Post page:** a breadcrumb (Home, then the category), the Format badge (plus length for agendas), the Remote & hybrid badge where it applies, and two or three hand-picked related links, at least one from another category. The agendas are natural hubs, because each one uses steps other posts explain. From the summaries I'd suggest: the half-day strategy offsite links to check-in questions, dot voting and closing a workshop; the design sprint to silent brainstorming and dot voting; the OKR workshop to the decision rights grid and the premortem; the annual planning offsite to the retro post and the premortem. Check these against the full posts.
- **Footer:** the five categories, Ready-made agendas, Remote & hybrid, About, Subscribe.
- **Rule for adding a sixth primary item:** at least 3 posts that the placement rule can't put anywhere else.
- **Search synonyms.** If you have site search, map these words to each category. If you don't, put the key ones in each category's description so readers and search engines see them.
  - Run team meetings: meeting, weekly meeting, staff meeting, retro, retrospective, hybrid meeting, Lean Coffee.
  - Plan offsites & workshops: offsite, off-site, retreat, away day, planning day, strategy session, workshop, design sprint, OKR, agenda.
  - Open, energize & close: icebreaker, ice breaker, warm-up, check-in, energizer, energiser, closing, wrap-up, follow-up.
  - Brainstorm & decide: brainstorming, brainwriting, ideas, discussion, prioritize, voting, decision making, RACI, risk, premortem, pre-mortem.
  - Handle tricky dynamics: conflict, disagreement, argument, talks too much, quiet team, psychological safety, team health.
  - Remote & hybrid: remote, virtual, online, Zoom, video call, hybrid, distributed.

### 4.7 URLs and front matter

- **Post URLs stay exactly as they are.** Don't put the category in the post URL: otherwise every future re-categorization costs a redirect.
- New pages use lowercase kebab-case: `/category/<slug>/`, `/agendas/`, `/remote-and-hybrid/`. Keep whichever trailing-slash form your site already uses, and enforce it.
- New front matter for every post (values in Appendix B):

```yaml
---
title: "Why your retro feels stale"
date: 2025-01-01
category: team-meetings      # exactly one of the five slugs
format: guide                # exactly one: agenda | activity | guide
# setting: remote-and-hybrid # only when the post is specifically about remote or hybrid
# length: half day           # agendas only: 3 hours | half day | 1 day | 2 days
---
```

The `tags` line is removed. If your platform builds archive pages only from `tags`, keep a `tags` field instead, holding only the Format and Setting values, and treat it as the same closed list.

## 5. Migration

Do these in one release, so the navigation, the posts and the redirects never disagree.

1. Commit or back up `posts/` before editing anything.
2. Check three platform behaviours I can't see from the markdown:
   - Does adding a `category` field change post URLs? The date-prefixed filenames look Jekyll-style, and I'd expect Jekyll's default permalink to include categories; confirm it for your setup. If adding the field would move posts, pin the permalink pattern first.
   - Did `Tips` and `tips` build one tag page or two? That depends on how your platform makes slugs and whether your host treats URLs as case-sensitive. Look at the built site's tag folder before writing redirects.
   - Can your host return 410? If not, let the five retired pages 404. Don't send them to the homepage.
3. Re-tag all 24 posts from Appendix B. Re-tagging is the step teams skip, and it is why reorganizations decay.
4. Build the five category pages and the two listing pages, and switch the navigation.
5. Add the redirects in Appendix C: 21 permanent (301) and 5 gone (410). The rule is simple: each old tag page goes to the smallest new page that lists most of its posts; with no majority, it answers 410. Crawl the old tag URLs afterwards and fix any chains, loops or misses.
6. Add the build check from section 6.

## 6. Keeping it from drifting back

- **Owner:** you. No term is added without your say.
- **Closed lists.** Five categories, three formats, one setting. Add a small build check that fails if a post has a value not on the lists, or has no category or format. This is what stops `Tips` from coming back through a typo.
- **Adding a term.** Check the synonym lists first; most "new" terms are an existing one. A new category needs 3 posts the placement rule can't place. A new topic tag needs the test in section 4.3. Record each change and its date, and re-tag old posts in the same change.
- **Quarterly drift check** (about 10 new posts a quarter at your 2025 pace): posts per category, flagging any above 40% of the blog or about 25 posts; any category with fewer than 2; posts whose category no longer passes the placement rule; and, if you have search, searches that returned nothing.
- **Growth.** At your 2025 pace, two more years adds about 75 posts, roughly 100 in total and about 20 per category, which still works as one level. At ten times today (240 posts, about 48 per category), split the busiest categories into sub-topics, for example Plan offsites & workshops into strategy and planning, team days, design sprints and prep, and add facets for session length and group size, which several posts already state (Lean Coffee for 4 to 12 people, fishbowl for 20 to 60).

## 7. Assumptions and open questions

Assumptions, since I couldn't ask:

- Your readers are team leads, as you said, and you are not trying to grow a freelance-facilitator audience. Section 4.5 depends on this.
- You keep publishing at about the 2025 pace, to the same audience.
- Post URLs don't contain tags or categories today, and tag pages live at `/tags/<tag>/`. I only had the markdown files, so the paths in Appendix C are patterns to confirm, not verified addresses.
- Each post is what the file shows: a title and one paragraph. I placed posts on those. If any post is longer somewhere else, re-check the five close calls.
- I had no analytics, search logs or reader questions. The labels come from your wording and the posts' wording, not from readers, so they are exactly what the test in section 8 should check. I haven't stated how often anything is read, because I don't know.

Questions for you:

1. Keep, move or retire the freelance pricing post? (Section 4.5.)
2. Are remote and hybrid teams a large share of your readers? If so, Remote & hybrid could become a sixth primary item instead of a listing page.
3. "Handle tricky dynamics" or "Handle conflict"? The first covers more and the second is a stronger search word. The test can settle it.

## 8. How to validate it before you build

Run a tree test: a text-only version of the five categories with their post titles underneath, and no design. Recruit 20 to 50 people who run their own team's meetings; your newsletter subscribers are the obvious pool. If that's hard, 8 to 12 people will still show the dominant pattern. The tasks are written in a team lead's words and deliberately avoid the category labels.

| # | Task | Correct answer | Target | What it checks |
|---|---|---|---|---|
| 1 | Your Monday team call always starts flat. You want a question that gets everyone talking in the first five minutes. | Open, energize & close: 50 check-in questions | 80% (top task) | Close call: check-ins versus team meetings |
| 2 | Your leadership team is getting away for a day or two next month to set next year's direction, and you need to work out what happens, hour by hour. | Plan offsites & workshops: the half-day strategy offsite, or the two-day annual planning offsite | 80% (top task) | Your core offsite reader |
| 3 | Two people on your team keep reopening the same argument in every meeting. | Handle tricky dynamics: When two people won't stop arguing | 80% (top task) | The label "tricky dynamics" |
| 4 | Your team's fortnightly look-back session has become box-ticking. | Run team meetings: Why your retro feels stale | 70% | Retros under team meetings |
| 5 | Half your team dials in while the rest share a room, and the people on the call barely get a word in. | Run team meetings: Making hybrid meetings fair to remote people | 70% | Hybrid content without the Remote & hybrid page |
| 6 | Your team has fifteen ideas on sticky notes and needs to pick three to work on. | Brainstorm & decide: Dot voting without the groupthink | 80% (top task) | Deciding |
| 7 | Before a big project starts, you want the team to think through what could go wrong. | Brainstorm & decide: The premortem | 70% | Close call: premortem versus planning |
| 8 | You're hosting 40 people and want a discussion anyone can join without it becoming a free-for-all. | Brainstorm & decide: Fishbowl discussions for big groups | 70% | Close call: fishbowl versus group dynamics |
| 9 | Next month's session with your team happens entirely on video, and you need somewhere everyone can add sticky notes together. | Plan offsites & workshops: Choosing a remote whiteboard tool | 70% | Close call: tool placement |
| 10 | It's 2pm on day one of your offsite and the room is half asleep. | Open, energize & close: Energizers for the post-lunch slump | 70% | Mid-session energy; "offsite" is a deliberate decoy for the other category |
| 11 | One person on your team does most of the talking in every meeting. | Handle tricky dynamics: Handling the person who talks too much | 70% | The label again, from a second angle |
| 12 | A client has asked what you would charge to run three sessions for their team. | Plan offsites & workshops: How to price a workshop as a freelance facilitator | 70% | The misfit |

For every task, also aim for directness: the participant reaches the answer in no more than 1.5 times the shortest path (two clicks here), and simple items take under 30 seconds.

Decide now what each result will mean, so the numbers drive the change:

- Task 1: if more than a third of first clicks go to Run team meetings, move the check-in questions there and cross-link them from Open, energize & close.
- Task 8: if most first clicks go to Handle tricky dynamics, move the fishbowl post there.
- Tasks 3 and 11: if either misses its target, re-test with the label "Handle conflict".
- Task 12: a failure is evidence the post has no natural home for this audience; take the first option in section 4.5.
- Any other failure: change the label or move the post, then re-test only that task.

After launch, watch whether readers who land on a category page go on to a post, and, if you have search, what they search for that returns nothing. Those are the signals that the labels still match the readers' words.

## Appendix A: Where every post goes

Posts are numbered by date. Totals: Plan offsites & workshops 7; Run team meetings 5; Brainstorm & decide 5; Open, energize & close 4; Handle tricky dynamics 3; 24 in all. Formats: Agenda 4, Activity 10, Guide 10. Remote & hybrid: 3.

| # | Post | Category | Format | Remote & hybrid | Old tags |
|---|---|---|---|---|---|
| 1 | Why your retro feels stale | Run team meetings | Guide |  | retros, misc |
| 2 | Running Two Truths and a Lie on Zoom | Open, energize & close | Activity | Yes | icebreakers, remote |
| 3 | The parking lot: keep meetings on track | Run team meetings | Activity |  | tips, meetings |
| 4 | Dot voting without the groupthink | Brainstorm & decide | Activity |  | Tips, decision making |
| 5 | A half-day strategy offsite agenda | Plan offsites & workshops | Agenda |  | agendas, offsites |
| 6 | When two people won't stop arguing | Handle tricky dynamics | Guide |  | facilitation tips, conflict |
| 7 | Who decides? Using a simple decision rights grid | Brainstorm & decide | Activity |  | decision making, leadership |
| 8 | Energizers for the post-lunch slump | Open, energize & close | Activity |  | icebreakers, energy |
| 9 | Making hybrid meetings fair to remote people | Run team meetings | Guide | Yes | remote, hybrid, misc |
| 10 | How to run Lean Coffee | Run team meetings | Activity |  | formats, meetings |
| 11 | Your first workshop: a checklist | Plan offsites & workshops | Guide |  | facilitation tips, beginners |
| 12 | Silent brainstorming beats shouting | Brainstorm & decide | Activity |  | tips, ideation |
| 13 | A one-day design sprint agenda | Plan offsites & workshops | Agenda |  | agendas, design sprint |
| 14 | 50 check-in questions for team meetings | Open, energize & close | Activity |  | icebreakers, meetings |
| 15 | Handling the person who talks too much | Handle tricky dynamics | Guide |  | facilitation tips, Tips |
| 16 | Choosing a remote whiteboard tool | Plan offsites & workshops | Guide | Yes | remote, tools |
| 17 | Closing a workshop so things actually happen | Open, energize & close | Guide |  | facilitation tips, follow-up |
| 18 | Running an OKR planning workshop | Plan offsites & workshops | Agenda |  | planning, agendas, leadership |
| 19 | Fishbowl discussions for big groups | Brainstorm & decide | Activity |  | formats, exercises |
| 20 | The premortem: imagine the project failed | Brainstorm & decide | Activity |  | exercises, risk |
| 21 | What your weekly meeting really costs | Run team meetings | Guide |  | meetings, misc |
| 22 | Psychological safety in five minutes a week | Handle tricky dynamics | Guide |  | leadership, team health |
| 23 | How to price a workshop as a freelance facilitator | Plan offsites & workshops | Guide |  | business, misc |
| 24 | A two-day annual planning offsite | Plan offsites & workshops | Agenda |  | offsites, agendas, planning |

## Appendix B: Front matter values to apply

One row per file in `posts/`. An empty `setting` or `length` means leave that field out.

```csv
file,category,format,setting,length
2025-01-01-why-your-retro-feels-stale.md,team-meetings,guide,,
2025-01-08-two-truths-and-a-lie-remote.md,openers-and-closers,activity,remote-and-hybrid,
2025-01-15-parking-lot-technique.md,team-meetings,activity,,
2025-02-01-dot-voting-guide.md,ideas-and-decisions,activity,,
2025-02-08-half-day-strategy-offsite-agenda.md,offsites-and-workshops,agenda,,half day
2025-02-22-facilitating-conflict.md,group-dynamics,guide,,
2025-03-01-decision-rights-raci.md,ideas-and-decisions,activity,,
2025-03-15-energizers-after-lunch.md,openers-and-closers,activity,,
2025-03-22-hybrid-meeting-equity.md,team-meetings,guide,remote-and-hybrid,
2025-04-08-lean-coffee-how-to.md,team-meetings,activity,,
2025-04-15-first-workshop-checklist.md,offsites-and-workshops,guide,,
2025-04-22-silent-brainstorming.md,ideas-and-decisions,activity,,
2025-05-01-one-day-design-sprint-agenda.md,offsites-and-workshops,agenda,,1 day
2025-05-08-check-in-questions.md,openers-and-closers,activity,,
2025-05-15-handling-dominant-voices.md,group-dynamics,guide,,
2025-06-01-remote-whiteboard-tools.md,offsites-and-workshops,guide,remote-and-hybrid,
2025-06-08-closing-a-workshop-well.md,openers-and-closers,guide,,
2025-06-22-okr-planning-workshop.md,offsites-and-workshops,agenda,,3 hours
2025-07-01-fishbowl-discussion.md,ideas-and-decisions,activity,,
2025-07-15-premortem-exercise.md,ideas-and-decisions,activity,,
2025-07-22-meeting-cost-calculator.md,team-meetings,guide,,
2025-08-08-psychological-safety-starter.md,group-dynamics,guide,,
2025-08-15-workshop-pricing-for-freelancers.md,offsites-and-workshops,guide,,
2025-08-22-annual-planning-two-day-offsite.md,offsites-and-workshops,agenda,,2 days
```

## Appendix C: Redirect map for the old tag pages

Each old tag page goes to the smallest new page that lists most of its posts. With no majority, it answers 410. The old paths assume your platform turns `decision making` into `/tags/decision-making/`; confirm the real paths first. If `Tips` and `tips` already share one page, that row disappears and there are 4 retirements, not 5. Post URLs do not change, so no post needs a redirect.

| Old tag | Posts | Old page (assumed) | New destination | Status |
|---|---|---|---|---|
| agendas | 5, 13, 18, 24 | /tags/agendas/ | /agendas/ | 301 |
| facilitation tips | 6, 11, 15, 17 | /tags/facilitation-tips/ | none | 410 |
| meetings | 3, 10, 14, 21 | /tags/meetings/ | /category/team-meetings/ | 301 |
| misc | 1, 9, 21, 23 | /tags/misc/ | /category/team-meetings/ | 301 |
| icebreakers | 2, 8, 14 | /tags/icebreakers/ | /category/openers-and-closers/ | 301 |
| leadership | 7, 18, 22 | /tags/leadership/ | none | 410 |
| remote | 2, 9, 16 | /tags/remote/ | /remote-and-hybrid/ | 301 |
| decision making | 4, 7 | /tags/decision-making/ | /category/ideas-and-decisions/ | 301 |
| exercises | 19, 20 | /tags/exercises/ | /category/ideas-and-decisions/ | 301 |
| formats | 10, 19 | /tags/formats/ | none | 410 |
| offsites | 5, 24 | /tags/offsites/ | /agendas/ | 301 |
| planning | 18, 24 | /tags/planning/ | /agendas/ | 301 |
| tips | 3, 12 | /tags/tips/ | none | 410 |
| Tips | 4, 15 | /tags/Tips/ | none | 410 |
| beginners | 11 | /tags/beginners/ | /category/offsites-and-workshops/ | 301 |
| business | 23 | /tags/business/ | /category/offsites-and-workshops/ | 301 |
| conflict | 6 | /tags/conflict/ | /category/group-dynamics/ | 301 |
| design sprint | 13 | /tags/design-sprint/ | /agendas/ | 301 |
| energy | 8 | /tags/energy/ | /category/openers-and-closers/ | 301 |
| follow-up | 17 | /tags/follow-up/ | /category/openers-and-closers/ | 301 |
| hybrid | 9 | /tags/hybrid/ | /remote-and-hybrid/ | 301 |
| ideation | 12 | /tags/ideation/ | /category/ideas-and-decisions/ | 301 |
| retros | 1 | /tags/retros/ | /category/team-meetings/ | 301 |
| risk | 20 | /tags/risk/ | /category/ideas-and-decisions/ | 301 |
| team health | 22 | /tags/team-health/ | /category/group-dynamics/ | 301 |
| tools | 16 | /tags/tools/ | /remote-and-hybrid/ | 301 |

Totals: 21 redirects (301) and 5 retired pages (410), one row for each of the 26 old tags.
