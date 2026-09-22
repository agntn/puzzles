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
        ><span class="landing-author-tag">ID</span>{{ author.key
        }}<span class="landing-author-file"
          >{{ String(position).padStart(2, "0") }} / {{ AUTHORS_STATIC.length }}</span
        ></span
      >
      <span class="console-hosts">{{ author.kind ?? "kind unknown" }}</span>
    </header>
    <div class="console-result">
      <div class="console-subject">
        <div :key="author.key" class="console-reticle" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <path class="reticle-frame" d="M24 5H5V24M96 5H115V24M115 96V115H96M24 115H5V96" />
            <circle class="reticle-ticks" cx="60" cy="60" r="49" />
            <path
              class="reticle-sectors"
              d="M39 10H49M71 10H81M110 39V49M110 71V81M81 110H71M49 110H39M10 81V71M10 49V39"
            />
            <path class="reticle-lock" d="M60 18A42 42 0 0 1 102 60M60 102A42 42 0 0 1 18 60" />
            <path
              class="reticle-axis"
              d="M60 0V12M108 60H120M60 108V120M0 60H12M30 60H38M82 60H90M60 30V38M60 82V90"
            />
            <path class="reticle-diamond" d="M60 24L96 60L60 96L24 60Z" />
          </svg>
          <UIcon :name="authorIcon(author.kind)" class="console-chain-icon" />
        </div>
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
.landing-author-tag {
  display: inline-block;
  margin-right: 8px;
  padding: 1px 5px;
  font-size: 10px;
  line-height: 1.4;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
  box-shadow: inset 0 0 0 1px var(--console-line);
}
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
