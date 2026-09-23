<script setup lang="ts">
import { stats } from "@agntn/puzzles";
import { formatStats } from "../../../../src/core/utils.ts";

/** What `puzzles stats` prints, from the same `stats()` and the same formatter as the CLI. */
const { data } = await useAsyncData("dataset-stats", async () =>
  formatStats(await stats()).join("\n"),
);
</script>

<template>
  <ProsePre language="text" :code="data ?? ''">{{ data }}</ProsePre>
</template>
