---
name: labeling
description: Use when someone needs to name or rename a section, menu item, tab, category, feature or link, when labels feel vague or read like internal jargon, or when they ask "what should we call this", "is this label clear", "nobody knows what Resources means" or "people don't understand this menu". Not for deciding the structure behind the labels, building a tag vocabulary, or writing body copy and microcopy.
---

# Labeling

Labels are the words that tell people what is behind a door before they open it. This skill serves the decision of what each destination, section or action is called, and which naming system each level uses. The test for every label: could a newcomer predict what is behind it?

## Before you start

| You need | If it is missing |
|---|---|
| The labels as they stand, each with what is behind it and where it appears | Read the navigation or ask for it. If there is nothing yet, deliver the empty `labels.csv` and the test plan. |
| Who reads them and what they are trying to do | Ask. If no answer comes, state your assumption at the top. |
| The users' own words: search logs, support questions, card-sort group names, interviews, reviews | Draft from the content and the conventions of similar products, mark every label `untested`, and deliver the test plan so the words can be checked. Never present a guess as the users' language. |

## Method

1. **List the labels in context.** Record each one's group (the labels seen together), destination and what is really behind it. Judging a label without its siblings is how overlap gets missed.
2. **Collect the users' words.** Their words are the first candidates; your internal terms are not.

   | Source | What it gives you | Watch for |
   |---|---|---|
   | Search logs | The exact words typed, the strongest trigger words | Run the findability skill's log report; never estimate volumes |
   | Support questions | How people describe the need | People in trouble phrase things differently |
   | Card-sort group names | What people call a cluster | Use their most common words |
   | Interviews, 5 to 10 people | Vocabulary and what words mean to them | Listen for the word they use unprompted |
   | Similar products | Words people have already learned | Familiar beats clever |

3. **Pick one labelling system per level.** Mixing them in one menu means each item answers a different question, and people cannot compare them.

   | System | Example | Works when | Breaks when |
   |---|---|---|---|
   | Task | "Track an order" | People arrive with a job to do | Tasks overlap or the list runs long |
   | Audience | "For developers" | Groups need different content and can place themselves | Someone is in two groups, or does not know which |
   | Topic | "Billing" | The subject is how people think about it | The topics are the organisation's, not theirs |
   | Format | "Videos", "Templates" | People choose by format | They care about the subject first |
   | A to Z | Glossaries, directories | People know the exact name | They are browsing to discover |

4. **Write candidates against these rules.**

   | Rule | Weak | Stronger |
   |---|---|---|
   | Specific and familiar, no mystery meat | Resources, Solutions, Discover | Guides and templates |
   | Parallel construction across siblings | Pricing, Getting started, For teams | Pricing, Setup, Teams |
   | Front-load the word that distinguishes | Report settings, Report history | Settings, History, under Reports |
   | One thing, one name everywhere | "Team" in the menu, "People" on the page | Choose one and use it in nav, title and breadcrumb |
   | The door matches the room | "Plans" opens "Choose your subscription" | Link text and page heading agree |
   | Link text says what you get | Learn more | Download the onboarding checklist |

5. **Decide what happens to internal names.**

   | The name is | Do this |
   |---|---|
   | A team, department or project codename | Never show it. Name what the person came to do |
   | A brand name for a feature people must learn | Pair it with a plain descriptor wherever it is used for navigation |
   | A term of art the audience really uses | Keep it, even if outsiders would not know it, and test with that audience |
   | A legal or regulatory term | Keep the exact term and put a plain gloss beside it |
   | An acronym | Spell it out unless the audience searches for the acronym more than the words |

6. **Offer two or three options for every contested label,** with what each gains and loses, and recommend one. A single answer hides the decision.
7. **Strengthen the scent around the label.** Short descriptions, item counts, breadcrumbs and active states carry what the word alone cannot. Read [references/information-scent.md](references/information-scent.md) when labels are fine in isolation but people still bounce.
8. **Test predictability.** In one direction show the label alone and ask what people expect behind it; in the other, give a goal and ask which label they would choose. As a first pass you can cold-read: cover the destination, write what you would expect, compare. Report that as your own reading, not as research. [references/predictability-test.md](references/predictability-test.md) has the plan and the scoring.
9. **Check other languages.** If the labels will be translated, read [references/locales.md](references/locales.md) before settling them. Translate for meaning, not word for word, and re-test with people in that market.

## Deliverable

Write these unless the user names other files.

- `labels.csv`, one row per label: `group,label,destination,system,was,evidence,status`. `evidence` says where the word came from (search log, support, assumption). `status` is `kept`, `renamed` or `new`, plus `tested` or `untested`, separated by a semicolon: `renamed; untested`.
- `labels.md`, in this order: Recommendation (two or three sentences); The system chosen for each level; Contested labels (options, trade-offs, the pick and why); Internal names and what happens to each; How to test them; Assumptions and open questions. The full list lives only in `labels.csv`, so the two cannot disagree.

| Job | Hand back |
|---|---|
| Rename one thing | Three options with trade-offs, a pick and one test question, in the reply |
| Review one menu | The `labels.csv` rows and a short list of changes |
| A whole site or app | Both files |

A longer document is not a more thorough one.

## Check it

Run the mechanical check and use its counts:

```
node "${CLAUDE_SKILL_DIR}/scripts/label-check.mjs" labels.csv
```

It finds vague words, duplicates in a group, siblings that start with the same word, groups mixing grammatical forms, one label with several destinations and one destination with several labels. The form check only fires on clear patterns, so read each group for parallel construction yourself. Then verify:

- Every group uses one labelling system, and `labels.md` says which.
- Every label is `tested` or marked `untested`. A clean script run proves nothing about understanding.
- Each label's `evidence` is real. If it is an assumption, the row says so.

## What Claude can't do here

You cannot learn what real people understand by reading a label yourself, and you cannot know the organisation's strategy, brand commitments or politics unless told. Never invent usage numbers, search volumes, test results or quotes. Propose alternatives with their trade-offs, recommend one and say why; the human owns the decision, especially when a name carries brand or legal weight.

## Where this hands off

| Next need | Skill |
|---|---|
| The groups themselves look wrong | card-sort, sitemaps |
| Which labels go on which menu | navigation |
| Terms for tagging and filters | taxonomies |
| A renamed section changing its address | url-structure, redirect-maps |
| Testing labels inside a hierarchy | tree-tests |
| Renaming did not fix "people can't find it" | findability |
| A list of what exists first | content-inventory |
| Fields behind a template | content-models |
| A whole-site restructure, or unsure where to start | information-architecture |
