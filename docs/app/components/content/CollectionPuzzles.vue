<script setup lang="ts">
import { NumericCollection, requireCollection } from "@agntn/puzzles";
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

/** Status counts in record order, for the bar. */
const counts = computed(() => {
  const totals = new Map<string, number>();
  for (const row of rows.value) totals.set(row.status, (totals.get(row.status) ?? 0) + 1);
  return [...totals];
});
</script>

<template>
  <section
    v-if="rows.length > 0"
    class="tool-console console-wide not-prose my-6"
    :aria-label="`${collection} puzzles`"
  >
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="console-bar">
      <span class="console-title"><span class="console-tag">List</span>{{ collection }}.all()</span>
      <span class="console-meta"
        ><span v-if="!numeric" class="console-ticks-bar" aria-hidden="true"
          ><span
            v-for="row in rows"
            :key="row.id"
            :class="
              row.status === 'unsolved' ? 'console-tick-open' : 'console-tick-closed'
            " /></span
        >{{ rows.length }} puzzles<template v-for="[status, count] in counts" :key="status">
          ·
          <span class="puzzles-list-count"
            ><span :class="{ 'puzzles-list-open': status === 'unsolved' }">{{ count }}</span>
            {{ status }}</span
          ></template
        ></span
      >
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span class="console-cursor" /></div>

    <ol v-if="numeric" class="puzzles-list-cells">
      <li v-for="row in rows" :key="row.id">
        <UTooltip>
          <template #content>
            <span class="puzzles-tooltip-value">{{ row.id }}</span
            ><span class="puzzles-tooltip-sep">&nbsp;·&nbsp;</span
            ><span :class="{ 'puzzles-tooltip-open': row.status === 'unsolved' }">{{
              row.status
            }}</span
            ><span class="puzzles-tooltip-sep">&nbsp;·&nbsp;</span
            ><span class="puzzles-tooltip-value">{{ row.prize }}</span
            ><template v-if="row.key"
              ><span class="puzzles-tooltip-sep">&nbsp;·&nbsp;</span>key published</template
            >
          </template>
          <NuxtLink :to="`/collections/${row.id}`" :class="`puzzles-list-cell-${row.status}`"
            >{{ row.name }}<span v-if="row.key" class="puzzles-list-cell-key" aria-hidden="true"
          /></NuxtLink>
        </UTooltip>
      </li>
    </ol>

    <ol v-else class="console-rows console-animate puzzles-list-rows">
      <li
        v-for="(row, index) in rows"
        :key="row.id"
        :style="{ animationDelay: `${Math.min(index * 30, 600)}ms` }"
      >
        <NuxtLink :to="`/collections/${row.id}`" class="puzzles-list-name">{{ row.name }}</NuxtLink>
        <StatusPill :status="row.status" />
        <span class="puzzles-list-prize">{{ row.prize }}</span>
        <span class="puzzles-list-address">
          <span class="console-leader" aria-hidden="true" />
          <UTooltip :text="row.address">
            <span>{{ shorten(row.address, 14, 8) }}</span>
          </UTooltip>
        </span>
        <span class="puzzles-list-marks">
          <UTooltip v-if="row.pubkey" text="public key known">
            <UIcon name="i-lucide-badge-check" class="size-3.5" aria-label="public key known" />
          </UTooltip>
          <UTooltip v-if="row.key" text="private key published">
            <UIcon
              name="i-lucide-key-round"
              class="puzzles-list-key size-3.5"
              aria-label="private key published"
            />
          </UTooltip>
          <span v-if="row.bits !== undefined">{{ row.bits }}b</span>
        </span>
      </li>
    </ol>

    <footer class="console-footer console-footer-plain">
      <span
        >{{ numeric ? "every cell is a page, hover for the prize" : "every name is a page" }} ·
        {{
          numeric
            ? "the corner mark is a published private key"
            : "the key marks a published private key"
        }}</span
      >
      <span class="console-meta">local dataset / no network</span>
    </footer>
  </section>
</template>

<style scoped>
.puzzles-list-count {
  white-space: nowrap;
}
.puzzles-list-open {
  color: var(--console-accent);
}
.puzzles-list-rows li {
  grid-template-columns: minmax(0, 1fr) auto;
}
.puzzles-list-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.puzzles-list-prize {
  grid-column: 1;
  color: var(--ui-text-muted);
  white-space: nowrap;
}
.puzzles-list-address {
  display: none;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  color: var(--ui-text-dimmed);
}
.puzzles-list-address > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.puzzles-list-marks {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--ui-text-dimmed);
}
.puzzles-list-key {
  color: var(--console-accent);
}
@media (width >= 640px) {
  .puzzles-list-rows li {
    grid-template-columns: 11rem 6.5rem 9rem minmax(0, 1fr) 4rem;
    align-items: center;
  }
  .puzzles-list-prize {
    grid-column: auto;
  }
  .puzzles-list-address {
    display: flex;
  }
}

/* A numbered collection: one cell per puzzle, closed ones stand on a hatched strip, open ones in the accent. */
.puzzles-list-cells {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2.5rem, 1fr));
  gap: 4px;
  margin: 0;
  padding: 16px 20px;
  list-style: none;
}
.puzzles-list-cells a {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-muted);
  box-shadow: inset 0 0 0 1px var(--console-line);
}
.puzzles-list-cells a::after {
  content: "";
  position: absolute;
  inset: auto 1px 1px;
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--console-corner) 0 1px, transparent 1px 3px);
}
.puzzles-list-cells a:hover {
  color: var(--ui-text-highlighted);
  box-shadow: inset 0 0 0 1px var(--console-corner);
}
.puzzles-list-cells a:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
.puzzles-list-cells .puzzles-list-cell-unsolved {
  color: var(--ui-text-highlighted);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--console-accent) 55%, transparent);
}
.puzzles-list-cells .puzzles-list-cell-unsolved:hover {
  box-shadow: inset 0 0 0 1px var(--console-accent);
}
.puzzles-list-cells .puzzles-list-cell-unsolved::after {
  content: none;
}
.puzzles-list-cells .puzzles-list-cell-swept::after {
  background: repeating-linear-gradient(
    90deg,
    color-mix(in srgb, var(--puzzles-del) 70%, var(--ui-bg)) 0 1px,
    transparent 1px 3px
  );
}
.puzzles-list-cells .puzzles-list-cell-expired {
  color: var(--ui-text-dimmed);
}
.puzzles-list-cell-key {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 3px;
  height: 3px;
  background: var(--ui-text-muted);
}
@media (width < 400px) {
  .puzzles-list-cells {
    padding-inline: 14px;
  }
}
</style>
