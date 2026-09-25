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
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="console-bar">
      <!-- prettier-ignore -->
      <span class="console-title registry-call"><span class="console-tag">Call</span>get(<span class="tok-str">{{ JSON.stringify(sample.id) }}</span>)</span>
      <span class="console-meta">manifest</span>
      <span class="console-mark" aria-hidden="true" />
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

    <!-- The count as a gauge: one tick per key, the loaded modules filled, the one the walk shows in the accent. -->
    <div
      class="registry-gauge"
      :aria-label="`${loaded.length} of ${COLLECTIONS.length} modules loaded`"
    >
      <span class="registry-ticks" aria-hidden="true">
        <span
          v-for="row in rows"
          :key="row.key"
          :data-state="row.state"
          :data-active="row.active"
        />
      </span>
      <span class="console-gauge-read"
        >loaded {{ loaded.length }} / {{ COLLECTIONS.length }}
        <span class="registry-rest"
          >· {{ COLLECTIONS.length - loaded.length }} still keys</span
        ></span
      >
    </div>

    <footer class="console-footer console-footer-plain">
      <span>import() loads no records · one chunk per key</span>
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
/* The manifest on the crosses grid, like every subject band. */
.registry-body {
  padding: 14px 20px 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M16 18h4m-2-2v4' fill='none' stroke='%23818a94' stroke-opacity='.1'/%3E%3C/svg%3E");
  background-size: 36px 36px;
  background-position: 24px 20px;
}
.registry-gauge {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 20px 12px;
  border-top: 1px solid var(--console-line);
}
.registry-ticks {
  display: flex;
  flex: 1;
  gap: 3px;
  align-items: flex-end;
  min-width: 0;
}
.registry-ticks > span {
  flex: 1;
  max-width: 8px;
  height: 10px;
  box-shadow: inset 0 0 0 1px var(--console-corner);
}
.registry-ticks > span[data-state="loaded"] {
  background: repeating-linear-gradient(180deg, var(--console-corner) 0 2px, transparent 2px 3px);
}
.registry-ticks > span[data-active="true"] {
  height: 14px;
  background: var(--console-accent);
  box-shadow: none;
}
.registry-rest {
  color: var(--ui-text-dimmed);
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
.registry-module[data-state="loaded"] .registry-icon {
  color: var(--ui-text-muted);
}
.registry-module[aria-current="true"] .registry-icon {
  color: var(--console-accent);
}
.registry-module[data-state="loaded"] .registry-key {
  color: var(--ui-text-highlighted);
}
.registry-module[data-state="loaded"] .registry-node {
  background: repeating-linear-gradient(180deg, var(--console-corner) 0 1px, transparent 1px 2px);
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
  .registry-gauge {
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
