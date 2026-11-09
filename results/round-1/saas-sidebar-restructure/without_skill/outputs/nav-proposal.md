# Sidebar navigation proposal

## Summary

The sidebar should go from 18 items of equal weight to **6 main destinations, a short list of starred projects, and a small utility area** at the bottom. Three groups of overlapping items become one item each:

- Reports, Analytics and Insights become **Reports**.
- Team and People become **Team**.
- Files, Docs and Wiki become **Docs & Files**.

Timeline and Calendar become views inside Projects and My Tasks instead of separate places. Settings, Integrations and Billing move into a workspace menu, and Help and What's New share one help menu.

The two support problems get a direct fix as well as the restructure. Export becomes a visible button on every report and list. Invite gets a permanent button and one Team page. After this, neither task depends on the user guessing which sidebar item holds it. The button fixes don't depend on the new structure, so they can ship first, within days.

## The proposed sidebar

```
 [ Search or jump to...        Cmd K ]

   Home
   My Tasks
   Projects
   Docs & Files
   Reports
   Team

   STARRED                          (collapsible)
     Acme rebrand
     Northwind Q4 campaign
     + Star a project

 ---------------------------------
   [ + Invite people ]
   ?  Help & what's new             (dot when a release note is unread)
   [ Agency name  v ]               Settings, Integrations, Billing,
                                    Your profile, Sign out
```

That leaves 6 permanent destinations, plus 3 utility controls the user only notices when they need them.

## What is wrong with the current sidebar

**1. Eighteen items with no grouping.** Nothing shows which items matter. My Tasks, used every hour, gets the same weight as Billing, which one person opens once a month. People don't read a long flat list. They scan the top few items and jump to the bottom, so items in the middle (Insights, Files, Docs, Wiki, Team, People) get the least attention.

**2. Three sets of near-synonyms.** This is the main cause of both kinds of ticket.
- *Reports, Analytics, Insights.* A PM who wants to "export a report" has three doors that all look right, and no label says which one holds export. If they pick wrong, they assume the feature doesn't exist and file a ticket.
- *Team, People.* The same problem for invites. Each looks like the right place, and the user can't predict which one has the Invite button.
- *Files, Docs, Wiki.* Three places a document might live, with no rule the user could guess.

**3. Views listed as places.** Timeline and Calendar are ways of looking at tasks and projects. They don't hold different data. Putting them at the top level suggests they do, and adds two items that duplicate Projects and My Tasks.

**4. Actions hidden behind places.** Export and invite are actions. When a user looks for an action, they scan the sidebar for a place that might contain it, and in this sidebar several places could. No sidebar label can fix that alone. The action has to be visible where the need comes up.

**5. Admin and support items mixed in with daily work.** Integrations, Billing, Settings, Help and What's New are 5 of the 18 items (28%). Most users rarely open them, and they are always on screen.

## Who this is designed for

The main users are project managers at agencies with 10 to 50 staff. Their week probably looks something like this (assumed, not measured):

- They run several client projects at once and jump between them all day.
- They report status, hours and budget to clients every week or month, often as a PDF or a spreadsheet. **For them, export is a core part of the job.**
- They bring people in often: new hires, freelancers, contractors, and sometimes client stakeholders who need limited access.
- They are often *not* the workspace owner or billing admin. In a 10-person agency, though, the PM may also be the owner.

The agency's designers, writers and developers also use the sidebar, mostly for My Tasks. The structure has to stay simple for them too, which is another reason to move the admin items out of the way.

## The proposed structure in detail

### Main destinations

| Item | What it contains | Replaces |
| --- | --- | --- |
| **Home** | Your overview: due and overdue work, projects at risk, insight cards, recent activity. | Dashboard; Insights (as cards) |
| **My Tasks** | Work assigned to you, with List and Calendar views. | My Tasks; the personal side of Calendar |
| **Projects** | All projects, with List, Timeline and Calendar views, and filtering or grouping by client. Each project keeps its own tabs (Tasks, Timeline, Calendar, Docs, Files, Reports). | Projects, Timeline, Calendar |
| **Docs & Files** | Docs, with the team wiki as a pinned shared space, and Files, which lists everything uploaded across all projects. | Docs, Wiki, Files |
| **Reports** | Every report and chart in one list, grouped by what it's for (project status, budget and time, team workload), each with an Export button. | Reports, Analytics, Insights (full list) |
| **Team** | Members, guests, groups and workload. "Invite people" is the main button on the page. | Team, People |

**Order.** The order follows how often a PM probably uses each item: daily first (Home, My Tasks, Projects), then weekly (Docs & Files, Reports), then occasional (Team). Re-order it using real click data once you have it.

**Why "Reports" and not "Analytics" or "Insights".** The tickets say "export a report", so that is the word your users already use. Analytics charts and Insights findings become report types in the same list, grouped by job rather than by which feature produced them. Insight cards also appear on Home, where people will actually see them.

**Why "Team" and not "People".** The tickets say "invite a teammate", and Team is also the natural home for workload and groups. Either label would work on its own. The mistake is having both.

**Why rename Dashboard to Home.** Analytics charts will now sit inside Reports, and users will call those dashboards. "Home" can't be confused with them. The rename is a nice-to-have. If it's expensive in docs or muscle memory, keep "Dashboard", because the merges matter more.

### Starred projects

An agency PM's most common destination is one particular client project. Today that takes three steps: open Projects, find the project, click it. A short starred list, chosen by the user, collapsible, and showing about 7 projects, makes it one click. When the list is empty it shows "Star a project to pin it here", so the feature explains itself.

### Utility area at the bottom

- **Invite people (button).** Always visible to anyone who is allowed to invite. For anyone who isn't, it opens "Request an invite", which notifies an admin. Invite is the action behind both a support problem and workspace growth, so it earns a permanent slot. A button that's hidden from people without permission makes them think the feature doesn't exist, and that leads to tickets.
- **Help & what's new (one menu).** Contains the help center, contact support, keyboard shortcuts and What's New. A dot on the icon shows when there's an unread release note. What's New only matters when there's something new, and the dot covers that.
- **Workspace menu.** Settings, Integrations, Billing (owners and admins only), your profile, and sign out. Integrations also appear where people need them. For example, "Connect Slack" sits in a project's notification settings, and "Import from..." appears when creating a project.

### Search that finds actions

Add a Cmd K bar that searches actions, not just content. Typing "export", "invite", "billing" or "new project" should take the user straight to that action. No sidebar suits every user. A search that finds actions protects you for the users whose mental model doesn't match the structure. If global search already exists but only searches content, extending it to actions is the cheapest change in this proposal.

## Where every current item goes

| Current item | New location | How users reach it |
| --- | --- | --- |
| Dashboard | Home | Main sidebar |
| My Tasks | My Tasks | Main sidebar, unchanged |
| Projects | Projects | Main sidebar, unchanged |
| Timeline | Projects > Timeline view, and inside each project | View switcher at the top of Projects |
| Calendar | Projects > Calendar view; My Tasks > Calendar view | View switcher in both |
| Reports | Reports | Main sidebar |
| Analytics | Reports (charts become report types) | Reports list, grouped by purpose |
| Insights | Insight cards on Home, plus the full list in Reports | Home and Reports |
| Files | Docs & Files > Files | Main sidebar; each project's Files tab |
| Docs | Docs & Files > Docs | Main sidebar; each project's Docs tab |
| Wiki | Docs & Files > Team wiki (pinned space) | Main sidebar |
| Team | Team | Main sidebar |
| People | Team > Members | Main sidebar |
| Integrations | Workspace menu > Settings > Integrations | Workspace menu, and wherever a connection is needed |
| Billing | Workspace menu > Settings > Billing | Workspace menu (owners and admins only) |
| Settings | Workspace menu > Settings | Workspace menu |
| Help | Help & what's new menu | Bottom of the sidebar |
| What's New | Help & what's new menu | Bottom of the sidebar, with an unread dot |

Nothing is removed. Every current page still exists and has a home.

## Fixing the two support problems

### "Where do I export a report?"

**Why it fails today.** There are three sidebar items that could hold it. Export probably sits in an overflow menu, or exists on only one of the three pages (assumed).

**Changes:**
1. One Reports item. Everything that produces a chart or a table lives there.
2. Every report has a visible **Export** button in its header, not inside a "..." menu. The options are PDF (formatted for a client), CSV or Excel, and, if the product supports it, a scheduled export emailed weekly or monthly.
3. Every list view (all projects, a project's tasks, team workload) has an "Export CSV" option, because PMs often think "export this list" rather than "export a report".
4. Each project has a Reports tab with the same Export button, so a PM working inside a client project doesn't have to leave it.
5. Typing "export" in the search bar lists the reports that can be exported.
6. The help article is titled in the user's own words: "Export a report".

### "Where do I invite a teammate?"

**Why it fails today.** Team and People both look like the right place. The invite action probably lives in Settings or under one of the two, and people who aren't admins may not see it at all (assumed).

**Changes:**
1. One Team page, with **Invite people** as its main button.
2. A permanent "Invite people" button at the bottom of the sidebar.
3. Invites from wherever the need comes up. When assigning a task or adding project members, typing an email address that isn't in the workspace offers "Invite name@agency.com".
4. One invite dialog that asks for the role first: **Member** for staff, or **Guest** for freelancers and clients, limited to the projects you choose. Agencies bring in freelancers and clients all the time, so they should get the same flow, not separate pages.
5. Permission-aware: people who can't invite see "Request an invite", not a missing button.
6. Typing "invite" in the search bar opens the invite dialog.

## Assumptions

No usage data, screenshots or ticket text came with the request, so this proposal rests on these assumptions. Each one should be checked.

- **Reports, Analytics and Insights are separate features today.** Reports are saved tables that can be exported, Analytics are charts and dashboards, and Insights are automatic findings, possibly AI-generated. If Insights is a large, separately marketed feature, it could stay as a tab inside Reports instead of becoming report types.
- **Team means groups, departments and workload, and People is the user directory**, including guests. The invite action lives on one of them or in Settings.
- **Wiki is shared knowledge for the whole workspace** (processes, how-tos), **and Docs are project documents.**
- **Dashboard, My Tasks and Projects get the most traffic,** and Billing, Integrations and What's New get the least.
- **Permissions:** most PMs can invite people but can't see billing. Some PMs, especially at the smaller agencies, are also the owner.
- **The product is a desktop web app.** Mobile navigation is out of scope here, though the same six destinations would work as a bottom tab bar plus a "More" tab.
- **The suggested thresholds** in the risks and measurement sections are starting points, not established benchmarks.

## Alternatives considered

**A. Keep all 18 items and add group headings** (Work, Insights, Knowledge, Workspace). This is the cheapest option, and it helps scanning. But it leaves all three groups of near-synonyms in place, and those are what cause the tickets. It is acceptable as a stopgap while the real change is tested, and not as the answer.

**B. Group by workflow phase** (Plan, Track, Report, Admin). Phase names are abstract. Users look for nouns like "reports" and "team", not phases, and some items, such as Docs, belong to every phase.

**C. Put everything inside projects** and keep only a minimal global sidebar. This works for tools built around one project at a time. Agency PMs need views across projects: every deadline this week, workload across all clients, reporting across the portfolio. So Reports and a cross-project Timeline have to stay global.

## Risks and how to handle them

- **Heavy users of Timeline lose their one-click entry.** Some PMs use the cross-project timeline for planning people's time. Suggested rule: if analytics show Timeline is a top-5 destination, or more than about 30% of PMs use it weekly, keep it as a main item called **Schedule** (timeline and calendar with a toggle). That makes seven main items, which is still fine.
- **Analytics or Insights may be a paid add-on.** Merging the sidebar items doesn't have to merge the pricing. Locked report types can show inside Reports with an upgrade prompt, which probably makes the add-on easier to discover than a separate item that people skip.
- **Muscle memory and bookmarks.** Redirect every old URL. For 30 days, show a one-time "Timeline is now a view inside Projects" note on arrival. Announce the change in What's New and update help center screenshots.
- **The Docs & Files merge may be wrong** if the Wiki is a heavily used knowledge base people think of as separate. The tree test below covers this. If it fails, keep Wiki as its own item and merge only Docs and Files.

## How to check it before building

1. **Baseline (4 weeks).** Tag incoming tickets as "can't find export", "can't find invite" and "can't find other". Pull click counts for each sidebar item and the top search queries.
2. **Tree test** (unmoderated, for example Treejack or Maze). Test the current structure against the proposed one with 30 to 50 agency PMs each, recruited from your customers. Suggested tasks:
   - "Your client wants last month's project status as a PDF. Where do you go?"
   - "A new designer starts Monday. Where do you add them?"
   - "A freelance copywriter needs access to one project only. Where do you set that up?"
   - "Find the agency's onboarding checklist."
   - "See every deadline across all projects next week."
   - "Connect the workspace to Slack."
   - "Update the card the agency pays with."
   - "Check who on the team is overloaded this week."

   Suggested bar: at least 80% success on the export and invite tasks, and no task more than 10 points worse than with the current structure.
3. **First-click test on a mock-up.** A tree test can't show buttons, so check the placement of the Invite button and the Export button separately.
4. **Open card sort** (optional), only if the Docs, Files and Wiki merge is disputed.

## How to measure it after launch

Roll it out behind a feature flag to 10 to 20% of workspaces first, and compare those against the rest:

- Export and invite tickets per 100 active workspaces. A suggested target is a 50% drop within 8 weeks.
- Time from creating a workspace to inviting the second member, and the share of new workspaces with 3 or more members by day 7.
- Exports per active PM per month.
- Traffic through the old-URL redirects. It should fall steadily as people learn the new places.
- Searches that return no results, for signs that something is still hard to find.

## Rollout

**Phase 1: the button fixes, which don't need the restructure.** A visible Export button on every report, the Invite button in the sidebar, invite-by-email when assigning work, and actions in search. These should cut tickets on their own, and they give you a cleaner baseline for judging the sidebar change.

**Phase 2: the sidebar restructure behind a flag,** with redirects and the one-time "moved" notes, checked against the tree test results.

**Phase 3: cleanup.** Remove the "moved" notes, update all help articles and screenshots, and re-order the main items using real click data.
