<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { collections } from "@agntn/puzzles";
import { collectionRows, type CollectionRow } from "../../utils/collections";
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";
import { ROSTER_CLASS, ROSTER_TABLE_UI } from "../../utils/roster";

interface Row extends CollectionRow {
  readonly to: string;
  readonly title: string;
  readonly icon: string;
  readonly blurb: string | undefined;
}

/** Every collection, loaded once for the prerender and again in the browser on navigation. */
const { data } = await useAsyncData("collection-rows", async () =>
  collectionRows(await collections()),
);

const rows = computed<Row[]>(() =>
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

/** Empty until a header is clicked: the rows then keep the largest first order `collectionRows` gives. */
const sorting = ref<{ id: string; desc: boolean }[]>([]);

const roster = useTemplateRef<HTMLElement>("roster");
useRosterFlip(
  () => roster.value,
  () => sorting.value,
);

const columns: TableColumn<Row>[] = [
  {
    accessorKey: "title",
    header: "Collection",
    sortingFn: "text",
    meta: { class: { th: "w-[14rem]" } },
  },
  { accessorKey: "key", header: "Key", meta: { class: { th: "w-[12.5rem]" } } },
  { accessorKey: "blurb", header: "About", enableSorting: false },
  {
    id: "open",
    header: "Open",
    accessorFn: (row) => row.open,
    // Equal open counts fall back to the collection size, so `4 of 12` and `4 of 6` keep an order.
    sortingFn: (left, right) =>
      left.original.open - right.original.open || left.original.total - right.original.total,
    meta: { class: { th: "w-[9.5rem]" } },
  },
];

const order = computed(() => {
  const [first] = sorting.value;
  if (first === undefined) return "largest first";
  const label = columns.find(
    (column) =>
      column.id === first.id || ("accessorKey" in column && column.accessorKey === first.id),
  )?.header;
  return `by ${String(label).toLowerCase()} ${first.desc ? "descending" : "ascending"}`;
});
</script>

<template>
  <section
    v-if="rows.length > 0"
    ref="roster"
    class="roster not-prose my-6"
    aria-label="Collections"
  >
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header :class="ROSTER_CLASS.bar">
      <span :class="ROSTER_CLASS.title">collections()</span>
      <span :class="ROSTER_CLASS.meta">{{ rows.length }} collections · {{ order }}</span>
    </header>
    <div class="roster-ruler" aria-hidden="true" />
    <UTable
      v-model:sorting="sorting"
      :data="rows"
      :columns="columns"
      :get-row-id="(row) => row.key"
      :ui="ROSTER_TABLE_UI"
    >
      <template #title-header="{ column }"
        ><RosterSort :column="column" label="Collection"
      /></template>
      <template #key-header="{ column }"><RosterSort :column="column" label="Key" /></template>
      <template #open-header="{ column }"><RosterSort :column="column" label="Open" /></template>
      <template #title-cell="{ row }">
        <NuxtLink :to="row.original.to" :class="[ROSTER_CLASS.name, 'items-baseline']">
          <UIcon
            :name="row.original.icon"
            class="relative top-0.5 size-3.5 flex-none"
            aria-hidden="true"
          />
          <span>{{ row.original.title }}</span>
        </NuxtLink>
      </template>
      <template #key-cell="{ row }">
        <span
          class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 @max-[52rem]/roster:justify-end"
        >
          <span :class="ROSTER_CLASS.id">{{ row.original.key }}</span>
          <span class="inline-flex gap-1 text-muted"
            ><UTooltip v-for="chain in row.original.chains" :key="chain" :text="chain"
              ><UIcon
                :name="CHAIN_ICONS[chain] ?? 'i-lucide-link'"
                class="size-3.5"
                :aria-label="chain" /></UTooltip
          ></span>
        </span>
      </template>
      <template #blurb-cell="{ row }">
        <span :class="ROSTER_CLASS.about">{{ row.original.blurb }}</span>
      </template>
      <template #open-cell="{ row }">
        <span :class="ROSTER_CLASS.count"
          ><span :class="ROSTER_CLASS.leader" aria-hidden="true" /><span
            class="whitespace-nowrap text-dimmed tabular-nums"
            ><template v-if="row.original.total === 1"
              ><span :class="row.original.open > 0 ? 'text-(--console-accent)' : 'text-muted'">{{
                row.original.open > 0 ? "open" : "closed"
              }}</span></template
            ><template v-else
              ><span :class="row.original.open > 0 ? 'text-(--console-accent)' : 'text-muted'">{{
                row.original.open
              }}</span>
              of {{ row.original.total }} open</template
            ></span
          ></span
        >
      </template>
    </UTable>
    <footer :class="ROSTER_CLASS.footer">
      <span>local dataset / no network</span>
      <span :class="ROSTER_CLASS.meta">getCollection(key) opens one</span>
    </footer>
  </section>
</template>
