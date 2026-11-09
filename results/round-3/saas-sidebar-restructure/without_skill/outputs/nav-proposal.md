# Sidebar navigation proposal

**Recommendation:** take the sidebar from 18 rows to 10 destinations plus one pinned "Invite teammates" action. Reports, Analytics and Insights become one Reports area. Team and People become one Team area. Files, Docs and Wiki become one Docs & Files area. Integrations and Billing move into Settings, and What's New moves into Help. The five rows that carry daily work stay exactly as they are.

The sidebar change will not end the tickets by itself. A sidebar can only get someone to the right page, and exporting and inviting are actions on that page, so this proposal also includes a visible Export button on every report and a single invite dialog that opens from every place people look for it.

This is written from the list of 18 items, the two ticket themes and the audience description. I have not seen usage data, the screens or the tickets themselves, so the structure is a reasoned hypothesis until the checks below are run. Where I had to guess what a page does, the guess and its consequence are listed under Assumptions.

## Why people can't find things

The two complaints land on the two places where the sidebar uses several words for one idea. Someone exporting a report has to choose between Reports, Analytics and Insights, and all three are reasonable guesses. Someone inviting a teammate has to choose between Team and People, and may also try Settings, or Billing if seats cost money. Reordering those rows would not help, because the labels themselves give people no way to tell the options apart. Files, Docs and Wiki have the same flaw and probably cause quieter confusion, since a client brief could plausibly live in any of them.

The list also gives equal weight to things used hourly and things used once a year, and it mixes four kinds of item: the person's own work, shared work, account administration, and news about the product. With 18 undifferentiated rows, people have to read the list every time instead of recognising a position in it.

The audience sharpens both problems. In an agency of 10 to 50 people the whole staff fits in one list, so a split between Team and People has little to offer. Project managers there run several client projects at once, and a report is often due to a client on a deadline, so a hidden export hurts at the worst moment. They are also often not the account owner, which makes Billing noise for most of them and means the invite path has to work for someone without admin rights.

## Proposed sidebar

```
  Dashboard
  My Tasks
  ----------------
  Projects
  Timeline
  Calendar
  ----------------
  Reports
  Docs & Files
  Team


  (pinned to the bottom)
  + Invite teammates
  Settings
  Help  (dot when What's New is unread)
```

The first cluster is the project manager's own day. The second is the delivery work and when it is due. The third holds what is shared across projects. The footer holds account and support items and stays in the same place on every screen.

I used plain dividers instead of section headings. With ten rows in small clusters, headings add words to read without adding meaning, and the third cluster could only be called something vague like "Workspace". Nothing collapses, because expandable sections would put the two things people already can't find behind another click.

The three merged areas open as one page with tabs, and the tabs keep the old names (Analytics, Insights, Wiki, Files) so nobody has to learn a new word for something they already use. Each tab has its own URL, and each merged page reopens on the tab last used, so someone who lives in Analytics is still one click away after their first visit. This is a navigation change only, and no content has to be migrated between systems.

The labels that survive are the ones closest to the words in the tickets: people ask about a "report" and a "teammate", so the rows are Reports and Team.

## Where all 18 items go

| Today | New home | What changes |
|---|---|---|
| Dashboard | Dashboard | Nothing |
| My Tasks | My Tasks | Nothing |
| Projects | Projects | Nothing |
| Timeline | Timeline | Nothing |
| Calendar | Calendar | Nothing |
| Reports | Reports, first tab | Becomes the one home for numbers about the work. Export button on every report |
| Analytics | Reports, Analytics tab | Loses its row |
| Insights | Reports, Insights tab | Loses its row |
| Files | Docs & Files, Files tab | Loses its row |
| Docs | Docs & Files, first tab | Row renamed |
| Wiki | Docs & Files, Wiki tab | Loses its row |
| Team | Team, Groups tab | Row stays and now opens on Members |
| People | Team, Members tab (first tab) | Loses its row. Home of the member list, roles and the Invite button |
| Integrations | Settings, Integrations | Loses its row |
| Billing | Settings, Billing | Loses its row. Shown only to people with billing rights. Seat count links to the invite dialog |
| Settings | Settings | Gains Integrations and Billing, plus a Members link that opens Team, Members |
| Help | Help, opens a small menu | Holds help centre, contact support and What's New |
| What's New | Help menu | Loses its row. Unread items show as a dot on Help |

## How the two problem tasks change

**Exporting a report.** Reports is now the only row that fits. Every report opens with a labelled Export button in the same spot in the page header, outside any "more" menu. The Analytics and Insights tabs carry the same button wherever there is something to export, so landing on the wrong tab is no longer a dead end. Rows in the report list also offer Export in their menu, for people who know which report they want.

**Inviting a teammate.** The pinned "Invite teammates" row opens one dialog over the current page, from anywhere in the product. The same dialog is the primary button on Team, Members, and it is reachable from Settings and from the seat count in Billing, the other places people are likely to look. There are four ways in and one dialog to maintain. The row is styled as an action, with a plus icon and no selected state, so it does not read as another page.

The row stays visible to people who are not allowed to invite. If it disappeared for them they would go hunting and then file the same ticket. For those users the dialog takes the email address and sends a request to an account admin. A cheaper first version simply names the admin to ask.

## Options I rejected

**Adding headings to the existing 18 rows.** This is the cheapest option and would make the list easier to scan, but every competing label stays, so both ticket types would continue.

**Merging Timeline and Calendar into a Schedule row, or into Projects.** It would save a row, but these are well-understood words on the most used part of the sidebar and nothing in the tickets points at them. I kept the change to the areas with evidence of a problem. Revisit this if usage shows one of them is rarely opened.

**An icon rail with a second contextual panel.** This pattern suits much larger products. Here it would mean rebuilding the app shell to solve what is mainly a labelling problem across ten destinations.

**A customisable sidebar.** It helps experienced users tune their setup, but the people filing these tickets are the ones who don't yet know where things are, and they will see the default. It can be added later.

**Invite under Settings only.** This is a common convention, but project managers who are not admins are unlikely to think of adding a colleague as configuration.

## Assumptions

| I assumed | If that is wrong |
|---|---|
| Reports are saved, exportable documents, Analytics is interactive charts, and Insights is automatic callouts, all about the same project data | If one of them serves a different job or audience, such as finance data for owners, it keeps its own row with a name that says what it is |
| People is the directory of individuals, and Team holds groups or departments | If Team is really a workload or capacity screen, it is a daily tool for agency project managers and should keep its own row, named Workload, in the second cluster. People then takes the Team row and the same invite plan applies |
| Timeline and Calendar show work across projects | If they only show one project at a time, they become view tabs inside Projects and the sidebar drops to eight destinations |
| Wiki is used occasionally | If agencies rely on it daily for standard procedures, it keeps its own row and only Files and Docs merge |
| Project managers often lack admin rights, and invites are restricted by role | If every member can invite, drop the request path and keep everything else |
| The tickets are about finding the page | If people reach the report and still can't export, or want a format the product doesn't offer, the fix is on the report page and the sidebar will matter less than this document suggests |

## How to check it

Three steps before building, all cheap compared with shipping the wrong structure:

1. Read 100 to 200 recent tickets on these two themes and code each one: could not find the page, could not find the control on the page, lacked permission, or wanted something the product doesn't do. This tells you how much of the problem navigation can solve. Note the words people use too, since the labels here rest on "report" and "teammate".
2. Pull 90 days of clicks per sidebar item, split by role. As a starting threshold, any item that loses its row but is used weekly by more than about a quarter of active users should get its row back.
3. Run a tree test of the current and proposed structures with about 50 agency project managers each, recruited in the product. Use the two complaint tasks plus tasks for everything that moved: connect an integration, update the payment card, find a procedure in the wiki, see what shipped recently, and find a chart of last month's work. Aim for at least 80% reaching the right place on export and invite, with no moved item losing more than 10 points against today.

After launch, compare tickets on the two themes for six weeks against the prior six, adjusted for active accounts. Also watch the share of users who export in their first 30 days, invites per new workspace, and searches for the old names (Analytics, People, Billing), which show who is still looking for an old home.

## Rollout

1. **Ship the Export button and the invite dialog with its pinned row first.** Neither depends on the restructure, both are small, and together they test the theory directly. Measure ticket volume for a few weeks.
2. **Then consolidate the rows behind a flag,** starting with new workspaces, which have no habits to break, and moving to existing ones after that. Every old URL redirects to its new tab. Existing users see one dismissible note naming what moved, and search and any command menu find items under their old names.
3. **Review at six weeks** against the measures above and restore any row the data says should not have moved.
