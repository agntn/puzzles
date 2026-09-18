<script setup lang="ts">
import { requireCollection } from "@agntn/puzzles";
import { collectionFacts, statusList } from "../../utils/collections";
import { formatPrizeTotals } from "../../utils/format";
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";

const props = defineProps<{ collection: string }>();

/** The collection module loads on the server for the prerender and again in the browser on navigation. */
const { data } = await useAsyncData(`collection-facts-${props.collection}`, async () =>
  collectionFacts(await requireCollection(props.collection)),
);

const entry = computed(() => collectionEntry(props.collection));

const facts = computed(() => {
  const current = data.value;
  if (!current) {
    return [];
  }
  return [
    { label: "load", value: `getCollection("${current.key}")`, mono: true },
    {
      label: "author",
      value: current.author ?? "unknown",
      mono: false,
      href: current.authorUrl,
    },
    { label: "puzzles", value: `${current.total} · ${statusList(current.statuses)}`, mono: false },
    { label: "prize recorded", value: formatPrizeTotals(current.prize), mono: true },
    { label: "still unsolved", value: formatPrizeTotals(current.unsolvedPrize), mono: true },
    {
      label: "known material",
      value: `${current.withPubkey} public keys · ${current.withKey} private keys`,
      mono: false,
    },
  ];
});
</script>

<template>
  <div v-if="data" class="not-prose my-6">
    <FactGrid :facts="facts" class="puzzles-frame overflow-hidden rounded-xl" />
    <div class="mt-3 flex flex-wrap items-center gap-1.5">
      <span v-for="chain in data.chains" :key="chain" class="puzzles-chip puzzles-chip-ok">
        <UIcon :name="CHAIN_ICONS[chain] ?? 'i-lucide-link'" class="size-3.5" />
        {{ chain }}
      </span>
      <span class="puzzles-chip"
        >started {{ data.firstStarted.slice(0, 10)
        }}<template v-if="data.lastStarted.slice(0, 10) !== data.firstStarted.slice(0, 10)">
          to {{ data.lastStarted.slice(0, 10) }}</template
        ></span
      >
      <NuxtLink
        v-if="entry"
        :to="`/playground?op=show&id=${encodeURIComponent(entry.sample)}`"
        class="puzzles-chip hover:text-highlighted"
      >
        <UIcon name="i-lucide-flask-conical" class="size-3.5" />
        open {{ entry.sample }} in the playground
      </NuxtLink>
    </div>
  </div>
</template>
