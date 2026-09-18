<script setup lang="ts">
import { COLLECTIONS } from "../../utils/puzzles";
import { FACTS_STATIC } from "../../utils/landing";
import type { LandingSample } from "../../utils/samples";

const props = defineProps<{ sample: LandingSample; loaded: readonly string[] }>();

const rows = computed(() =>
  COLLECTIONS.map((entry) => ({
    ...entry,
    total: FACTS_STATIC.find((row) => row.key === entry.key)?.total ?? 0,
    active: entry.key === props.sample.collection,
    loaded: props.loaded.includes(entry.key),
  })),
);

const percent = computed(() => Math.round((props.loaded.length / COLLECTIONS.length) * 100));
</script>

<template>
  <div class="puzzles-frame overflow-hidden rounded-xl">
    <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
      <p class="min-w-0 truncate font-mono text-xs text-muted">
        <span class="text-dimmed">await get</span>
        <span class="ms-2 text-highlighted">("{{ sample.id }}")</span>
      </p>
      <p class="shrink-0 font-mono text-[11px] text-dimmed">
        {{ loaded.length }} of {{ COLLECTIONS.length }} modules
      </p>
    </div>
    <div class="px-4 pt-4 pb-2">
      <div class="puzzles-progress"><span :style="{ width: `${percent}%` }" /></div>
    </div>
    <ol class="grid sm:grid-cols-2">
      <li
        v-for="(row, index) in rows"
        :key="row.key"
        class="border-t border-muted"
        :class="{ 'sm:border-t-0': index < 2 }"
      >
        <NuxtLink
          :to="row.to"
          class="puzzles-row grid-cols-[1rem_minmax(0,1fr)_auto] font-mono text-[12px]"
          :class="{ 'puzzles-row-active': row.active }"
        >
          <UIcon
            :name="row.icon"
            class="size-4 transition-colors duration-500"
            :class="row.active || row.loaded ? 'text-primary' : 'text-dimmed'"
          />
          <span
            class="truncate"
            :class="row.active || row.loaded ? 'text-highlighted' : 'text-muted'"
            >{{ row.key }}</span
          >
          <span
            class="inline-flex items-center gap-1.5 text-[11px]"
            :class="row.active ? 'text-primary' : row.loaded ? 'text-muted' : 'text-dimmed'"
          >
            <span class="puzzles-state-dot" :class="{ 'puzzles-pulse': row.active }" />
            {{ row.active ? "loading" : row.loaded ? `${row.total} records` : "manifest" }}
          </span>
        </NuxtLink>
      </li>
    </ol>
    <div
      :key="loaded.length"
      class="puzzles-derive border-t border-muted px-4 py-3.5 text-sm leading-6 text-muted"
    >
      <span class="font-mono text-[12px] text-highlighted">import("@agntn/puzzles")</span> loaded no
      records. Every <span class="font-mono text-[12px] text-highlighted">get(id)</span> on this
      page imported one collection module, {{ loaded.length }} of {{ COLLECTIONS.length }} so far,
      and the other {{ COLLECTIONS.length - loaded.length }} are still just keys in the manifest.
    </div>
  </div>
</template>
