<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { type Chain, chainName, collections } from "@agntn/puzzles";
import {
  collectionFilterQuery,
  collectionRows,
  matchesCollection,
  FILTER_TEXT_MAX,
  readCollectionFilter,
  type CollectionFilter,
  type CollectionState,
  type CollectionRow,
} from "../../utils/collections";
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

const chain = ref("");
const state = ref<CollectionState>("");
const text = ref("");
const filter = computed<CollectionFilter>(() => ({
  chain: chain.value,
  state: state.value,
  text: text.value,
}));
const filtered = computed(
  () => filter.value.chain !== "" || filter.value.state !== "" || filter.value.text.trim() !== "",
);
const shown = computed(() => rows.value.filter((row) => matchesCollection(row, filter.value)));

/**
 * How many rows a filter keeps, for the count on the chip that would switch to it.
 *
 * @param {Partial<CollectionFilter>} change - The part of the filter the chip changes.
 * @returns {number} The rows left after the click.
 */
function countWith(change: Partial<CollectionFilter>): number {
  const next = { ...filter.value, ...change };
  return rows.value.filter((row) => matchesCollection(row, next)).length;
}

/** The chains the index lists, the one most collections live on first, each with its count. */
const chainOptions = computed(() => {
  const totals = new Map<string, number>();
  for (const row of rows.value) {
    for (const name of row.chains) totals.set(name, (totals.get(name) ?? 0) + 1);
  }
  return [...totals]
    .toSorted(([left, a], [right, b]) => b - a || left.localeCompare(right))
    .map(([value]) => ({
      value,
      label: chainName(value as Chain),
      icon: CHAIN_ICONS[value] ?? "i-lucide-link",
      count: countWith({ chain: value }),
    }));
});

/** The state switch: every collection, the ones with a puzzle still unsolved, the ones with none. */
const stateOptions = computed(() =>
  (
    [
      { value: "", label: "any" },
      { value: "open", label: "open" },
      { value: "closed", label: "closed" },
    ] as const
  ).map((option) => ({ ...option, count: countWith({ state: option.value }) })),
);

/**
 * Puts the filter a link asks for on screen.
 *
 * @param {Readonly<Record<string, unknown>>} query - The route query.
 */
function readQuery(query: Readonly<Record<string, unknown>>) {
  const next = readCollectionFilter(
    query,
    chainOptions.value.map((option) => option.value),
  );
  chain.value = next.chain;
  state.value = next.state;
  text.value = next.text;
}

/** Drops every filter, from the reset control and the empty state. */
function reset() {
  chain.value = "";
  state.value = "";
  text.value = "";
}

const route = useRoute();
const router = useRouter();

/**
 * Reads the link once after mount, because a prerendered page hydrates with an empty query and
 * gets the address only afterwards, then keeps the address in step with the filter.
 */
onMounted(() => {
  if (Object.keys(route.query).length > 0) {
    readQuery(route.query);
  } else {
    watch(
      () => route.query,
      (query) => readQuery(query),
      { once: true, flush: "post" },
    );
  }
  watch(filter, (next) => {
    void router.replace({ query: collectionFilterQuery(next), hash: route.hash });
  });
});

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
      <span :class="ROSTER_CLASS.meta" aria-live="polite"
        ><template v-if="filtered">{{ shown.length }} of </template>{{ rows.length }} collections ·
        {{ order }}</span
      >
    </header>
    <div class="roster-ruler" aria-hidden="true" />
    <div class="roster-filter">
      <p class="console-label console-rule-title">
        <span
          >Filter
          <span class="roster-filter-fields" aria-hidden="true"
            >[ chain · state · match ]</span
          ></span
        >
        <UButton
          v-if="filtered"
          color="neutral"
          variant="chip"
          icon="i-lucide-x"
          label="reset"
          class="roster-filter-reset"
          @click="reset"
        />
        <span class="console-mark" aria-hidden="true" />
      </p>
      <div class="console-readout" role="search" aria-label="Filter collections">
        <dl class="console-readout-rows">
          <div>
            <dt id="roster-filter-chain">chain</dt>
            <dd class="roster-filter-chips" role="group" aria-labelledby="roster-filter-chain">
              <UButton
                :color="chain === '' ? 'primary' : 'neutral'"
                variant="chip"
                label="all"
                :aria-pressed="chain === ''"
                @click="chain = ''"
                ><template #trailing
                  ><span class="puzzles-chip-count">{{ countWith({ chain: "" }) }}</span></template
                ></UButton
              >
              <UButton
                v-for="option in chainOptions"
                :key="option.value"
                :color="chain === option.value ? 'primary' : 'neutral'"
                variant="chip"
                :icon="option.icon"
                :label="option.label"
                :aria-pressed="chain === option.value"
                :data-empty="option.count === 0 || undefined"
                @click="chain = chain === option.value ? '' : option.value"
                ><template #trailing
                  ><span class="puzzles-chip-count">{{ option.count }}</span></template
                ></UButton
              >
            </dd>
          </div>
          <div>
            <dt id="roster-filter-state">state</dt>
            <dd class="roster-filter-chips" role="group" aria-labelledby="roster-filter-state">
              <UButton
                v-for="option in stateOptions"
                :key="option.value"
                :color="state === option.value ? 'primary' : 'neutral'"
                variant="chip"
                :label="option.label"
                :aria-pressed="state === option.value"
                :data-empty="option.count === 0 || undefined"
                @click="state = option.value"
                ><template #trailing
                  ><span class="puzzles-chip-count">{{ option.count }}</span></template
                ></UButton
              >
            </dd>
          </div>
          <div>
            <dt><label for="roster-filter-text">match</label></dt>
            <dd>
              <UInput
                id="roster-filter-text"
                v-model="text"
                variant="field"
                icon="i-lucide-search"
                placeholder="key, name or a word from about"
                spellcheck="false"
                autocomplete="off"
                :maxlength="FILTER_TEXT_MAX"
                class="w-full"
                @keydown.esc="text = ''"
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <UTable
      v-model:sorting="sorting"
      :data="shown"
      :columns="columns"
      :get-row-id="(row) => row.key"
      :ui="ROSTER_TABLE_UI"
    >
      <template #empty>
        <span class="roster-filter-empty"
          >no collection matches
          <UButton color="neutral" variant="chip" icon="i-lucide-x" label="reset" @click="reset"
        /></span>
      </template>
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

<style scoped>
/* The filter under the ruler: a section title, then a dashed readout with one row per field. */
.roster-filter {
  container: roster-filter / inline-size;
  padding: 16px 20px 18px;
  box-shadow: inset 0 -1px 0 var(--console-line);
}
.roster-filter .console-rule-title {
  margin-bottom: 12px;
}
.roster-filter .console-rule-title > .roster-filter-reset {
  order: 3;
}
.roster-filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.roster-filter .console-readout-rows > div {
  grid-template-columns: 5.5rem minmax(0, 1fr);
  align-items: center;
}
.roster-filter-empty {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ui-text-dimmed);
}
@container roster-filter (width < 30rem) {
  .roster-filter-fields {
    display: none;
  }
  .roster-filter .console-readout-rows > div {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
}
@media (width < 400px) {
  .roster-filter {
    padding-inline: 14px;
  }
}
</style>
