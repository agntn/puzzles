<script setup lang="ts">
import { chainName, type Status } from "@agntn/puzzles";
import { collectionEntry } from "../../../utils/puzzles";
import type { PuzzleView } from "../../../utils/puzzle-view";

definePageMeta({ layout: "default" });

const route = useRoute();
const collection = computed(() => String(route.params.collection ?? ""));
const id = computed(() => `${collection.value}/${String(route.params.puzzle ?? "")}`);

/** The same record `PuzzlePage` renders below, resolved once under one key. */
const { data } = await usePuzzlePage(() => id.value);

if (data.value === null) {
  throw createError({
    statusCode: 404,
    statusMessage: "Puzzle not found",
    message: `No puzzle ${id.value}`,
  });
}

const entry = computed(() => collectionEntry(collection.value));
const title = computed(() => id.value);

/**
 * The document title: the collection and the puzzle in the words a search uses, with the id after them.
 * `zden/level_5` becomes `Zden's puzzles level 5 (zden/level_5)`.
 */
const seoTitle = computed(() => {
  const name = String(route.params.puzzle ?? "").replaceAll("_", " ");
  return `${entry.value?.title ?? collection.value} ${name} (${id.value})`;
});

/**
 * A clause for the search width of an open puzzle, empty when the record has none.
 *
 * @param {number | undefined} bits - The key width in bits.
 * @returns {string} The clause with its leading comma, or an empty string.
 */
function bitsClause(bits: number | undefined): string {
  return bits === undefined ? "" : `, the key somewhere in ${bits} bits`;
}

/**
 * A clause for how long a solve took, empty when the record has no solve time.
 *
 * @param {string | undefined} solveTime - The formatted solve time.
 * @returns {string} The clause with its leading space, or an empty string.
 */
function afterClause(solveTime: string | undefined): string {
  return solveTime === undefined ? "" : ` after ${solveTime}`;
}

/**
 * A clause for the private key of a solved puzzle: printed by a source, or rebuilt from the
 * published recipe. Empty when the record has no key.
 *
 * @param {PuzzleView} view - The puzzle view.
 * @returns {string} The clause with its leading comma, or an empty string.
 */
function keyClause(view: PuzzleView): string {
  if (view.secret === "none") return "";
  return view.derived ? ", key derived from the published recipe" : ", key published";
}

/** The first sentence of the description per status: what happened to the puzzle. */
const OUTCOME: Readonly<Record<Status, (view: PuzzleView, when: string) => string>> = {
  unsolved: (view) => `Open since ${view.startedAt.slice(0, 10)}${bitsClause(view.bits)}.`,
  solved: (view, when) => `Solved on ${when}${afterClause(view.solveTime)}${keyClause(view)}.`,
  claimed: (view, when) =>
    `Claimed on ${when}${afterClause(view.solveTime)}, without a published key.`,
  swept: (_, when) => `Swept on ${when} by someone other than a solver.`,
  expired: (_, when) => `Expired on ${when}, the prize went back to the author.`,
};

/** One sentence about the outcome, one about the money, one about the collection. */
const description = computed(() => {
  const view = data.value?.view;
  if (view === undefined) return "";
  const outcome = OUTCOME[view.status](view, view.solvedAt?.slice(0, 10) ?? "an unknown date");
  const prize = view.prize === "-" ? "No prize recorded" : view.prize;
  return `${outcome} ${prize} on a ${chainName(view.chain)} address, ${view.address}. Part of ${entry.value?.title ?? collection.value}.`;
});

/** The lead under the title: the description without the full address, which the dossier prints with its node. */
const lead = computed(() => {
  const view = data.value?.view;
  if (view === undefined) return "";
  const outcome = OUTCOME[view.status](view, view.solvedAt?.slice(0, 10) ?? "an unknown date");
  const prize = view.prize === "-" ? "No prize recorded" : view.prize;
  return `${outcome} ${prize} on ${chainName(view.chain)}.`;
});

/** The part of the id after the collection key. */
const name = computed(() => String(route.params.puzzle ?? ""));

useSeo({
  title: seoTitle.value,
  description: description.value,
  type: "article",
  breadcrumbs: [
    { title: "Collections", path: "/collections" },
    { title: entry.value?.title ?? collection.value, path: `/collections/${collection.value}` },
    { title: title.value, path: `/collections/${id.value}` },
  ],
});

defineOgImage(
  "Docs",
  {
    headline: entry.value?.title ?? collection.value,
    title: title.value,
    description: description.value.replaceAll(",", ""),
  },
  { alt: `${id.value}: ${description.value}` },
);
</script>

<template>
  <div class="puzzles-landing">
    <header class="puzzles-hero hero-page puzzle-hero">
      <div class="hero-zone">
        <span class="hero-cross hero-cross-tl" aria-hidden="true">+</span>
        <span class="hero-cross hero-cross-tr" aria-hidden="true">+</span>
        <span class="hero-bracket hero-bracket-l" aria-hidden="true" />
        <span class="hero-bracket hero-bracket-r" aria-hidden="true" />

        <p class="console-id">
          <span class="console-id-tag">ID</span>
          <NuxtLink to="/collections" class="puzzle-crumb">collections</NuxtLink>
          <span class="console-id-sep" aria-hidden="true">/</span>
          <NuxtLink v-if="entry" :to="entry.to" class="puzzle-crumb">{{ entry.title }}</NuxtLink>
        </p>

        <h1 class="hero-title puzzle-title">
          <span class="puzzle-title-key">{{ collection }}/</span><wbr /><span
            class="puzzle-title-name"
            >{{ name }}</span
          >
        </h1>
        <p v-if="data" class="hero-lead">{{ lead }}</p>
      </div>

      <div class="hero-instrument hero-instrument-keep">
        <svg class="hero-circuit" viewBox="0 0 160 56" aria-hidden="true">
          <path class="hero-circuit-rail" d="M80 0V16L96 32V56" />
          <path class="hero-circuit-live" d="M80 0V16L96 32V56" pathLength="1" />
          <path class="hero-circuit-seg" d="M96 38V48" />
          <rect class="hero-circuit-node" x="92.5" y="52.5" width="7" height="7" />
        </svg>
        <span class="hero-circuit-tag" aria-hidden="true">get(id)</span>
        <PuzzlePage :puzzle="id" />
      </div>
    </header>
  </div>
</template>

<style scoped>
.puzzle-hero {
  padding-top: 56px;
}
.puzzle-crumb {
  color: var(--ui-text-muted);
}
.puzzle-crumb:hover {
  color: var(--console-accent);
}
/* The id in mono like the logo: the collection key dimmed, the puzzle's name bright. */
.puzzle-title {
  font-family: var(--font-mono);
  font-size: clamp(1.75rem, 1rem + 2.4vw, 2.75rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  overflow-wrap: break-word;
  color: var(--ui-text-highlighted);
}
/* Break after the slash, never inside the key or the name. */
.puzzle-title > span {
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
}
.puzzle-title .puzzle-title-key {
  color: var(--ui-text-dimmed);
}
</style>
