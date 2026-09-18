<script setup lang="ts">
import { chainName, type Status } from "@agntn/puzzles";
import { collectionEntry } from "../../../utils/puzzles";
import type { PuzzleView } from "../../../utils/puzzle-view";

definePageMeta({ layout: "default" });

const route = useRoute();
const collection = computed(() => String(route.params.collection ?? ""));
const id = computed(() => `${collection.value}/${String(route.params.puzzle ?? "")}`);

/** The same record `PuzzlePage` renders below, resolved once under one key. */
const { data } = await usePuzzlePage(id.value);

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

/** The first sentence of the description per status: what happened to the puzzle. */
const OUTCOME: Readonly<Record<Status, (view: PuzzleView, when: string) => string>> = {
  unsolved: (view) => `Open since ${view.startedAt.slice(0, 10)}${bitsClause(view.bits)}.`,
  solved: (view, when) =>
    `Solved on ${when}${afterClause(view.solveTime)}${view.secret === "none" ? "" : ", key published"}.`,
  claimed: (_, when) => `Claimed on ${when}, without a published key.`,
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

useSeo({
  title: title.value,
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
    <header
      class="puzzles-hero mx-auto w-full max-w-[var(--ui-container)] px-8 pt-14 pb-8 sm:px-12 lg:px-16"
    >
      <p class="puzzles-eyebrow">
        <NuxtLink to="/collections" class="hover:text-highlighted">collections</NuxtLink>
        <span class="text-dimmed">/</span>
        <NuxtLink v-if="entry" :to="entry.to" class="hover:text-highlighted">{{
          entry.title
        }}</NuxtLink>
      </p>
      <h1
        class="mt-4 font-mono text-3xl leading-[1.1] font-medium tracking-tight text-highlighted sm:text-4xl"
      >
        {{ title }}
      </h1>
      <p v-if="data" class="mt-4 max-w-2xl text-base leading-7 text-muted">
        {{ description }}
      </p>
    </header>

    <section class="puzzles-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-10 sm:px-12 lg:px-16">
        <PuzzlePage :puzzle="id" />
      </div>
    </section>
  </div>
</template>
