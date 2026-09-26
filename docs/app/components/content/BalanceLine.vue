<script setup lang="ts">
import type { Status } from "@agntn/puzzles";

const props = defineProps<{ id: string; status?: Status }>();

const { state } = useBalance(() => props.id);

const PROVIDERS: Readonly<Record<string, string>> = {
  bitcoin: "mempool.space",
  bitcoincash: "blockchair.com",
  litecoin: "litecoinspace.org",
  ethereum: "etherscan.io",
  decred: "dcrdata.decred.org",
  arweave: "arweave.net",
};

/** What an empty address means for a puzzle that's over: the note under a zero. */
const EMPTY: Readonly<Partial<Record<Status, string>>> = {
  solved: "empty since the solve",
  claimed: "empty since the claim",
  swept: "empty since the sweep",
  expired: "returned to the author",
};

const note = computed(() => {
  if (state.value.status !== "ready" || state.value.balance.amount !== "0") return undefined;
  return props.status === undefined ? undefined : EMPTY[props.status];
});
</script>

<template>
  <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <template v-if="state.status === 'ready'">
      <span class="font-mono text-lg text-highlighted"
        >{{ state.balance.amount }} {{ state.balance.symbol }}</span
      >
      <span class="font-mono text-[11px] text-dimmed"
        ><template v-if="note">{{ note }} · </template
        >{{ PROVIDERS[state.balance.chain] ?? state.balance.chain }} · live · cached five
        minutes<template v-if="state.balance.unconfirmed !== '0'">
          · {{ state.balance.unconfirmed }} base units in the mempool</template
        ></span
      >
    </template>
    <span v-else-if="state.status === 'failed'" class="font-mono text-[12px] text-muted">
      <UIcon name="i-lucide-circle-x" class="puzzles-text-del me-1 inline size-3.5 align-[-2px]" />
      {{ state.error }}
    </span>
    <span v-else class="inline-flex items-center gap-1.5 font-mono text-[12px] text-dimmed">
      <UIcon name="i-lucide-loader-circle" class="size-3.5 animate-spin" />
      asking the explorer
    </span>
  </div>
</template>
