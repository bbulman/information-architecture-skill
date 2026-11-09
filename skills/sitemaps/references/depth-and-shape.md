# Depth, breadth and shape

Read this when depth or breadth is contested, when comparing options, or when reviewing a tree someone else drew.

## Depth and breadth

- **Choice cost.** Decision time grows with the number of options, so very long menus slow people down. Too few options per level forces more levels. Five to nine items per level, three to four levels deep, is a sound default.
- **Keep scent over click counts.** People abandon a path when the scent goes cold, not when they hit click four. Measure success and confidence per step, not raw clicks. Dead ends and vague labels are the real cost.
- **Broad and shallow, or narrow and deep?** Broad levels work when labels are clear and scannable, because people see their target sooner. Deep levels work when each step is an obvious, small choice. Mixed is common: broad at the top, deeper inside one section.
- **Progressive disclosure.** Show the overview first and reveal detail on demand: hub pages with a few clear doors, collapsed sections, "show more", a side rail that expands. A newcomer should not be overwhelmed and an expert should not be slowed down.

## Stress tests

| Test | It fails when | Then |
|---|---|---|
| Ten times the content | A section would become a list nobody can scan | Design sub-sections or facets now, not after |
| The next larger context | The tree makes sense alone but not inside the product or business around it | Change the top level |
| The org chart | A section maps to a department rather than a task | Re-cut by what people are trying to do |
| Depth and breadth | More than 9 a level or 4 deep | Merge or flatten, or justify it by the scent of each step |
| Ways in | An item has one path, such as paging "next" 46 times | Add search, filters, related links or breadcrumbs. Some people know what they want and search; others explore. |

## Balance

Look at the distribution across the top level, because that is what people scan. A section holding more than about 40% of items probably needs splitting or facets. A section holding one item probably belongs inside a neighbour. An "Other" section grows until it is the largest one.

## Several parents or facets

Letting an item sit under several parents is fine for a handful of real cross-cutters. It does not scale: with many of them nobody knows where anything lives. When many items belong in several places, the hierarchy is cut along the wrong axis and you want facets.

## Comparing options

Write the options so a reader can disagree with you. Every row names a cost.

| Organised by | Serves | Costs | Strains when |
|---|---|---|---|
| Task | People who arrive knowing what they want to do | Content that serves several tasks needs cross-links | The task list keeps growing |
| Audience | Groups with truly separate needs | People who do not see themselves in a group stall at the first click; shared content needs one home | Audiences overlap |
| Content type | Browsers, and libraries with clear formats | Says nothing about why someone came | Items are one topic in many formats |

Make the recommendation from what you know about this content and these people. If the deciding fact is missing, say which fact it is.

## Serve the level above

A page sits in a section, a section in a site, a site in a business. A section can be tidy and still be wrong if the level above needs something else from it. Ask what the next larger context wants before settling the top level.

## Reject these

| Anti-pattern | What it looks like | Instead |
|---|---|---|
| Org-chart structure | Sections named after departments | Sections named for what people came to do. "For developers, APIs" beats "About us, engineering, APIs". |
| Everything under one umbrella | `/services/<thing>` for every section | Promote real sections to the top level |
| Two competing structures | The side rail, the breadcrumbs and the URL each say something different | One tree, drawn on by all three |
| Placeholder sections | "Coming soon" pages that ship | Build it or leave it out |
| Deep pagination as the only path | Item 470 reachable only by clicking "next" 46 times | Facets, search, and sensible sub-sections |
| A hand-kept `sitemap.xml` | A file someone edits and forgets | Generate it from the routes or the CMS so it cannot drift |
| A catch-all node | "Other", "Misc", "More resources" | Find each item a home, or retire it |
