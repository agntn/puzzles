# Design system

The site presents records and tools, not a simulated terminal. Use real identifiers, values and statuses. Geometry gives the panels their character. Extra labels, bright borders and decoration do not.

## Scope and source of truth

This document records the accepted visual direction. [app/app.css](app/app.css) owns shared tokens and the grammar every instrument shares: the clipped shell, the `console-*` labels and rules, the scan line, the corner crosses, the ID bar's tag, file number and hatched mark, the ruler with its cursor, the subject band with its crosses grid, the dashed readout with its circuit link, rows and tick gauge, the leads with their dotted leaders and nodes, the address node, the rule titles and the copy buttons, chips and snippets of the playground. [ConsoleReticle.vue](app/components/content/ConsoleReticle.vue) is the instrument icon and [ConsoleResponse.vue](app/components/content/ConsoleResponse.vue) the `03 Full tool response` row with its dialog; every instrument uses both instead of repeating the SVG or the modal. The previous and next buttons under the landing instruments that walk the samples are `.console-controls` in `app.css`. [LandingRecord.vue](app/components/content/LandingRecord.vue) owns the record file, described under [Record file](#record-file). [LandingRegistry.vue](app/components/content/LandingRegistry.vue) owns the registry map, described under [Registry map](#registry-map). [LandingVerify.vue](app/components/content/LandingVerify.vue) owns the landing's verification console: the sample's verdict on the reticle with its shield glyph, and the three calls behind it in a dashed readout, each with the value it returned, a square marker (filled in the accent for a value, hollow for nothing, red for a mismatch) and one line on what the value means. [AuthorFacts.vue](app/components/content/AuthorFacts.vue) owns what only the author dossier has: its bar and footer, the channels and addresses band, the log on `UTimeline`. [CollectionFacts.vue](app/components/content/CollectionFacts.vue) owns the collection dossier's own parts, described under [Collection dossier](#collection-dossier), and [PuzzleFacts.vue](app/components/content/PuzzleFacts.vue) the puzzle dossier's, described under [Puzzle dossier](#puzzle-dossier). [HintLog.vue](app/components/content/HintLog.vue) is the hint log both dossiers print. [AuthorList.vue](app/components/content/AuthorList.vue) and [CollectionList.vue](app/components/content/CollectionList.vue) are the two rosters, described under [Rosters](#rosters). [PuzzlesPlayground.vue](app/components/content/PuzzlesPlayground.vue) owns the playground's two instruments, described under [Playground](#playground). Change those sources rather than adding a second theme file. Other panels share the typography, palette and flat surfaces, but do not all need clipped corners or targeting marks.

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

## Playground

The playground is two instruments of the dossier family stacked at full width, never side by side: the dossier's readout and bands need the width, and a 2/5 column squeezed them.

1. **Request:** bar with the `CALL` tag, the tool name and its file number among the eight operations, the hosts as meta and the hatched mark; the ruler with one cursor sweep on load. One band in two columns: the operations as leads (tag, tool name, leader, node; the pressed one gets the accent) with the chosen tool's description from `facts` under them, and the input as a dashed readout whose rows hold the form controls, followed by the sample chips and the operation's note. A second band, also in two columns, prints the same call as a CLI line and as the JSON an MCP client sends, each under a rule title with its copy button. The footer carries the permalink as an arrow link and the meta `every state is a link`.
2. **Response:** bar with the operation's tag, the call as `puzzles_show("b1000/71")` and a truthful meta (the status, the match count, the error name). The ruler's cursor sweeps once per answer and the scan line crosses the subject band once per answer. A `show`, `verify`, `balance`, `author` and `stats` answer fills the subject band: reticle with the chain, verdict or author kind glyph, label, name and one sentence on the left, the dashed readout on the right. A record adds its literal under the sentence, factory, address builder, status and key chain colored with the landing's `tok-*` classes, long values shortened on screen and copied whole; the block wraps and never scrolls. The readout's gauge shows one tick per transaction for a record and one tick per puzzle for the totals, the open ones in the accent. A record adds a trail band: page, explorer and source as leads, the address with its node and the balance line. A `list`, `collections` and `authors` answer is rows with a leader to the last column. An error fills the subject band alone. The `03 Full tool response` row and the footer with its arrow links, locality and the measured milliseconds close the instrument.

Motion is one-shot and transform only, as everywhere in the family: the operation leaders draw from the left once on load, 60 ms apart; the readout rows and the list rows slide in 8 px from the left once per answer, 45 and 30 ms apart; the request ruler's cursor sweeps once on load and the response ruler's once per answer. The one loop is the response cursor while a call is in flight, because a call in flight is a change in progress; it stops with the answer. The bar of a list or collections answer carries one 2 px tick per row, hatched when closed and open in the accent when unsolved, and the snippets get the readout's corner brackets. Reduced motion removes every animation and both cursors.

Below 80rem the operations fall into one column, below 56rem the two-column bands stack, and the dossier breakpoints apply to the rest.

## Collection dossier

A collection page opens with a dossier on the shared console shell (`tool-console console-wide`), not a grid of fact cells.

1. **Bar:** `ID` tag, the key and its file number among the registered collections (`16 / 20`, manifest order), the puzzle count and the start date range as meta, the hatched mark.
2. **Subject band:** reticle with the collection's icon from `puzzles.ts`, the `Collection` label, the display title, key and chains, the blurb. The readout has three rows like the author's: author as a link, prize recorded, still unsolved in the accent (`none` in plain text when nothing is open), and the tick gauge, one tick per puzzle.
3. **Census:** one counter per status in record order, then public and private keys after a brighter divider. Each counter is a 10 px label, an 18 px tabular number with its share as a dimmed percent, and a 2 px bar of that share; the unsolved bar is in the accent, like the open ticks. The bars grow from the left once on load.
4. **Access:** leads for `getCollection("<key>")`, the sample in the playground and, for more than one puzzle, the list in the playground.
5. **Hints:** only when the collection carries shared hints. Each entry is the dossier log's grid: date and time on the left, the kind tag and text in Figtree 14 px, then `Source` and `Confirm` leads. A lead shows host, path and query on one line with an ellipsis and the full URL in a `UTooltip`; a confirmation with a description shows the description and its host. Below 640 px the date goes above the text and the leads stay on one line.
6. **Footer:** arrow links to the author and to all collections, the locality meta and the data version in three blocks.

## Puzzle dossier

A puzzle page, and the page of each singleton collection, is one record on the shared shell (`tool-console console-wide`), drawn by [PuzzleFacts.vue](app/components/content/PuzzleFacts.vue). The literal, the readout rows, the solve date and the transaction ticks come from [record.ts](app/utils/record.ts), the same helpers the playground's `show` answer uses, so both print a record the same way.

1. **Bar:** `ID` tag, the puzzle id and its file number in the collection (`66 / 256`, record order, left out for a singleton), the start date and, once solved, `→` the solve date as meta, the hatched mark.
2. **Subject band:** reticle with the chain glyph, the `Puzzle / <collection title>` label, the name, chain, address kind, `StatusPill` and a `pre-genesis` flag with its meaning in a tooltip. Under them the record as written, colored with `tok-*`, long values shortened on screen and copied whole. The readout has four rows: prize (in the accent while unsolved), key material, verification, solved; the gauge has one tick per transaction, money out open in the accent.
3. **Trail:** explorer, source, solver and the playground as leads on the left; the address with its node and copy button, hash160 or redeem script under it, and the live balance on the right. Below 900 px the two columns stack.
4. **Key:** only when the record carries one: public key with its format, the search range for a numbered puzzle, then every key row `puzzle-view.ts` builds, label on the left and the full value wrapping on the right.
5. **Transactions:** `console-rows`, type, date, amount, a leader and the shortened txid linked to the explorer with the full txid in a tooltip; money out in the accent. Eight rows, then a button for the rest. Below 640 px the txid goes under the row instead of the leader.
6. **Files and hints:** the record's images and files in flat 1 px frames with their label tag, then the hint log, the collection's shared hints first with a `collection` tag.
7. **Responses:** `03 Full tool response` opens what `puzzles_show` prints, `04 Serialized record` opens `puzzle.toJSON()`, both in the `ConsoleResponse` dialog, so neither lengthens the page.
8. **Footer:** previous and next puzzle and, outside a singleton, the collection as arrow links, and the meta `local record / balance from the explorer`, because the balance is the one value the page asks the worker for.

## Puzzle list

`::collection-puzzles` in [CollectionPuzzles.vue](app/components/content/CollectionPuzzles.vue) closes a collection page on the same shell (`tool-console console-wide`).

1. **Bar:** `List` tag and `<key>.all()`; the meta carries one 2 px tick per puzzle for a named collection, the puzzle count and the status counts in record order, the unsolved count in the accent; the hatched mark.
2. **Ruler** with one cursor sweep.
3. **Named collection:** `console-rows`, one per puzzle: name as the page link, `StatusPill`, prize, a dotted leader into the shortened address, then the public key and private key glyphs, the key in the accent. Rows slide in once, 30 ms apart. Below 640 px the prize goes under the name and the address is dropped.
4. **Numbered collection:** a grid of square cells, `auto-fill` from 2.5 rem. A closed cell stands on a 3 px hatched strip, red hatching for `swept`; an open cell has no strip and a half accent edge, the full accent on hover. A 3 px square in the top right corner marks a published private key.
5. **Footer:** what a name or a cell opens and what the marks mean, the locality meta.

Every value a row shortens or a cell hides is in a `UTooltip`, never a `title`. The tooltip is themed once in `app.config.ts` (`ui.tooltip`) with `.puzzles-tooltip` in `app.css`: one quiet 1 px edge with a 14 px amber segment at the top left, the top right corner cut by 7 px, mono 11 px, no shadow, radius or scale animation, and it wraps so a full address fits. A structured tooltip uses the `#content` slot with `puzzles-tooltip-value`, `puzzles-tooltip-sep` and `puzzles-tooltip-open`.

## Record file

The landing's data as code section shows the sample's module on the shared shell, drawn by [LandingRecord.vue](app/components/content/LandingRecord.vue). It is the file, not a dossier: no reticle, no readout, because the puzzle page already has both.

1. **Bar:** `File` tag and the module path, `src/collections/<key>/<name>.ts`, with the field count as meta. The path rolls to the next one with the sample.
2. **Record:** a rule title `Record [ as written ]` with a copy button, then the literal in a `console-snippet`: the import line, the export and one line per field, colored with `tok-*`, line numbers in a gutter. Long hex values, keys and the source URL are shortened on screen; the copy button hands out the same lines with every value whole. A wrapped line continues four columns in, never under its number, and breaks after a slash or before a chained call (`<wbr>`) before it breaks a name. Values roll with the sample, the comma with them so it never stands alone.
3. **Footer:** the puzzle id as an arrow link to its page with chain and status in `dimmed`, and the previous and next controls.

Below 640 px the rule title drops its hatched mark. Below 400 px the padding is 14 px, the annotation goes, and the gutter and continuation indent narrow so `hashCollisionPuzzleSha1` still fits at 320 px.

## Registry map

The landing's registry section shows which collection modules the sample walk has imported, drawn by [LandingRegistry.vue](app/components/content/LandingRegistry.vue) on the shared shell. It maps the manifest, so it stays short: one cell per key, never one row with a state word per key.

1. **Bar:** `Call` tag and `await get("<id>")` for the sample, with `<loaded> of <keys> loaded` as meta.
2. **Ruler:** the cursor passes once per sample, and loops (`console-cursor-busy`) only while the sample's collection is not yet in `loaded`, because that is the moment its `import()` is in flight.
3. **Manifest:** a rule title `Manifest [ one import() per key ]`, then the keys in manifest order as a grid of as many columns as fit (`minmax(9.5rem, 1fr)`): icon, key, and a 5 px square node. The node is hollow for a key only, outlined in the accent once the module loaded, filled for the collection the walk shows; a loaded key turns `highlighted`, the shown one the accent. A key that doesn't fit ends in an ellipsis, and every cell carries a `UTooltip` and an accessible name with the key and its state (`not loaded`, `import() in flight`, `loaded, <count> records`). Each cell links to its collection page.
4. **Note:** one sentence in the sans face with the live count of keys still unloaded.
5. **Footer:** `One chunk per collection` and an arrow link to the shown collection.

Below 400 px the padding is 14 px, the annotation goes and the cells narrow to `8rem`; at 320 px that is one column, since two would cut most keys.

## Rosters

`::author-list` in [AuthorList.vue](app/components/content/AuthorList.vue) and `::collection-list` in [CollectionList.vue](app/components/content/CollectionList.vue) index the author and collection pages, and [LandingCollections.vue](app/components/content/LandingCollections.vue) prints the collection roster on the landing. The rows are a `UTable` inside the clipped shell with the corner crosses. Everything except that shell and the ruler's ticks, which stay in `app.css` as `.roster` and `.roster-ruler`, is Tailwind utilities from `app/utils/roster.ts`: `ROSTER_TABLE_UI` for the table's `ui` prop, `ROSTER_CLASS` for the bar, footer and cell parts every roster shares.

1. **Bar:** the call, `authors()` or `collections()`, and the row count in the meta. The collection roster names its order there too, `largest first` or `by key ascending`.
2. **Ruler** of thin ticks, no cursor.
3. **Header:** the column names as field labels, 10 px mono uppercase in `dimmed`. A sortable column's name is a `RosterSort` button: its arrow shows the direction, and a click steps through the first direction, the other one, and back to the order the rows came in. Text sorts A to Z first, counts largest first. The about column doesn't sort.
4. **Rows:** icon and name as the page link, the key in a boxed tag, the one line about it, then a dotted leader into the last column. An author row ends in its collection keys and puzzle count. A collection row carries its chain glyphs next to the key, each in a `UTooltip`, and ends in `77 of 256 open` with the open count in the accent, or `open` and `closed` for a single puzzle; a bare `256` and an unsolved count on a second line read as two unlabeled numbers. Collections start largest first, and a wrapped name keeps the row on its first line's baseline.
5. **Footer:** the locality meta and the call that opens one row.
6. **Landing:** the same collection roster, read off `FACTS_STATIC` so it renders before any collection loads. It keeps the manifest order, adds an unclaimed column with the prize the CLI prints (`none` in `dimmed` when nothing is left) and gives the row of the collection the walk is showing the `--puzzles-cell-active` background through the table's `meta.class.tr`. Its footer links to the custom collection guide. Every cell holds one line: a long name or blurb ends in an ellipsis with the whole text in a `UTooltip`, since the collection page prints it in full. The cells are `align-middle` and the name link a block `flex`, because on the roster's baseline a clipped name rode above the row with a gap under it. Narrow, the open count and the prize share one line.

The columns collapse on the table's own width, `@container/roster` with `@max-[52rem]/roster:` variants, not the window's: beside both sidebars at 1024 px the roster is 600 px wide, and a window breakpoint left the about column 14 px wide there. Narrow, the header is hidden from sight but kept for screen readers, and the about line and the last column take full rows under the name and key.

A new sort slides every row from its old place to the new one, 320 ms of `transform` through `useRosterFlip`, with no other motion and none under reduced motion. Rows carry the canvas colour, so one sliding past another covers it instead of mixing the text. With that background a collapsed border would vanish under the next row, so the header line and the row dividers are inset shadows.

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
