<script setup lang="ts">
import {
  authors,
  type Chain,
  collectionKeys,
  requireAuthor,
  selectPuzzles,
  type Status,
} from "@agntn/puzzles";

/**
 * A count the prose quotes, asked from the library at render time so no page keeps a copy.
 * `of` picks what to count: puzzles by default, narrowed by the filters `selectPuzzles` takes
 * or by an author key, or the collections in the manifest, or the authors.
 */
const props = defineProps<{
  of?: "puzzles" | "collections" | "authors";
  collection?: string;
  chain?: Chain;
  status?: Status;
  author?: string;
}>();

const { data } = await useAsyncData(
  () =>
    `dataset-count-${[props.of, props.collection, props.chain, props.status, props.author].join("-")}`,
  async () => {
    if (props.of === "collections") {
      return collectionKeys().length;
    }
    if (props.of === "authors") {
      return (await authors()).length;
    }
    if (props.author !== undefined) {
      return (await requireAuthor(props.author)).puzzles;
    }
    const { collection, chain, status } = props;
    return (await selectPuzzles({ collection, chain, status })).length;
  },
);
</script>

<template>
  <span class="tabular-nums">{{ data }}</span>
</template>
