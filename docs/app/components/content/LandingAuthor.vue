<script setup lang="ts">
import { authorIcon } from "../../utils/authors";
import { AUTHORS_STATIC, FACTS_STATIC } from "../../utils/landing";
import type { LandingSample } from "../../utils/samples";

const props = defineProps<{ sample: LandingSample }>();

/** The author of whichever collection the walk is on, from the static rows so SSR has it. */
const author = computed(() => {
  const key = FACTS_STATIC.find((row) => row.key === props.sample.collection)?.authorKey;
  return AUTHORS_STATIC.find((row) => row.key === key);
});
const position = computed(
  () => AUTHORS_STATIC.findIndex((row) => row.key === author.value?.key) + 1,
);

/** The author's collections as the static facts count them: puzzles, the open ones, the years they span. */
const facts = computed(() =>
  FACTS_STATIC.filter((row) => author.value?.collections.includes(row.key)),
);
const total = computed(() => facts.value.reduce((sum, row) => sum + row.total, 0));
const open = computed(() =>
  facts.value.reduce((sum, row) => sum + (row.statuses.unsolved ?? 0), 0),
);
const years = computed(() => {
  const first = facts.value.map((row) => row.firstStarted.slice(0, 4)).sort()[0];
  const last = facts.value
    .map((row) => row.lastStarted.slice(0, 4))
    .sort()
    .at(-1);
  if (first === undefined) return "unknown";
  return first === last ? first : `${first} to ${last}`;
});

const scan = ref(0);
watch(
  () => author.value?.key,
  () => {
    scan.value += 1;
  },
);
</script>

<template>
  <div v-if="author" class="tool-console landing-author">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="console-bar">
      <span class="console-title"
        ><span class="console-tag">ID</span>{{ author.key
        }}<span class="console-file"
          >{{ String(position).padStart(2, "0") }} / {{ AUTHORS_STATIC.length }}</span
        ></span
      >
      <span class="console-meta">{{ author.kind ?? "kind unknown" }}</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true">
      <span :key="author.key" class="console-cursor" />
    </div>

    <!-- The subject on the crosses grid, like the dossier's subject band, then the readout of what the author put out. -->
    <div class="author-subject">
      <div v-if="scan > 0" :key="scan" class="console-scan" aria-hidden="true" />
      <div class="author-identity">
        <ConsoleReticle :key="author.key" :icon="authorIcon(author.kind)" />
        <div class="author-name">
          <span class="console-label"
            >Subject / <span class="console-label-key">{{ sample.collection }}</span></span
          >
          <h3>{{ author.name }}</h3>
          <p v-if="author.about" class="author-about">{{ author.about }}</p>
        </div>
      </div>
      <div class="console-readout author-readout">
        <dl class="console-readout-rows">
          <div>
            <dt>Collections</dt>
            <dd class="author-collections">
              <NuxtLink
                v-for="key in author.collections"
                :key="key"
                :to="`/collections/${key}`"
                class="author-collection"
                >{{ key }}</NuxtLink
              >
            </dd>
          </div>
          <div>
            <dt>Puzzles</dt>
            <dd>
              {{ total }}
              <span v-if="open > 0" class="author-open">· {{ open }} open</span
              ><span v-else class="author-closed">· none open</span>
            </dd>
          </div>
          <div>
            <dt>Active</dt>
            <dd>{{ years }}</dd>
          </div>
        </dl>
        <div class="console-gauge" :aria-label="`${open} of ${total} puzzles open`">
          <span
            :key="author.key"
            class="console-ticks"
            :class="{ 'console-ticks-dense': total > 64 }"
            aria-hidden="true"
          >
            <span
              v-for="index in total"
              :key="index"
              :class="index > total - open ? 'console-tick-open' : 'console-tick-closed'"
              :style="{ animationDelay: `${Math.min(index * 3, 400)}ms` }"
            />
          </span>
          <span class="console-gauge-read">open {{ open }} / {{ total }}</span>
        </div>
      </div>
    </div>

    <footer class="console-footer console-footer-plain">
      <span class="author-call">getAuthor("{{ author.key }}")</span>
      <NuxtLink :to="`/authors/${author.key}`" class="author-link"
        ><span aria-hidden="true">→ </span>open the dossier</NuxtLink
      >
    </footer>
  </div>
</template>

<style scoped>
/* The subject band: crosses behind it, the reticle with the name and one sentence, the readout under them. */
.author-subject {
  position: relative;
  display: grid;
  gap: 16px;
  padding: 18px 20px 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M16 18h4m-2-2v4' fill='none' stroke='%23818a94' stroke-opacity='.1'/%3E%3C/svg%3E");
  background-size: 36px 36px;
  background-position: 24px 20px;
}
.author-subject > :not(.console-scan) {
  position: relative;
}
.author-identity {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.author-name {
  min-width: 0;
}
.author-name h3 {
  margin: 4px 0 6px;
  font-family: var(--font-sans);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--ui-text-highlighted);
  overflow-wrap: anywhere;
}
.author-about {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
.author-readout {
  align-self: stretch;
}
.author-readout .console-readout-rows > div {
  grid-template-columns: 6.5rem minmax(0, 1fr);
  padding: 8px 12px;
}
.author-collections {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}
.author-collection {
  color: var(--ui-text-highlighted);
  text-decoration: underline dotted var(--console-line);
  text-underline-offset: 3px;
}
.author-collection:hover {
  color: var(--console-accent);
}
.author-open {
  color: var(--console-accent);
}
.author-closed {
  color: var(--ui-text-dimmed);
}
.author-readout .console-gauge {
  padding-inline: 12px;
}
.author-call {
  color: var(--ui-text-muted);
}
.author-link {
  margin-left: auto;
  color: var(--ui-text-highlighted);
}
.author-link:hover {
  color: var(--console-accent);
}
.author-link:focus-visible,
.author-collection:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
@media (width < 400px) {
  .author-subject {
    padding-inline: 14px;
  }
  .author-identity {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
