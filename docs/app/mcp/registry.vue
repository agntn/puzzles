<script setup lang="ts">
import type { RegistryCollection, RegistryCounts, RegistryView } from "#shared/registry";

defineMcpApp({
  name: "puzzles_registry",
  title: "Puzzle Registry",
  description:
    "Opens the puzzle registry for the user to browse: every collection with its puzzles, statuses and prizes, each linked to its page on puzzles.agntn.dev. The model gets the totals only. To read a record, call puzzles_show.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  _meta: { "openai/ui": { entrypoints: [{ type: "global" }, { type: "thread" }] } },
  handler: async () => {
    const [{ collections }, { COLLECTIONS }, { registryCounts, registryText, registryView }] =
      await Promise.all([
        import("@agntn/puzzles"),
        import("~/utils/puzzles"),
        import("#shared/registry"),
      ]);
    const view = registryView(await collections(), COLLECTIONS);
    const counts = registryCounts(view);
    return {
      content: [{ type: "text", text: registryText(counts) }],
      structuredContent: { ...counts },
      _meta: { registry: view },
    };
  },
});

const { meta, loading, error, hostContext, openLink, sendPrompt } = useMcpApp<RegistryCounts>();

/**
 * Reads the rows from the result's `_meta`, which ChatGPT hands to the app and not to the model.
 *
 * @param {unknown} value - The `registry` key of that `_meta`.
 * @returns {value is RegistryView} Whether it holds a row list.
 */
function isRegistry(value: unknown): value is RegistryView {
  return (
    typeof value === "object" && value !== null && Array.isArray(Reflect.get(value, "collections"))
  );
}

const collections = computed<readonly RegistryCollection[]>(() => {
  const registry = meta.value?.["registry"];
  return isRegistry(registry) ? registry.collections : [];
});

/** The host's theme once it says, the system's until then. */
watchEffect(() => {
  const theme =
    hostContext.value?.theme ??
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.classList.toggle("dark", theme === "dark");
});

const PAGE = "https://puzzles.agntn.dev/collections/";
/** The longest search the box takes, the same cap as the collections index. */
const TEXT_MAX = 64;

type State = "" | "open" | "closed";

const text = ref("");
const state = ref<State>("");
const picked = ref<string | undefined>();

const query = computed(() => text.value.trim().toLowerCase());

/**
 * Whether the search names the collection itself, by key, title or author.
 *
 * @param {RegistryCollection} collection - The row.
 * @returns {boolean} `true` with no search, or when one of those holds it.
 */
function namesCollection(collection: RegistryCollection): boolean {
  return [collection.key, collection.title, collection.author ?? ""].some((value) =>
    value.toLowerCase().includes(query.value),
  );
}

/**
 * The puzzles a row lists: all of them, unless the search found the row through a puzzle id.
 *
 * @param {RegistryCollection} collection - The row.
 * @returns {readonly RegistryCollection["puzzles"]} The puzzles to list, in record order.
 */
function puzzlesOf(collection: RegistryCollection): RegistryCollection["puzzles"] {
  if (namesCollection(collection)) return collection.puzzles;
  return collection.puzzles.filter((puzzle) => puzzle.id.toLowerCase().includes(query.value));
}

/**
 * Whether a row is in the state the chips ask for.
 *
 * @param {RegistryCollection} collection - The row.
 * @param {State} wanted - Any, some puzzle open, or none open.
 * @returns {boolean} `true` when the row's open count agrees.
 */
function inState(collection: RegistryCollection, wanted: State): boolean {
  if (wanted === "open") return collection.open > 0;
  if (wanted === "closed") return collection.open === 0;
  return true;
}

/**
 * The rows a state chip would leave, for the count on that chip.
 *
 * @param {State} wanted - The chip's state.
 * @returns {readonly RegistryCollection[]} The rows the search and that state keep.
 */
function rowsIn(wanted: State): readonly RegistryCollection[] {
  return collections.value.filter(
    (collection) => inState(collection, wanted) && puzzlesOf(collection).length > 0,
  );
}

const shown = computed(() => rowsIn(state.value));
const total = computed(() => collections.value.reduce((sum, row) => sum + row.puzzles.length, 0));
const open = computed(() => collections.value.reduce((sum, row) => sum + row.open, 0));

const STATES = [
  { value: "", label: "any" },
  { value: "open", label: "open" },
  { value: "closed", label: "closed" },
] as const;

const chips = computed(() => STATES.map((chip) => ({ ...chip, count: rowsIn(chip.value).length })));

/**
 * Whether a row shows its puzzles: the one picked, or every row a search found by puzzle id.
 *
 * @param {RegistryCollection} collection - The row.
 * @returns {boolean} `true` when its puzzle list is out.
 */
function expanded(collection: RegistryCollection): boolean {
  return picked.value === collection.key || (query.value !== "" && !namesCollection(collection));
}

/**
 * Opens a row's puzzles, or folds them back.
 *
 * @param {string} key - The collection key.
 */
function toggle(key: string) {
  picked.value = picked.value === key ? undefined : key;
}

/** Drops the search and the state, from the empty state's button. */
function reset() {
  text.value = "";
  state.value = "";
}

const STATE_CLASS: Readonly<Record<string, string>> = {
  solved: "puzzles-state-ok",
  claimed: "puzzles-state-info",
  swept: "puzzles-state-failed",
  expired: "puzzles-state-dim",
};
</script>

<template>
  <main class="registry">
    <section class="tool-console console-wide" aria-label="Puzzle registry">
      <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
      <span class="console-cross console-cross-br" aria-hidden="true">+</span>
      <header class="console-bar">
        <span class="console-title"><span class="console-tag">List</span>collections()</span>
        <span v-if="collections.length > 0" class="console-meta" aria-live="polite"
          ><span class="registry-pair"
            >{{ shown.length }} of {{ collections.length }} collections</span
          >
          · <span class="registry-pair">{{ total }} puzzles</span> ·
          <span class="registry-pair"
            ><span class="registry-accent">{{ open }}</span> open</span
          ></span
        >
        <span class="console-mark" aria-hidden="true" />
      </header>
      <div class="console-ruler" aria-hidden="true">
        <span class="console-cursor" :class="{ 'console-cursor-busy': loading }" />
      </div>

      <p v-if="loading" class="registry-note">Opening the registry, one collection at a time…</p>
      <p v-else-if="error" class="registry-note">
        The registry didn't make it here: {{ error.message }}
      </p>
      <p v-else-if="collections.length === 0" class="registry-note">
        The result came back without its rows, so there's nothing to browse yet.
      </p>

      <template v-else>
        <div class="registry-filter">
          <input
            v-model="text"
            class="registry-search"
            type="search"
            :maxlength="TEXT_MAX"
            placeholder="bits, zden, 71…"
            aria-label="Match a collection, author or puzzle id"
          />
          <div class="console-chips" role="group" aria-label="State">
            <button
              v-for="chip in chips"
              :key="chip.value"
              type="button"
              :aria-pressed="state === chip.value"
              @click="state = chip.value"
            >
              {{ chip.label }} <span class="registry-chip-count">{{ chip.count }}</span>
            </button>
          </div>
        </div>

        <p v-if="shown.length === 0" class="registry-note">
          Nothing in the registry answers to that.
          <button type="button" class="console-button" @click="reset">Show everything</button>
        </p>

        <ol v-else class="registry-rows">
          <li v-for="collection in shown" :key="collection.key">
            <button
              type="button"
              class="registry-row"
              :aria-expanded="expanded(collection)"
              @click="toggle(collection.key)"
            >
              <span class="registry-name">{{ collection.title }}</span>
              <span class="registry-key">{{ collection.key }}</span>
              <span class="registry-author">{{ collection.author }}</span>
              <span class="registry-open">
                <template v-if="collection.puzzles.length === 1">{{
                  collection.open === 1 ? "open" : "closed"
                }}</template>
                <template v-else
                  ><span :class="{ 'registry-accent': collection.open > 0 }">{{
                    collection.open
                  }}</span>
                  of {{ collection.puzzles.length }} open</template
                >
              </span>
            </button>
            <ol v-if="expanded(collection)" class="registry-puzzles">
              <li v-for="puzzle in puzzlesOf(collection)" :key="puzzle.id">
                <a
                  class="registry-puzzle"
                  :href="`${PAGE}${puzzle.id}`"
                  @click.prevent="openLink(`${PAGE}${puzzle.id}`)"
                  >{{ puzzle.name }}</a
                >
                <span class="puzzles-state" :class="STATE_CLASS[puzzle.status]"
                  ><span class="puzzles-state-dot" />{{ puzzle.status }}</span
                >
                <span class="registry-prize">{{ puzzle.prize }}</span>
                <button
                  type="button"
                  class="console-button"
                  :aria-label="`Ask about ${puzzle.id}`"
                  @click="sendPrompt(`Show me the puzzle ${puzzle.id}.`)"
                >
                  ask
                </button>
              </li>
            </ol>
          </li>
        </ol>
      </template>

      <footer class="console-footer console-footer-plain">
        <span>pick a row for its puzzles · a name opens its page · ask hands it to the chat</span>
        <span class="console-meta">local dataset / no network</span>
      </footer>
    </section>
  </main>
</template>

<style>
/* The tokens Nuxt UI and Tailwind give the site, which the app's plain Vue bundle goes without. */
:root {
  --font-sans: "Figtree", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Fira Code", ui-monospace, monospace;
  --color-amber-200: #fde68a;
  --color-amber-300: #fcd34d;
  --color-amber-600: #d97706;
  --color-amber-700: #b45309;
  --ui-text-muted: oklch(55.4% 0.046 257.417);
  --ui-text: oklch(37.2% 0.044 257.287);
  --ui-text-highlighted: oklch(20.8% 0.042 265.755);
}

.dark {
  --ui-text-muted: oklch(70.4% 0.04 256.788);
  --ui-text: oklch(92.9% 0.013 255.508);
  --ui-text-highlighted: #fff;
}

body {
  margin: 0;
  color: var(--ui-text);
  font-family: var(--font-sans);
}

.registry {
  padding: 16px;
}

.registry .tool-console {
  max-width: none;
}

.registry-note {
  margin: 0;
  padding: 14px 20px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ui-text-muted);
}

.registry-note .console-button {
  margin-left: 8px;
}

.registry-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--console-line);
}

.registry-search {
  flex: 1 1 12rem;
  min-width: 0;
  padding: 6px 10px;
  border: 0;
  background: var(--ui-bg-muted);
  box-shadow: inset 0 0 0 1px var(--console-line);
  color: var(--ui-text-highlighted);
  font: inherit;
  font-size: 13px;
}

.registry-search:focus-visible {
  outline: 1px solid var(--console-accent);
  outline-offset: 0;
}

.registry .console-chips {
  margin: 0;
}

.registry-pair {
  white-space: nowrap;
}

.registry-accent {
  color: var(--console-accent);
}

.registry-chip-count {
  color: var(--ui-text-dimmed);
}

.registry-rows,
.registry-puzzles {
  margin: 0;
  padding: 0;
  list-style: none;
}

.registry-rows > li + li {
  box-shadow: inset 0 1px 0 var(--console-line);
}

.registry-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2px 16px;
  width: 100%;
  padding: 9px 20px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.registry-row:hover,
.registry-row[aria-expanded="true"] {
  background: color-mix(in srgb, var(--ui-text-muted) 4%, var(--ui-bg));
}

.registry-row:focus-visible {
  outline: 1px solid var(--console-accent);
  outline-offset: -1px;
}

.registry-name {
  min-width: 0;
  overflow: hidden;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ui-text-highlighted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.registry-key,
.registry-author {
  font-size: 11px;
  color: var(--ui-text-dimmed);
}

.registry-author {
  grid-row: 2;
  grid-column: 2;
  text-align: right;
}

.registry-open {
  grid-row: 1;
  grid-column: 2;
  font-size: 11px;
  color: var(--ui-text-muted);
  text-align: right;
  white-space: nowrap;
}

.registry-puzzles {
  padding: 4px 20px 12px;
  background: color-mix(in srgb, var(--ui-text-muted) 4%, var(--ui-bg));
}

.registry-puzzles li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 4px 12px;
  padding: 5px 0 5px 12px;
  box-shadow: inset 1px 0 0 var(--console-line);
}

.registry-puzzle {
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-highlighted);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.registry-puzzle:hover {
  color: var(--console-accent);
}

.registry-prize {
  grid-column: 1;
  grid-row: 2;
  font-size: 11px;
  color: var(--ui-text-muted);
}

.registry-puzzles .console-button {
  grid-column: 3;
  grid-row: 1 / span 2;
}

@media (width >= 640px) {
  .registry-row {
    grid-template-columns: 14rem 10rem minmax(0, 1fr) 8rem;
    align-items: baseline;
  }

  .registry-author,
  .registry-open {
    grid-row: auto;
    grid-column: auto;
  }

  .registry-author {
    text-align: left;
  }

  .registry-puzzles li {
    grid-template-columns: 12rem 7rem minmax(0, 1fr) auto;
  }

  .registry-prize {
    grid-column: auto;
    grid-row: auto;
  }

  .registry-puzzles .console-button {
    grid-column: auto;
    grid-row: auto;
  }
}
</style>
