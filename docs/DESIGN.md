# Design system

The site presents records and tools, not a simulated terminal. Use real identifiers, values and statuses. Geometry gives the panels their character. Extra labels, bright borders and decoration do not.

## Scope and source of truth

This document records the accepted visual direction. [app/app.css](app/app.css) owns shared tokens and the grammar every instrument shares: the clipped shell, the `console-*` labels and rules, the scan line, the corner crosses, the ID bar's tag, file number and hatched mark, the ruler with its cursor, the subject band with its crosses grid, the dashed readout with its circuit link, rows and tick gauge, the leads with their dotted leaders and nodes, the address node, the rule titles and the copy buttons, chips and snippets of the playground. [ConsoleReticle.vue](app/components/content/ConsoleReticle.vue) is the instrument icon and [ConsoleResponse.vue](app/components/content/ConsoleResponse.vue) the `03 Full tool response` row with its dialog; every instrument uses both instead of repeating the SVG or the modal. The previous and next buttons under the landing instruments that walk the samples are `.console-controls` in `app.css`. [LandingRecord.vue](app/components/content/LandingRecord.vue) owns the record file, described under [Record file](#record-file). [LandingCustom.vue](app/components/content/LandingCustom.vue) owns the custom collection files, described under [Custom collection](#custom-collection). [LandingRegistry.vue](app/components/content/LandingRegistry.vue) owns the registry map, described under [Registry map](#registry-map). [LandingHero.vue](app/components/content/LandingHero.vue) owns the hero zone, [LandingLock.vue](app/components/content/LandingLock.vue) the lock instrument under it and [LandingStart.vue](app/components/content/LandingStart.vue) the closing section, described under [Hero](#hero), [Lock instrument](#lock-instrument) and [Start](#start). The ID strip (`console-id`), the boxed actions (`console-action`) and the install line (`console-install`) live in `app.css`, because the hero, the start section and the [footer](#footer) share them. The `--console-*` palette sits on `:root` for the same reason. [tokens.ts](app/utils/tokens.ts) colors TypeScript lines with `tok-*` for every snippet written in a component. [LandingVerify.vue](app/components/content/LandingVerify.vue) owns the landing's verification console: the verdict on the reticle with its shield glyph, and the three calls behind it in one readout, each row the call, the value it returned with a square marker (filled in the accent for a value, hollow for nothing, red for a mismatch) and one sentence on what it means. Values stay short enough for one line (`{ verified: true }`, `{ verified: false, unavailable }`, `{ verified: false, error }`); the derived address or the error goes in the sentence. A container query on the readout (`width < 30rem`) puts every value under its call together, never one row alone; the rows are grids, since a flex row let the sentence ride up beside the call. [AuthorFacts.vue](app/components/content/AuthorFacts.vue) owns what only the author dossier has: its bar and footer, the channels and addresses band, the log on `UTimeline`. [CollectionFacts.vue](app/components/content/CollectionFacts.vue) owns the collection dossier's own parts, described under [Collection dossier](#collection-dossier), and [PuzzleFacts.vue](app/components/content/PuzzleFacts.vue) the puzzle dossier's, described under [Puzzle dossier](#puzzle-dossier). [HintLog.vue](app/components/content/HintLog.vue) is the hint log both dossiers print. [AuthorList.vue](app/components/content/AuthorList.vue) and [CollectionList.vue](app/components/content/CollectionList.vue) are the two rosters, described under [Rosters](#rosters). [PuzzlesPlayground.vue](app/components/content/PuzzlesPlayground.vue) owns the playground's two instruments, described under [Playground](#playground). Change those sources rather than adding a second theme file. Other panels share the typography, palette and flat surfaces, but do not all need clipped corners or targeting marks.

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
- People read these panels. Prose goes in Figtree at 14 to 15 px and values at 13 px or more. A new layer has to carry data or it goes. A panel that needs a legend for every mark has too many marks.
- An identifier inside an uppercase label keeps its case: `Collection / zden`, not `COLLECTION / ZDEN`. Wrap it in `.console-label-key` from `app.css`; chain names and address kinds are labels and stay uppercase.
- Every instrument's bar carries a tag (`Call`, `File`, `ID`, `Start`) before its title, and every footer is `console-footer-plain`, sentence case. Where a response row sits above the footer, the two share one edge.
- The theme comes from the library's domain: bounties, keys, locks, time on chain. A diagram of the implementation is not a hero.

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

The landing's small instruments, the tool console ([LandingToolCall.vue](app/components/content/LandingToolCall.vue)), the verification console ([LandingVerify.vue](app/components/content/LandingVerify.vue)) and the author card ([LandingAuthor.vue](app/components/content/LandingAuthor.vue)), share one anatomy, the dossier's in small:

1. **Bar:** a tag, the call with its argument (`puzzles_show("b1000/71")`, `verify("…")`) or the author's key and file number, the meta, the hatched mark. One line for every sample: the title ends in an ellipsis with the whole call in a `UTooltip`, the meta never wraps and goes below 640 px. Hosts that don't fit the bar move to the footer (`MCP · Pi · OMP / no network`). The argument as a full JSON object broke the bar onto two or three lines for most ids.
2. **Ruler** with the cursor, corner crosses on the shell.
3. **Subject band** on the crosses grid: the reticle with the chain, verdict or author glyph, the label with the key in its own case, the name, one line of chain and address kind or one sentence.
4. **Readout** under the subject, four or five rows at most. The tool console prints prize (accent while open), address shortened with a `UTooltip`, public key and one `On chain` row with the transaction count and start date; the author card its collections as links, puzzles with the open count in the accent, the years active and a tick gauge, all computed from the static facts.
5. **Response row** where the instrument has one, then the footer, sentence case.

Each of them stays within about 40 px of the text column beside it at 1440 and 1024 px; measure both with `getBoundingClientRect()` before handing a change over. Two readout rows merged into one and the arguments moved into the bar took the tool console from 543 to 438 px.

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

The page ([playground.vue](app/pages/playground.vue)) opens with the landing's hero zone, from the shared `hero-*` classes in `app.css`: the ID strip `playground / @agntn/puzzles v…`, the title broken after its first sentence on wide screens, one sentence, three readouts (the tools from `facts`, the collections from the manifest, the one network call) and the verification note as a line of the zone with a `Note` tag. The note had been a callout, a box with its own frame inside the zone's frame, and it didn't sit in the zone. The zone runs into the request through the `call` circuit, the request into the response through the `answer` circuit (`.playground-link`), which draws again on every new call. Everything under the zone reads from the left; `.hero-instrument` resets the zone's centering, and `.hero-instrument-keep` keeps the instruments on a phone, where the landing hides its lock.

The CLI line and the tool JSON are colored with `shellTokens` and `jsonTokens` from [tokens.ts](app/utils/tokens.ts), the same `tok-*` palette as everywhere. The tokens sit in a `<code>`: `.console-snippet > span` colors its direct children and would win over `tok-*`.

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
5. **Hints:** only when the collection carries shared hints. The source and the confirmation share one row of `Source` and `Confirm` tags, the confirmation as its host with the description in a `UTooltip`; two full lead rows per hint made twelve hints half the page. Each entry is the dossier log's grid: date and time on the left, the kind tag and text in Figtree 14 px, then `Source` and `Confirm` leads. A lead shows host, path and query on one line with an ellipsis and the full URL in a `UTooltip`; a confirmation with a description shows the description and its host. Below 640 px the date goes above the text and the leads stay on one line.
6. **Footer:** arrow links to the author and to all collections, the locality meta and the data version in three blocks.

## Puzzle page header

A puzzle page ([[puzzle].vue](app/pages/collections/[collection]/[puzzle].vue)) opens with the hero zone like the landing and the playground: the `console-id` strip with `collections / <collection title>` as links, the id as the title in mono with the collection key dimmed and the name bright, one sentence on the outcome and the prize, and the `get(id)` circuit into the dossier. The sentence leaves the address out, since the dossier prints it with its node; the SEO description keeps it. The title breaks after the slash only (`<wbr>`, each part `inline-block`), and a name wider than the line wraps inside itself.

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
2. **Record:** a rule title `Record [ as written ]` with a copy button, then the literal in a `console-snippet`: the import line, the export and one line per field, colored with `tok-*`, line numbers in a gutter (`console-lines` in `app.css`, which the custom collection files share). Long hex values, keys and the source URL are shortened on screen; the copy button hands out the same lines with every value whole. A wrapped line continues four columns in, never under its number, and breaks after a slash or before a chained call (`<wbr>`) before it breaks a name. Values roll with the sample, the comma with them so it never stands alone.
3. **Footer:** the puzzle id as an arrow link to its page with chain and status in `dimmed`, and the previous and next controls.

Below 640 px the rule title drops its hatched mark. Below 400 px the padding is 14 px, the annotation goes, and the gutter and continuation indent narrow so `hashCollisionPuzzleSha1` still fits at 320 px.

The panel keeps one height for every record, so the page doesn't jump on a rotation. Every line stays on one line (`white-space: pre`, no `<wbr>`, an ellipsis where it doesn't fit; the copy button still hands out every value whole), the path in the bar and the footer too. Under the visible file every walked record from `LANDING_STATIC` is drawn invisibly in the same grid cell (`.record-sizer`), so the cell takes the tallest record's line count. The grid has one `minmax(0, 1fr)` column, or the unbroken lines widen the page. Measured over all 28 samples: 426 px at desktop, 414 px on a phone.

## Custom collection

The landing's custom collection section shows the two files a collection outside the package needs, drawn by [LandingCustom.vue](app/components/content/LandingCustom.vue) on the shared shell. It is static: the example is not a record in `src/collections/`, so nothing walks.

1. **Bar:** `File` tag and `mine.ts`, with the copy button for that file on the right.
2. **Collection:** the module in a `console-snippet console-lines`: the imports, a blank line, the class with its static key and the `super()` call, a blank line, the exported instance. The record comes from `./mine/first`, the way a built-in collection imports its puzzles.
3. **Loader:** a rule title `main.ts [ loads on first get() ]` with its own copy button, then `registerCollection({ key, load })` written over several lines as a formatter would.

Each copy button hands out its file as shown. The lines wrap between words only (`overflow-wrap: break-word`), so a string such as `"./mine"` never splits at its slash. Blank lines stay between imports, declarations and exports; the section keeps its height close to the text column beside it by leaving out the `get()` call, which the annotation names instead. Below 640 px the rule title drops its hatched mark, below 400 px the padding is 14 px and the annotation goes.

## Registry map

The landing's registry section shows which collection modules the sample walk has imported, drawn by [LandingRegistry.vue](app/components/content/LandingRegistry.vue) on the shared shell. It maps the manifest, so it stays short: one cell per key, never one row with a state word per key.

1. **Bar:** `Call` tag and `await get("<id>")` for the sample, with `<loaded> of <keys> loaded` as meta.
2. **Ruler:** the cursor passes once per sample, and loops (`console-cursor-busy`) only while the sample's collection is not yet in `loaded`, because that is the moment its `import()` is in flight.
3. **Manifest:** a rule title `Manifest [ one import() per key ]`, then the keys in manifest order as a grid of as many columns as fit (`minmax(9.5rem, 1fr)`): icon, key, and a 5 px square node. The node is hollow for a key only, outlined in the accent once the module loaded, filled for the collection the walk shows; a loaded key turns `highlighted`, the shown one the accent. A key that doesn't fit ends in an ellipsis, and every cell carries a `UTooltip` and an accessible name with the key and its state (`not loaded`, `import() in flight`, `loaded, <count> records`). Each cell links to its collection page.
4. **Note:** one sentence in the sans face with the live count of keys still unloaded.
5. **Footer:** `One chunk per collection` and an arrow link to the shown collection.

Below 400 px the padding is 14 px, the annotation goes and the cells narrow to `8rem`; at 320 px that is one column, since two would cut most keys.

## Page edges

Two gutters, one per kind of page, and the header, the content and the footer always share the one the page uses.

- **Docs pages** keep the Nuxt UI container (`px-4 sm:px-6 lg:px-8`): 32 px at desktop, 16 px on a phone. Wider gutters beside both asides looked roomy for nothing.
- **Pages built on `.puzzles-landing`**, the landing, the playground and a puzzle page, use `px-8 sm:px-12 lg:px-16`: 64 px at desktop, 32 px on a phone. The narrow docs gutter there read as cramped on a large screen. `.hero-page` takes the same gutters, and a rule in `app.css` (`html:has(.puzzles-landing)`) gives the header's and the footer's container the same padding, so the package name lines up with the content. It updates on client navigation too.

Inside a page every section shares one left and one right edge: the hero zone and its instrument have no width of their own, and an instrument beside text sits on the container's outer edge (`margin-inline: auto 0` on the right, `0 auto` on the left, from `LandingFeature.vue`), never centered in its column. At 1440 px the landing spans 64 to 1376 px. Measure the logo, the leftmost content edge of each section and the footer with `getBoundingClientRect()` after a layout change.

## Feature sections

[LandingFeature.vue](app/components/content/LandingFeature.vue) sets the text beside each landing instrument: the title and the paragraph in Figtree, the points on a rail of ticks with a square node each, like the sidebar, and the link as the `Read` tag, the page's name in mono and an arrow in the accent. Inline code in that copy is `.puzzles-code`, the docs' boxed value, at 13 px. The sections are split by the panel line with ticks under it (`.puzzles-section`), like the site header's edge.

## Hero

The zone's styles (`hero-page`, `hero-zone`, brackets, crosses, title, lead, readouts, share bar, circuit) live in `app.css`, since the landing and the playground both draw it. [LandingHero.vue](app/components/content/LandingHero.vue) draws the landing hero as one zone above the lock instrument. The zone and the instrument share the 72rem width, so their edges line up.

1. **Zone:** open brackets on both sides with a short thick mark near the top, crosses above the corners, the crosses grid behind it. The amber halo sits in the upper half and fades out before the instrument.
2. **ID strip:** `console-id` with the `ID` tag, the package, its version and the data version in blocks of four.
3. **Title and lead:** Figtree, the title in two tones. The lead quotes no counts, the metrics carry them.
4. **Metrics:** records, unclaimed BTC with the other currencies under it, open over total. One row of three, a label over a 28 px tabular value. Below 640 px the row keeps three columns at 20 px and the unit drops under the value.
5. **Share bar:** closed records hatched, open ones an accent outline, both counts under it. One split only. A bar per collection was tried and read as noise.
6. **Actions:** `console-action` segments 34 px high. The label is mono uppercase, the glyph sits in its own cell behind a rule, the top right corner is cut by 8 px. The primary one fills with the accent. The frame uses the quiet panel line and turns to a dimmed accent on hover.
7. **Install:** `console-install`, a dashed outline with corner brackets, the `Install` tag, the command and the copy button. Below 400 px the tag goes.
8. **Circuit:** a dotted rail from the zone's center down to the instrument's bar, a jog to the right, a node on the bar and a boxed `get(id)` tag. The accent runs down the rail once per sample.

Below 48rem the instrument is hidden and the zone ends the hero.

## Lock instrument

[LandingLock.vue](app/components/content/LandingLock.vue) shows the walk's sample as a combination lock on the shared shell (`tool-console console-wide`). A puzzle is a prize behind a key someone has to find, and the lock says that at a glance. It replaced a diagram of the manifest and `import()`, which the registry map already shows.

1. **Bar:** `Call` tag, `await get("<id>")`, the sample's number on the walk, chain and address kind as meta. The ruler's cursor loops while the collection's module loads.
2. **Subject band:** the dial where the dossiers put their reticle, the record beside it.
   - **Dial:** one position per collection, in manifest order. The ring is each collection's bounty: the closed share hatched, the open share in the accent, the active position in full accent. A notch per position inside the ring and a longer one every six, frame corners outside. The wedge and its pointer turn the short way to the collection, 700 ms with a slight overshoot, like a dial clicking into place. Lock arcs around the hub turn once per record.
   - **Hub:** the lock glyph and the state word, then the collection key. `locked` is in the accent, `solved`, `claimed` and `swept` show an open lock, `expired` a timer.
   - **Record:** the `Puzzle / <key>` label keeps the key in its own case. Then the id at 28 px, one Figtree sentence about the target, and four readouts in one row: prize, key (the search range of a numbered puzzle, otherwise the key material published), the address shortened with a `UTooltip`, verify.
3. **Time band:** `On chain [ first year to last year ]`, one axis of years for every sample, read off `FACTS_STATIC` so there is no clock. The record's span runs from start to solve, hatched, with a hollow node at the start and a filled one at the end, so a solve of a few days still shows. An unsolved record runs to the end of the axis in the accent. The label reads `locked since <date>` or `held <solve time>`.
4. **Footer:** the locality meta and the id as an arrow link.

The dial stays sparse on purpose. Rotated labels for all 24 keys, a graduation, axis marks, rim circuits and faint spans of the other samples were all tried, and each read as clutter. Below 72rem the dial column narrows to 14rem and the readouts go two by two.

## Start

[LandingStart.vue](app/components/content/LandingStart.vue) closes the landing on the shared shell.

1. **Bar:** `Start` tag, the install command, `Node.js 24 or newer` from `engines` as meta.
2. **Copy:** the title in Figtree, one sentence, three notes as boxed tags (`Pin`, `Data`, `Balance`) with a sentence each, then the two actions.
3. **First lookup:** a rule title `First lookup [ index.ts ]` with a copy button over a numbered snippet: install, import, `get("b1000/71")`, `status()` and `address()` with their values in comments, and the same lookup from the CLI. The values come from `LANDING_STATIC`, so the fixture test pins them. Shell lines get a dimmed prompt, TypeScript goes through `tokens()`.
4. **Footer:** the license meta and an arrow link to the CLI guide.

Below 56rem the two columns stack. Below 640 px the rule title drops its annotation and hatched mark.

## Footer

[AppFooterLeft.vue](app/components/AppFooterLeft.vue) overrides the Docus footer on every page: the `console-id` strip with the package, its version and the license link, then one Figtree sentence. It imports no landing fixture, so a docs page doesn't pull the walk's data for it.

## Callouts

`::warning`, `::caution`, `::note` and `::tip` render through [PuzzlesCallout.vue](app/components/PuzzlesCallout.vue). The four `Prose*` files in `app/components/content/` override the Nuxt UI ones and pass their kind. A plain alert box with a coloured bar read as a generic component, not as part of the family.

1. **Strip:** 44 px on the left, hatched in the kind's colour, the glyph boxed at the top. Amber for warning, red for caution, muted for note, green for tip.
2. **Shell:** the clipped outline with both cuts and the corner crosses, like every instrument.
3. **Bar:** the kind as a boxed tag in its colour, then the title from the markdown (`::warning{title="Pre-1.0"}`) in the instrument's title face, the hatched mark before the cut. Without a title the bar holds the tag alone.
4. **Ruler**, then the text in Figtree 14 px in the reading colour, not tinted.

The title is an attribute, so the body doesn't repeat it in bold. The glyphs come from `appConfig.ui.icons`, where Nuxt UI keeps the note's under `info`; the other kinds use their own name. Below 640 px the strip narrows to 32 px and the title wraps under the tag.

## Code blocks

Fenced code in the docs renders through [ProsePre.vue](app/components/content/ProsePre.vue), which overrides the Nuxt UI block and keeps its props (`code`, `language`, `filename`, `highlights`, `hideHeader`, `copy`), so markdown needs no change.

1. **Shell:** the clipped outline with both cuts, like the callouts.
2. **Bar:** the language as a boxed tag in its reader's name (`ts`, `shell`, `json`), the filename in the title face when the block has one, the hatched mark and the `console-button` copy.
3. **Ruler**, then the lines with numbers in a gutter like the landing's snippets. A highlighted line gets the accent edge. Long lines scroll inside the block; the page never does.

The colours come from [shiki-theme.ts](shiki-theme.ts), a Shiki theme whose every colour is a `--shiki-token-*` variable from `app.css`. The landing's `tok-*` classes read the same variables, so a snippet looks the same in a panel and on a page: keywords amber, calls light amber, strings blue, comments grey, names, punctuation and numbers in the text colour. `nuxt.config.ts` uses the theme for both modes and imports only its type from `shiki`.

## Tables and inline code

Markdown tables render through [ProseTable.vue](app/components/content/ProseTable.vue), which overrides the Nuxt UI one with the roster's grammar: the clipped shell with corner crosses, the ruler on the tinted band, the column names as field labels (10 px mono uppercase), rows split by a quiet inset rule, cells in Figtree 14 px. A row tints on hover. Wide tables scroll inside the shell.

Inline code carries `.puzzles-code` from `app.config.ts` (`ui.prose.code`), styled in `app.css`: a boxed value with one quiet edge like the tags, no radius, no fill, the identifier in the highlight colour. It applies everywhere prose uses backticks, callouts and tables included.

## Page header links

[DocsPageHeaderLinks.vue](app/components/DocsPageHeaderLinks.vue) overrides the Docus copy controls with the same actions. The copy button and the menu trigger are boxed segments 30 px high in one frame with the top right corner cut, the glyph in its own cell, the label in mono uppercase. The trigger's glyph lights in the accent while the menu is open.

The menu is a `UDropdownMenu` in the tooltip's grammar: one quiet edge with a 14 px accent segment at the top left, the top right corner cut by 9 px, no radius or shadow, items in mono 12 px, a quiet rule between groups. A highlighted item gets the accent edge and its glyph lights. The classes (`.puzzles-menu*`) live in `app.css` because the menu renders in a portal, outside the component's scope. It opens from the keyboard with the arrow keys.

## Page header rule

Every docs page header ends in a section rule instead of a border: a dot, the line with ticks every 12 px under it, and a hatched block at the end, drawn by `.puzzles-page-header` in `app.css` (hooked in `ui.pageHeader.slots.root`). The rule sits on the header's bottom edge and the body right under it starts 20 px below, so the gap under the line matches the one above it.

## Page foot

Under every docs page, two parts:

1. **Edit and report:** the Docus separator keeps its markup; `app.css` targets it with `[role="separator"]:has(a[href*="/edit/"])`, because `USeparator` also sits in the header and asides. The rule starts at a dot and ends in a hatched block, the two links are boxed buttons in mono uppercase, the `or` is hidden. Below 640 px the buttons wrap and the block goes, so the page never scrolls sideways.
2. **Previous and next:** [UContentSurround.vue](app/components/UContentSurround.vue) overrides the Nuxt UI surround with two small instruments like the callouts: a hatched strip with the arrow boxed, the clipped shell with corner crosses, a bar with the direction as a boxed tag, the page title and the hatched mark, the ruler, the description in Figtree and the path in mono. On hover the edge and the arrow turn toward the accent. The next card mirrors the strip to the right. Below 640 px the cards stack.

## Site header

The Docus header in the family's grammar. Classes hook in `app.config.ts` (`ui.header`, `ui.contentSearchButton`, `ui.kbd`), the look lives in `app.css`, and the logo and the area links are overrides.

1. **Logo:** [AppHeaderLogo.vue](app/components/AppHeaderLogo.vue), the lock from the landing's instrument in a boxed cell with the top right corner cut, in the accent, then `@agntn/` dimmed and `puzzles` bright in mono 14 px, then the version as a boxed tag, hidden below 400 px.
2. **Areas:** [AppHeaderCTA.vue](app/components/AppHeaderCTA.vue), `Docs` (lit on the guide, the collections and the authors) and `Playground`, mono uppercase with the sidebar's square node, filled in the accent for the area you are in. The docs sections moved to the tabs, so they aren't repeated here.
3. **Search:** the field is the family's input, a dashed outline with corner brackets on a faint tint, the prompt in mono, the glyph in the accent. Keys are boxed tags everywhere. The modal (`ui.contentSearch.slots.modal`) is the clipped shell with both cuts and an accent segment, no radius or shadow; the palette (`ui.commandPalette`) opens with the input row as an instrument bar, tinted with ticks under it, the close button a quiet boxed cell; group labels are section titles in mono uppercase with a rule from a dot; a result is the page name in mono and its description in Figtree, the highlighted one on the accent edge with its glyph lit, matches in the accent. The classes live in `app.css` because the modal is portalled; `UCommandPalette` is used nowhere else, so the global slots touch only the search.
4. **Icon buttons:** GitHub, and on a phone search and the menu, sit in boxed cells; the glyph lights in the accent on hover.
5. **Bottom edge:** the quiet panel line with ticks every 12 px, like the ruler.
6. **Section tabs:** `navigation.sub: "header"` turns on the Docus row under the header, drawn by [AppHeaderBottom.vue](app/components/AppHeaderBottom.vue): the sections from `useSubNavigation().sections` as tabs, glyph and mono label, the section you are in with its glyph in the accent and an accent segment on the bottom edge. A new section becomes a tab by itself. The row shows on docs pages from `lg` up; the landing has none.

With the tabs the sidebar holds the current section only, title included, so the lists can grow without turning the aside into one long column. The mobile menu has no tabs, so [AppHeaderBody.vue](app/components/AppHeaderBody.vue) renders the sidebar with every section (`full`).

## Sidebar

[DocsAsideLeftBody.vue](app/components/DocsAsideLeftBody.vue) draws the docs navigation in the table of contents' grammar, so both asides rhyme. [AppHeaderBody.vue](app/components/AppHeaderBody.vue) renders the same component in the mobile menu, so one navigation serves both. The tree and its icons come from `useSubNavigation`.

1. **Group title:** the glyph boxed in a 24 px cell in the accent, the name in mono uppercase at 12 px in the highlight colour, a rule from a dot and the hatched block. A page count was tried and dropped: it counted the overview too and said 25 next to a site that says 24 collections.
2. **Pages:** on a rail of ticks every 12 px, icon and name in Figtree 13.5 px. The page on screen gets a square node in the accent on the rail, the name in the highlight colour and the icon in the accent. Pages under a page sit indented with a short tick.
3. **Index row:** the page whose path is the section's own, the overview of the collections and the authors or the guide's first page, is lifted out of the list and stands between the title and the entries as a lead: the boxed `Index` tag, its name, a dotted leader and a node, lit in the accent on that page. An overview listed among the entities read as one of them.
4. **Width:** the lists are grids with one `minmax(0, 1fr)` column, so a long name ends in an ellipsis instead of stretching the aside into a sideways scroll.

## Table of contents

[DocsAsideRight.vue](app/components/DocsAsideRight.vue) overrides the Docus right aside on wide screens. A section title like the instruments' opens it. The list hangs on a rail of ticks every 12 px, like the ruler turned upright. Top level entries are numbered `01`, `02` in mono and carry a square node on the rail; the sections in view fill it in the accent and light their number. Subsections sit past the number column with a short tick, the one in view in the accent. The text stays in Figtree at 13 px. The aside's root is the sticky element, since it sits in the page's full height right column. The active headings come from Nuxt UI's `useScrollspy`, refreshed on mount and on page load and transition like the original. Below `lg` the Nuxt UI toc and the Docus mobile bar stay.

The layouts with a right aside get one grid track per panel (`ui.page` in `app.config.ts`): the toc takes `min(13.75rem, 20%)` and the text the rest, so the toc is about 220 px on a large screen instead of Nuxt UI's 186, and the text keeps 833 px, above the 52rem the rosters and dossiers need before they stack. A toc of 263 px took the text to 790 px and folded every roster on a large desktop. The left menu layout keeps the Nuxt UI ten column grid.

## Registry map on the landing

[LandingRegistry.vue](app/components/content/LandingRegistry.vue): the bar `Call get("id")` with `manifest` as meta and the hatched mark, corner crosses, the manifest cells on the crosses grid, and a gauge instead of a paragraph: one tick per key, loaded ones hatched, the walk's collection taller in the accent, read as `loaded 13 / 24 · 11 still keys`. Only the shown collection is in the accent; a loaded key is highlighted text with a hatched node. The sentence about `import()` is the footer's meta.

## Rosters

`::author-list` in [AuthorList.vue](app/components/content/AuthorList.vue) and `::collection-list` in [CollectionList.vue](app/components/content/CollectionList.vue) index the author and collection pages, and [LandingCollections.vue](app/components/content/LandingCollections.vue) prints the collection roster on the landing. The rows are a `UTable` inside the clipped shell with the corner crosses. Everything except that shell and the ruler's ticks, which stay in `app.css` as `.roster` and `.roster-ruler`, is Tailwind utilities from `app/utils/roster.ts`: `ROSTER_TABLE_UI` for the table's `ui` prop, `ROSTER_CLASS` for the bar, footer and cell parts every roster shares.

1. **Bar:** the call, `authors()` or `collections()`, and the row count in the meta. The collection roster names its order there too, `largest first` or `by key ascending`.
2. **Ruler** of thin ticks, no cursor.
3. **Header:** the column names as field labels, 10 px mono uppercase in `dimmed`. A sortable column's name is a `RosterSort` button: its arrow shows the direction, and a click steps through the first direction, the other one, and back to the order the rows came in. Text sorts A to Z first, counts largest first. The about column doesn't sort.
4. **Rows:** icon and name as the page link, the key in a boxed tag, the one line about it, then a dotted leader into the last column. An author row ends in its collection keys and puzzle count. A collection row carries its chain glyphs next to the key, each in a `UTooltip`, and ends in `77 of 256 open` with the open count in the accent, or `open` and `closed` for a single puzzle; a bare `256` and an unsolved count on a second line read as two unlabeled numbers. Collections start largest first, and a wrapped name keeps the row on its first line's baseline.
5. **Footer:** the locality meta and the call that opens one row.
6. **Landing:** the bar carries the `Call` tag and the hatched mark, its meta hides below 640 px; the open column's header is right aligned like its values; the key and its chain glyphs stay on one line; the row of the collection the walk shows gets the accent edge on its first cell and a faint tint, not a full tinted row. The entry path sits under the section's copy as an `Import` lead instead of inline code, which broke the sentence at every width. The same collection roster, read off `FACTS_STATIC` so it renders before any collection loads. It keeps the manifest order, adds an unclaimed column with the prize the CLI prints (`none` in `dimmed` when nothing is left) and gives the row of the collection the walk is showing the `--puzzles-cell-active` background through the table's `meta.class.tr`. Its footer links to the custom collection guide. Every cell holds one line: a long name or blurb ends in an ellipsis with the whole text in a `UTooltip`, since the collection page prints it in full. The cells are `align-middle` and the name link a block `flex`, because on the roster's baseline a clipped name rode above the row with a gap under it. Narrow, the open count and the prize share one line.

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
