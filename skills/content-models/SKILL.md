---
name: content-models
description: Use when someone needs a content model, content types, CMS fields or page templates worked out, or asks "what fields do we need", "how should we model this in the CMS", "what should go in this template" or "we need structured content before we pick a CMS". Not for deciding which pages exist, for the terms in a tag list, or for building the CMS itself.
---

# Content models

A content model says what kinds of thing a site holds, what fields each has and how they connect. Every URL pattern is a template type and every template type has fields. If you can't write that table, the structure isn't finished.

## What you need first

| Input | Where it comes from | If it is missing |
|---|---|---|
| The URL patterns or tree | A sitemap, or in a codebase the routes and navigation components. Never model from the homepage alone. | Draft the patterns from what you can see and mark them assumed, or use `sitemaps` first. |
| Real content | Three to five items per type, including the longest and the oddest | Without samples, fields are guesses. Mark the whole model a draft. |
| The current model | CMS schema, database tables, template files, front matter | Ask for an export. |
| Who writes it, and what else reads it (search, feeds, apps, agents) | The user | Ask. It sets how far to constrain authors, and a field nothing reads is a cost. |

If you can get none of this, say what you would need and hand over the template in `references/fields-and-cms.md` with suggested types for this kind of site.

## Method

1. **Choose the overall approach.** Offer two or three, with what each costs, and recommend one.

   | Approach | Fits | Costs |
   |---|---|---|
   | Few templates with flexible blocks | Marketing pages, a small team, layouts that change often | Little reuse. Content is locked in layout and hard to filter or re-present. |
   | Strongly typed templates | Libraries, catalogues, docs, anything filtered or reused | More design up front. A new kind of page is slower to add. |
   | Hybrid | Typed for repeatable content, one flexible zone for landing pages. The usual answer. | Two authoring experiences, and the flexible zone grows unless it is capped. |

2. **Give every URL pattern a template.** A pattern with no template is unfinished. A template with no pattern must be an embedded type or shared block; say which.

3. **Decide what counts as a type.**

   | Signal | Decision |
   |---|---|
   | Same fields, different subject | One template plus a taxonomy field |
   | Several fields differ, or a different owner or lifecycle | A new template |
   | Only the layout differs | One template. Layout is not a type. |
   | Appears only inside others and has no address | An embedded type |

4. **Read the samples, then write the fields.** Each field gets a name, a type, required or optional, and its validation or allowed values. Types are listed in `references/fields-and-cms.md`.

   | The content | Make it |
   |---|---|
   | Filtered, sorted, shown elsewhere or validated | A field |
   | Prose read only where it stands | The body |
   | A repeating structure such as steps or FAQs | A list of structured items, not headings in rich text |
   | A fixed choice | An enum or a controlled list, never free text |

   Make a field required only if the page breaks without it. Authors fill a required field they can't answer with junk, and every required field needs a plan for old content.

5. **Set relations and reuse.**

   | The situation | Use |
   |---|---|
   | One thing shown in several places, changing once | A reference. A value used twice is a reference, not a copy. |
   | Belongs to this item alone | An embedded field |
   | A deliberate snapshot that must not change | A copy, labelled as one |
   | The same group of fields on many templates | A shared field group |
   | A link to another page on the site | A reference, so it survives a slug change |

   State cardinality in both directions (a post has one author, an author has many posts) and what happens to a reference when its target is archived or deleted.

6. **Add the standard fields to every template:** slug, parent (if hierarchical), status (draft, scheduled, published, archived) and locale (if multilingual). Taxonomy fields pick from the controlled list. Archived is not deleted: archived pages should answer 410 or redirect.

7. **Decide how the model constrains authors.** What an author can't do is part of the model: maximum lengths, tags picked from a list, alt text required, rich text limited to the marks you allow, a cap on blocks. More freedom costs consistency; more rules cost authors' patience. Say where you landed and why. The reference pairs each risk with its constraint.

8. **Say what the CMS must provide,** from the list in `references/fields-and-cms.md`. Choose the CMS after sketching the model, not before: the model may rule some candidates out.

## Deliverable

`content-model.md`, in this order:

1. **Recommendation:** the approach, in two or three sentences, and why.
2. **Options:** one row per approach, with what it costs.
3. **Templates:** template, URL pattern, purpose, owner.
4. **Fields, one table per template:** field, type, required, validation or allowed values, notes.
5. **Relations:** from, to, cardinality, what happens on archive or delete.
6. **Shared groups and embedded types.**
7. **Author constraints.**
8. **What the CMS must provide,** and what to confirm with the vendor.
9. **Assumptions and open questions,** and what didn't fit when you tested it.

Scale it down. A small site can use one table with columns template, URL pattern, fields (type), relations, plus the standard fields stated once. A longer document is not a more thorough one. A request to model every type means every type gets a row, even the awkward one.

## Check it

There is no script, because the model is prose and tables and the real test needs judgment. Do these before handing over:

- **Fill it in.** Enter three real items per template, including the oddest, and report what doesn't fit. This is the fastest test a model has.
- Tick every URL pattern from the sitemap against a template.
- Every placeholder in a URL pattern is a field on that template (`/products/<category>/<slug>` needs `category` and `slug`).
- Every relation names a template that exists.
- Every field has a type and a required status. Every enum lists its values. Every taxonomy field names its list.
- Every required field can be filled for existing content, or the migration says how.

## What Claude can't do here

- Know the organisation's strategy, staffing or editorial habits unless told. Ask how authors work before constraining them.
- Invent traffic, usage or research, or say how often a field will be used.
- Vouch for a CMS. Say what you would expect it to do, such as conditional fields or validation rules, and tell the user to confirm it, because what a platform supports varies.

## Where this hands off

- `information-architecture`: the front door, when the job spans several of these.
- `sitemaps`: for the tree the templates come from. `content-inventory`: to see what content really exists.
- `url-structure`: for what the slug and parent fields must produce. `redirect-maps`: for what archived content answers.
- `taxonomies`: to define the controlled lists the fields pick from.
- `labeling`: for the words authors see. `navigation`: when a side-rail rule depends on a field.
- `card-sort`, `tree-tests` and `findability`: for how people group and find the content the model holds.
