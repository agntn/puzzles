<script setup lang="ts">
import {
  authors,
  type Chain,
  collectionKeys,
  collections,
  requireAuthor,
  requireCollection,
  requirePuzzle,
  selectPuzzles,
  SingletonCollection,
  type Status,
} from "@agntn/puzzles";

/**
 * A count the prose quotes, asked from the library at render time so no page keeps a copy.
 * `of` picks what to count: puzzles by default, narrowed by the filters `selectPuzzles` takes
 * or by an author key, or the collections in the manifest, the singletons among them, or the authors.
 * `of="hints"` counts the hints of one `puzzle`, its collection's shared ones included, or of a whole
 * `collection`, where a shared hint counts once.
 */
const props = defineProps<{
  of?: "puzzles" | "collections" | "singletons" | "authors" | "hints";
  collection?: string;
  puzzle?: string;
  chain?: Chain;
  status?: Status;
  author?: string;
}>();

const { data } = await useAsyncData(
  () =>
    `dataset-count-${[props.of, props.collection, props.puzzle, props.chain, props.status, props.author].join("-")}`,
  async () => {
    if (props.of === "collections") {
      return collectionKeys().length;
    }
    if (props.of === "singletons") {
      return (await collections()).filter((collection) => collection instanceof SingletonCollection)
        .length;
    }
    if (props.of === "hints") {
      if (props.puzzle !== undefined) {
        const puzzle = await requirePuzzle(props.puzzle);
        return (await requireCollection(puzzle.collection())).hintsById(puzzle.id()).length;
      }
      if (props.collection === undefined) {
        throw new Error('dataset-count of="hints" needs a puzzle or a collection');
      }
      const collection = await requireCollection(props.collection);
      return collection
        .all()
        .reduce((count, puzzle) => count + puzzle.hints().length, collection.hints.length);
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
