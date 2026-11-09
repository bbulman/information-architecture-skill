# Tree format

What `tree-check.mjs` reads and what it checks. Read this when writing a tree for the script, or when the script's result needs explaining.

## Text tree

One node per line, indented under its parent. Box-drawing characters, ASCII trees (`|--`, `+--`), bullets and plain spaces or tabs all work. A line starting with `#` is a comment.

```
/                          home
├── /guides                section-hub   items: 40
│   ├── /guides/setup      listing       (new)
│   └── /guides/<slug>     guide
├── /products              listing       items: 120  facets: use, price
│   └── /products/<slug>   product
├── /archive               listing       (retired)
└── /about                 marketing     (moved from /company)
```

Columns are separated by two or more spaces, or by ` | `.

| Column | What it holds |
|---|---|
| First | The label or path. A path can be followed by a single space. A label with spaces needs two spaces after it. |
| Second | The template type |
| Anywhere after | `items: N` or `N items`, `facets: a, b`, and status notes in brackets: `(new)`, `(moved from /x)`, `(retired)` |

Retired nodes, and everything under them, are left out of the checks. A pattern node (`<slug>`, `{slug}`, `[slug]`, `:slug`, `*`) stands for many pages, so it is not counted as a repeated label or an only child.

Suggested template types: `home`, `section-hub`, `listing`, a named detail type such as `post` or `product`, `marketing`, `form`, `legal`, `search`, `account`. Use the words the team already uses.

## JSON

An object or a list of objects. Each node needs a `label`, `name`, `title`, `path` or `url`. Optional: `template` or `type`, `items` or `count`, `facets`, `notes` or `status`, and `children`, `pages` or `nodes`.

```json
{ "label": "/", "template": "home", "children": [
  { "label": "/guides", "template": "section-hub", "items": 40 }
] }
```

## What it flags

| Check | Severity | Line it draws |
|---|---|---|
| `depth` | Warning | More than 4 levels below the top node. `--max-depth N` changes it. |
| `breadth` | Warning | More than 9 children. `--max-breadth N` changes it. |
| `only-child` | Note | A node with one real child |
| `repeated-label` | Warning | The same name twice, compared by the last path segment or the whole label |
| `no-template` | Warning | A node with no template when other nodes have one. A note when none do. |
| `junk-node` | Warning | Other, Others, Misc, Miscellaneous, Uncategorised, Unsorted, or a label starting with one |
| `placeholder` | Warning | Coming soon, under construction, placeholder, TBD |
| `umbrella` | Warning | One section holds 80% of the nodes in a tree of 10 or more |
| `size` | Warning | Deeper than the content-size table allows, or 500 or more items with no facets named |
| `balance` | Warning | A top-level section over 40% of items among three or more real sections, or over 75% among two; an empty section |
| `balance` | Note | A top-level section with one item |
| `indent` | Note | A line that does not line up with any earlier level |

A warning is a question, not a verdict. A docs section may rightly hold 80% of a tree. Say so in `sitemap.md` and move on.

Exit codes: 0 no warnings, 1 warnings, 2 bad input.
