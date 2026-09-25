<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { FACTS_STATIC } from "../../utils/landing";
import { formatPrizeTotals } from "../../utils/format";
import { CHAIN_ICONS, COLLECTIONS, type CollectionEntry } from "../../utils/puzzles";
import { ROSTER_CLASS, ROSTER_TABLE_UI } from "../../utils/roster";

/**
 * The landing's collection roster. It reads the static fixtures, so it renders before any
 * collection loads, and marks the collection the walk is showing.
 */
const props = defineProps<{
  /** Key of the collection the landing panels show right now. */
  active: string;
}>();

interface Row extends CollectionEntry {
  readonly total: number;
  readonly open: number;
  /** Unclaimed prize as the CLI prints it, `-` when nothing is left. */
  readonly unclaimed: string;
}

const rows: Row[] = COLLECTIONS.map((entry) => {
  const facts = FACTS_STATIC.find((row) => row.key === entry.key);
  return {
    ...entry,
    chains: facts?.chains ?? entry.chains,
    total: facts?.total ?? 0,
    open: facts?.statuses.unsolved ?? 0,
    unclaimed: formatPrizeTotals(facts?.unsolvedPrize ?? {}),
  };
});

/** Empty until a header is clicked: the rows then keep the manifest order. */
const sorting = ref<{ id: string; desc: boolean }[]>([]);

const roster = useTemplateRef<HTMLElement>("roster");
useRosterFlip(
  () => roster.value,
  () => sorting.value,
);

// The prize column takes its width from the blurb, which is one truncated line here anyway. The key
// column fits `satoshi_birthday_quiz` with its glyph on one line. Stacked, the open count and the
// prize share a line: `col-span-1!` beats the roster's `nth-[n+3]:col-span-full`, which the CSS
// order would otherwise keep.
const columns: TableColumn<Row>[] = [
  {
    accessorKey: "title",
    header: "Collection",
    sortingFn: "text",
    meta: { class: { th: "w-[14.5rem]" } },
  },
  { accessorKey: "key", header: "Key", meta: { class: { th: "w-[12rem]" } } },
  { accessorKey: "blurb", header: "About", enableSorting: false },
  {
    id: "open",
    header: "Open",
    accessorFn: (row) => row.open,
    sortingFn: (left, right) =>
      left.original.open - right.original.open || left.original.total - right.original.total,
    meta: {
      class: { th: "w-[8.5rem] text-end", td: "@max-[52rem]/roster:col-span-1!" },
    },
  },
  {
    accessorKey: "unclaimed",
    header: "Unclaimed",
    enableSorting: false,
    meta: {
      class: {
        th: "w-[8.5rem]",
        td: "@max-[52rem]/roster:col-span-1! @max-[52rem]/roster:justify-self-end",
      },
    },
  },
];

const order = computed(() => {
  const [first] = sorting.value;
  if (first === undefined) return "manifest order";
  const label = columns.find(
    (column) =>
      column.id === first.id || ("accessorKey" in column && column.accessorKey === first.id),
  )?.header;
  return `by ${String(label).toLowerCase()} ${first.desc ? "descending" : "ascending"}`;
});

// Every cell holds one line, so the cells center it: on the roster's baseline a truncated name,
// clipped by its overflow, would sit on its bottom edge and ride above the rest of the row.
const ui = { ...ROSTER_TABLE_UI, td: `${ROSTER_TABLE_UI.td} align-middle` };

const meta = {
  class: {
    tr: (row: { original: Row }) =>
      row.original.key === props.active
        ? "bg-[color-mix(in_srgb,var(--ui-text-muted)_5%,var(--ui-bg))]! [&>td:first-child]:shadow-[inset_2px_0_0_var(--console-accent)]!"
        : "",
  },
};
</script>

<template>
  <section ref="roster" class="roster not-prose" aria-label="Collections">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header :class="ROSTER_CLASS.bar">
      <span :class="ROSTER_CLASS.title"><span class="console-tag">Call</span>collections()</span>
      <span class="flex items-center gap-4 max-[640px]:hidden"
        ><span :class="ROSTER_CLASS.meta">{{ rows.length }} collections · {{ order }}</span
        ><span class="console-mark" aria-hidden="true"
      /></span>
    </header>
    <div class="roster-ruler" aria-hidden="true" />
    <UTable
      v-model:sorting="sorting"
      :data="rows"
      :columns="columns"
      :meta="meta"
      :get-row-id="(row) => row.key"
      :ui="ui"
    >
      <template #title-header="{ column }"
        ><RosterSort :column="column" label="Collection"
      /></template>
      <template #key-header="{ column }"><RosterSort :column="column" label="Key" /></template>
      <template #open-header="{ column }"><RosterSort :column="column" label="Open" /></template>
      <!-- One line per name and blurb: a long one ends in an ellipsis, the tooltip and the collection page carry it whole. The link is a block flex, not the roster's inline one, so no line box adds a descender gap under it. -->
      <template #title-cell="{ row }">
        <UTooltip :text="row.original.title">
          <NuxtLink
            :to="row.original.to"
            class="flex min-w-0 max-w-full items-center gap-2 text-highlighted hover:text-(--console-accent)"
            :aria-current="row.original.key === active ? 'true' : undefined"
          >
            <UIcon :name="row.original.icon" class="size-3.5 flex-none" aria-hidden="true" />
            <span class="truncate">{{ row.original.title }}</span>
          </NuxtLink>
        </UTooltip>
      </template>
      <template #key-cell="{ row }">
        <span class="flex min-w-0 flex-nowrap items-center gap-x-2 @max-[52rem]/roster:justify-end">
          <span :class="[ROSTER_CLASS.id, 'min-w-0']">{{ row.original.key }}</span>
          <span class="inline-flex flex-none gap-1 text-muted"
            ><UTooltip v-for="chain in row.original.chains" :key="chain" :text="chain"
              ><UIcon
                :name="CHAIN_ICONS[chain] ?? 'i-lucide-link'"
                class="size-3.5"
                :aria-label="chain" /></UTooltip
          ></span>
        </span>
      </template>
      <template #blurb-cell="{ row }">
        <UTooltip :text="row.original.blurb">
          <span :class="[ROSTER_CLASS.about, 'block truncate']">{{ row.original.blurb }}</span>
        </UTooltip>
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
      <template #unclaimed-cell="{ row }">
        <span
          class="block text-end text-[11px] tabular-nums"
          :class="row.original.unclaimed === '-' ? 'text-dimmed' : 'text-highlighted'"
          >{{ row.original.unclaimed === "-" ? "none" : row.original.unclaimed }}</span
        >
      </template>
    </UTable>
    <footer :class="ROSTER_CLASS.footer">
      <span>Local dataset / no network</span>
      <NuxtLink to="/guide/custom" class="text-highlighted hover:text-(--console-accent)"
        ><span aria-hidden="true">→ </span>registerCollection({ key, load }) adds yours</NuxtLink
      >
    </footer>
  </section>
</template>
