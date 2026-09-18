<script setup lang="ts">
import { NumericCollection, requireCollection, type Status } from "@agntn/puzzles";
import { formatPrize, shorten } from "../../utils/format";

const props = defineProps<{ collection: string }>();

/** One row per puzzle, plain data; the page for each is `/collections/<id>`. */
const { data } = await useAsyncData(
  () => `collection-puzzles-${props.collection}`,
  async () => {
    const collection = await requireCollection(props.collection);
    return {
      numeric: collection instanceof NumericCollection,
      rows: collection.all().map((puzzle) => ({
        id: puzzle.id(),
        name: puzzle.name(),
        status: puzzle.status(),
        prize: formatPrize(puzzle.prize(), puzzle.prizeCurrency()),
        address: puzzle.address().value,
        pubkey: puzzle.hasPubkey(),
        key: puzzle.hasPrivateKey(),
        bits: puzzle.keyData()?.bits,
      })),
    };
  },
);

const rows = computed(() => data.value?.rows ?? []);

/** A numbered collection reads as a grid of cells, a named one as rows. */
const numeric = computed(() => data.value?.numeric === true);

const counts = computed(() => {
  const totals: Record<string, number> = {};
  for (const row of rows.value) totals[row.status] = (totals[row.status] ?? 0) + 1;
  return Object.entries(totals);
});

const CELL: Readonly<Record<Status, string>> = {
  solved: "puzzles-cell-solved",
  swept: "puzzles-cell-swept",
  claimed: "puzzles-cell-claimed",
  expired: "puzzles-cell-expired",
  unsolved: "",
};
</script>

<template>
  <div v-if="rows.length > 0" class="puzzles-frame not-prose my-6 overflow-hidden rounded-xl">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-muted px-4 py-3">
      <p class="font-mono text-xs text-muted">
        <span class="text-dimmed">{{ collection }}.all()</span>
        <span class="ms-2 text-highlighted">{{ rows.length }} puzzles</span>
      </p>
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-dimmed">
        <span
          v-for="[status, count] in counts"
          :key="status"
          class="inline-flex items-center gap-1.5"
        >
          <span
            class="puzzles-state-dot"
            :class="CELL[status as Status] ? `${CELL[status as Status]}-dot` : ''"
          />
          {{ count }} {{ status }}
        </span>
      </p>
    </div>

    <div v-if="numeric" class="grid grid-cols-8 gap-1.5 p-3 sm:grid-cols-12 lg:grid-cols-16">
      <NuxtLink
        v-for="row in rows"
        :key="row.id"
        :to="`/collections/${row.id}`"
        class="puzzles-cell"
        :class="CELL[row.status]"
        :title="`${row.id} · ${row.status} · ${row.prize}${row.key ? ' · key published' : ''}`"
      >
        {{ row.name }}
      </NuxtLink>
    </div>

    <ol v-else class="divide-y divide-muted">
      <li
        v-for="row in rows"
        :key="row.id"
        class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-2.5 font-mono text-[12px] sm:grid-cols-[8rem_6rem_9rem_minmax(0,1fr)_4rem]"
      >
        <NuxtLink
          :to="`/collections/${row.id}`"
          class="truncate text-highlighted hover:underline"
          >{{ row.name }}</NuxtLink
        >
        <StatusPill :status="row.status" />
        <span class="hidden text-muted sm:block">{{ row.prize }}</span>
        <span class="hidden truncate text-dimmed sm:block" :title="row.address">{{
          shorten(row.address, 14, 8)
        }}</span>
        <span class="hidden justify-end gap-1.5 text-dimmed sm:flex">
          <UIcon
            v-if="row.pubkey"
            name="i-lucide-badge-check"
            class="size-3.5"
            title="public key known"
          />
          <UIcon
            v-if="row.key"
            name="i-lucide-key-round"
            class="size-3.5 text-primary"
            title="private key published"
          />
          <span v-if="row.bits !== undefined" class="text-[10px]">{{ row.bits }}b</span>
        </span>
      </li>
    </ol>
    <p class="border-t border-muted px-4 py-2.5 font-mono text-[11px] text-dimmed">
      {{ numeric ? "every cell is a page, hover for the prize" : "every name is a page" }} · the key
      icon marks a published private key
    </p>
  </div>
</template>
