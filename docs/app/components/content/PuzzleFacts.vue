<script setup lang="ts">
import type { PuzzlePageData } from "../../composables/usePuzzlePage";
import { host, linkText, shorten, verdictLabel } from "../../utils/format";
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";
import { literalTokens, recordLiteral, solvedText, transactionTicks } from "../../utils/record";

/**
 * The puzzle dossier: one record on the console shell, from its literal and readout down to its
 * transactions, files and hints. `PuzzlePage` resolves the record and hands it in.
 */
const props = defineProps<{ page: PuzzlePageData }>();

const view = computed(() => props.page.view);
const entry = computed(() => collectionEntry(view.value.collection));
const literal = computed(() => recordLiteral(view.value));
const ticks = computed(() => transactionTicks(view.value));

const keyMaterial = computed(() => {
  const current = view.value;
  if (current.secret !== "none")
    return current.derived ? `${current.secret}, derived from the recipe` : current.secret;
  return current.bits === undefined ? "none published" : `${current.bits}-bit search width`;
});

/** The started date, and the solved one when the record has it, for the bar. */
const span = computed(() => {
  const started = view.value.startedAt.slice(0, 10);
  const solved = view.value.solvedAt?.slice(0, 10);
  return solved === undefined || solved === started ? started : `${started} → ${solved}`;
});

/** Public key, search range and every piece of key material the record carries, one row each. */
const keyRows = computed(() => {
  const current = view.value;
  return [
    ...(current.pubkey === undefined
      ? []
      : [
          {
            label: `public key · ${current.pubkeyFormat ?? "format unknown"}`,
            value: current.pubkey,
          },
        ]),
    ...(current.range === undefined || current.bits === undefined
      ? []
      : [
          {
            label: `range · ${current.bits} bits`,
            value: `0x${current.range[0]} to 0x${current.range[1]}`,
          },
        ]),
    ...current.keyRows,
  ];
});

/** Rows shown before the list folds; the rest open on request. */
const FOLD = 8;
const unfolded = ref(false);
const transactionRows = computed(() =>
  unfolded.value || view.value.transactionRows.length <= FOLD
    ? view.value.transactionRows
    : view.value.transactionRows.slice(0, FOLD),
);
const folded = computed(() => view.value.transactionRows.length - transactionRows.value.length);

const { copied, copy } = useCopied();
</script>

<template>
  <section class="tool-console console-wide not-prose" aria-label="Puzzle record">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="console-bar">
      <span class="console-title puzzle-id"
        ><span class="console-tag">ID</span>{{ view.id
        }}<span v-if="page.total > 1" class="console-file"
          >{{ String(page.position).padStart(2, "0") }} / {{ page.total }}</span
        ></span
      >
      <span class="console-meta puzzle-span">{{ span }}</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span class="console-cursor" /></div>

    <div class="console-band console-subject-band">
      <div class="console-scan" aria-hidden="true" />
      <div class="console-identity-block">
        <ConsoleReticle :key="view.id" :icon="CHAIN_ICONS[view.chain] ?? 'i-lucide-link'" />
        <div class="console-name">
          <span class="console-label"
            >Puzzle / <span class="console-label-key">{{ view.collection }}</span></span
          >
          <h3 class="console-name-mono">{{ view.name }}</h3>
          <p class="console-aliases">
            <span class="console-chain"
              ><UIcon :name="CHAIN_ICONS[view.chain] ?? 'i-lucide-link'" class="size-3.5" />{{
                view.chain
              }}</span
            >
            <span>{{ view.kind }}</span>
            <StatusPill :status="view.status" />
            <UTooltip v-if="view.preGenesis" text="Funded before the puzzle thread existed">
              <span class="puzzle-flag">pre-genesis</span>
            </UTooltip>
          </p>
          <p class="console-label console-rule-title puzzle-literal-title">
            <span>Record <span aria-hidden="true">[ as written ]</span></span>
            <span class="console-mark" aria-hidden="true" />
            <button
              type="button"
              class="console-button"
              :data-copied="copied === 'record'"
              @click="copy('record', literal)"
            >
              <UIcon
                :name="copied === 'record' ? 'i-lucide-check' : 'i-lucide-copy'"
                class="size-3"
                aria-hidden="true"
              />
              {{ copied === "record" ? "copied" : "copy" }}
            </button>
          </p>
          <pre
            class="console-snippet puzzle-literal"
          ><code><span v-for="(token, index) in literalTokens(literal)" :key="index" :class="token.cls">{{ token.text }}</span></code></pre>
        </div>
      </div>

      <div class="console-readout">
        <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
          <circle cx="3" cy="12" r="2.5" />
          <path d="M5.5 12H14L22 20H32" />
        </svg>
        <dl class="console-readout-rows console-animate">
          <div :style="{ animationDelay: '0ms' }">
            <dt>Prize</dt>
            <dd :class="{ 'console-accent': view.status === 'unsolved' }">{{ view.prize }}</dd>
          </div>
          <div :style="{ animationDelay: '45ms' }">
            <dt>Key material</dt>
            <dd>{{ keyMaterial }}</dd>
          </div>
          <div :style="{ animationDelay: '90ms' }">
            <dt>Verification</dt>
            <dd>
              {{ verdictLabel(view.verdict === "verified", view.verdict === "unavailable") }}
            </dd>
          </div>
          <div :style="{ animationDelay: '135ms' }">
            <dt>Solved</dt>
            <dd>{{ solvedText(view) }}</dd>
          </div>
        </dl>
        <div
          v-if="ticks.length > 0"
          class="console-gauge"
          :aria-label="`${ticks.length} transactions on record`"
        >
          <span
            class="console-ticks"
            :class="{ 'console-ticks-dense': ticks.length > 64 }"
            aria-hidden="true"
          >
            <span
              v-for="(tick, index) in ticks"
              :key="index"
              :class="tick === 'open' ? 'console-tick-open' : 'console-tick-closed'"
              :style="{ animationDelay: `${Math.min(index * 12, 720)}ms` }"
            />
          </span>
          <span class="console-gauge-read">tx {{ ticks.length }}</span>
        </div>
      </div>
    </div>

    <div class="console-band puzzle-trail">
      <dl class="puzzle-channels">
        <dt class="console-label">Trail <span aria-hidden="true">[ where it lives ]</span></dt>
        <dd class="console-lead">
          <span class="console-tag">Explorer</span>
          <a :href="view.explorer" target="_blank" rel="noopener">{{ host(view.explorer) }}</a>
          <span class="console-leader" aria-hidden="true" />
        </dd>
        <dd class="console-lead">
          <span class="console-tag">Source</span>
          <UTooltip :text="view.source">
            <a :href="view.source" target="_blank" rel="noopener">{{ linkText(view.source) }}</a>
          </UTooltip>
          <span class="console-leader" aria-hidden="true" />
        </dd>
        <dd v-if="view.solverName || view.solverUrl" class="console-lead">
          <span class="console-tag">Solver</span>
          <NuxtLink v-if="view.solverKey" :to="`/solvers/${view.solverKey}`"
            >{{ view.solverName ?? view.solverKey
            }}<span class="puzzle-dim"> and what else they solved</span></NuxtLink
          >
          <a v-else-if="view.solverUrl" :href="view.solverUrl" target="_blank" rel="noopener">{{
            view.solverName ?? linkText(view.solverUrl)
          }}</a>
          <span v-else>{{ view.solverName }}</span>
          <span class="console-leader" aria-hidden="true" />
        </dd>
        <dd class="console-lead">
          <span class="console-tag">Try</span>
          <NuxtLink :to="`/playground?op=show&id=${encodeURIComponent(view.id)}`"
            >{{ view.id }}<span class="puzzle-dim"> in the playground</span></NuxtLink
          >
          <span class="console-leader" aria-hidden="true" />
        </dd>
      </dl>
      <div class="puzzle-target">
        <dl class="console-address">
          <dt class="console-label">
            Address <span aria-hidden="true">[ {{ view.kind }} ]</span>
            <button
              type="button"
              class="console-button"
              :data-copied="copied === 'address'"
              @click="copy('address', view.address)"
            >
              <UIcon
                :name="copied === 'address' ? 'i-lucide-check' : 'i-lucide-copy'"
                class="size-3"
                aria-hidden="true"
              />
              {{ copied === "address" ? "copied" : "copy" }}
            </button>
          </dt>
          <dd class="console-node">{{ view.address }}</dd>
        </dl>
        <p v-if="view.hash160" class="puzzle-script">hash160 {{ view.hash160 }}</p>
        <p v-if="view.redeemScript" class="puzzle-script">
          redeem script {{ view.redeemScript.script }}
        </p>
        <div class="puzzle-balance">
          <span class="console-label">Balance <span aria-hidden="true">[ explorer ]</span></span>
          <BalanceLine :id="view.id" :status="view.status" />
        </div>
      </div>
    </div>

    <div v-if="keyRows.length > 0" class="console-band">
      <p class="console-label console-rule-title">
        <span>Key <span aria-hidden="true">[ on the record ]</span></span>
        <span class="console-mark" aria-hidden="true" />
      </p>
      <dl class="puzzle-keys console-animate">
        <div
          v-for="(row, index) in keyRows"
          :key="row.label"
          :style="{ animationDelay: `${Math.min(index * 45, 450)}ms` }"
        >
          <dt>{{ row.label }}</dt>
          <dd :class="{ 'puzzle-prose': 'mono' in row && !row.mono }">
            <a v-if="'href' in row && row.href" :href="row.href" target="_blank" rel="noopener">{{
              row.value
            }}</a>
            <template v-else>{{ row.value }}</template>
          </dd>
        </div>
      </dl>
    </div>

    <div v-if="view.transactionRows.length > 0" class="puzzle-transactions">
      <p class="console-label console-rule-title">
        <span
          >Transactions <span aria-hidden="true">[ {{ view.transactionRows.length }} ]</span></span
        >
        <span class="console-mark" aria-hidden="true" />
      </p>
      <ol class="console-rows console-animate">
        <li
          v-for="(row, index) in transactionRows"
          :key="row.txid"
          :style="{ animationDelay: `${Math.min(index * 30, 600)}ms` }"
        >
          <span
            class="puzzle-tx-type"
            :class="{ 'puzzle-tx-out': /sweep|claim|decrease/u.test(row.type) }"
            >{{ row.type }}</span
          >
          <span class="puzzle-tx-date">{{ row.date.slice(0, 10) }}</span>
          <span class="puzzle-tx-amount">{{ row.amount }}</span>
          <span class="console-leader" aria-hidden="true" />
          <UTooltip :text="row.txid">
            <a :href="row.url" target="_blank" rel="noopener" class="puzzle-tx-id">{{
              shorten(row.txid, 10, 6)
            }}</a>
          </UTooltip>
        </li>
      </ol>
      <button v-if="folded > 0" type="button" class="puzzle-unfold" @click="unfolded = true">
        <UIcon name="i-lucide-chevron-down" class="size-3.5" aria-hidden="true" />
        {{ folded }} more transactions
      </button>
    </div>

    <div v-if="view.assets.length > 0" class="console-band">
      <p class="console-label console-rule-title">
        <span>Files <span aria-hidden="true">[ shipped with the record ]</span></span>
        <span class="console-mark" aria-hidden="true" />
      </p>
      <ul class="puzzle-assets">
        <li v-for="asset in view.assets" :key="asset.path">
          <a :href="asset.url" target="_blank" rel="noopener">
            <img
              v-if="asset.image"
              :src="asset.url"
              :alt="`${asset.label} for ${view.id}`"
              loading="lazy"
            />
            <span
              ><span class="console-tag">{{ asset.label }}</span
              >{{ asset.path }}</span
            >
          </a>
        </li>
      </ul>
      <p v-if="view.assetSource" class="console-lead puzzle-asset-source">
        <span class="console-tag">From</span>
        <UTooltip :text="view.assetSource">
          <a :href="view.assetSource" target="_blank" rel="noopener">{{
            linkText(view.assetSource)
          }}</a>
        </UTooltip>
        <span class="console-leader" aria-hidden="true" />
      </p>
    </div>

    <div v-if="view.hints.length > 0" class="console-band">
      <p class="console-label console-rule-title">
        <span
          >Hints
          <span aria-hidden="true">[ who said it, where · {{ view.hints.length }} ]</span></span
        >
        <span class="console-mark" aria-hidden="true" />
      </p>
      <HintLog :hints="view.hints" />
    </div>

    <ConsoleResponse :title="`puzzles_show · ${view.id}`" :text="view.tool" />
    <ConsoleResponse
      :title="`puzzle.toJSON() · ${view.id}`"
      :text="view.json"
      index="04"
      label="Serialized record"
      source="puzzle.toJSON()"
      description="The record as JSON. An absent field is left out, never null."
    />

    <footer class="console-footer console-footer-plain">
      <ul class="console-links">
        <li v-if="page.previous">
          <NuxtLink :to="`/collections/${page.previous}`"
            ><span aria-hidden="true">← </span>{{ page.previous }}</NuxtLink
          >
        </li>
        <li v-if="page.next">
          <NuxtLink :to="`/collections/${page.next}`"
            >{{ page.next }}<span aria-hidden="true"> →</span></NuxtLink
          >
        </li>
        <li v-if="entry && page.total > 1">
          <NuxtLink :to="entry.to"><span aria-hidden="true">→ </span>{{ entry.title }}</NuxtLink>
        </li>
      </ul>
      <span class="console-meta">local record / balance from the explorer</span>
    </footer>
  </section>
</template>

<style scoped>
.puzzle-id {
  overflow-wrap: anywhere;
}
.puzzle-span {
  white-space: nowrap;
}
.puzzle-flag {
  padding: 0 6px;
  box-shadow: inset 0 0 0 1px var(--console-line);
  color: var(--ui-text-muted);
}
.puzzle-literal-title {
  margin: 18px 0 10px;
}
.puzzle-literal {
  font-size: 11.5px;
  overflow: visible;
}
.puzzle-dim {
  color: var(--ui-text-dimmed);
}
.console-lead > a:hover .puzzle-dim {
  color: inherit;
}
.puzzle-trail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px 36px;
}
.puzzle-channels {
  min-width: 0;
  margin: 0;
}
.puzzle-channels dt > span,
.puzzle-target dt > span,
.puzzle-balance > .console-label > span {
  color: var(--ui-text-dimmed);
}
.puzzle-channels .console-lead {
  flex-wrap: nowrap;
  margin-top: 10px;
}
.puzzle-channels .console-lead > a,
.puzzle-channels .console-lead > span:not(.console-tag, .console-leader) {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-wrap: normal;
}
.puzzle-target {
  min-width: 0;
}
.puzzle-target .console-address dt {
  display: flex;
  align-items: center;
  gap: 10px;
}
.puzzle-target .console-address .console-button {
  margin-left: auto;
}
.puzzle-script {
  margin: 8px 0 0;
  font-size: 11px;
  overflow-wrap: anywhere;
  color: var(--ui-text-dimmed);
}
.puzzle-balance {
  margin-top: 16px;
}
.puzzle-keys {
  display: grid;
  gap: 10px;
  margin: 0;
}
.puzzle-keys > div {
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  gap: 4px 16px;
  align-items: baseline;
}
.puzzle-keys dt {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.puzzle-keys dd {
  margin: 0;
  font-size: 12px;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.puzzle-keys dd.puzzle-prose {
  font-family: var(--font-sans);
  font-size: 14px;
}
.puzzle-keys a:hover {
  color: var(--console-accent);
}
.puzzle-transactions > .console-rule-title {
  margin: 0;
  padding: 20px 20px 12px;
}
.puzzle-transactions .console-rows li {
  grid-template-columns: 6.5rem 6.5rem auto minmax(16px, 1fr) auto;
}
.puzzle-tx-type {
  color: var(--ui-text-highlighted);
}
.puzzle-tx-type.puzzle-tx-out {
  color: var(--console-accent);
}
.puzzle-tx-date {
  color: var(--ui-text-muted);
  font-variant-numeric: tabular-nums;
}
.puzzle-tx-amount {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-highlighted);
}
.puzzle-transactions .console-rows .puzzle-tx-id {
  color: var(--ui-text-muted);
}
.puzzle-transactions .console-rows .puzzle-tx-id:hover {
  color: var(--console-accent);
}
.puzzle-unfold {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 20px;
  border-top: 1px solid var(--console-line);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-muted);
  cursor: pointer;
}
.puzzle-unfold:hover {
  color: var(--console-accent);
}
.puzzle-assets {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.puzzle-assets a {
  display: flex;
  flex-direction: column;
  max-width: 18rem;
  box-shadow: inset 0 0 0 1px var(--console-line);
  color: var(--ui-text-muted);
}
.puzzle-assets a:hover {
  color: var(--console-accent);
  box-shadow: inset 0 0 0 1px var(--console-corner);
}
.puzzle-assets img {
  width: 100%;
  max-height: 14rem;
  padding: 1px;
  object-fit: contain;
  background: color-mix(in srgb, var(--ui-text-muted) 4%, var(--ui-bg));
}
.puzzle-assets a > span {
  padding: 8px 10px;
  font-size: 11px;
  overflow-wrap: anywhere;
}
.puzzle-asset-source {
  flex-wrap: nowrap;
  margin-top: 12px;
}
.puzzle-asset-source > a {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (width < 900px) {
  .puzzle-trail {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (width < 640px) {
  .puzzle-literal-title > .console-mark {
    display: none;
  }
  .puzzle-keys > div {
    grid-template-columns: minmax(0, 1fr);
  }
  .puzzle-transactions .console-rows li {
    grid-template-columns: 5.5rem minmax(0, 1fr) auto;
    padding-inline: 14px;
  }
  .puzzle-transactions .console-rows .console-leader {
    display: none;
  }
  .puzzle-transactions .console-rows .puzzle-tx-id {
    grid-column: 1 / -1;
    font-size: 11px;
  }
  .puzzle-transactions > .console-rule-title {
    padding-inline: 14px;
  }
  .puzzle-channels .console-leader {
    display: none;
  }
}
</style>
