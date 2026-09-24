<script setup lang="ts">
import { collections } from "@agntn/puzzles";
import { collectionRows } from "../../utils/collections";
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";

/** Every collection, loaded once for the prerender and again in the browser on navigation. */
const { data } = await useAsyncData("collection-rows", async () =>
  collectionRows(await collections()),
);

const rows = computed(() =>
  (data.value ?? []).map((row) => {
    const entry = collectionEntry(row.key);
    return {
      ...row,
      to: `/collections/${row.key}`,
      title: entry?.title ?? row.key,
      icon: entry?.icon ?? "i-lucide-layers",
      blurb: entry?.blurb,
    };
  }),
);
</script>

<template>
  <section v-if="rows.length > 0" class="roster not-prose my-6" aria-label="Collections">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="roster-bar">
      <span class="roster-title">collections()</span>
      <span class="roster-meta">{{ rows.length }} collections · largest first</span>
    </header>
    <div class="roster-ruler" aria-hidden="true" />
    <ol class="roster-rows collection-roster">
      <li v-for="row in rows" :key="row.key">
        <NuxtLink :to="row.to" class="roster-name">
          <UIcon :name="row.icon" class="size-3.5" aria-hidden="true" />
          <span>{{ row.title }}</span>
        </NuxtLink>
        <span class="roster-id">{{ row.key }}</span>
        <span class="roster-about">{{ row.blurb }}</span>
        <span class="collection-roster-count">
          <span class="roster-count"
            ><span class="roster-leader" aria-hidden="true" /><span class="collection-roster-chains"
              ><UTooltip v-for="chain in row.chains" :key="chain" :text="chain"
                ><UIcon
                  :name="CHAIN_ICONS[chain] ?? 'i-lucide-link'"
                  class="size-3.5"
                  :aria-label="chain" /></UTooltip></span
            ><span class="collection-roster-total">{{ row.total }}</span></span
          >
          <span v-if="row.open > 0" class="collection-roster-open">{{ row.open }} unsolved</span>
        </span>
      </li>
    </ol>
    <footer class="roster-bar roster-footer">
      <span>local dataset / no network</span>
      <span class="roster-meta">getCollection(key) opens one</span>
    </footer>
  </section>
</template>

<style scoped>
.collection-roster li {
  grid-template-columns: 14rem 10rem minmax(0, 1fr) 8.5rem;
}
.collection-roster .roster-name > span {
  white-space: normal;
}
.collection-roster-count {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.collection-roster-chains {
  display: inline-flex;
  gap: 4px;
  align-self: center;
  color: var(--ui-text-muted);
}
.collection-roster-total {
  min-width: 2.5em;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-muted);
}
.collection-roster-open {
  align-self: flex-end;
  font-size: 11px;
  white-space: nowrap;
  color: var(--console-accent);
}
@container roster (width < 52rem) {
  .collection-roster li {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .collection-roster-count {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: baseline;
    gap: 12px;
  }
  .collection-roster-open {
    align-self: auto;
  }
}
</style>
