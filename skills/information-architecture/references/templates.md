# Information architecture: templates

Fill-in templates for the artifacts in `SKILL.md`. Use the ones the job needs; leave a field out rather than pad it.

## Contents

1. Content inventory
2. Audit summary
3. Card sort plan
4. Card sort findings
5. Sitemap
6. Navigation spec
7. URL rules
8. Content model
9. Tree test plan
10. Tree test results
11. Taxonomy and metadata schema
12. Redirect map
13. Drift audit

---

## 1. Content inventory

One row per item. A spreadsheet or CSV is easiest to sort and count.

```
id, url, title, type, section, tags, owner, last_updated, traffic_90d, status, action, notes
```

- `status`: current, outdated, duplicate, trivial, gap (for content that should exist but doesn't)
- `action`: keep, update, merge into <id>, retire, create

## 2. Audit summary

```
Corpus: <what it is, who it serves, how many items, how it was surveyed or sampled>
By type: <type: count, ...>
By section: <section: count, ...>  (flag any over ~40% or with 1 item)
Duplicates: <count, examples>
Outdated or trivial: <count, examples>
Gaps: <what people need that isn't there; evidence: search logs, support questions>
Current structure problems: <overlapping sections, vague labels, orphans, phantom parents>
Biggest wins: <the 3 changes that would help most>
```

## 3. Card sort plan

```
Goal: <discover categories | test our categories | refine our categories>
Type: <open | closed | hybrid>
Participants: <who, how many, how recruited>
Cards: <30 to 60 items; plain titles, no internal codes; list them>
Categories (closed or hybrid only): <the proposed labels>
Tool: <online sorting tool, a shared board, or paper>
Instructions to participants: <the exact words>
Analysis: similarity matrix, clusters, label frequency, outliers
Decision it feeds: <what we'll change based on the result>
```

## 4. Card sort findings

```
Participants completed: <n>
Strong pairs (>70% together): <card + card, ...>
Clusters: <cluster: cards, agreement %, most common participant labels>
Cards that scattered: <card: groups it landed in>  -> needs a cross-link, or the cut is wrong
Unrecognized labels: <label>  -> rename
Single-card groups: <group>  -> merge
Recommendation: <the structure and labels this supports>
```

## 5. Sitemap

A text tree with each node's template type. Mark new, moved and retired nodes.

```
/                               home
├── /plan                       section-hub
│   ├── /plan/templates         listing        (new)
│   └── /plan/<slug>            plan
├── /library                    section-hub
│   ├── /library/exercises      listing        facets: topic, duration, group size
│   ├── /library/icebreakers    listing        facets: topic, energy, duration
│   └── /library/<type>/<slug>  library-item
├── /pricing                    marketing
└── /about                      marketing      (moved from /company)
```

## 6. Navigation spec

```
Primary (3 to 6): <label -> destination>, with why each earns its slot
Utility: <sign in, account, search, ...>
Footer: <groups and links>
Contextual:
  <section>: side rail of <...>; in-page contents; related links rule: <...>
  Breadcrumbs: <pattern, e.g. Home > Library > Icebreakers > Item>
App tab bar (if any, at most 5): <tabs>; what goes under "More"
Mobile: <how primary collapses; what stays visible>
Active state: <how the current location is shown>
Inclusion rule for adding a new top-level item: <the test it must pass>
```

## 7. URL rules

```
Case and separator: lowercase, kebab-case (redirect anything else)
Trailing slash: <yes | no>, enforced, with canonical tags
Extensions: none
Hierarchy: path mirrors the sitemap: /<section>/<type>/<slug>
Slug source: <title, trimmed of filler words, max ~60 characters>
IDs: never in the path; <where they live if needed>
Query strings: filters, sort, page only
Locales: /<locale>/ prefix, hreflang siblings, x-default at /
Changing a slug: automatic 301 from the old one, logged
```

## 8. Content model

```
Template      URL pattern               Fields (type)                                        Relations
library-item  /library/<type>/<slug>    title (text), summary (text), duration (minutes),    category (one), tags (many,
                                        group_size (range), steps (list), materials (list)   from controlled list), related (many)
post          /blog/<slug>              title, author, published_at, body, topics (many)     author (one)
```

Add for every template: slug, parent (if hierarchical), status (draft, scheduled, published, archived), locale (if multilingual).

## 9. Tree test plan

The tree is text only: labels and hierarchy, no visual design.

```
Tree: <link or the full text tree>
Participants: <who, how many (20 to 50)>
Tasks (8 to 12, written as goals, not using the target's label):
  1. "<You want to run a quick game to warm up a new team. Where would you look?>"
     Correct answer(s): <Library > Icebreakers>
     Target: success >= 80% (top task) | 70% (other); directness <= 1.5x shortest path
  2. ...
Success means: <the participant chose a correct node, first time or after backtracking>
```

Write tasks in the participant's words. A task that repeats the label ("Find the Icebreakers section") tests reading, not the structure.

## 10. Tree test results

```
Task | Success % | Direct % | Median time | Wrong first click (where, %) | Verdict
1    | 84        | 71       | 14s         | Plan (12%)                   | pass
2    | 52        | 30       | 41s         | Resources (35%)              | fail: "Resources" draws clicks; rename or split
Overall: <pass rate across tasks>
Changes: <what to change, then re-test the failing tasks>
```

## 11. Taxonomy and metadata schema

```
Facet: <name>                 Purpose: <what slicing it enables>   Selection: <one | many>   Owner: <role>
  Term: <preferred label>     Definition: <one line: what's in, what's out>
                              Synonyms: <terms that map here>      Status: <active | deprecated -> merged into X>
  ...
Rules:
  - Every item gets exactly one <facet A> term and one or more <facet B> terms.
  - New terms: proposed by <who>, checked for near-duplicates, approved by <owner>.
  - Version: <n>, change log: <where>
```

## 12. Redirect map

```
old_url, new_url, status (301 | 410), reason, checked (crawl date)
/company/team, /about/team, 301, section renamed
/blog/old-announcement, , 410, retired: outdated
```

Check before cutover: no chains (A > B > C becomes A > C), no loops, no redirects to home, every old URL from the sitemap, logs and inbound links accounted for.

## 13. Drift audit

Run monthly or quarterly. Record the counts so the next audit can compare.

```
Date:
Terms with no items: <list>                      -> deprecate or keep (with reason)
Terms over ~40% of items: <list>                 -> split
Near-duplicate terms: <a ~ b>                    -> merge, keep synonyms
Items with no terms: <count>                     -> tag
Items whose terms don't match the content: <sample, count>  -> re-tag
Sections past their balance limits: <list>
Search queries with no matching term: <top 10>   -> candidate terms
Actions taken:
```
