# Navigation spec template

The fill-in form for section 4 of `navigation-spec.md`. Leave a field out rather than pad it.

```
Primary (3 to 6): <label -> destination>, with why each earns its slot
Utility: <sign in, account, search, ...>
Footer: <groups and links>
Contextual:
  <section>: side rail of <...>; in-page contents; related links rule: <...>
  Breadcrumbs: <pattern, e.g. Home > Products > Widgets > Item>
App tab bar (if any, at most 5): <tabs>; what goes under "More"
Mobile: <how primary collapses; what stays visible; what each mega-menu becomes>
Keyboard: <focus order; how menus open and close; skip link>
Active state: <how the current location is shown>
Inclusion rule for adding a new top-level item: <the test it must pass>
```

## Before and after

| Current item | Current surface | New home | Change | Why |
|---|---|---|---|---|
| Reports | Primary | Insights > Reports | Merged | Three items for one job |
| Billing | Primary | Utility > Account | Moved | About the account, not the work |

## Canonical homes

| Task people fail at | The one home | Entry points that lead there |
|---|---|---|
| Export a report | Insights > Reports > Export | The report page's action menu |

## Hand-off to tree-tests

`tree-tests` writes the study plan and the task wording. Give it this list.

| Problem task or unsure placement | Proposed answer (path through the tree) | Top task? |
|---|---|---|
| Export a report | Insights > Reports > Export | Yes |

Targets: success at least 80% (top task) or 70% (other); path ratio at most 1.5.

## Reject these

| Anti-pattern | What it looks like | Instead |
|---|---|---|
| Org-chart navigation | Sections named after departments | Name what people came to do |
| Mystery-meat labels | "Discover", "Solutions" or "Resources" with no context | A label a newcomer could predict |
| Two competing structures | The side rail, breadcrumbs and URL each say something different | One tree, drawn on by all three |
| Phantom parents | Breadcrumbs pointing to pages that don't exist | Build the parent or drop the crumb |
| Hash navigation | Primary nav built on `/#features` anchors | Real pages with real addresses |
| A different menu for everyone | Personalised structure | One shared map, personalised shortcuts |
| A chat box instead of structure | An open-ended AI interface where options would answer faster | Menus and buttons let people act and also show what the system can do. A chat does the first slowly and the second not at all. Use it where the task really is open-ended. |

Offer several ways in. Some people know what they want and search; others explore. Browse, search, filters, related links and breadcrumbs should all lead to the same canonical home.
