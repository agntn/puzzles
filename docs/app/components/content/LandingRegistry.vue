<script setup lang="ts">
import { COLLECTIONS } from "../../utils/puzzles";
import { FACTS_STATIC } from "../../utils/landing";
import type { LandingSample } from "../../utils/samples";

const props = defineProps<{ sample: LandingSample; loaded: readonly string[] }>();

type State = "manifest" | "loading" | "loaded";

/**
 * What a module's node means, for its tooltip and its accessible name.
 *
 * @param {State} state - Where the module is on the walk.
 * @param {number} total - The collection's record count.
 * @returns {string} The state in words.
 */
function stateText(state: State, total: number): string {
  if (state === "loading") return "import() in flight";
  if (state === "loaded") return `loaded, ${total} records`;
  return "not loaded";
}

const rows = computed(() =>
  COLLECTIONS.map((entry) => {
    const active = entry.key === props.sample.collection;
    const state: State = props.loaded.includes(entry.key)
      ? "loaded"
      : active
        ? "loading"
        : "manifest";
    const total = FACTS_STATIC.find((row) => row.key === entry.key)?.total ?? 0;
    return { ...entry, active, state, text: stateText(state, total) };
  }),
);

/** The walk's collection is in flight until its module lands in `loaded`; the cursor loops only then. */
const busy = computed(() => !props.loaded.includes(props.sample.collection));
</script>

<template>
  <div class="tool-console landing-registry">
    <header class="console-bar">
      <span class="console-title registry-call"
        ><span class="console-tag">Call</span>await get("{{ sample.id }}")</span
      >
      <span class="console-hosts">{{ loaded.length }} of {{ COLLECTIONS.length }} loaded</span>
    </header>
    <div class="console-ruler" aria-hidden="true">
      <span
        :key="`${sample.id}-${busy}`"
        class="console-cursor"
        :class="{ 'console-cursor-busy': busy }"
      />
    </div>

    <div class="registry-body">
      <p class="console-label console-rule-title">
        <span>Manifest <span aria-hidden="true">[ one import() per key ]</span></span>
        <span class="console-mark" aria-hidden="true" />
      </p>
      <ol class="registry-modules">
        <li v-for="row in rows" :key="row.key">
          <UTooltip :text="`${row.key} · ${row.text}`">
            <NuxtLink
              :to="row.to"
              class="registry-module"
              :data-state="row.state"
              :aria-current="row.active ? 'true' : undefined"
              :aria-label="`${row.key}, ${row.text}`"
            >
              <UIcon :name="row.icon" class="registry-icon" aria-hidden="true" />
              <span class="registry-key">{{ row.key }}</span>
              <span class="registry-node" aria-hidden="true" />
            </NuxtLink>
          </UTooltip>
        </li>
      </ol>
    </div>

    <p class="registry-note">
      <code>import("@agntn/puzzles")</code> loaded no records. Each <code>get(id)</code> here
      imported one module; the other {{ COLLECTIONS.length - loaded.length }} are still just keys.
    </p>

    <footer class="console-footer console-footer-plain">
      <span>One chunk per collection</span>
      <NuxtLink :to="`/collections/${sample.collection}`" class="registry-link"
        ><span aria-hidden="true">→ </span>{{ sample.collection }}</NuxtLink
      >
    </footer>
  </div>
</template>

<style scoped>
.registry-call {
  min-width: 0;
  overflow-wrap: anywhere;
}
.registry-body {
  padding: 14px 20px 12px;
}
/* A map of the manifest: as many columns as fit, one cell per key, its node tells whether it loaded. */
.registry-modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0 16px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.registry-module {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  line-height: 18px;
  color: var(--ui-text-muted);
}
.registry-icon {
  flex: none;
  width: 13px;
  height: 13px;
  color: var(--ui-text-dimmed);
  transition: color 0.5s ease;
}
.registry-key {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Hollow for a key only, an accent outline once loaded, filled for the collection the walk shows. */
.registry-node {
  flex: none;
  width: 5px;
  height: 5px;
  box-shadow: inset 0 0 0 1px var(--console-corner);
}
.registry-module[data-state="loaded"] .registry-icon,
.registry-module[data-state="loading"] .registry-icon {
  color: var(--console-accent);
}
.registry-module[data-state="loaded"] .registry-key {
  color: var(--ui-text-highlighted);
}
.registry-module[data-state="loaded"] .registry-node,
.registry-module[data-state="loading"] .registry-node {
  box-shadow: inset 0 0 0 1px var(--console-accent);
}
.registry-module[aria-current="true"] .registry-key {
  color: var(--console-accent);
}
.registry-module[aria-current="true"] .registry-node,
.registry-module:hover .registry-node {
  background: var(--console-accent);
  box-shadow: none;
}
.registry-module:hover .registry-key {
  color: var(--console-accent);
}
.registry-module:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
.registry-note {
  margin: 0;
  padding: 10px 20px 12px;
  border-top: 1px solid var(--console-line);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
.registry-note code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ui-text-highlighted);
}
.registry-link {
  margin-left: auto;
  color: var(--ui-text-highlighted);
}
.registry-link:hover {
  color: var(--console-accent);
}
.registry-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
@media (width < 640px) {
  .registry-body > .console-rule-title > .console-mark {
    display: none;
  }
}
@media (width < 400px) {
  .registry-body,
  .registry-note {
    padding-inline: 14px;
  }
  .registry-body > .console-rule-title > span:first-child > span {
    display: none;
  }
  .registry-modules {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: 0 12px;
  }
}
</style>
