# Fields and CMS requirements

Read this when writing field tables, choosing types, or listing what a CMS has to do.

## Template form

```
Template   URL pattern              Fields (type)                                         Relations
article    /articles/<slug>         title (short text), summary (long text), body         author (one), topics (many,
                                    (rich text), published_at (date)                      from controlled list), related (many)
product    /products/<slug>         title, price (number, currency), sizes (list),        category (one), maker (one)
                                    images (media, alt required)
```

Add for every template: slug, parent (if hierarchical), status (draft, scheduled, published, archived), locale (if multilingual).

## A field table

| Field | Type | Required | Validation or allowed values | Notes |
|---|---|---|---|---|
| title | Short text | Yes | Max 70 characters | Shown in listings and the page head |
| summary | Long text | Yes | Max 160 characters, no formatting | Shown on cards and in search |
| topics | Taxonomy | Yes | One to three, from the Topic list | Drives filters |
| author | Reference to person | Yes | One | On person archive: keep the name, drop the link |
| body | Rich text | Yes | Headings 2 and 3, lists, links, images | No tables |

The lengths above are illustrations. Set yours from the real content and the layouts that show it.

## Field types

| Type | Use for | Constraint to set |
|---|---|---|
| Short text | Titles, names | Maximum length |
| Long text | Summaries, descriptions | Maximum length; no formatting |
| Rich text | Bodies | Allowed marks and blocks |
| Number | Quantities | Unit, minimum and maximum |
| Date or date-time | Published, event start | Time zone, if it matters |
| Boolean | A real either-or | If a third state is likely, use an enum |
| Enum | A short fixed list owned by the model | Every value listed |
| Taxonomy | Terms from a controlled list | One or many; the name of the list |
| Reference | Another content item | Target type; one or many; what happens on archive |
| Media | Images, files | Allowed types; alt text required on images |
| Structured list | Steps, FAQs, materials | The item's own fields; minimum and maximum |
| URL | External links | Valid format. Use a reference for internal links. |
| Slug | The address | Kebab-case, unique within its parent |

## Constraining authors

| Risk | Constraint |
|---|---|
| Titles and summaries that break layouts | Maximum lengths |
| Tags that multiply | Pick from a list; no creating on the fly |
| Inaccessible images | Alt text required on the image field |
| Formatting used as structure | Rich text limited to the marks and blocks you allow |
| Pages that drift from the system | Allowed blocks listed, or a cap on them |
| Fields people misread | One line of help text, written for the author |

## What the CMS has to provide

For the structure to hold, the CMS needs:

- A **slug** field with validation: kebab-case, unique within its parent.
- A **parent** relation for hierarchical URLs.
- An automatic **redirect log** when a slug changes.
- **Status:** draft, scheduled, published, archived. Archived is not deleted, and archived pages should answer 410 or redirect.
- **Taxonomy fields** that pick from the controlled list instead of free text.
- **Locale** and links to the item's translations, if the site is multilingual.

## To confirm with the vendor or the host

Expect these to vary. State what you would expect and ask for confirmation.

- Field validation: patterns, lengths, conditional required fields.
- References: whether deleting a target is blocked, cascades or leaves a broken link.
- Rich text: whether marks and blocks can be restricted per field.
- Slugs: whether a change writes a redirect by itself.
- Roles: who can edit the controlled lists.
- Export: whether content can leave in a structured form.
