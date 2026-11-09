# Sidebar restructure proposal

**Status:** a draft for your team to react to. I worked only from the 18 labels, the two ticket themes and the audience you described. I have not seen the product, the tickets or any usage data, so every statement about what an item contains or how often it is used is an assumption, listed in section 6. No research has been run: the numbers in section 7 are targets, not results.

## 1. Summary

Cut the sidebar from 18 items to 8: six destinations (Dashboard, My Tasks, Projects, Reports, Docs & Files, Team) and two utility items pinned to the bottom (Settings, Help). All 18 keep a home, and ten leave the top level.

The main reason is that both failing tasks sit inside sets of near-synonyms. A report has three possible doors (Reports, Analytics, Insights) and a teammate has two (Team, People). Merging them gives each task one door.

The sidebar alone will not fix this. Exporting and inviting are actions, not places, so the proposal also puts an Export button on every report and an Invite teammate button on the Team page. Those two buttons can ship before the restructure does.

## 2. What exists now

I assumed one flat level with no headings. Read in order, the 18 labels already fall into seven implied groups, so reordering them would not help.

| Implied group | Items | Count | Problem |
|---|---|---|---|
| Personal start | Dashboard, My Tasks | 2 | None apparent |
| Project work | Projects, Timeline, Calendar | 3 | Timeline and Calendar look like date views of projects, listed as if they were places |
| Reporting | Reports, Analytics, Insights | 3 | Near-synonyms, and the first failing task |
| Knowledge | Files, Docs, Wiki | 3 | Overlapping: a newcomer cannot predict which one holds a given document |
| People | Team, People | 2 | Near-synonyms, and the second failing task |
| Administration | Integrations, Billing, Settings | 3 | Setup items sit at the same level as project work |
| Product support | Help, What's New | 2 | Utility items taking primary space |
| **Total** | | **18** | |

**Why the two tasks fail**

- **Labels are the main cause.** Eight of the 18 items sit in three near-synonym sets, and both failing tasks are inside those sets. Nothing on screen says how Reports differs from Analytics, or Team from People.
- **Scent stops at the sidebar.** "Export" and "invite" are verbs, and a sidebar lists nouns. Inviting also pulls people towards Settings, and towards Billing if seats are paid, so it may have as many as four doors.
- **Breadth is the problem, not depth.** Nothing is buried, but 18 choices at one level is three times the upper end of the usual 3 to 6 primary destinations. The labels also mix kinds of thing: objects (Projects, Files), views (Timeline, Calendar), activities (Analytics) and product news (What's New).
- **Search is unknown.** If searching "export" returns nothing today, that is a cheap fix regardless of the structure.
- **The cause may not be navigation at all.** If only admins see the invite control, or Export depends on plan, then project managers without those rights will never find it however good the sidebar is. Check who is filing these tickets before anything is built.

## 3. The options

| | A. One door per job (recommended) | B. Group in place | C. Project-first |
|---|---|---|---|
| Organized by | Object of work | Kind of job, under headings | Scope: global, or inside one project |
| Sidebar lines | 8 | 24 (18 items plus 6 headings) | 6 global, plus a 6-tab project rail |
| Doors to a report | 1 | 3, now adjacent | 2 (the project's Reports tab, or cross-project reports under Company) |
| Doors to invite | 1 | 2, now adjacent | 1, inside Settings |
| Serves best | Newcomers, and anyone who knows the noun they want | Existing users who know the current names | Project managers who work one client at a time |
| Cost | Moderate: sidebar, tabbed hubs, two page merges (Analytics with Insights, Team with People), redirects, help content | Lowest: sidebar only | Highest: a new project scope model and rail |
| Where it strains | Timeline and Calendar lose top-level visibility; "Docs & Files" is a compound label; existing users have to relearn | Leaves the near-synonyms in place, and the sidebar gets longer | Cross-client questions, probably common at agencies, have no natural home; needs a vague "Company" item; invite is out of sight |

**Option B** groups the current items as My work (Dashboard, My Tasks), Delivery (Projects, Timeline, Calendar), Reporting (Reports, Analytics, Insights), Knowledge (Docs, Wiki, Files), Workspace (Team, People, Integrations, Billing, Settings) and Support (Help, What's New).

**Option C** keeps Dashboard, My Tasks, Projects, Company (cross-project reports including Analytics and Insights, plus Wiki), Settings (Team merged with People, Integrations, Billing) and Help (What's New) globally, with Tasks, Timeline, Calendar, Reports, Docs and Files on a rail inside each project.

**I recommend A** because it is the only option that gives both failing tasks a single door without rebuilding how the product is scoped. B is a reasonable stopgap if the page merges cannot happen this quarter, but people would still have to choose between Reports, Analytics and Insights. C is worth revisiting if research shows your project managers really do work one client at a time.

## 4. The proposal

```
SIDEBAR, PRIMARY (6)
Dashboard                      overview page
My Tasks                       task list
Projects                       list with view switcher
├── List (default)             view
├── Timeline                   view             moved from top level
├── Calendar                   view             moved from top level
└── <a project>                project page     tabs: see Contextual below
Reports                        hub with tabs    absorbs Analytics, Insights
├── All reports (default)      filterable list  was Reports
│   └── <a report>             report page      Export button in the header
└── Trends                     chart page       was Analytics and Insights; Export button in the header
Docs & Files                   hub with tabs    renamed from Docs; absorbs Wiki, Files
├── Docs (default)             list
├── Wiki                       list             moved from top level
└── Files                      filterable list  moved from top level
Team                           people list      absorbs People; Invite teammate button in the header

SIDEBAR, UTILITY (2, pinned to the bottom)
Settings                       settings index
├── General                    settings page    everything already in Settings
├── Integrations               settings page    moved from top level
├── Billing                    settings page    moved from top level
└── Team                       link only        goes to the Team page; not a second page
Help                           menu
├── Help center                help site        was Help
└── What's New                 feed             moved from top level; unread dot on Help
```

**One home for each problem task**

| Task | Canonical home | Traced path | Other ways in, all leading to the same place |
|---|---|---|---|
| Export a report | Export button in the header of every report and of Trends, always in the same position | Reports, open the report, Export: three clicks to the format choice (All reports is the default tab, so it costs none) | Export in each row's menu on All reports; the Reports tab inside a project; Dashboard widgets link to the report behind them; search terms "export", "download", "PDF", "CSV" |
| Invite a teammate | Invite teammate button in the header of the Team page | Team, Invite teammate: two clicks to the form | The Team link in Settings; Invite teammate in the New menu; "Invite someone new" at the bottom of the assignee picker, where the need is likely to come up; search terms "invite", "add user", "add member", "seat" |

The two header buttons are written out in full, never icon-only and never tucked into an overflow menu. If a role or plan cannot use one, show it anyway and say who can: "Only admins can invite. Your admin is <name>."

**Navigation spec**

| Primary item | Why it earns the slot | Why this word |
|---|---|---|
| Dashboard | Overview and, I assume, the landing screen | Familiar; no evidence it is a problem, so renaming it would be churn |
| My Tasks | The only item scoped to one person | Unchanged, for the same reason |
| Projects | The core object of the product, and now the home of its date views | Unchanged |
| Reports | First failing task, and probably how agency PMs show progress to clients | The tickets' own word. Analytics and Insights do not say what you get |
| Docs & Files | Three overlapping items become one door | One word loses scent: "Docs" hides uploads, "Files" hides writing, and "Knowledge" or "Library" would be vaguer than either |
| Team | Second failing task, and the one home for who is in the workspace | The tickets' own word ("teammate") |

At the second level, "All reports" says it is the full list and "Trends" describes charts over time. Treat Trends as a placeholder until someone confirms what Analytics and Insights actually show.

- **Utility:** Settings and Help pinned to the bottom. Search and a New button at the top of the sidebar, assuming both exist or can be added. Profile and sign out stay in the account menu.
- **Contextual:** inside a project, tabs for Tasks, Timeline, Calendar, Reports, Docs and Files open those pages already filtered to that project. They are filtered views, not second homes. Breadcrumbs follow the tree: Reports > the report's name.
- **Filters:** Projects, Reports and Files filter by client (if the product has clients), project, owner and date. This stops those lists from outgrowing the structure at ten times the content, without adding tabs.
- **Active state:** highlight the primary item and the current tab. A shortcut highlights the canonical home, so Settings > Team highlights Team.
- **Mobile:** below tablet width the sidebar becomes a drawer with the same 8 items. A native app, if there is one, gets at most 5 tabs: Dashboard, My Tasks, Projects, Reports, More (Docs & Files, Team, Settings, Help).
- **Inclusion rule for a new top-level item:** it must be a destination, not an action or a view. It must serve a top task for agency PMs, shown by usage or support data. It cannot work as a tab in an existing item. If there are already six, it replaces one.
- **Ownership:** one named person approves sidebar changes, and reviews the sidebar against top search terms each quarter.

**Flagged placements (least-bad homes, each with a separate recommendation)**

- **Insights under Trends** is my least certain placement. If it is only automated callouts, retire it as a named destination and show the callouts on Trends and the Dashboard.
- **Wiki beside Docs** keeps the overlap, one level down. Separately, I would merge Wiki into Docs as a company-wide space, which is product work.
- **Timeline and Calendar under Projects** may be costly if they turn out to be heavily used. If usage data says so, promote a single "Schedule" item with both views. That makes seven primary items, one over the default, so it should be a decision someone makes on evidence.
- **What's New under Help** is an imperfect fit, since news is not help. It is the closest thing to a home, and the unread dot keeps it noticed.

## 5. Migration

1. **Ship the two buttons first, on their own.** They do not depend on the restructure, and shipping them separately shows how much of the ticket volume they remove before the sidebar changes anything.
2. **Tree-test the draft** (section 7) and revise it.
3. **Ship the sidebar in one release, together with:**
   - A redirect from each old in-app route to its new home, following the appendix. I have not seen your routes, so confirm that your router and any email deep links can do this.
   - Old labels kept as search synonyms: "Analytics" finds Reports > Trends, "People" finds Team, "Wiki" finds Docs & Files > Wiki.
   - Every help article, onboarding tour and screenshot rewritten to the new names in the same release. Teams skip this step, and skipping it would recreate these tickets.
   - A one-time, dismissible note showing where the moved items went.

The full old-to-new mapping is in the appendix.

## 6. Assumptions and open questions

| Assumption | If it is wrong |
|---|---|
| The sidebar is flat, with no headings or nesting | The diagnosis of breadth softens; the near-synonym finding stands |
| Reports are saved, exportable reports; Analytics is interactive charts; Insights is automated callouts | If Insights is a distinct product or a strategic bet, or the two cannot share a page in the first release, ship them as separate tabs under Reports |
| Team and People hold the same roster | If Team means groups and People means individuals, keep one Team item with Members and Groups tabs |
| Docs are written per project, Wiki is company knowledge, Files are uploads | The tabs still work; the labels and the Wiki merge need rethinking |
| Timeline and Calendar are date views of project work | If Calendar is personal or holds meetings, make it a view of My Tasks |
| Integrations, Billing and What's New are probably visited less often than project work. I have no usage data | If any is a top destination or a sales driver, reconsider its place in Settings or Help |
| "Report" and "teammate" are your users' words. I have your paraphrase, not the ticket text | Change the labels to match the real wording |
| Agency PMs probably export reports to send to clients | If exports are internal, the PDF format and client filter matter less |
| Desktop web is the main surface | The mobile line in section 4 needs real design work |

**Open questions only your team can answer**

1. Where does Export sit today, and which formats does it offer?
2. Who is allowed to invite, and does Export depend on role or plan?
3. Is "client" an object in the product, and can client contacts be invited as guests? The sidebar shows no trace of clients, which is surprising for agencies. If guests exist, the Team page needs a Members and Guests split.
4. Does search exist, does it find actions, and what do its logs show?
5. Does the business need any item kept visible for strategic reasons, such as Insights or Integrations?

## 7. How to validate it

**First, read the tickets.** Pull these tickets, plus in-app search logs if you have them, and note the exact words people use, their roles and plans, and where they say they looked. It is the cheapest research available and may change the labels.

**Then tree-test** the section 4 tree as labels only, without the notes. Recruit 20 to 50 project managers from agencies of 10 to 50 staff, mixing customers and non-customers and reporting them separately, because customers carry memories of the old sidebar. Run the same tasks on today's 18-item list as a baseline. Success means choosing a correct node, first time or after backtracking. Directness target for every task: at most 1.5 times the shortest path.

| # | Task | Correct answer | Success target |
|---|---|---|---|
| 1 | A client wants last month's project status as a PDF to pass to their boss. Where do you go to get it? | Reports > All reports | 80% |
| 2 | A new designer joins on Monday and needs a login for this tool. Where do you go to set that up? | Team, or Settings > Team (same page) | 80% |
| 3 | Your agency owner asks whether client work has been finishing later this quarter than last. Where do you look? | Reports > Trends | 70% |
| 4 | You want to see anything unusual the app has spotted across your accounts this month. (Rewrite once Insights' contents are confirmed.) | Reports > Trends | 70% |
| 5 | Three client launches might overlap in the next six weeks. Where do you see them side by side, week by week? | Projects > Timeline | 70% |
| 6 | You want to see what is due on each day next week across all your clients. | Projects > Calendar | 70% |
| 7 | A client emailed a logo as a ZIP last month and someone saved it here. Where do you look? | Docs & Files > Files | 70% |
| 8 | You need to write up notes from a client call for your colleagues to read. | Docs & Files > Docs | 70% |
| 9 | You want to read how your agency runs a client kickoff, step by step. | Docs & Files > Wiki | 70% |
| 10 | You want updates from this tool to appear automatically in your agency's Slack channel. | Settings > Integrations | 70% |
| 11 | Your finance lead needs last quarter's invoice for this tool. | Settings > Billing | 70% |
| 12 | A colleague says the app added something useful last week, and you want to read about it. | Help > What's New | 70% |

If tasks 8 and 9 scatter between Docs and Wiki, that is evidence for merging them. For any failed task, look at where the wrong first clicks went, change the label or placement, and retest that task.

**Add a first-click test** on a mock-up of a report page and the Team page. A tree test only proves people reach the page; it says nothing about whether they spot Export or Invite teammate once there.

**Metrics to watch after launch.** Start tagging tickets now so there is a baseline, and set the targets once you have it. A short dip is possible while existing users relearn, so judge the change over several weeks.

- Weekly tickets tagged "can't find export" and "can't find invite"
- Share of report views that lead to a completed export
- Invites sent, and time from opening Team to sending one
- Searches for "export", "invite" and the retired labels
- First clicks in the sidebar for sessions that end in an export or invite

## Appendix: where all 18 items go

| # | Today | New home | Change | Note |
|---|---|---|---|---|
| 1 | Dashboard | Dashboard | Stays at top | |
| 2 | My Tasks | My Tasks | Stays at top | |
| 3 | Projects | Projects | Stays at top | Gains the Timeline and Calendar views |
| 4 | Timeline | Projects > Timeline | Moves under a parent | Flagged |
| 5 | Calendar | Projects > Calendar | Moves under a parent | Flagged |
| 6 | Reports | Reports > All reports | Stays at top | Becomes a hub with tabs |
| 7 | Analytics | Reports > Trends | Moves under a parent | Renamed |
| 8 | Insights | Reports > Trends | Moves under a parent | Renamed; flagged |
| 9 | Files | Docs & Files > Files | Moves under a parent | |
| 10 | Docs | Docs & Files > Docs | Stays at top, renamed | Parent is now Docs & Files |
| 11 | Wiki | Docs & Files > Wiki | Moves under a parent | Flagged |
| 12 | Team | Team | Stays at top | Absorbs People |
| 13 | People | Team | Merges | See section 6 if the two differ |
| 14 | Integrations | Settings > Integrations | Moves under a parent | |
| 15 | Billing | Settings > Billing | Moves under a parent | |
| 16 | Settings | Settings > General | Stays at top | Gains Integrations, Billing and the Team link |
| 17 | Help | Help > Help center | Stays at top | Becomes a menu |
| 18 | What's New | Help > What's New | Moves under a parent | Flagged |

Totals: 7 stay at the top, 1 stays and is renamed, 9 move under a parent and 1 merges, which makes 18. Eight remain at the top level and ten leave it.
