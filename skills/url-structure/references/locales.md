# Locales

Read this when a site is, or will be, multilingual or multi-market.

## The rules

- Put the locale in the URL, as a prefix. Detecting it by IP or a cookie alone breaks sharing, the back button and search.
- Give each page `hreflang` siblings, and an `x-default` for people who match none.
- Keep one canonical structure across locales where you can, so content and redirects stay manageable.
- Translate labels for meaning, not word for word, and re-test them with people in that market.
- Some categories don't travel: seasons, holidays, units, business conventions. Check that the structure still makes sense in each market, not just the words.

## Decisions

| Decision | Options | Judgment |
|---|---|---|
| What `/` does | Serve the default language, or redirect by browser language | A suggestion on the page is safer than a forced redirect, which can trap people and crawlers. Whatever you pick, each locale still needs its own URL. |
| Language or market | `/de/`, or `/de-at/` | Use the market form only where content really differs by market |
| Translated slugs | `/de/produkte/mixer`, or `/de/products/mixer` | Translated reads better to the person. It multiplies slugs to maintain and redirects to keep. Choose per site and write it down. |
| Missing translation | Show the default language, hide the page, or fall back with a notice | Decide before launch, because each choice affects `hreflang` |
| Prefix for the default language | `/en/` too, or the root | A prefix on every locale is consistent. A bare root keeps existing URLs in place on a site that is adding languages later. |

Adding a prefix after launch moves every URL, so ask about locales early even when the first release has one language. Anything that moves goes through `redirect-maps`.

Confirm what the platform supports. Internationalised routing, `hreflang` output and slug translation vary.
