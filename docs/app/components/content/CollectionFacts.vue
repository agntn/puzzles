<script setup lang="ts">
import { collectionKeys, dataVersion, requireCollection } from "@agntn/puzzles";
import { collectionFacts } from "../../utils/collections";
import { formatPrizeTotals, hostPath } from "../../utils/format";
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";

const props = defineProps<{ collection: string }>();

/** The collection module loads on the server for the prerender and again in the browser on navigation. */
const { data } = await useAsyncData(
  () => `collection-facts-${props.collection}`,
  async () => {
    const collection = await requireCollection(props.collection);
    const keys = collectionKeys();
    return {
      ...collectionFacts(collection),
      /** One status per puzzle, in record order, for the tick strip. */
      ticks: collection.all().map((puzzle) => puzzle.status()),
      position: Math.max(0, keys.indexOf(collection.key)) + 1,
      registered: keys.length,
      dataVersion: await dataVersion(),
    };
  },
);

const entry = computed(() => collectionEntry(props.collection));

/**
 * `1 puzzle`, `2 puzzles`.
 *
 * @param {number} value - The count.
 * @param {string} noun - The singular noun.
 * @returns {string} The count with the noun in the right number.
 */
function count(value: number, noun: string): string {
  return `${value} ${noun}${value === 1 ? "" : "s"}`;
}

/**
 * Host, path and query of a link, the query kept because forum threads live in it.
 *
 * @param {string} url - The link.
 * @returns {string} The link without its scheme.
 */
function linkText(url: string): string {
  try {
    const parsed = new URL(url);
    return `${hostPath(url)}${parsed.search}`;
  } catch {
    return url;
  }
}

/**
 * The bare host, printed after a link's own description.
 *
 * @param {string} url - The link.
 * @returns {string} The host without `www.`, or nothing for an unparsable link.
 */
function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

/**
 * A share as a whole percent, `<1%` for a sliver above zero.
 *
 * @param {number} share - A fraction between 0 and 1.
 * @returns {string} The percent for the census counter.
 */
function percent(share: number): string {
  if (share > 0 && share < 0.005) {
    return "<1%";
  }
  return `${Math.round(share * 100)}%`;
}

const unsolved = computed(() => data.value?.statuses.unsolved ?? 0);

/** One counter per status, then the key material; each bar is its share of the collection. */
const census = computed(() => {
  const current = data.value;
  if (!current) {
    return [];
  }
  const share = (value: number) => (current.total === 0 ? 0 : value / current.total);
  return [
    ...Object.entries(current.statuses).map(([status, value]) => ({
      label: status,
      value,
      share: share(value),
      gap: false,
    })),
    {
      label: "public keys",
      value: current.withPubkey,
      share: share(current.withPubkey),
      gap: true,
    },
    { label: "private keys", value: current.withKey, share: share(current.withKey), gap: false },
  ];
});
</script>

<template>
  <section
    v-if="data"
    class="tool-console console-wide not-prose my-6"
    aria-label="Collection record"
  >
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="console-bar">
      <span class="console-title"
        ><span class="console-tag">ID</span>{{ data.key
        }}<span class="console-file"
          >{{ String(data.position).padStart(2, "0") }} / {{ data.registered }}</span
        ></span
      >
      <span class="console-meta"
        >{{ count(data.total, "puzzle") }} · {{ data.firstStarted.slice(0, 10)
        }}<template v-if="data.lastStarted.slice(0, 10) !== data.firstStarted.slice(0, 10)">
          → {{ data.lastStarted.slice(0, 10) }}</template
        ></span
      >
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span class="console-cursor" /></div>

    <div class="console-band console-subject-band">
      <div class="console-scan" aria-hidden="true" />
      <div class="console-identity-block">
        <ConsoleReticle :key="data.key" :icon="entry?.icon ?? 'i-lucide-circle-help'" />
        <div class="console-name">
          <span class="console-label">Collection</span>
          <h3>{{ entry?.title ?? data.key }}</h3>
          <p class="console-aliases">
            <span v-for="chain in data.chains" :key="chain" class="console-chain"
              ><UIcon :name="CHAIN_ICONS[chain] ?? 'i-lucide-link'" class="size-3.5" />{{
                chain
              }}</span
            >
          </p>
          <p v-if="entry" class="console-about">{{ entry.blurb }}</p>
        </div>
      </div>

      <div class="console-readout">
        <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
          <circle cx="3" cy="12" r="2.5" />
          <path d="M5.5 12H14L22 20H32" />
        </svg>
        <dl class="console-readout-rows">
          <div>
            <dt>Author</dt>
            <dd>
              <NuxtLink :to="`/authors/${data.authorKey}`" class="collection-author">{{
                data.author ?? "unknown"
              }}</NuxtLink>
            </dd>
          </div>
          <div>
            <dt>Prize recorded</dt>
            <dd>{{ formatPrizeTotals(data.prize) }}</dd>
          </div>
          <div>
            <dt>Still unsolved</dt>
            <dd v-if="unsolved > 0" class="console-accent">
              {{ unsolved }} · {{ formatPrizeTotals(data.unsolvedPrize) }}
            </dd>
            <dd v-else class="collection-none">none</dd>
          </div>
        </dl>
        <div
          class="console-gauge"
          :aria-label="`${data.total - unsolved} of ${data.total} puzzles closed`"
        >
          <span
            class="console-ticks"
            :class="{ 'console-ticks-dense': data.ticks.length > 64 }"
            aria-hidden="true"
          >
            <span
              v-for="(status, index) in data.ticks"
              :key="index"
              :class="status === 'unsolved' ? 'console-tick-open' : 'console-tick-closed'"
              :style="{ animationDelay: `${Math.min(index * 12, 720)}ms` }"
            />
          </span>
          <span class="console-gauge-read"
            >closed {{ data.total - unsolved }} / {{ data.total }}</span
          >
        </div>
      </div>
    </div>

    <div class="console-band">
      <p class="console-label console-rule-title">
        <span
          >Census <span aria-hidden="true">[ {{ count(data.total, "puzzle") }} ]</span></span
        >
        <span class="console-mark" aria-hidden="true" />
      </p>
      <dl class="collection-census">
        <div
          v-for="cell in census"
          :key="cell.label"
          :class="{
            'collection-census-gap': cell.gap,
            'collection-census-open': cell.label === 'unsolved',
          }"
        >
          <dt>{{ cell.label }}</dt>
          <dd>
            {{ cell.value }}<span class="collection-share">{{ percent(cell.share) }}</span>
          </dd>
          <span class="collection-census-bar" aria-hidden="true"
            ><span :style="{ transform: `scaleX(${cell.share})` }"
          /></span>
        </div>
      </dl>
    </div>

    <div class="console-band">
      <p class="console-label console-rule-title">
        <span>Access <span aria-hidden="true">[ library · tools ]</span></span>
        <span class="console-mark" aria-hidden="true" />
      </p>
      <dl class="collection-access">
        <dd class="console-lead">
          <span class="console-tag">Load</span>
          <code class="collection-code"
            ><span class="tok-fn">getCollection</span>(<span class="tok-str">"{{ data.key }}"</span
            >)</code
          >
          <span class="console-leader" aria-hidden="true" />
        </dd>
        <dd v-if="entry" class="console-lead">
          <span class="console-tag">Show</span>
          <NuxtLink :to="`/playground?op=show&id=${encodeURIComponent(entry.sample)}`"
            >{{ entry.sample }}<span class="collection-dim"> in the playground</span></NuxtLink
          >
          <span class="console-leader" aria-hidden="true" />
        </dd>
        <dd v-if="data.total > 1" class="console-lead">
          <span class="console-tag">List</span>
          <NuxtLink :to="`/playground?op=list&collection=${encodeURIComponent(data.key)}`"
            >all {{ data.total }}<span class="collection-dim"> in the playground</span></NuxtLink
          >
          <span class="console-leader" aria-hidden="true" />
        </dd>
      </dl>
    </div>

    <div v-if="data.hints.length > 0" class="console-band">
      <p class="console-label console-rule-title">
        <span
          >Hints
          <span aria-hidden="true"
            >[ what every puzzle here inherits · {{ data.hints.length }} ]</span
          ></span
        >
        <span class="console-mark" aria-hidden="true" />
      </p>
      <ol class="collection-hints">
        <li v-for="(hint, index) in data.hints" :key="index" class="collection-hint">
          <span class="collection-hint-date"
            ><span>{{ hint.date?.slice(0, 10) ?? "undated" }}</span
            ><span v-if="hint.date && hint.date.length > 10">{{ hint.date.slice(11) }}</span></span
          >
          <div class="collection-hint-body">
            <p>
              <span class="console-tag">{{ hint.kind }}</span
              >{{ hint.text }}
            </p>
            <p class="console-lead">
              <span class="console-tag">Source</span>
              <a :href="hint.source" :title="hint.source" target="_blank" rel="noopener">{{
                linkText(hint.source)
              }}</a>
              <span class="console-leader" aria-hidden="true" />
            </p>
            <p v-if="hint.confirmation" class="console-lead">
              <span class="console-tag">Confirm</span>
              <a
                :href="hint.confirmation.url"
                :title="hint.confirmation.url"
                target="_blank"
                rel="noopener"
                >{{ hint.confirmation.description ?? linkText(hint.confirmation.url)
                }}<span v-if="hint.confirmation.description" class="collection-hint-host">
                  {{ host(hint.confirmation.url) }}</span
                ></a
              >
              <span class="console-leader" aria-hidden="true" />
            </p>
            <details v-if="hint.answer" class="collection-hint-answer">
              <summary>Published answer</summary>
              <p>{{ hint.answer.text }}</p>
              <p class="console-lead">
                <span class="console-tag">{{ hint.answer.date?.slice(0, 10) ?? "Source" }}</span>
                <a
                  :href="hint.answer.source"
                  :title="hint.answer.source"
                  target="_blank"
                  rel="noopener"
                  >{{ linkText(hint.answer.source) }}</a
                >
                <span class="console-leader" aria-hidden="true" />
              </p>
            </details>
          </div>
        </li>
      </ol>
    </div>

    <footer class="console-footer console-footer-plain">
      <ul class="console-links">
        <li>
          <NuxtLink :to="`/authors/${data.authorKey}`"
            ><span aria-hidden="true">→ </span>{{ data.author ?? data.authorKey }}</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/collections"><span aria-hidden="true">→ </span>All collections</NuxtLink>
        </li>
      </ul>
      <span class="console-meta"
        >local dataset / no network ·
        <span class="collection-version"
          >data {{ data.dataVersion.slice(0, 4) }} {{ data.dataVersion.slice(4, 8) }}
          {{ data.dataVersion.slice(8, 12) }}</span
        ></span
      >
    </footer>
  </section>
</template>

<style scoped>
.collection-author {
  color: var(--ui-text-highlighted);
}
.collection-author:hover {
  color: var(--console-accent);
}
.collection-code {
  font: inherit;
  color: var(--ui-text-highlighted);
}
.collection-dim {
  color: var(--ui-text-dimmed);
}
.console-lead > a:hover .collection-dim {
  color: inherit;
}
.console-readout-rows dd.collection-none {
  color: var(--ui-text-muted);
}
.collection-access {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  gap: 0 28px;
  margin: 0;
}
.collection-access > .console-lead:first-child,
.collection-access > .console-lead {
  margin: 0 0 8px;
}
.collection-census {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  gap: 14px 0;
  margin: 0;
}
.collection-census > div {
  min-width: 0;
  padding: 0 16px;
  box-shadow: inset 1px 0 0 var(--console-line);
}
.collection-census > .collection-census-gap {
  box-shadow: inset 1px 0 0 var(--console-corner);
}
.collection-census dt {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.collection-census dd {
  margin: 4px 0 8px;
  font-size: 18px;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-highlighted);
}
.collection-share {
  margin-left: 8px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-dimmed);
}
.collection-version {
  white-space: nowrap;
}
.collection-census-bar {
  display: block;
  height: 2px;
  background: var(--console-line);
}
.collection-census-bar > span {
  display: block;
  height: 100%;
  background: var(--console-corner);
  transform-origin: left;
  animation: collection-census-fill 600ms ease-out both;
}
.collection-census-open .collection-census-bar > span {
  background: var(--console-accent);
}
.collection-census > div:hover .collection-census-bar > span {
  background: var(--console-accent);
}
@keyframes collection-census-fill {
  from {
    scale: 0 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .collection-census-bar > span {
    animation: none;
  }
}
.collection-hints {
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.collection-hint {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  gap: 16px;
}
.collection-hint-date {
  display: grid;
  align-content: start;
  padding-top: 3px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-dimmed);
}
.collection-hint-date > span:first-child {
  color: var(--ui-text-muted);
}
.collection-hint:hover .collection-hint-date > span:first-child {
  color: var(--console-accent);
}
.collection-hint-body {
  min-width: 0;
}
.collection-hint-body > p:first-child {
  margin: 0 0 6px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ui-text-highlighted);
}
.collection-hint-body > p:first-child > .console-tag {
  font-family: var(--font-mono);
  vertical-align: 1px;
}
.collection-hint .console-lead {
  flex-wrap: nowrap;
  gap: 0 10px;
  margin-top: 4px;
}
.collection-hint .console-lead > a {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-wrap: normal;
  color: var(--ui-text-muted);
}
.collection-hint .console-lead > a:hover {
  color: var(--console-accent);
}
.collection-hint-host {
  margin-left: 8px;
  color: var(--ui-text-dimmed);
}
.collection-hint-answer {
  margin-top: 8px;
}
.collection-hint-answer summary {
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.collection-hint-answer > p:first-of-type {
  margin: 6px 0 0;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ui-text-highlighted);
}
@media (width < 640px) {
  .collection-hint {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
  .collection-hint-date {
    display: flex;
    gap: 8px;
  }
  .collection-hint .console-lead > .console-tag {
    min-width: 4.5rem;
  }
  .collection-hint .console-leader {
    display: none;
  }
}
</style>
