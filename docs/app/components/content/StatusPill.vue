<script setup lang="ts">
import type { Status } from "@agntn/puzzles";

const props = defineProps<{ status: Status }>();

const CLASSES: Readonly<Record<Status, string>> = {
  solved: "puzzles-state-ok",
  claimed: "puzzles-state-info",
  swept: "puzzles-state-failed",
  expired: "puzzles-state-dim",
  unsolved: "",
};

const klass = computed(() => CLASSES[props.status]);
</script>

<template>
  <span class="puzzles-state" :class="klass">
    <span class="puzzles-state-dot" />
    {{ status }}
  </span>
</template>
