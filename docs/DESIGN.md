# Design system

The site presents records and tools, not a simulated terminal. Use real identifiers, values and statuses. Geometry gives the panels their character. Extra labels, bright borders and decoration do not.

## Scope and source of truth

This document records the accepted visual direction. [app/app.css](app/app.css) owns shared tokens and the panel grammar two instruments share: the clipped shell, the `console-*` labels and rules, the scan line and the reticle. [LandingToolCall.vue](app/components/content/LandingToolCall.vue) owns the tool console's response viewer and controls. [AuthorFacts.vue](app/components/content/AuthorFacts.vue) owns the author dossier: the ID bar with its ruler, the identification band with the dashed readout, the channels and addresses band, the log on `UTimeline`, and the corner crosses. Change those sources rather than adding a second theme file. Other panels share the typography, palette and flat surfaces, but do not all need clipped corners or targeting marks.

Reference views:

- [Accepted panel](design/tool-console.png)
- [Instrument icon detail](design/instrument-icon.png)

These images are visual references, not fixtures for record values. Data comes from the library. The panel takes its sample from [samples.ts](app/utils/samples.ts), chain symbols from [puzzles.ts](app/utils/puzzles.ts), and navigation from [LandingHome.vue](app/components/content/LandingHome.vue).

## Visual direction

Use the restrained instrument geometry of Person of Interest and Destiny from Stargate Universe: thin interrupted lines, precise alignment, small identifiers and a quiet graphite surface. Keep the subject readable before the frame becomes noticeable.

- One edge per surface. No soft shadow, glass, white outer outline or second decorative frame.
- A small cut at the top right and bottom left distinguishes the operational panel. Keep ordinary cards rectangular where the cut adds nothing.
- Amber is a limited accent, not the surface color. Reserve it for a primary value, part of the instrument and interactive emphasis.
- The existing amber halo at the page top, hero and OG image stays. It does not justify glow on cards, icons or buttons.
- No decorative tabs, executor diagrams, fake window controls or invented activity indicators.
- No entrance fade on the whole card. Motion belongs to a change in data, not to decoration running forever.

A request to darken the border changes the border. It does not reopen the font, geometry or layout.

## Color roles

The dark palette in `app.css` is the reference for the screenshots. Light tokens also exist; their presence alone does not prove an equivalent light design has been reviewed.

| Role             | Dark token or expression                                                | Use                              |
| ---------------- | ----------------------------------------------------------------------- | -------------------------------- |
| Canvas           | `--ui-bg: #0b0d10`                                                      | page and panel body              |
| Muted surface    | `--ui-bg-muted: #11141a`                                                | secondary surfaces               |
| Elevated surface | `--ui-bg-elevated: #161a20`                                             | existing layered UI where needed |
| Standard border  | `--ui-border: #262c35`                                                  | shared frames                    |
| Quiet border     | `--ui-border-muted: #1c2128`                                            | secondary separators             |
| Primary          | `--color-amber-300: #fcd34d`                                            | dark accent                      |
| Panel line       | `color-mix(in srgb, var(--ui-border) 75%, transparent)`                 | outer edge and panel divisions   |
| Panel corner     | `color-mix(in srgb, var(--ui-text-muted) 55%, var(--ui-bg))`            | short brackets and scan line     |
| Panel accent     | `color-mix(in srgb, var(--ui-primary) 65%, var(--ui-text-highlighted))` | prize and instrument arcs        |
| Header tint      | `color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg))`             | subtle header separation         |

Use `--ui-text-highlighted` for values, `--ui-text-muted` for labels and the central symbol, and `--ui-text-dimmed` for supporting markers. Do not substitute pure white. Text, controls and focus indicators need readable contrast even when decorative lines are faint. Small type is not an exemption from accessibility checks.

## Typography

Figtree is the general text and heading family. Fira Code is the code, identifier and console family. Declare both through `@theme` in `app.css`; Nuxt UI and `@nuxt/fonts` resolve and bundle them. Do not keep font binaries, manual `@font-face` rules or a second font stylesheet.

The two [OG templates](app/components/OgImage/) name the families explicitly because their renderer does not read CSS variables. Update and inspect those images when changing a family. Disable code ligatures and use tabular numerals.

| Panel content       | Size  | Weight / treatment                               |
| ------------------- | ----- | ------------------------------------------------ |
| Operation name      | 13 px | 400, original case, no tracking                  |
| Labels and metadata | 11 px | uppercase where appropriate, tracking 0.08-0.1em |
| Body values         | 12 px | mono, higher contrast than labels                |
| Record identifier   | 16 px | 400, line-height 1.5                             |
| Main metrics        | 18 px | one primary value in amber                       |
| Full response       | 13 px | line-height 1.85, original whitespace            |

This is a compact panel scale, not the body type scale for documentation. Do not enlarge the operation name into another page heading.

## Panel anatomy

1. **Header:** `puzzles_show` and `MCP · Pi · OMP` on one row. The tinted background follows the clipped corner.
2. **Input:** small `01` marker, `Input / id`, actual identifier and a quiet directional mark.
3. **Summary:** `02`, label and textual status. Below it, the instrument icon sits beside collection, identifier and chain/address kind.
4. **Metrics:** prize and transaction count in two columns. One top and bottom rule, one internal divider. No nested cards.
5. **Address:** full address, wrapped as needed, with two short corner brackets. A quiet `[ target ]` annotation is enough.
6. **Metadata:** public key availability and start date in aligned rows. Unknown values remain explicit.
7. **Response action:** `03` and a full-width button opening the complete response.
8. **Footer:** truthful locality/network information and previous/next controls.

The shell is `width: 100%`, capped at `35rem`, with 1 px padding. Two clipped pseudo-elements provide the outer line and inner fill. The outer cut is 16 px; the header uses 15 px to align inside it. Keep decoration non-interactive and its stacking context isolated.

Horizontal padding is normally 20 px. Below 400 px it becomes 14 px. The summary uses faint crosses on a 36 px grid, with opacity 0.1. Metrics and the address have a solid background so the pattern does not run through the values.

## Instrument icon

The icon is a monochrome domain symbol inside an instrument, not a filled badge. Its frame is decorative. The adjacent text identifies the chain and record, so the whole instrument is `aria-hidden="true"`.

The SVG uses `viewBox="0 0 120 120"`, `fill="none"`, `stroke="currentColor"` and a default stroke of 1 unit. Keep the layers separate:

| Layer           | Geometry                                                  | Appearance                                      |
| --------------- | --------------------------------------------------------- | ----------------------------------------------- |
| Corner brackets | four open corners from 5 to 115, arms ending at 24 and 96 | muted, opacity 0.5                              |
| Ticks           | circle centered at 60/60, radius 49                       | dasharray `1 7.55`, stroke 2, opacity 0.3       |
| Sector marks    | eight short segments near the edges                       | stroke 1, opacity 0.45                          |
| Lock arcs       | two opposite quarter-circles, radius 42                   | panel accent, opacity 0.65                      |
| Axes            | four outer and four inner marks, leaving the center clear | muted, opacity 0.7                              |
| Diamond         | points 60/24, 96/60, 60/96, 24/60                         | panel line color, the faintest continuous shape |
| Domain glyph    | separate centered `UIcon`                                 | muted, no background or colored badge           |

`CHAIN_ICONS` is the mapping owner. Chain glyphs use the monochrome `token` collection. UI actions use Lucide. Check the installed icon name before introducing a new symbol; do not substitute a different chain or a colored brand icon.

### Size and placement

| Viewport         | Instrument | Glyph | Gap to identity |
| ---------------- | ---------- | ----- | --------------- |
| 640 px and wider | 84 px      | 26 px | 18 px           |
| 400-639 px       | 76 px      | 24 px | 14 px           |
| Below 400 px     | 64 px      | 24 px | 12 px           |

The container is square and relatively positioned. The SVG fills it. Center the glyph absolutely with `translate(-50%, -50%)`. The identity column is `minmax(0, 1fr)` and its content has `min-width: 0`.

Do not scale this whole instrument down to a 16 px button. Use a plain glyph there. Do not apply the reticle to every icon on the page. Its detail works because it surrounds one subject.

### Motion

The lock arcs turn from -85° to 0° over 800 ms with `ease-out`. The glyph, frame and identity text stay still. A 700 ms scan line crosses the summary after a record change and fades out. Neither effect loops.

The reticle is keyed by record id. The scan increments only when the id changes. Under reduced motion, the lock animation is disabled and the scan is hidden. The sample controller must also stop automatic cycling while preserving manual navigation. No motion is required to understand the state.

## Full-response viewer

The complete response belongs in `UModal`, not an expanding inline dump. Opening it must not lengthen the page or resize the card.

- Content is capped at `max-w-5xl`, with a small radius and no shadow.
- The text region has `height: min(60dvh, 36rem)`, internal scrolling, `overscroll-behavior: contain` and `white-space: pre`.
- Long lines scroll horizontally inside the viewer on narrow screens. Summary addresses wrap instead.
- Capture the selected sample on opening. The modal title, rendered text and clipboard source all read that snapshot, not the live carousel.
- Use the native dialog's close, focus handling and Escape behavior. Keep the scrollable text keyboard-focusable.
- [tool-response.ts](app/utils/tool-response.ts) classifies plain text into label, URL, date, hash, status and number tokens. It does not convert the response to JSON or normalize whitespace.
- Render token text through Vue interpolation. Never use `v-html`. URL coloring does not make it a link, so no underline is needed.
- Copy `response.tool`, not reconstructed or formatted text. The toolbar identifies the source as `content[0].text`.

## Verification before changing the reference

Compare the actual rendered panel with the two reference images. Inspect the icon at its displayed size, not only enlarged.

- Desktop, 390 px and 320 px: no page overflow, clear glyph, readable labels, longest id and address contained.
- Confirm the font families have loaded. Inspect text and generated OG images after font changes.
- Previous and next controls work at both ends. Hover and keyboard focus pause the sample walk. Input, summary and status refer to one record.
- Open the modal, change the underlying sample, then copy. Title, text and clipboard still match the sample captured on opening. Reopen it to capture the new sample.
- Compare card and document height before and after opening. Only the modal's internal text region should scroll.
- Check Escape, focus restoration, keyboard scrolling and visible focus. Test clipboard with real input events rather than relying on a synthetic click.
- Token concatenation and rendered text equal the original response. Include empty input, CRLF, tabs and HTML-looking text. Existing tests: [tool-response.test.ts](../test/unit/tool-response.test.ts).
- Reduced motion removes scan and rotation without hiding content or breaking manual controls.
- Test every theme the site actually exposes. Do not claim a theme was checked when the screenshot stayed in another mode.

Use the repository's normal build and test gates when implementation changes. A build proves compilation, not the appearance or clipboard behavior. Documentation-only changes need valid links, accurate source references and a reviewed diff, not a pretend UI regression run.
