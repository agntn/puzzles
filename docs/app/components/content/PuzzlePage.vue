<script setup lang="ts">
/** The identifier is named `puzzle`, not `id`, because MDC keeps `id` for the element. */
const props = defineProps<{ puzzle: string }>();

/** Singletons render this inside their collection page through `::puzzle-page`. */
const { data } = await usePuzzlePage(() => props.puzzle);
</script>

<template>
  <PuzzleFacts v-if="data" :page="data" class="my-6" />
</template>
