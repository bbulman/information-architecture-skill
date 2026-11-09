---
name: navigation
description: Use when someone wants a navigation or menu designed, audited or cut down, including a main menu, nav bar, sidebar, app switcher, mega-menu, footer, breadcrumbs, tab bar or mobile menu, or says "there are too many items in the menu", "rethink the sidebar", "our nav is a mess" or "where should settings go". Not for deciding which pages exist, for wording a single label, for fixing site search, or for running a tree test.
---

# Navigation

Navigation decides which parts of the structure get a permanent place on screen and which are reached another way. The slots are scarce, and each surface has its own rule for what earns one.

## What you need first

| Input | Where it comes from | If it is missing |
|---|---|---|
| Every surface as it stands | In a codebase, read the routes and the navigation components (header, footer, app switcher, side rails, tab bars) first. Never redesign from the homepage alone. | Ask for screenshots or a typed list of items per surface. |
| The tree behind it | A sitemap, or the routes | Map the current tree yourself, and say so. If the structure itself is wrong, stop and use `sitemaps`. |
| Top tasks, the ones people fail at, and usage | The user, analytics, search logs, repeated support questions | Ask, or state your assumption at the top. Never estimate usage; say which decisions would change if you had it. |

If you can get none of this, say what you would need and produce the empty spec from `references/spec-template.md` with the entry rules filled in.

## Method

1. **Map every surface.** Surface, item, destination, count. Mark the same destination under two names, items that lead nowhere, and anything that exists only in one surface by accident.

2. **Separate global from local.**

   | | Global | Local |
   |---|---|---|
   | Job | What this whole place offers | What is around this page |
   | Shows | The same on every page | Only inside its section |
   | Surfaces | Primary, utility, footer | Side rail, in-page contents, breadcrumbs, related links |
   | Goes wrong when | It lists one section's children | It repeats the global items |

   A section that needs more than two levels of navigation usually wants its own side rail or its own home.

3. **Give each surface an entry rule, and apply it to every item.**

   | Surface | What belongs | What doesn't | Entry rule |
   |---|---|---|---|
   | Primary | The 3 to 6 destinations that matter most to users and the business | Anything that hasn't earned the slot | Serves a top task or a stated business goal, makes sense to a newcomer, and beats the weakest item already there |
   | Utility | Sign in, account, search, language, settings | Marketing-ranked items | Is about the person's session or the tool, not the content |
   | Footer | The fuller sitemap, legal, contact, secondary calls to action | A junk drawer (people and crawlers still read it) | Someone needs it from any page, or the law does; it fits a named group |
   | Contextual | Side rails, in-page contents, breadcrumbs, related links | Anything global | Only means something here, and is placed by a written rule |
   | App tab bar | At most 5 tabs; a 6th becomes "More" or gets cut | Rarely used destinations | A repeated, top-level job in the product |

4. **Allocate.** Treat more than seven primary items as a sign that some aren't earning their place: consolidate them or move them to the footer. Merge near-twins into one item. Give every task people fail at one canonical home, and say that any other entry point leads there.

5. **Offer two or three arrangements** (by task, by object, by audience), each with what it costs and where it strains. Recommend one and say why.

6. **Choose the pattern.**

   | Situation | Use | Note |
   |---|---|---|
   | One item has three or more sub-groups with children of their own | Mega-menu | Design its keyboard focus and mobile version as separate work |
   | A short flat list of children | A plain dropdown, or a link to a hub page | Often the hub page is better |
   | Depth of three levels or more | Breadcrumbs | Every crumb is a real page. One trail per page, following the canonical home, not the route the person took. |
   | Long reference pages | In-page contents | Local only |
   | Different roles need different starting points | Personalised shortcuts | Personalise the shortcuts, not the map. If everyone sees a different menu, people can't give directions, support can't describe where things are, and analytics stop meaning anything. |

7. **Design mobile and keyboard now.** On mobile, say how primary collapses, what stays visible and what happens to each mega-menu. On keyboard, every item is reachable in visual order, focus is visible, Escape closes what Enter opened, and nothing works by hover alone. Details are in `references/mobile-and-keyboard.md`; read it for any menu that opens.

8. **Put cues where the decision happens.** A good cue answers a question the person already has, at the moment they choose, where they are already looking, quietly and cheaply. The arrow beside a car's fuel gauge showing which side the cap is on is the model. Show the current location with an active state.

9. **Plan how items leave.** Removing a link is not removing a page.

   | Step | What to do |
   |---|---|
   | Decide its fate | Merged, moved to footer or utility, reachable by search only, or gone |
   | If the page goes | Add it to the redirect map |
   | If it stays | Confirm another path still reaches it |
   | Tell people | In a signed-in product, leave a pointer in the old place for a release or two, and fix help articles, tours and emails that name the old path |
   | Keep the word | The old label stays as a search synonym, then watch search and support for it |

10. **Hand validation to `tree-tests`.** It writes the plan and the tasks. Give it each problem that prompted the work, every placement you were unsure of and the proposed answers. Targets: at least 70% success, 80% for top tasks, path ratio at most 1.5.

## Deliverable

`navigation-spec.md`, in this order:

1. **Recommendation:** two or three sentences and the main reason.
2. **Current state:** each surface, its count, its problems.
3. **Options:** one row per arrangement, with what it costs.
4. **The spec:** per surface, label and destination, and why each primary item earns its slot. Then breadcrumb pattern, mobile, keyboard and active state.
5. **Canonical homes:** each problem task, its one home, and the entry points that lead there.
6. **Before and after:** every current item and where it went, including what is retired and how.
7. **Entry rule:** the test a new top-level item must pass.
8. **Assumptions and open questions.**
9. **Hand-off to `tree-tests`:** the problem tasks, the unsure placements and the proposed answers.

Scale it down. A menu rethink needs the diagnosis, the new tree, one home for each problem task and the hand-off to `tree-tests`; it doesn't need a content model or a URL policy. A longer document is not a more thorough one. A request to place every item means every item gets a home.

## Check it

There is no script. These checks are short and need reading the spec, so do them by hand and fix what fails:

- Count primary items (7 at most, 3 to 6 preferred) and tabs (5 at most).
- Every current item appears in the before and after table with a new place or a stated retirement.
- Every destination exists in the tree or the routes, every breadcrumb parent is a real page, and the side rail, breadcrumbs and URL tell the same story.
- Each problem task has exactly one home and is on the `tree-tests` hand-off with its proposed answer.
- No usage claim you were not given. Frequency words are marked as assumptions.

## What Claude can't do here

- Know the organisation's strategy or politics unless told. Which item earns a slot is partly a business call, so present a draft and say whose call it is.
- Invent traffic, usage or research, or run a tree test with real people.
- Say what a framework's menu component does. Say what you would expect and tell the user to confirm it, because what a platform supports varies.

## Where this hands off

- `information-architecture`: the front door, when the job spans several of these.
- `sitemaps`: when the tree underneath needs changing.
- `labeling`: to word the items. `taxonomies`: when filters or facets are the real need.
- `url-structure` and `redirect-maps`: when destinations change address. `content-models`: when a contextual rule needs fields behind it.
- `tree-tests`: to run the study. `findability`: when the problem is search or scent. `content-inventory` and `card-sort`: when nobody knows what is there or how people group it.
