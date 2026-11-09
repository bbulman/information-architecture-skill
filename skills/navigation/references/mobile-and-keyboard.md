# Mobile and keyboard

Read this for any menu that opens, and before calling a navigation spec finished. Treat framework behaviour as something to confirm: components differ, and a library's defaults may not match this list.

## Mobile

| Decision | Judgment |
|---|---|
| What stays visible | If there is room, keep the one or two top tasks on screen. Everything hidden behind a menu is used less, so choose what hides on purpose. |
| Order in the collapsed menu | Top tasks first. A row that reads well left to right may stack badly. |
| Two levels | An accordion keeps the parent list in view |
| Three levels or more | A drill-in panel handles depth but hides siblings, so it needs a clear back control and the parent's name. Consider linking to a hub page instead. |
| Mega-menu | It does not shrink. Rebuild it as an accordion, or send the top item to a section hub. |
| Hover | Does not exist. A parent that is both a link and a menu needs two separate targets. |
| Utility items | Decide where they live in the drawer. Sign in and language are easy to lose. |
| Tab bar | At most 5, all labelled. Icons alone rarely carry the meaning. |
| Touch targets | Large enough and far enough apart to hit with a thumb. 44 by 44 points is a common minimum. |

## Keyboard and assistive technology

| Requirement | How |
|---|---|
| Reach everything | Every item reachable with Tab, in visual order |
| See where you are | A visible focus style on every item |
| Skip repeated links | A skip link as the first focusable element |
| Open and close | A button with `aria-expanded` opens a list of links. Enter or Space opens it. Escape closes it and returns focus to the button. |
| No hover-only menus | Anything that opens on hover also opens on focus or click, and does not vanish the moment the pointer drifts |
| Closed means closed | Links in a closed menu are out of the tab order |
| Mobile drawer | While open, focus stays inside it; on close, focus returns to the control that opened it |
| Current page | `aria-current="page"` on the active link, as well as the visual state |
| Name each region | `<nav aria-label="...">` for each navigation landmark when there is more than one |
| Breadcrumbs | A labelled `nav` holding an ordered list |
| Site menus | Prefer disclosure buttons and plain links. `role="menu"` promises application-style arrow-key behaviour that site navigation usually doesn't deliver. |

## How to test it

1. Put the mouse away and tab through every surface. Open and close each menu.
2. Run it with a screen reader, listening for names, states and the current page.
3. Zoom to 200% and check nothing is lost or trapped.
4. On a real phone, reach each top task with one thumb.

Report what you actually tested. If you only read the code, say so.
