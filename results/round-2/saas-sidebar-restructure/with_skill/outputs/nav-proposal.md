# Sidebar navigation proposal

Draft for discussion, 24 October 2026. For: project managers at agencies of 10 to 50 staff.

This is built from the 18 sidebar labels and the two support-ticket themes in the brief. I have not seen the app, its usage data or the tickets themselves, so what sits behind each label is an assumption. Section 6 lists every assumption and what changes if it is wrong.

## 1. Summary

Cut the sidebar from 18 equal links to six sections (Home, My Tasks, Projects, Reports, Docs & files, Team) by merging four groups of near-synonyms, and move admin and support into three utility links at the bottom (Invite people, Help, Settings). Each ticket theme then has one home. Everything about reporting lives under Reports, with the same Export button in the same place on every report, chart and insight. Inviting lives on Team, and the same invite dialog is also reachable from a permanent sidebar link and from the assignee picker.

The main reason: today each of those two tasks has three or four plausible doors, and no label says which one is right.

## 2. What exists now

The 18 items fall into seven clusters.

| Cluster | Current items | Count | Problem |
|---|---|---|---|
| Daily work | Dashboard, My Tasks, Projects | 3 | Clear, though "Dashboard" can read as "the charts" |
| Views of project data | Timeline, Calendar | 2 | Presented as places; they are ways of looking at the same tasks and projects |
| Reporting | Reports, Analytics, Insights | 3 | Three near-synonyms; nothing says how they differ |
| Content | Files, Docs, Wiki | 3 | The split (uploaded, written, company-wide) reflects how the product is built, not how a PM looks for a document |
| People | Team, People | 2 | Synonyms |
| Admin | Integrations, Billing, Settings | 3 | Occasional, often admin-only, yet holding primary slots |
| Support and news | Help, What's New | 2 | Not places where work happens |
| **Total** | | **18** | |

What that adds up to:

1. **Too many equal links.** 18 items in one undivided list is three times the six a primary navigation should hold. Every visit pays the cost of scanning it, and the items behind both ticket themes sit in the stretch of a long list that people scan least carefully: Reports, Analytics and Insights at positions 6 to 8, Team and People at 12 and 13.
2. **Near-synonyms.** 10 of the 18 items sit in four clusters whose labels don't tell a newcomer which one to pick.
3. **Utility in the primary list.** 5 of the 18 (Integrations, Billing, Settings, Help, What's New) are visited occasionally, yet carry the same weight as Projects.
4. **Mixed labelling systems.** One list mixes objects (Projects, Files), views (Timeline, Calendar), outputs (Reports, Analytics), groups of people (Team, People), admin (Billing) and announcements (What's New), so the list doesn't answer any one question.
5. **No search in the list.** I assume search lives in a top bar. If the app has none, that is the biggest single gap, because search is how people recover when a label fails them.

That leaves three items (Dashboard, My Tasks, Projects) as the only unambiguous primary destinations today.

### Why the two ticket tasks fail

| Task | Plausible doors today | Likely causes, to confirm against the tickets |
|---|---|---|
| Export a report | Reports, Analytics, Insights; Dashboard if it shows charts; the project itself, if "report" means a client status report | (a) Export lives in only one of the three reporting sections, and people try another first. (b) To an agency PM, "a report" is often the status report for one client's project, so they start at the project, which has no export and no link to its reports. (c) Export is tucked into an overflow menu or under Share instead of being a visible button. (d) Some reporting views can't export at all. |
| Invite a teammate | Team, People, Settings; Billing if seats are paid | (a) Invite lives in one of four places and the other three don't link to it. (b) Invite is hidden from people who aren't admins, so to a PM it looks as if it doesn't exist. (c) The moment a PM needs to invite someone (assigning work to a new freelancer) offers no invite option, so they have to leave the task to hunt for one. |

The proposal covers all of these causes, but which ones are real decides where to spend effort first. Section 7 starts with a short read of the tickets that settles it.

## 3. The options

**A. Consolidate into six sections (recommended).** Merge each cluster of near-synonyms into one section, turn Timeline and Calendar into views of Projects, and move admin and support to a utility row.
- Serves: every PM, because each task gets one obvious door; newcomers most of all.
- Costs: merged pages need tabs, old routes need redirects, and help articles need rewriting. Existing users relearn where Analytics, Insights, Wiki and People went.
- Strains: PMs who live in Timeline lose their one-click entry (softened by Projects remembering the last view used, and by Pinned). If Analytics and Insights turn out to be large, distinct tools, Reports gets crowded.

**B. Group, don't merge.** Keep all 18 links and add headers: Work (Dashboard, My Tasks, Projects, Timeline, Calendar), Reporting (Reports, Analytics, Insights), Knowledge (Files, Docs, Wiki), People (Team, People), then Integrations, Billing, Settings, Help and What's New at the bottom.
- Serves: existing users, since nothing moves.
- Costs: a sidebar-only change. No routes, pages or help articles change.
- Strains: still 18 links. The near-synonyms now sit side by side, so the choice is visible but still a guess. On its own it fixes neither ticket theme: export still has three doors, and invite still has two or more.

**C. Split by role.** For example "My work" (Dashboard, My Tasks, Calendar), "Manage" (Projects, Timeline, Reports, Analytics, Insights, Team, People), "Library" (Files, Docs, Wiki) and "Admin" (Integrations, Billing, Settings), each shown or hidden by role, with Help and What's New at the bottom.
- Serves: agencies where designers and developers use the app only for their own tasks and never touch reporting.
- Costs: role logic in the sidebar, and a support team that has to know which menu each customer sees.
- Strains: PMs are both doers and managers, so they straddle the groups. Role-dependent menus mean nobody can give anyone directions ("it's under Manage" isn't true for everyone), and hiding things by role is a likely cause of the invite tickets in the first place.

**Recommendation: A.** It is the only option that gives each ticket task a single door. If the merged pages can't ship soon, ship B's grouping together with the two fixes in section 4.3 (Export everywhere, invite shortcuts) as a stopgap: those fixes address the ticket themes directly, and B moves nothing users have learned. C's useful idea, a personal shortcut area, survives in A as Pinned, which personalizes the shortcuts without changing the map everyone shares.

## 4. The proposal

### 4.1 The new sidebar

Template types: **dashboard** is a landing page of summaries; **hub** is a section landing with tabs; **list** is a filterable listing; **view** is another way of looking at the same data; **detail** is one object; **group**, **dialog**, **menu** and **settings** are what they say.

```
SIDEBAR
├── Search                       utility   top of the sidebar, or the top bar if it lives there today;
│                                          also answers the old labels (4.4)
│
├── Home                         dashboard renamed from Dashboard; content unchanged
├── My Tasks                     list      unchanged
├── Projects                     list      view switcher: List | Timeline | Calendar; remembers the last view
│   └── <a project>              detail    tabs: Tasks | Timeline | Calendar | Docs & files | Reports,
│                                          each a view scoped to this project
├── Reports                      hub       Export on every saved report, chart and insight
│   ├── Saved reports            list      was Reports
│   ├── Charts                   list      was Analytics
│   └── Insights                 list      was Insights
├── Docs & files                 hub       one search box across all three tabs
│   ├── Docs                     list      was Docs
│   ├── Files                    list      was Files
│   └── Wiki                     list      was Wiki
├── Team                         hub       page button: Invite people; merges Team and People
│   ├── Members                  list      was People
│   └── Groups                   list      was Team (assumed to be groups or departments; assumption 3)
│
├── Pinned                       group     the user's own shortcuts; hidden until they pin something
│
├── + Invite people              dialog    the same dialog as Team > Invite people
├── Help                         menu      Help center | What's New (dot when unread) | Contact support
└── Settings                     settings  side rail in two groups
    ├── Your account             settings  Profile, Notifications and the other personal settings
    └── Workspace                settings  existing workspace settings, Integrations, Billing & plan,
                                           Members (a link that opens Team)
```

18 equal links become six primary sections, a search box, a Pinned group that stays hidden until someone uses it, and three utility links. The sidebar shows only the first level; second-level items appear as tabs at the top of each section's page.

### 4.2 Labels

| Label | What's behind it | Why this word |
|---|---|---|
| Home | Today's Dashboard | "Dashboard" is a fourth label that can mean "charts about my work". Renaming it leaves Reports as the one place for charts. If Home shows charts, each links to its full version in Reports > Charts |
| My Tasks | Unchanged | Already clear |
| Projects | All projects, in List, Timeline and Calendar views | Timeline and Calendar are ways of looking at projects, so they live with them |
| Reports | Saved reports, Charts, Insights | Matches the word in the tickets ("export a report") |
| Charts (tab) | Today's Analytics | Says what's on the page. "Analytics" beside "Insights" and "Reports" is the synonym problem again, and "Dashboards" would collide with the old name for Home |
| Docs & files | Docs, Files, Wiki | One door for "where's that document?"; the tabs keep the distinction for people who care about it |
| Team | Members, Groups, Invite people | Matches "teammate", the word in the tickets. "People" is the alternative; test both if the ticket read is split (section 7) |
| Invite people | The invite dialog, wherever it appears | One name everywhere. "People" rather than "teammates" because agencies also invite freelancers and possibly clients |
| Help | Help center, What's New, Contact support | Not "Help & updates": in a project management app, "updates" already means project status updates |
| Settings | Your account, Workspace | Familiar, and where people already look for Integrations and Billing |

### 4.3 One home for each ticket task

**Exporting a report**

- *Home:* the Export button at the top right of every saved report, chart and insight, with the same label in the same place. It offers whatever formats the app supports (PDF, CSV and so on). Reports is the only section that holds reporting.
- *Ways in:* the Reports section; the Reports tab on each project, which shows the same reports filtered to that project, with the same button; and search, where "export", "download", "PDF" and "CSV" all lead to Reports.
- *Cue where the decision happens:* Export is a visible button beside Share, never only an item in an overflow menu. A PM looking at a report is already asking "how do I get this out?", and the answer should be in view.
- *Condition:* if some reporting views can't export today, build it before launch. A section where Export appears on some pages and not others teaches people that Export is unreliable.

**Inviting a teammate**

- *Home:* the Team page, with Invite people as its main button.
- *Ways in, all opening the same dialog:* the "+ Invite people" link at the bottom of the sidebar; the assignee picker, which offers "Invite <name or email>" when the person typed isn't in the workspace; the Members link in Settings > Workspace; and the seat count in Billing & plan.
- *Cue where the decision happens:* the assignee picker is where a PM discovers that the new freelancer isn't in the workspace yet. Offering the invite there answers the question at the moment it arises, without sending them off to look for a page.
- *The dialog* asks for email addresses and a role (member, or guest if the app has guests), and states the seat cost if each invite adds a paid seat, so nobody has to detour to Billing to find out.
- *Permissions:* show Invite people to everyone. For someone who can't invite, the dialog names who can and offers to send them a request. Hiding the button is exactly what makes a control look as if it doesn't exist.

### 4.4 Navigation spec

- **Primary (6):** Home, My Tasks, Projects, Reports, Docs & files, Team. In that order they follow an agency PM's week: what's on my plate, what's happening across projects, what do I tell the client, where's the material, who's doing the work. Each earns its slot because it is a place people go to do a job, not a view, a setting or an announcement.
- **Utility:** Search at the top; "+ Invite people", Help and Settings at the bottom, beside the account avatar.
- **Contextual:**
  - Section tabs at the top of Reports (Saved reports, Charts, Insights), Docs & files (Docs, Files, Wiki) and Team (Members, Groups).
  - Project tabs (Tasks, Timeline, Calendar, Docs & files, Reports), each a filtered view of the matching section, so every item keeps one home and the project shows it in context.
  - Filters on lists, designed for ten times today's volume: Projects by status and owner; Saved reports by project, type and owner; Docs & files by type, project, owner and last updated. Add a client filter to Projects and Saved reports if projects have a client field.
  - Breadcrumbs from the second level down, for example Reports > Charts > Weekly throughput.
  - Cross-links, never second homes: Settings > Workspace > Members opens Team, and so does the seat count in Billing & plan.
- **Pinned:** any project, saved report, chart or saved view can be pinned. Personal shortcuts sit on top of a map that is the same for everyone, so support and colleagues can still give directions.
- **Collapsed sidebar:** an icon rail with the six primary icons and the utility icons, showing labels on hover and on keyboard focus.
- **Mobile, if there is a mobile layout:** a bottom bar of five: Home, My Tasks, Projects, Reports and More (Docs & files, Team, Invite people, Help, Settings).
- **Active state:** the current section is highlighted in the sidebar, the current tab is marked, and the breadcrumb confirms the path.
- **Permissions:** prefer showing a destination in a locked state that names who can act over hiding it. This matters most for invite.
- **Search aliases:** keep the old labels, and the words people actually use, as permanent synonyms. Add whatever the ticket read turns up.

  | People type | They land on |
  |---|---|
  | Dashboard | Home |
  | Timeline, Gantt, Calendar | Projects, in that view |
  | Analytics, stats, metrics | Reports > Charts |
  | Insights | Reports > Insights |
  | Export, download, PDF, CSV | Reports, with a line saying where the Export button is |
  | People, users, members, add user, seats, access | Team |
  | Files, Docs, Wiki | Docs & files, on that tab |
  | Integrations, or the name of any integration | Settings > Workspace > Integrations |
  | Billing, invoice, payment, card, plan | Settings > Workspace > Billing & plan |
  | What's New, changelog, release notes | Help > What's New |

- **Inclusion rule for a new top-level item:** it must be a place people go to do a job at least weekly; it must not be a view of data another section holds, a setting or an announcement; it must not fit as a tab in an existing section; and if it would make seven, something else merges or moves to utility. One named owner, the product manager who owns navigation, applies the rule and reviews the search-alias report each quarter for old labels people still type.

## 5. Migration

Every current item has a new home; the full table is Appendix A. To release it:

1. **Start tagging tickets now.** Tag every export and invite ticket from today, so there is a baseline to compare against after launch.
2. **Redirect every retired route to its new home**, never to Home. An old Analytics bookmark, or a link in a notification email, should land on Reports > Charts. I don't know your router: confirm it can redirect old paths and keep their query strings rather than assuming it.
3. **Rewrite everything that names the old labels, in the same release:** help-center articles, onboarding checklists, product tours, support macros and email templates. This is the step teams skip, and it is how "go to People and click Invite" survives in a help article for a year after People is gone.
4. **Tell existing users once.** A dismissible note on the first load after the change: "The sidebar is shorter. Analytics and Insights are now in Reports, Timeline and Calendar are views in Projects, Files and Wiki are in Docs & files, People is in Team, and Integrations and Billing are in Settings." The search aliases catch anyone who skips it.
5. **Ship the two task fixes as soon as they're ready.** Export everywhere and the invite shortcuts don't depend on the merges.

## 6. Assumptions and open questions

| # | Assumption | If it's wrong |
|---|---|---|
| 1 | Timeline and Calendar show tasks and projects across the workspace, not a separate meetings calendar | A meetings calendar belongs with My Tasks or in an integration, not under Projects |
| 2 | Analytics is interactive charts, and Insights is automatic highlights or warnings | If they're the same thing, merge them into one tab. If Insights is an AI assistant, keep it out of the sidebar and offer it in context instead |
| 3 | People is the member directory, and Team is groups or departments | If Team is the directory, the merge still holds and only the tab names change. If there are no groups, Team is a single list with no tabs |
| 4 | Settings mixes personal and workspace settings | If it's workspace-only, drop the Your account group and put personal settings under the avatar |
| 5 | Search exists, probably in a top bar | If not, building it comes first: it is the fallback for every label that fails |
| 6 | To an agency PM, "report" often means the status report for one client's project | If the tickets say otherwise, the project's Reports tab matters less and the Export button matters more |
| 7 | Inviting may be admin-only today | Whether PMs can invite, or only request an invite, is a product decision; the navigation works either way as long as the button is visible |
| 8 | Agencies often invite freelancers, and may invite clients as guests | If clients are invited, the dialog needs a clear role choice, and Team needs a way to tell staff from guests |
| 9 | PMs think of projects as belonging to clients, though no sidebar item says so | Don't add a top-level Clients item untested. If projects have a client field, a client filter in Projects comes first |
| 10 | The app is used mainly on desktop web | If mobile matters, test the five-item bottom bar separately |
| 11 | No usage data was available | If most PMs open Timeline daily, test it as a seventh primary item against the view-inside-Projects version |

**Open questions for the team:** Which reporting views can export today, and in which formats? Does inviting someone add a paid seat? Who owns the sidebar and approves a new top-level item?

**Where this draft is weakest:** the evidence (no usage data, no ticket text) and the users' own groupings (no card sort). The groupings above are mine, not your users', until the ticket read and the tree test below say otherwise.

## 7. How to validate it

**First, read the tickets (about an afternoon).** Take the recent export and invite tickets, all of them or 30 to 50 of each, and note three things per ticket: the words used ("download", "PDF", "send to the client"; "add", "access", "seat", "freelancer"), where the person says they looked first, and whether they're an admin. That confirms or rules out the causes in section 2, supplies more search aliases, and settles Team versus People.

**Then tree-test the sidebar, text only, before building anything.** Run the same tasks on the current 18-item list (scored against where things really are today) and on the proposed tree, with about 30 participants on each, so the result is a comparison rather than a single number. Recruit customers who are PMs at agencies of 10 to 50 staff, mixing long-time users with people in their first month, plus a few admins for the Settings tasks. If the ticket read doesn't settle Team versus People, run a second round of at least 20 with People in place of Team and compare task 2.

The tree participants see, with no notes and no "was" labels:

```
Home
My Tasks
Projects
  List
  Timeline
  Calendar
  Acme website redesign
    Tasks
    Timeline
    Calendar
    Docs & files
    Reports
Reports
  Saved reports
  Charts
  Insights
Docs & files
  Docs
  Files
  Wiki
Team
  Invite people
  Members
  Groups
Invite people
Help
  Help center
  What's New
  Contact support
Settings
  Your account
    Profile
    Notifications
  Workspace
    General
    Members
    Integrations
    Billing & plan
```

| # | Task, in the participants' words | Correct answers | Success target |
|---|---|---|---|
| 1 | A client wants last month's progress on their project as a PDF they can forward to their boss. Where would you go to get it? | Anything under Reports; Projects > Acme website redesign > Reports | 80% (top task) |
| 2 | A freelance designer joins your agency next week to work on a client project. Where would you go to give them access? | Either Invite people node; anything under Team; Settings > Workspace > Members (counts as success, but report it separately: it shows how many still start in Settings) | 80% (top task) |
| 3 | You need to check whether deadlines on different projects clash over the next two months. | Projects > Timeline; Projects > Calendar | 70% |
| 4 | Which day next week has the most due across all your projects? | Projects > Calendar; Projects > Timeline | 70% |
| 5 | Find the agency's standard checklist for kicking off work with a new client. | Docs & files > Wiki; Docs & files > Docs | 70% |
| 6 | Find the logos a client sent over last week, which a colleague uploaded. | Docs & files > Files; Projects > Acme website redesign > Docs & files | 70% |
| 7 | You want project updates to appear automatically in your agency's Slack. Where would you set that up? (Swap in an integration you support.) | Settings > Workspace > Integrations | 70% |
| 8 | The agency's credit card has expired. Where would you change the card you pay with? | Settings > Workspace > Billing & plan | 70% |
| 9 | A colleague says the app added a feature this week. Where would you find out what changed? | Help > What's New | 70% |
| 10 | You want a graph of how many tasks got finished each week this quarter, across the agency. | Reports > Charts; Reports > Saved reports | 70% |
| 11 | The app can warn you when a project looks likely to miss its deadline. Where would you look for those warnings? | Reports > Insights; Home, if it shows those warnings today | 70% |
| 12 | See everything you personally need to finish this week. | My Tasks | Close to 100%: a control, so if it fails, suspect the study before the tree |

Success means the participant ends on a correct node, first time or after backtracking. Also record directness, with a target of no more than 1.5 times the shortest path (one or two clicks for every task here), and expect simple tasks such as 9 and 12 to take under 30 seconds. Tasks 3, 4, 5, 7, 8, 9 and 11 are there because those placements are the ones I'm least sure of.

**Then a first-click test on the pages.** The tree test checks the sidebar, not the buttons on the pages. Show static mockups of a saved report, the Team page and the assignee picker (with a name typed that matches nobody), and ask participants to send the report to a client as a PDF, give a new freelancer access, and assign the task to the freelancer. Target: 80% click Export, Invite people and the invite option in the picker on their first click.

**After launch, watch:**
- Export and invite tickets per week, against the baseline from step 1 of the migration.
- Pogo-sticking: sessions that open two or more Reports tabs before exporting, and sessions that visit both Team and Settings before inviting.
- Where invites start: the Team page, the sidebar link, the assignee picker or Settings. An entry point almost nobody uses can be removed.
- Searches for old labels (Analytics, People, Wiki) over time. They should fall; one that doesn't is a label doing a job its replacement isn't.
- Searches started from inside Reports or Team, which mean the section's own layout failed the person.

## Appendix A: Where every current item goes

| # | Today | New home | Change |
|---|---|---|---|
| 1 | Dashboard | Home | Renamed |
| 2 | My Tasks | My Tasks | Unchanged |
| 3 | Projects | Projects | Unchanged; now holds the Timeline and Calendar views |
| 4 | Timeline | Projects > Timeline view, and on each project | Became a view |
| 5 | Calendar | Projects > Calendar view, and on each project | Became a view |
| 6 | Reports | Reports > Saved reports | Merged into the Reports section; Export made consistent |
| 7 | Analytics | Reports > Charts | Merged and renamed |
| 8 | Insights | Reports > Insights | Merged |
| 9 | Files | Docs & files > Files | Merged |
| 10 | Docs | Docs & files > Docs | Merged |
| 11 | Wiki | Docs & files > Wiki | Merged |
| 12 | Team | Team > Groups | Merged with People (assumption 3) |
| 13 | People | Team > Members | Merged and renamed |
| 14 | Integrations | Settings > Workspace > Integrations | Moved to utility |
| 15 | Billing | Settings > Workspace > Billing & plan | Moved to utility and renamed |
| 16 | Settings | Settings, at the bottom of the sidebar | Moved to utility; split into Your account and Workspace |
| 17 | Help | Help > Help center | Moved to utility |
| 18 | What's New | Help > What's New, with a dot when unread | Moved to utility |

Totals: 2 unchanged (My Tasks, Projects), 1 renamed (Dashboard), 2 became views (Timeline, Calendar), 8 merged into three sections (Reports, Analytics and Insights; Files, Docs and Wiki; Team and People), and 5 moved to utility (Integrations, Billing, Settings, Help, What's New): 18 in all. Nothing is removed. New to the sidebar: Search (moved up, if it lives in a top bar today), Pinned and the "+ Invite people" link.
