<script setup lang="ts">
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";
import type { PuzzleView } from "../../utils/puzzle-view";
import { hostPath, shorten } from "../../utils/format";

const props = defineProps<{ view: PuzzleView; compact?: boolean }>();

const entry = computed(() => collectionEntry(props.view.collection));
const page = computed(() => `/collections/${props.view.id}`);

const facts = computed(() => {
  const view = props.view;
  return [
    { label: "prize", value: view.prize, mono: true },
    {
      label: "key material",
      value:
        view.secret === "none"
          ? view.bits === undefined
            ? "none published"
            : `${view.bits}-bit search width`
          : view.secret,
      mono: true,
    },
    {
      label: "public key",
      value:
        view.pubkey === undefined
          ? "unknown"
          : `${view.pubkeyFormat ?? ""} · ${shorten(view.pubkey, 10, 8)}`,
      mono: true,
    },
    { label: "started", value: view.startedAt.slice(0, 10), mono: true },
    {
      label: "solved",
      value:
        view.solvedAt === undefined
          ? "not yet"
          : `${view.solvedAt.slice(0, 10)} · ${view.solveTime ?? ""}`,
      mono: true,
    },
    {
      label: "verification",
      value:
        view.verdict === "verified"
          ? "key derives the address"
          : view.verdict === "unavailable"
            ? view.detail.toLowerCase()
            : `failed: ${view.detail}`,
      mono: false,
    },
  ];
});

/** Rows shown before the list folds; the rest open on request. */
const FOLD = 8;
const unfolded = ref(false);
const transactionRows = computed(() =>
  unfolded.value || props.view.transactionRows.length <= FOLD
    ? props.view.transactionRows
    : props.view.transactionRows.slice(0, FOLD),
);
const folded = computed(() => props.view.transactionRows.length - transactionRows.value.length);

const { copied, copy } = useCopied();
</script>

<template>
  <div class="puzzles-frame not-prose overflow-hidden rounded-xl">
    <div class="flex flex-wrap items-center gap-3 border-b border-muted px-5 py-4">
      <span class="font-mono text-lg text-highlighted">{{ view.id }}</span>
      <StatusPill :status="view.status" />
      <span class="puzzles-chip">
        <UIcon :name="CHAIN_ICONS[view.chain] ?? 'i-lucide-link'" class="size-3.5" />
        {{ view.chain }}
      </span>
      <span
        v-if="view.preGenesis"
        class="puzzles-chip"
        title="Funded before the puzzle thread existed"
        >pre-genesis</span
      >
      <NuxtLink v-if="entry" :to="entry.to" class="puzzles-chip ms-auto hover:text-highlighted">
        <UIcon :name="entry.icon" class="size-3.5" />
        {{ entry.title }}
      </NuxtLink>
    </div>

    <FactGrid :facts="facts" class="[&>div]:px-5" />

    <div class="border-t border-muted px-5 py-4">
      <p class="puzzles-eyebrow mb-2">address · {{ view.kind }}</p>
      <div class="flex flex-wrap items-center gap-2">
        <code class="min-w-0 font-mono text-[13px] break-all text-highlighted">{{
          view.address
        }}</code>
        <button
          type="button"
          class="puzzles-copy"
          :data-copied="copied === 'address'"
          @click="copy('address', view.address)"
        >
          <UIcon
            :name="copied === 'address' ? 'i-lucide-check' : 'i-lucide-copy'"
            class="size-3.5"
          />
          {{ copied === "address" ? "copied" : "copy" }}
        </button>
        <a :href="view.explorer" target="_blank" rel="noopener" class="puzzles-copy">
          <UIcon name="i-lucide-external-link" class="size-3.5" />
          {{ hostPath(view.explorer).split("/")[0] }}
        </a>
      </div>
      <p v-if="view.hash160" class="mt-1.5 font-mono text-[11px] text-dimmed">
        hash160 {{ view.hash160 }}
      </p>
      <p v-if="view.redeemScript" class="mt-1 font-mono text-[11px] text-dimmed">
        redeem script {{ view.redeemScript.script }}
      </p>
    </div>

    <div class="border-t border-muted px-5 py-4">
      <p class="puzzles-eyebrow mb-2">balance</p>
      <BalanceLine :id="view.id" :status="view.status" />
    </div>

    <template v-if="!compact">
      <div v-if="view.range" class="border-t border-muted px-5 py-4">
        <p class="puzzles-eyebrow mb-2">key range · {{ view.bits }} bits</p>
        <p class="font-mono text-[13px] text-highlighted">
          2^{{ (view.bits ?? 1) - 1 }} to 2^{{ view.bits }} - 1
        </p>
        <p class="mt-1 font-mono text-[11px] break-all text-dimmed">
          0x{{ view.range[0] }} to 0x{{ view.range[1] }}
        </p>
      </div>

      <div v-if="view.keyRows.length > 0" class="border-t border-muted px-5 py-4">
        <p class="puzzles-eyebrow mb-3">key material · on the record</p>
        <dl class="puzzles-kv p-0!">
          <template v-for="row in view.keyRows" :key="row.label">
            <dt>{{ row.label }}</dt>
            <dd :class="{ 'font-mono text-[12px]': row.mono }">
              <a
                v-if="row.href"
                :href="row.href"
                target="_blank"
                rel="noopener"
                class="hover:underline"
                >{{ row.value }}</a
              >
              <template v-else>{{ row.value }}</template>
            </dd>
          </template>
        </dl>
      </div>

      <div v-if="view.transactionRows.length > 0" class="border-t border-muted">
        <p class="puzzles-eyebrow px-5 pt-4 pb-2">
          transactions · {{ view.transactionRows.length }}
        </p>
        <ol class="divide-y divide-muted border-t border-muted">
          <li
            v-for="row in transactionRows"
            :key="row.txid"
            class="grid grid-cols-[5.5rem_6rem_minmax(0,1fr)] gap-x-3 px-5 py-2.5 font-mono text-[12px] sm:grid-cols-[6.5rem_9rem_7rem_minmax(0,1fr)]"
          >
            <span class="text-highlighted">{{ row.type }}</span>
            <span class="text-muted">{{ row.date.slice(0, 10) }}</span>
            <span class="truncate text-dimmed">{{ row.amount }}</span>
            <a
              :href="row.url"
              target="_blank"
              rel="noopener"
              class="hidden truncate text-muted hover:text-highlighted hover:underline sm:block"
              :title="row.txid"
              >{{ shorten(row.txid, 16, 10) }}</a
            >
          </li>
        </ol>
        <button
          v-if="folded > 0"
          type="button"
          class="flex w-full items-center gap-1.5 border-t border-muted px-5 py-2.5 font-mono text-[11px] text-muted hover:bg-muted hover:text-highlighted"
          @click="unfolded = true"
        >
          <UIcon name="i-lucide-chevron-down" class="size-3.5" />
          {{ folded }} more transactions
        </button>
      </div>

      <div v-if="view.assets.length > 0" class="border-t border-muted px-5 py-4">
        <p class="puzzles-eyebrow mb-3">assets · shipped with the record</p>
        <div class="flex flex-wrap gap-3">
          <a
            v-for="asset in view.assets"
            :key="asset.path"
            :href="asset.url"
            target="_blank"
            rel="noopener"
            class="puzzles-frame group flex max-w-xs flex-col overflow-hidden rounded-lg"
          >
            <img
              v-if="asset.image"
              :src="asset.url"
              :alt="`${asset.label} for ${view.id}`"
              loading="lazy"
              class="max-h-56 w-full bg-muted object-contain"
            />
            <span class="px-3 py-2 font-mono text-[11px] text-muted group-hover:text-highlighted"
              >{{ asset.label }} · {{ asset.path }}</span
            >
          </a>
        </div>
        <p v-if="view.assetSource" class="mt-2 font-mono text-[11px] text-dimmed">
          from
          <a :href="view.assetSource" target="_blank" rel="noopener" class="hover:underline">{{
            hostPath(view.assetSource)
          }}</a>
        </p>
      </div>

      <div v-if="view.hints.length > 0" class="border-t border-muted px-5 py-4">
        <p class="puzzles-eyebrow mb-3">
          hints · {{ view.hints.length }} · who said it, where, and what confirms that
        </p>
        <ul class="space-y-3">
          <li v-for="(hint, index) in view.hints" :key="index">
            <p class="text-sm text-highlighted">
              <span class="puzzles-chip me-2 font-mono text-[11px]">{{ hint.kind }}</span
              >{{ hint.text }}
            </p>
            <p class="mt-1 font-mono text-[11px] text-dimmed">
              <template v-if="hint.date">{{ hint.date }} · </template>source
              <a :href="hint.source" target="_blank" rel="noopener" class="hover:underline">{{
                hostPath(hint.source)
              }}</a>
              · confirmation
              <a :href="hint.confirmation" target="_blank" rel="noopener" class="hover:underline">{{
                hostPath(hint.confirmation)
              }}</a>
              <template v-if="hint.note"> ({{ hint.note }})</template>
            </p>
          </li>
        </ul>
      </div>

      <div v-if="view.solverName || view.solverUrl" class="border-t border-muted px-5 py-4">
        <p class="puzzles-eyebrow mb-2">solved by</p>
        <p class="text-sm text-highlighted">
          <a
            v-if="view.solverUrl"
            :href="view.solverUrl"
            target="_blank"
            rel="noopener"
            class="hover:underline"
            >{{ view.solverName ?? hostPath(view.solverUrl) }}</a
          >
          <template v-else>{{ view.solverName }}</template>
        </p>
      </div>

      <div class="border-t border-muted px-5 py-4">
        <div class="flex items-center justify-between">
          <p class="puzzles-eyebrow">source</p>
          <NuxtLink
            :to="`/playground?op=show&id=${encodeURIComponent(view.id)}`"
            class="puzzles-copy"
          >
            <UIcon name="i-lucide-flask-conical" class="size-3.5" />
            open in the playground
          </NuxtLink>
        </div>
        <a
          :href="view.source"
          target="_blank"
          rel="noopener"
          class="mt-1 block truncate font-mono text-[12px] text-muted hover:text-highlighted hover:underline"
          >{{ view.source }}</a
        >
      </div>
    </template>
    <div v-else class="flex items-center justify-between border-t border-muted px-5 py-3">
      <span class="font-mono text-[11px] text-dimmed"
        >{{ view.transactionRows.length }} transactions · {{ view.assets.length }} assets</span
      >
      <NuxtLink
        :to="page"
        class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        puzzle page
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </NuxtLink>
    </div>
  </div>
</template>
