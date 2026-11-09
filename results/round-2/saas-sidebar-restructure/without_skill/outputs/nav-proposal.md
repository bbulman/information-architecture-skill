# Sidebar navigation proposal

## Summary

Cut the sidebar from 18 items to 6 destinations plus three utility controls at the bottom (Invite people, Settings, Help). The cut works by merging the three clusters of near-synonyms: Reports, Analytics and Insights; Files, Docs and Wiki; Team and People. It also turns Timeline and Calendar into views inside Projects, and moves the admin and help items to the bottom of the sidebar. The two tasks behind the support tickets, exporting a report and inviting a teammate, stop depending on the user guessing the right page. Each one gets a labelled button in every place a user is likely to look for it, and search finds both.

```
[ Brightside Agency  v ]        workspace menu: Invite people, Settings, Billing
[ Search or jump to...   Cmd+K ]

  Home
  My Tasks

  Projects
  Reports
  Docs & Files
  Team

  PINNED
    Acme rebrand
    Northwind Q4 campaign
    Globex website
    + Pin a project or view

  ──────────────────────────
  + Invite people
  Settings
  Help                          (dot appears when there is news)
```

## What is wrong with the current sidebar

The main problem is not the length. Eighteen items is a lot, but users can scan a long list when every item is clearly different from the others. Here several items are not, and the support tickets show it.

1. **Near-synonyms split the scent.** A project manager who wants to export a report sees three plausible doors: Reports, Analytics and Insights. One who wants to invite a teammate sees at least two, Team and People, and probably also checks Settings and Billing because seats cost money. Every wrong guess costs a click and some confidence, and after two or three a support ticket is quicker. The two ticket topics line up exactly with two of the three synonym clusters. The third cluster, Files, Docs and Wiki, is very likely causing the same confusion under a different ticket tag ("where did my file go", "where do I put the brief").
2. **Everything has the same weight.** Billing, which one person opens a few times a year, sits at the same level and size as My Tasks, which everyone opens many times a day. Nothing tells a user which items are for daily work and which are for admin.
3. **Views are shown as places.** Timeline and Calendar are ways of looking at project and task dates, not separate things. Listing them beside Projects makes users wonder whether a timeline is its own object and whether changes there touch the project.
4. **The tasks users ask about are verbs, but the sidebar only holds nouns.** "Export" and "invite" are actions. The user has to work out which noun owns each action, and the sidebar gives them no help. Actions should sit where the user already is, not inside one destination they have to find first.
5. **Help and What's New take up primary space.** Both are useful, but neither is a place where work happens.

## Assumptions

I have not seen the product, its usage data or the tickets, so the proposal rests on these assumptions. Each one should be checked before building.

- **Reports** holds standard and saved reports (project status, budget, time, utilisation). **Analytics** holds charts and dashboards over the same data. **Insights** holds automatically generated observations, possibly AI-driven. If Insights is a strategic feature the business wants prominent, see the risks section.
- **Team** is a workload or team-structure view and **People** is a member directory. Inviting probably lives in one of those or in Settings, behind a button that is not obvious.
- Exporting exists today but sits behind an icon or an overflow menu, or exists on Reports while users look for it on Analytics.
- When agency project managers say "export a report", they usually mean producing something to send to a client: a status, budget or hours report as a PDF, or a CSV for the finance team.
- "Invite a teammate" includes staff, freelancers brought in for one project, and possibly clients as guests. At agencies of 10 to 50 people, project managers often do the inviting themselves and are frequently workspace admins as well.
- There is no Clients object today. I have not added one, though it is worth considering (see alternatives).

## The proposed sidebar

### Groups and order

The sidebar is split into four bands by spacing and thin dividers rather than headings. With only six destinations, headings would add reading without adding meaning.

| Band | Items | Why it is here |
| --- | --- | --- |
| Personal | Home, My Tasks | Used by everyone, many times a day. Top of the list is the strongest position. |
| Shared work | Projects, Reports, Docs & Files, Team | The four kinds of shared things in the workspace. Ordered by how often a project manager needs them. |
| Pinned | Up to about five starred projects or saved views | Agency PMs switch between client projects constantly. This gives back the click lost by moving Timeline and Calendar inside Projects, and lets power users pin "All projects on a timeline" if that is how they work. |
| Utility | Invite people, Settings, Help | Settings and Help at the bottom is the convention people already know from other tools. Invite people sits with them so it is always visible, whatever page the user is on. |

### What each destination contains

**Home** (was Dashboard). Today's priorities, overdue items, project health across the user's projects, and a small strip of the most relevant insights.

**My Tasks.** Unchanged, plus a Calendar view of the user's own work so the personal calendar has a home.

**Projects.** The project list, filterable and groupable by client, with a view switcher at the top: List, Board, Timeline, Calendar. The same switcher appears inside each project. Timeline on the project list shows every project on one timeline, which replaces the old Timeline page. Each project header has an **Export** button for the project status report.

**Reports** (absorbs Analytics and Insights). Three tabs:
- *Reports*: standard and saved reports, most-used first.
- *Dashboards*: the former Analytics charts.
- *Insights*: the former Insights feed.

Every report and every dashboard carries a labelled **Export** button in the page header (see below).

**Docs & Files** (absorbs Files, Docs and Wiki). One place to find anything written or uploaded, with filters for Docs, Wiki and Files, and filters by project and client. Files attached to tasks show up here as well as on their project. The wiki becomes a space called "Wiki" inside this destination, so people who rely on it still find it by that name.

**Team** (absorbs People). Two tabs: *Members* (the directory, with roles and the Invite people button in the header) and *Workload* (who has capacity which week). Utilisation as a report lives in Reports; Workload here answers the day-to-day question of who is free.

**Settings** (absorbs Integrations and Billing). A left sub-menu. Everyone sees *My profile* and *Notifications*. Admins also see *Workspace*, *Members & permissions*, *Integrations*, *Billing & plan*, *Data export* and *Security*. Billing is hidden from people who cannot act on it.

**Help** (absorbs What's New). A menu with Help centre, What's new, Keyboard shortcuts and Contact support. A dot on the Help icon shows when there is something new, so What's New keeps its signal without a permanent slot.

**Search (Cmd+K).** Search finds actions and settings as well as content. Typing "export", "download", "CSV", "PDF", "invite", "add user", "add member" or "seats" offers the matching action directly. Old page names (Analytics, Insights, Wiki, People, Timeline) stay as search aliases for at least six months, so muscle memory still works.

## Where every current item goes

| Current item | New location | Change |
| --- | --- | --- |
| Dashboard | Home | Renamed |
| My Tasks | My Tasks | Gains a Calendar view |
| Projects | Projects | Gains the view switcher |
| Timeline | Projects, Timeline view (all projects or one project) | Becomes a view |
| Calendar | Projects, Calendar view; My Tasks, Calendar view | Becomes a view |
| Reports | Reports, Reports tab | Unchanged |
| Analytics | Reports, Dashboards tab | Merged |
| Insights | Reports, Insights tab; highlights on Home | Merged |
| Files | Docs & Files, Files filter | Merged |
| Docs | Docs & Files | Renamed |
| Wiki | Docs & Files, Wiki space | Merged |
| Team | Team | Gains Members tab |
| People | Team, Members tab | Merged |
| Integrations | Settings, Integrations | Moved |
| Billing | Settings, Billing & plan (admins only); also in the workspace menu | Moved |
| Settings | Settings, bottom of sidebar; also in the workspace menu | Moved down |
| Help | Help menu, bottom of sidebar | Moved down |
| What's New | Help menu, with a dot badge on Help | Moved into Help |

Nothing is removed. Every feature that exists today still exists, and every old URL redirects to its new home (for example, the Analytics URL opens Reports on the Dashboards tab).

## Fixing the two support problems

The sidebar change reduces the number of wrong doors. These page-level changes make sure the right door has the action plainly visible behind it.

### "Where do I export a report?"

- There is now one Reports destination, and its label uses the user's own word.
- Every report and dashboard has a labelled **Export** button in the page header, not an icon and not an item in an overflow menu. It offers *PDF* (client-ready, with the agency's logo), *CSV*, *Excel*, *Share link* and *Schedule by email*. Scheduling matters for agencies that send clients the same weekly status report.
- Each project header has an **Export** button for the project status report, because many PMs start from the client's project, not from Reports.
- Settings has a separate *Data export* page for full workspace backups. Its title spells out "Export all workspace data" so it is not mistaken for report export, and the Reports Export menu links to it for anyone who needs everything.
- Search for "export" offers "Export a report" as an action.

### "Where do I invite a teammate?"

- A persistent **+ Invite people** control at the bottom of the sidebar, visible on every page.
- An **Invite people** button in the header of Team, Members.
- **Invite people** in the workspace menu at the top of the sidebar, where users of tools like Slack and Notion already look.
- On a project's member list, "Add people" can invite someone new to the workspace as well as add existing members to the project.
- Settings, Members & permissions keeps the admin side (roles, removing people, pending invites) with the same Invite button.
- The invite dialog asks for the role up front: *Member*, *Guest* (for clients or freelancers limited to chosen projects). For admins on seat-based plans, it shows what the invite does to the bill, so nobody has to visit Billing first to find out.
- If the user is not allowed to invite, the button stays visible and becomes **Request an invite**, which notifies an admin. Hiding it would bring back the original problem: the user still could not find it, and would not know why.
- Search for "invite", "add user" or "add member" offers the action.

## Labels and why

| Label | Instead of | Reason |
| --- | --- | --- |
| Home | Dashboard | "Dashboard" suggests charts and competes with Reports. Home is the convention in tools such as Asana and monday.com. |
| Reports | Analytics, Insights | It is the word in the tickets. Agency PMs think in reports they send to clients. |
| Docs & Files | Files, Docs, Wiki | Covers both what people write and what they upload, so nobody looking for an uploaded PDF passes over it. |
| Team | People | "Teammate" is the word in the tickets, and agencies talk about their team. |
| Invite people | (no direct equivalent) | A verb, so it reads as an action, not a place. "People" covers staff, freelancers and clients. |

## Alternatives considered

**Keep all 18 items and add section headings.** This is the cheapest option, and it does make the list easier to scan. It does not fix the problem, though: under a "Reporting" heading the user still has to choose between Reports, Analytics and Insights. I would use it only as an interim step if merging pages cannot happen this quarter.

**Client-first navigation,** with Clients at the top and projects under each client. This fits how agencies think and is worth exploring next. It depends on a Clients object that probably does not exist, and the support problems can be fixed without it. In this proposal, filtering and grouping Projects and Docs & Files by client covers the most common need in the meantime.

**Workflow phases** (Plan, Track, Report) as top-level groups. Rejected: the labels are abstract, and nobody looking for the invite button thinks of it as part of a phase.

## Risks and how to handle them

- **Lost muscle memory.** Existing users will reach for items that have moved. Handle it with redirects from every old URL, a one-time callout on first load ("Analytics and Insights are now in Reports"), the search aliases, and a help article that reproduces the mapping table above.
- **A crowded Reports page.** Three features in one place can feel dense. Tabs and a default that opens on the most-used reports keep it manageable. Check usage data first: if almost nobody uses Insights, it may be better as a panel on Home than as a tab.
- **Insights may be a flagship feature.** If the business wants Insights (or an AI feature behind it) prominent, placing it inside Reports hides it. The insight strip on Home gives it daily visibility without bringing back a third reporting door.
- **Timeline power users lose a click.** Remember each user's last view per project, and let anyone pin "All projects: Timeline" to the Pinned section.
- **The wiki may be a product in its own right.** If usage data shows a large group who use only the wiki, it could keep its own sidebar item. The test is whether people go to Files, Docs and Wiki for different jobs or whether they are guessing between them.

## How to validate it

**Before building:**
1. Pull 90 days of click data for each current sidebar item and the search logs. Look for items that are rarely used (safe to move) and items that are heavily used directly (handle with care).
2. Tag the last three months of support tickets by the task the user was trying to do. This gives the baseline and shows whether the Files, Docs and Wiki cluster is generating tickets too.
3. Run a tree test of the current structure against the proposed one, with 30 to 50 agency project managers per tree, recruited from existing customers. Suggested tasks:
   - Export last month's budget report for your client Acme as a PDF.
   - Invite a freelance designer who will work on one project.
   - See everything due on Thursday across all your projects.
   - Find the brand guidelines file for Acme.
   - Connect Slack.
   - Update the card your agency pays with.
   - Find out who has capacity next week.
   - Read about the latest product changes.

   The proposed tree should reach at least 80 percent success on the export and invite tasks and should not do worse than the current tree on any other task. Any task where it does worse needs a fix or a recorded reason before building.

**After launch:**
- Findability tickets per 1,000 active users, aiming to halve them within 60 days.
- Invites sent per new workspace in its first 14 days.
- Report exports per active project manager.
- Searches for "export" and "invite" that end without the user taking the offered action.

## Rollout

1. **Quick wins now, before any restructuring.** Add the labelled Export buttons, the persistent Invite people control and the search actions to the current product. They add things and move nothing, so nobody has to relearn anything, and they should reduce tickets on their own. They also show how much of the problem the sidebar itself was causing.
2. **New sidebar for new workspaces first.** New users have no muscle memory to break, and their first-week behaviour (invites sent, reports exported) gives a clean comparison with recent cohorts.
3. **Opt-in preview for existing workspaces** for about two weeks, with a feedback link, then make it the default. Do not keep a permanent toggle for the old sidebar; maintaining two navigations doubles the cost of every future change.
4. **Announce it** in What's New with the mapping table, and keep the search aliases for the old names for at least six months.
