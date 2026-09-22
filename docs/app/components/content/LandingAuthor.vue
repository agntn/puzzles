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
</script>

<template>
  <div v-if="author" class="tool-console landing-author">
    <header class="console-bar">
      <span class="console-title"
        ><span class="console-tag">ID</span>{{ author.key
        }}<span class="landing-author-file"
          >{{ String(position).padStart(2, "0") }} / {{ AUTHORS_STATIC.length }}</span
        ></span
      >
      <span class="console-hosts">{{ author.kind ?? "kind unknown" }}</span>
    </header>
    <div class="console-result">
      <div class="console-subject">
        <ConsoleReticle :key="author.key" :icon="authorIcon(author.kind)" />
        <div class="console-identity">
          <span class="console-label">Subject / {{ sample.collection }}</span>
          <h3>{{ author.name }}</h3>
          <span>{{ author.collections.join(" · ") }} · {{ author.puzzles }} puzzles</span>
        </div>
      </div>
      <p class="landing-author-about">{{ author.about }}</p>
    </div>
    <footer class="console-footer">
      <span class="landing-author-call">getAuthor("{{ author.key }}")</span>
      <NuxtLink :to="`/authors/${author.key}`" class="landing-author-link"
        >open the dossier <UIcon name="i-lucide-arrow-right" class="size-3.5"
      /></NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.landing-author-file {
  margin-left: 12px;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--ui-text-dimmed);
}
.landing-author .console-identity h3 {
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 500;
}
.landing-author-about {
  margin: 4px 0 2px;
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
.landing-author-call {
  text-transform: none;
  letter-spacing: 0;
}
.landing-author-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: var(--ui-text-muted);
  text-transform: none;
  letter-spacing: 0.04em;
}
.landing-author-link:hover {
  color: var(--console-accent);
}
</style>
