# Search tuning

Read when search is a confirmed or likely cause, when asking for an export, or when writing best bets, synonyms or a no-results page.

## What the signals mean

| Signal | What it suggests | First move |
|---|---|---|
| Zero-result searches | Vocabulary you lack | Add synonyms, or the content |
| Searches started from a section page | That section's navigation failed them | Look at what they searched for and what the section offered |
| Refinements: people rewording the same query | The results or the labels do not match their words | Compare the first and last wording |
| Top queries | The most-wanted things | Reachable in one or two steps from home, and best bets |
| Search exits: leaving straight from the results page | The results are wrong | Run the query and read what came back |
| Results but no clicks | The results or their titles do not look right | Read the titles as the searcher would |

## What to ask for

`search-log.mjs` needs a CSV with `query`, `count` and `results`, and `clicks` if the tool records it. A log with one row per search works with a count of 1 on each row. Ask for a named period long enough to cover normal use, and note any launch, campaign or outage inside it. If the search tool does not record results or clicks, say which checks that rules out. Refinements, exits and the page a search started from usually come from analytics rather than the log.

The script normalises case, spacing and surrounding punctuation before counting. It does not correct spelling; misspellings show up in the variant groups for you to review.

## Best bets

A best bet is a hand-placed result at the top of the list for a specific query.

- Start from the top queries where the right answer is one known page.
- Keep the list short and give it an owner. A best bet pointing at a retired page is worse than none.
- Write the best bet's title in the searcher's words.
- If a best bet would be needed for a query that also has a nav destination, that is evidence for a label or link change. Fix both.

## Synonyms

| Kind | Example | Treat as |
|---|---|---|
| Spelling, plural, punctuation | "e-mail", "email"; "invoice", "invoices" | Two-way. Many engines handle some of this; confirm which |
| Same concept, different word | "sign in", "log in" | Two-way, with one preferred term shown |
| Acronym | "SSO", "single sign-on" | Two-way if the audience uses both |
| Narrower to broader | "visa" to "payment methods" | One-way: the narrow word finds the broad page, not the reverse |
| Misspelling | "reciept" | One-way to the right word |

Check meaning before adding. Words that are spelled alike can mean different things, and the script only sees spelling. Keep synonyms with the vocabulary so taxonomy and search agree, and review them when the drift audit runs.

## The no-results page

A no-results page is the moment someone is closest to giving up. It should:

1. Say what was searched for, so a typo is visible, and keep the query editable.
2. Offer a spelling correction if there is a likely one.
3. Show routes that are likely to help: the main categories, the most-used destinations, or results from a broader scope.
4. Say what the site does not offer, if that is the honest answer.
5. Give a way to reach a person if the task matters enough.
6. Record the query, so the gap gets into the next log.

Never show a blank page, blame the person, or suggest "try different keywords" with nothing else to try. Filters that lead to zero results are the same problem: show which filter to remove.

## Before blaming the engine

Check that the content is actually indexed, that the scope includes it, that page titles and summaries contain the words people use, and that the result titles are distinguishable from each other. Those are usually cheaper than changing the search product.
