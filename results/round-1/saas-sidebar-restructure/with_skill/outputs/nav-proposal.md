# Sidebar navigation proposal

Draft, 24 October 2026. This is a proposal to react to, not a decision: the product team owns the final structure.

## 1. Summary

Cut the sidebar from 18 items to 6: **Home, My Tasks, Projects, Reports, Docs & Files, Team**. Admin and help items move into a workspace menu, a help menu and an account menu, and Timeline and Calendar become views inside Projects and My Tasks.

The main reason is that both support themes come from one concept being split across several labels. A report could live in Reports, Analytics or Insights. A teammate could be invited from Team, People, Settings or Billing. The fix is to give each concept one home, name it in the tickets' own words ("report", "teammate"), and put the Export and Invite buttons where people already are when they need them. That removes the cause, not just the symptom.

**What I worked from:** the 18 labels and their order, the two ticket themes, and the audience (project managers at agencies of 10 to 50 staff). I have not seen the screens behind the labels, the tickets themselves, usage data or search logs. Section 6 lists what I assumed each item contains. Section 7 starts with a day or two of cheap research that would confirm or overturn this proposal before anyone builds it.

## 2. What exists now

### The current tree

The sidebar has one level and 18 items, with no grouping:

```
 1 Dashboard      7 Analytics     13 People
 2 My Tasks       8 Insights      14 Integrations
 3 Projects       9 Files         15 Billing
 4 Timeline      10 Docs          16 Settings
 5 Calendar      11 Wiki          17 Help
 6 Reports       12 Team          18 What's New
```

### What the labels say once you group them

Grouping the 18 labels by what they are about gives seven clusters of two or three items each. This is the central finding. The sidebar is not 18 things. It is about seven things, and several of them are named two or three times.

| Cluster | Current items | What overlaps |
|---|---|---|
| Starting point and my work | Dashboard, My Tasks | Little: one is an overview, one is a personal list |
| Projects and their dates | Projects, Timeline, Calendar | Timeline and Calendar show project and task dates; they don't hold anything of their own |
| Numbers about the work | Reports, Analytics, Insights | Three labels for one need, and nothing tells a newcomer which one exports |
| Stored content | Files, Docs, Wiki | Docs and Wiki both hold written pages |
| The people | Team, People | Two labels for one need, and nothing says which one invites |
| Running the workspace | Integrations, Billing, Settings | Admin work, done rarely and mostly by admins |
| About the product | Help, What's New | Not about the user's work at all |

### The problems, with counts

1. **Too many primary items.** There are 18, against a working limit of about 7. Every visit means scanning a long list, and so far every new feature has become a new item.
2. **Split concepts directly cause both ticket themes.** Someone who wants to export a report has at least three plausible homes (Reports, Analytics, Insights), and a fourth if they think of Dashboard as the place with the charts. Someone who wants to invite a teammate has four: Team, People, and Settings or Billing, where many products keep user management and seats. When a label can't predict what's behind it, people guess, guess wrong and file a ticket.
3. **One list mixes several labelling systems.** It mixes things (Projects, Files, Docs), views of things (Timeline, Calendar, Dashboard) and a scope (My Tasks). It also has three formats of analysis (Reports, Analytics, Insights), admin (Integrations, Billing, Settings) and product news (Help, What's New). With no rule behind the list, people can't learn where something will be.
4. **Five of the 18 items (28%) are admin or product utility:** Integrations, Billing, Settings, Help and What's New. They take primary space that daily project work never uses.
5. **The people items sit in the weakest position.** Team and People are 12th and 13th of 18. That is the middle of a long list, where people pay the least attention while scanning, and it is where the invite ticket lives.
6. **The actions themselves may be hidden.** This is a hypothesis to check, not a finding. Export and invite are actions, not destinations. Many products put them behind a "⋯" overflow menu or a plan gate, or show them only to admins. In a 10 to 50 person agency the owner or ops lead is often the only admin. If PMs aren't admins and the Invite button is hidden from non-admins, no menu change will fix that ticket. Section 7.1 says how to check.

## 3. Options

Here are three ways to restructure, from least change to most.

### Option A: Group what's there

Keep all 18 items, add section headings, and move admin and help to the bottom.

```
Dashboard
My Tasks
WORK          Projects, Timeline, Calendar
REPORTING     Reports, Analytics, Insights
CONTENT       Files, Docs, Wiki
PEOPLE        Team, People
(bottom)      Integrations, Billing, Settings, Help, What's New
```

- **Who it serves:** existing users, because nothing moves or changes name. It is the cheapest to ship.
- **What it costs:** almost nothing to build.
- **Where it strains:** it fixes neither ticket. The headings narrow the guess from 18 items to three for a report and two for an invite, but people still have to choose between near-synonyms. The list stays at 18, and the next feature makes it 19.

### Option B: One item per kind of thing (recommended)

Six primary items, each holding one kind of thing. Views become tabs or switchers inside them, and admin and help move to menus.

```
Home, My Tasks, Projects, Reports, Docs & Files, Team
menus:  workspace (Settings, Integrations, Billing)   help (Help, What's New)   account
```

- **Who it serves:** newcomers and occasional users most, because each label predicts what's behind it. Daily users keep one-click access to the four places they use most: Home, My Tasks, Projects and Reports.
- **What it costs:** merging Reports, Analytics and Insights into one hub is product work, not just a menu change. Help articles, screenshots and support macros all need updating, and existing users have to relearn a few locations.
- **Where it strains:** anyone who opens the cross-project Timeline every day needs one more click, which is softened by remembering their last view. Whoever owns Insights or What's New loses a dedicated slot. "Docs & Files" is the label most likely to need tuning.

### Option C: Client and project first

The global sidebar gets very short, and most things move into each project's own tabs. This matches how agencies bill and report: per client, per project.

```
Home, My Tasks, Projects (grouped by client)
  inside a project:  Tasks, Timeline, Calendar, Files, Docs, Reports, People
workspace-wide:      Reports, Wiki, Team
```

- **Who it serves:** PMs who spend their day inside one client's project at a time.
- **What it costs:** the biggest build. It needs project-level navigation, plus a client entity if the product doesn't already have one.
- **Where it strains:** anything that spans projects gets pushed deeper. That includes the portfolio timeline, all files, team workload and agency-wide reports, which hurts the owner or ops lead who looks across every client. It also adds a second navigation layer that people have to learn.

### Recommendation

Choose Option B, and borrow the project tabs from Option C. It removes the cause of both tickets and keeps the primary list under the 7-item limit, with room for one future addition. It also organizes the product around how agency work is done rather than the order in which features shipped. Option A is worth doing only as a stopgap if B can't ship this quarter. Option C is worth revisiting if usage data shows that PMs spend most of their time inside single projects.

## 4. The proposal

### The tree

Each node shows its template type. "was X" marks where each of today's 18 items ended up.

```
SIDEBAR, TOP TO BOTTOM             TEMPLATE          NOTES

Workspace menu (workspace name)    menu
├── Settings                       settings          was Settings (workspace settings)
├── Integrations                   settings          was Integrations
├── Members and permissions        link              opens Team > Members; not a second list
└── Billing                        billing           was Billing; admins only
Search                             command palette   finds content, actions and settings
+ New (optional)                   menu              Task, Project, Doc, Invite teammate

Home                               home              was Dashboard; shows a preview of Insights
My Tasks                           task-list         views: List, Calendar
Projects                           project-list      views: List, Timeline (was Timeline), Calendar (was Calendar)
│                                                    filters: client (if the product has clients), status, owner
└── <project>                      project           tabs: Tasks, Timeline, Calendar, Files, Docs, People
Reports                            reports-hub       Insights (was Insights) at the top, then all reports
├── <report>                       report            charts (was Analytics) and table; Export, Share
└── New report                     report-builder    was Analytics, if Analytics is a chart builder
Docs & Files                       docs-hub          tabs: Docs, Wiki, Files
├── Docs                           doc-list          was Docs; filter by project and owner
├── Wiki                           wiki              was Wiki
└── Files                          file-list         was Files; every file across projects
Team                               team-hub          opens on Members
├── Members                        member-list       was People; Invite button; filter by role, group, guest
└── Groups                         group-list        was Team (assumed to mean sub-teams)

Starred projects                   shortcuts         per person, optional

SIDEBAR FOOTER
Invite teammates                   action            opens the same invite flow as Team > Members
Help (?)                           menu
├── Help centre                    external          was Help
├── What's New                     changelog         was What's New; a dot on the ? when unread
└── Contact support                action            if offered today
Your account (avatar)              menu              Profile, Notifications, Sign out (personal settings)
```

**One home per item.** A file or doc attached to a project lives in that project. Docs & Files > Files and Docs show the same items across all projects; they are views, not second copies. Wiki pages and docs that belong to no project live in Docs & Files. Calendar and Timeline appear in several places because they are views of tasks at different scopes, not places where anything is stored.

### Why these labels

| Label | Reason |
|---|---|
| Home | Replaces "Dashboard". "Dashboard" suggests charts and competes with Reports as the place where the numbers are, which feeds the export confusion. "Home" says "where I land". If existing users push back, keeping "Dashboard" is acceptable; the tree test compares the two. |
| My Tasks | Unchanged. It is clear, familiar and used daily. |
| Projects | Unchanged. Timeline and Calendar join it as views, because they show project dates rather than holding anything of their own. |
| Reports | The tickets' own word ("export a report"). It is the one home for every report, prebuilt or custom, so Export is always in the same place. |
| Docs & Files | Names both kinds of stored content. "Knowledge", "Library" or "Content" would be shorter but would hide what's inside. Wiki keeps its name as a tab, so people who look for "wiki" still find it. |
| Team | The tickets' own word ("invite a teammate"), chosen over "People" for that reason. It holds members (was People) and groups (was Team). |

The primary level now uses one labelling system: each item names a kind of thing. Home is the conventional exception.

### Navigation spec

| Surface | What goes there | Rule |
|---|---|---|
| Primary (6) | Home, My Tasks, Projects, Reports, Docs & Files, Team | Daily items first (Home, My Tasks, Projects), weekly ones next (Reports, Docs & Files), and Team last, directly above "Invite teammates" so the two sit together. Items at the end of a list are also remembered better than items in the middle. |
| Top of sidebar | Workspace menu, Search, optional + New | The workspace menu holds whatever runs the workspace. Search finds actions and settings as well as content (see section 5). |
| Sidebar footer | Invite teammates, Help, account | The utility that every user needs now and then. |
| Contextual | Projects view switcher; project tabs; Reports hub sections; Docs & Files tabs; Team tabs | Anything that belongs to one area lives inside that area, not in the global list. |
| Shortcuts | Starred projects | Per person. Personalize the shortcuts, never the map, so everyone still sees the same six items and support can give directions. |

- **Breadcrumbs** show the canonical location, whatever path got you there: Projects > Acme Rebrand > Files > logo.png, Reports > Monthly status, Team > Members.
- **Active state** highlights the primary item that is the canonical home. If you reach Team > Members from the footer link or the workspace menu, Team is highlighted.
- **Collapsed sidebar** shows icons with labels on hover, and labels are visible by default. Icon-only navigation removes the cues people navigate by.
- **Mobile web** turns the sidebar into a drawer with the same order. If there is a native app, its tab bar is Home, My Tasks, Projects, Search and More, with everything else under More.

### Where the two problem actions live

**Exporting a report**

| Path | How it works |
|---|---|
| Canonical home | Reports > any report > **Export**, in the action bar at the top right of every report, offering PDF and CSV |
| From a project | A "Report" button in the project header opens Reports filtered to that project. A PM is usually inside the project when the client asks for an update. |
| From Home | Each Insights card links to the report behind it |
| From search | "export", "download", "PDF", "CSV" and "report" find the Export action on the current report and the list of reports |
| If the plan restricts it | Show the button with a short "Available on (plan)" note instead of hiding it. A hidden feature looks like a missing one. |

**Inviting a teammate**

| Path | How it works |
|---|---|
| Canonical home | Team > Members > **Invite**, top right |
| Sidebar footer | "Invite teammates", visible to everyone |
| Assigning work | The assignee picker ends with "Not listed? Invite by email". A PM usually discovers that someone is missing at the moment they try to assign them a task, so that is where the cue belongs. |
| Inside a project | People tab > "Add people" adds existing members or invites a new one |
| Admin paths | Workspace menu > Members and permissions, and Billing's seat count > "Manage members". Both open Team > Members. |
| From search | "invite", "add user", "add member", "new user" and "seat" |
| Non-admins | Show the action to everyone. If a PM can't invite directly, the same flow sends the request to an admin. This is an open product question (section 6). |

Every path opens the same invite flow and the same member list, and none of them is a copy. If the product has guest access, the flow should first ask whether this is a teammate or a guest (a client or a freelancer), because agency PMs regularly add both, not just staff.

### Page template rules

| Template | Rule |
|---|---|
| report | Every report, prebuilt or custom, has the same action bar: Export (PDF, CSV), Share and, if offered, Schedule. Export never goes in an overflow menu. Filters for project, client and date range sit above the chart. |
| member-list | Invite is the primary button in the header. Each row shows name, role, groups and status (active, invited, guest). Admins see role changes and removal on this same page, not on a separate admin copy. |
| project-list, task-list | The view switcher (List, Timeline, Calendar) remembers each person's last choice, so daily Timeline users land on Timeline. |

### URL rules

I don't know the real routes, so the paths below are illustrative. The rules apply either way.

- **One route per destination.** Views and filters go in the query string: `/projects?view=timeline`, `/my-tasks?view=calendar`, `/reports?project=482`.
- **Format:** lowercase kebab-case, no file extensions, and one trailing-slash rule, enforced.
- **Objects use a stable ID plus a readable slug:** `/projects/482-acme-rebrand`. The ID resolves the page, so renaming a project never breaks a link, and the old slug redirects to the new one.
- **Paths mirror the new sidebar** where something moved: `/docs/wiki`, `/docs/files`, `/team/members`, `/team/groups`. Routes whose destination didn't change keep their path, to avoid needless churn.
- **Every moved route gets a permanent 301,** including deep links such as `/people/<id>` to `/team/members/<id>`. See section 5.

## 5. Migration

### Old to new, all 18 items

Every one of the 18 items gets exactly one new home. Nothing ends up in an "Other" or "More" bucket on desktop. The old routes are assumed.

| # | Old item | New home | Change | Old route | New route (301) |
|---|---|---|---|---|---|
| 1 | Dashboard | Home | Renamed | `/dashboard` | `/home` |
| 2 | My Tasks | My Tasks | Gains a Calendar view | `/my-tasks` | unchanged |
| 3 | Projects | Projects | Gains Timeline and Calendar views and project tabs | `/projects` | unchanged |
| 4 | Timeline | Projects, Timeline view | Primary item becomes a view | `/timeline` | `/projects?view=timeline` |
| 5 | Calendar | Projects, Calendar view (and My Tasks) | Primary item becomes a view | `/calendar` | `/projects?view=calendar`, or `/my-tasks?view=calendar` if it only showed the user's own tasks |
| 6 | Reports | Reports | Becomes the hub for all reports | `/reports` | unchanged |
| 7 | Analytics | Reports (charts in each report; builder under New report) | Merged | `/analytics`, `/analytics/<id>` | `/reports`, `/reports/<id>` |
| 8 | Insights | Reports, Insights section; preview on Home | Merged | `/insights` | `/reports` |
| 9 | Files | Docs & Files, Files tab | Grouped | `/files` | `/docs/files` |
| 10 | Docs | Docs & Files, Docs tab | Grouped | `/docs` | unchanged |
| 11 | Wiki | Docs & Files, Wiki tab | Grouped | `/wiki`, `/wiki/<page>` | `/docs/wiki`, `/docs/wiki/<page>` |
| 12 | Team | Team, Groups tab | Merged | `/team`, `/team/<id>` | `/team` (opens Members), `/team/groups/<id>` |
| 13 | People | Team, Members tab | Merged | `/people`, `/people/<id>` | `/team/members`, `/team/members/<id>` |
| 14 | Integrations | Workspace menu | Leaves the sidebar | `/integrations` | unchanged |
| 15 | Billing | Workspace menu | Leaves the sidebar | `/billing` | unchanged |
| 16 | Settings | Workspace menu (workspace settings); account menu (personal settings) | Leaves the sidebar; split if it mixes both today | `/settings` | unchanged |
| 17 | Help | Help menu | Leaves the sidebar | external | unchanged |
| 18 | What's New | Help menu, with an unread dot | Leaves the sidebar | `/whats-new` | unchanged |

### Release steps

1. **Redirects.** Add a 301 for every moved route, with pattern rules for deep links. Before release, check the redirect list for chains and loops.
2. **Search synonyms.** Old labels keep working in search. "analytics", "insights", "people", "wiki", "timeline", "calendar", "dashboard", "billing", "integrations" and "changelog" each find their new home. This is the cheapest way to carry existing users' habits across.
3. **Help content and support macros, in the same release.** Update every help article, screenshot, onboarding email, product tour and support macro that names an old label. Teams usually skip this step, and it is how a new structure decays: someone reads "go to People" in an article, and the label no longer exists.
4. **A one-time note for existing users.** On their first visit after the change, show a dismissible "What moved" note: Analytics and Insights are now in Reports, People is now Team > Members, and Timeline and Calendar are views in Projects.
5. **Staged rollout.** Release to a share of workspaces first, and compare the two ticket rates against the workspaces that haven't changed yet.

## 6. Assumptions and open questions

### What I assumed each item contains

| Item | Assumed to be |
|---|---|
| Dashboard | An overview of activity across projects |
| My Tasks | Tasks assigned to me, across projects |
| Projects | The project list; each project holds its tasks |
| Timeline | A Gantt-style view of dates across projects |
| Calendar | Task due dates and milestones across projects on a calendar |
| Reports | Prebuilt reports (status, time, budget), probably where export lives today |
| Analytics | Charts, or a custom chart builder, over the same data |
| Insights | Automated highlights such as projects at risk, possibly AI-generated |
| Files | Uploaded attachments across projects |
| Docs | Written documents such as briefs and plans |
| Wiki | The agency's internal knowledge base and processes |
| Team | Sub-teams or groups (Design, Dev), or a workload view |
| People | The directory of individual users |
| Integrations, Billing, Settings | Workspace administration, with Settings possibly mixing personal and workspace options |
| Help, What's New | The help centre and the product changelog |

### Other assumptions

- Most users are PMs. Admins (owners or ops leads) are a minority, and many PMs may not be admins.
- Desktop web is the main surface.
- No large new area is planned for the next year. If one is, section 8 says where likely additions would go.
- The two ticket themes are the main findability complaints. I have not seen ticket volumes.

### Open questions for the team

1. Is Invite hidden from non-admins, and how many PMs are non-admins?
2. Where is Export today: on Reports, Analytics, Insights or several of them? Is it inside an overflow menu, or limited to some plans?
3. How do Reports, Analytics and Insights actually differ as built? Is Insights a strategic AI feature the business wants visible? If so, its preview on Home is where people will see it.
4. What is "Team" as built: sub-teams, workload, or something else? Where should team workload and capacity live? (Tree-test task 8 is designed to settle this.)
5. Does the product treat clients as an entity? If so, client becomes a filter on Projects and Reports, because agencies report per client.
6. Does Settings mix personal and workspace settings today?
7. Is there guest access for clients and freelancers?
8. Is there a native mobile app?
9. Who owns Insights and What's New, and will they accept losing a primary slot?

## 7. How to validate it

### 7.1 Before building: one or two days, no recruiting

- **Read the last 50 tickets in each theme.** Note the words people used, where they say they looked first, whether they were admins, and their plan. Their words should confirm or replace the labels "Reports" and "Team".
- **Pull 90 days of usage for each sidebar item** (unique users per week). Items few people use are evidence for moving them. Any item that most PMs use daily but this proposal demotes needs a closer look; Timeline is the likely one.
- **Pull search logs** for export and invite queries, and for searches started from Reports, Analytics, Insights, Team and People. A search started on one of those pages means the page didn't answer the question.
- **Check the hidden-action hypothesis** in section 2, problem 6: overflow menus, plan gates and admin-only buttons.
- **Tag both ticket themes in the help desk now,** so there is a baseline to compare against after launch.

### 7.2 Tree test

Test the text-only hierarchy, with no visual design. Run the same tasks on the current 18-item tree and on the proposed tree, so there is a baseline. Show the menus as top-level nodes ("Workspace menu", "Help menu", "Your account"), since a tree test can't show their placement.

**Participants:** 30 to 50 project managers at agencies of 10 to 50 staff. About a third should never have used the product, to test whether a newcomer can predict the labels; the rest should be current customers. Existing users will do better on the current tree out of habit, so report the newcomers' results separately.

**Tasks.** Each task is written in the participant's words and avoids the target label.

| # | Task | Correct answers | Target success |
|---|---|---|---|
| 1 | Your client wants last month's status update as a PDF before Friday's call. Where would you go to get it? | Reports (any report); Projects > the project (Report button) | 80% |
| 2 | A freelance designer joins the Acme rebrand next week. Where would you go to give them access? | Team > Members; Projects > Acme > People | 80% |
| 3 | A new account manager has started at the agency and needs to be able to log in. Where would you set that up? | Team > Members; Workspace menu > Members and permissions | 80% |
| 4 | You want to see what's due from you tomorrow. | My Tasks | 80% |
| 5 | You want to see which of your projects overlap in March. | Projects (Timeline view) | 70% |
| 6 | You need the client onboarding checklist your ops lead wrote for every new client. | Docs & Files > Wiki or Docs | 70% |
| 7 | The client sent a logo in the Acme project last week and you need it again. | Projects > Acme > Files; Docs & Files > Files | 70% |
| 8 | Your boss asks whether the team has room for another project next month. | Reports (workload report) | 70%; this task decides where workload lives |
| 9 | You want project updates to post into your agency's Slack. | Workspace menu > Integrations | 70% |
| 10 | Your finance person needs last month's invoice for this software. | Workspace menu > Billing | 70% |
| 11 | You heard a new feature came out last week and want to read about it. | Help menu > What's New | 70% |
| 12 | When you sign in, you want a quick view of anything at risk across your projects. | Home; Reports > Insights | 70% |

**Targets:** at least 80% success on tasks 1 to 4 (the two ticket themes and daily work) and at least 70% on the rest. Directness should be no more than 1.5 times the shortest path.

**Reading the results:**
- If task 8 splits between Reports and Team, add a Workload link on the Team page that points to the report, rather than building a second workload page.
- If tasks 6 and 7 fail, test alternative labels for Docs & Files in a second round ("Docs", "Docs & Wiki"), changing one label at a time.
- If task 12 sends many people to Reports instead of Home, the Home label is working as intended and the Insights preview is a bonus.

### 7.3 First-click test on mockups

A tree test only sees labels, so it can't test the placements that matter most here: Export in the report action bar, the "Invite teammates" footer link, and "Invite by email" in the assignee picker. Show 20 or more agency PMs static screens of a report, a project and the task assignee picker. Ask them tasks 1 and 2 and record their first click. Target: at least 80% first-click success.

### 7.4 After launch, watch these

- **Tickets** about finding export or invite, per 100 active workspaces per week, against the baseline from 7.1. Set the target once the baseline exists.
- **Invites** sent per new workspace in its first 14 days, and which entry point each came from. An entry point almost nobody uses is a candidate to cut.
- **Exports** per active workspace, and the share reached from the project header compared with the Reports hub.
- **Search:** the zero-result rate for export and invite terms, and how often searches start from the Reports and Team pages.
- **Hits on old routes** in the redirect logs, to show how fast old habits fade and which help articles still link to old routes.
- **Weekly use of each primary item,** to check that none of the six has gone quiet.

## 8. Governance

- **Owner.** One named person, a product designer or PM, owns the sidebar. Every change goes through them.
- **Inclusion rule for a new primary item.** It must be a destination people come back to at least weekly, not an action, a view of something already there, a setting or an announcement. It must hold a kind of thing none of the six already holds, be named in users' words, and pass a tree-test task at 70% or better alongside the existing six. The primary list stays at 7 or fewer, so an eighth item means merging or moving one first.
- **Every new feature spec states its home in this tree before design starts.** Most should land as a tab, view, report or setting inside an existing item.
- **Likely next features and their homes:**
  - **Time tracking:** logging time in My Tasks and project tasks, and time reports in Reports. It becomes a primary "Time" item, the seventh, only if it turns into a daily destination.
  - **Resource or capacity planning:** Reports > Workload, linked from Team.
  - **A client portal or client entity:** a client filter on Projects and Reports, with guests managed in Team.
- **Quarterly review.** Check weekly use per item, search queries with no matching destination, and "can't find" ticket tags, and confirm that no feature has crept back into the primary list.

## 9. Where this proposal is weakest

I scored the proposal against a twelve-point information architecture rubric (1 to 5 per criterion, with N/A where a criterion doesn't apply). It averages about 3.8 across the eleven scored criteria, and none scores below 2.

- **Grounded in evidence: 2.** I have only the labels and two ticket themes. The research in 7.1 (the tickets, usage data and search logs) would lift this to 3 or 4.
- **Matches the users' model: 3.** The labels follow the tickets' wording, but there is no card sort or interview data yet. The tree test is the check.
- **URL rules: 3.** The rules are sound, but the routes are assumed and need checking against the real router.
- **Content model: N/A.** This is a navigation change, so section 4 gives page template rules instead.

The strongest parts are the shape (6 items, never more than two levels below), the single home for every item including both problem actions, and a validation plan that runs against the current tree as a baseline instead of relying on invented results.
