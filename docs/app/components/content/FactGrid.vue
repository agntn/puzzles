<script setup lang="ts">
import { host } from "../../utils/format";

export interface Fact {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
  readonly href?: string;
  readonly to?: string;
}

const props = withDefaults(defineProps<{ facts: readonly Fact[]; columns?: 3 | 4 }>(), {
  columns: 3,
});

/**
 * Two columns on a phone, `columns` from the small breakpoint; borders drawn between cells only.
 *
 * @param {number} index - The cell's position in the grid.
 * @returns {Record<string, boolean>} The border classes for that cell.
 */
function cellClass(index: number): Record<string, boolean> {
  const columns = props.columns;
  return {
    "border-t": index >= 2,
    "sm:border-t-0": index < columns,
    "border-l": index % 2 === 1,
    "sm:border-l": index % columns !== 0,
    "sm:border-l-0": index % columns === 0,
  };
}
</script>

<template>
  <dl class="grid grid-cols-2" :class="columns === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'">
    <div
      v-for="(fact, index) in facts"
      :key="fact.label"
      class="min-w-0 border-muted px-4 py-3.5"
      :class="cellClass(index)"
    >
      <dt class="font-mono text-[10px] tracking-[0.12em] text-dimmed uppercase">
        {{ fact.label }}
      </dt>
      <dd
        class="mt-1 text-sm text-highlighted"
        :class="{ 'font-mono text-[13px] break-words': fact.mono }"
      >
        <NuxtLink v-if="fact.to" :to="fact.to" class="hover:underline"
          >{{ fact.value
          }}<span class="ms-1 font-mono text-[11px] text-dimmed">{{ fact.to }}</span></NuxtLink
        >
        <a
          v-else-if="fact.href"
          :href="fact.href"
          target="_blank"
          rel="noopener"
          class="hover:underline"
          >{{ fact.value
          }}<span class="ms-1 font-mono text-[11px] text-dimmed">{{ host(fact.href) }}</span></a
        >
        <template v-else>{{ fact.value }}</template>
      </dd>
    </div>
  </dl>
</template>
