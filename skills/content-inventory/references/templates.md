# Content inventory templates

Read this when writing the deliverable. Use what the job needs, and leave a field out rather than pad it.

## content-inventory.csv

One row per item. A spreadsheet or CSV is easiest to sort and count.

```
id, url, title, type, section, tags, owner, last_updated, traffic_90d, status, action, notes
```

| Column | Holds |
|---|---|
| `id` | A stable key, so `merge into <id>` can point at it |
| `url` | Current location, or file path for a folder of content |
| `title` | The title as published |
| `type` | The kind of item: page, post, guide, video, form |
| `section` | Where it sits today |
| `tags` | Current tags, as they are |
| `owner` | A named person or role. Blank is a finding. |
| `last_updated` | `YYYY-MM-DD` where you can. Blank is a finding. |
| `traffic_90d` | Visits in the last 90 days, only if the user supplied analytics |
| `status` | `current`, `outdated`, `duplicate`, `trivial`, or `gap` for content that should exist and does not |
| `action` | `keep`, `revise`, `merge into <id>`, `retire`, `create` |
| `notes` | What has to change, or why this action |

Quote any value that contains a comma. A section with no content yet can be recorded as a `gap` row so that it shows up as empty.

Example rows:

```
id,url,title,type,section,tags,owner,last_updated,traffic_90d,status,action,notes
12,/help/reset-password,Reset your password,guide,Help,account,Support team,2026-03-02,4100,current,keep,
13,/help/password-reset,"Password reset, step by step",guide,Help,,,2021-06-14,90,duplicate,merge into 12,Same steps; keep the screenshots from this one
14,,Cancel a subscription,guide,Help,,,,,gap,create,Third most repeated support question
```

## audit-summary.md

```
Corpus: <what it is, who it serves, how many items, how it was surveyed or sampled>
By type: <type: count, ...>
By section: <section: count, ...>  (name any over about 40% or with 1 item)
Duplicates: <count, examples>
Outdated or trivial: <count, examples>
Gaps: <what people need that is not there; evidence: search logs, support questions>
Current structure problems: <overlapping sections, vague labels, orphans, phantom parents>
Biggest wins: <the 3 changes that would help most>
```

Take every count from the script. Put the sampling sentence in `Corpus` when anything was sampled.
