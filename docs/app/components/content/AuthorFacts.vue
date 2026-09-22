<script setup lang="ts">
import { getAuthor, requireCollection } from "@agntn/puzzles";
import { authorFacts, authorIcon } from "../../utils/authors";
import { formatPrizeTotals, hostPath } from "../../utils/format";
import { CHAIN_ICONS } from "../../utils/puzzles";

const props = defineProps<{ author: string }>();

/** The author and its collections load on the server for the prerender and again on navigation. */
const { data } = await useAsyncData(
  () => `author-facts-${props.author}`,
  async () => {
    const entry = await getAuthor(props.author);
    if (entry === undefined) {
      throw createError({ statusCode: 404, statusMessage: `Unknown author ${props.author}` });
    }
    const collections = await Promise.all(entry.collections.map((key) => requireCollection(key)));
    return authorFacts(entry, collections);
  },
);

/** The facts as timeline items; the source link renders through the description slot. */
const log = computed(() =>
  (data.value?.facts ?? []).map((entry) => ({
    date: entry.date ?? "undated",
    title: entry.text,
    description: entry.source,
    source: entry.source,
  })),
);
</script>

<template>
  <section v-if="data" class="dossier not-prose my-6" aria-label="Author record">
    <span class="dossier-cross dossier-cross-tl" aria-hidden="true">+</span>
    <span class="dossier-cross dossier-cross-br" aria-hidden="true">+</span>

    <header class="dossier-bar">
      <span class="dossier-id"><span class="dossier-tag">ID</span>{{ data.key }}</span>
      <span class="dossier-meta"
        >{{ data.kind ?? "kind unknown" }} · {{ data.collections.length }}
        {{ data.collections.length === 1 ? "collection" : "collections" }} ·
        {{ data.firstStarted.slice(0, 10)
        }}<template v-if="data.lastStarted.slice(0, 10) !== data.firstStarted.slice(0, 10)">
          → {{ data.lastStarted.slice(0, 10) }}</template
        ></span
      >
    </header>
    <div class="dossier-ruler" aria-hidden="true" />

    <div class="dossier-band dossier-subject">
      <div class="dossier-identity">
        <div class="console-reticle dossier-reticle" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <path class="reticle-frame" d="M24 5H5V24M96 5H115V24M115 96V115H96M24 115H5V96" />
            <circle class="reticle-ticks" cx="60" cy="60" r="49" />
            <path
              class="reticle-sectors"
              d="M39 10H49M71 10H81M110 39V49M110 71V81M81 110H71M49 110H39M10 81V71M10 49V39"
            />
            <path class="reticle-lock" d="M60 18A42 42 0 0 1 102 60M60 102A42 42 0 0 1 18 60" />
            <path
              class="reticle-axis"
              d="M60 0V12M108 60H120M60 108V120M0 60H12M30 60H38M82 60H90M60 30V38M60 82V90"
            />
            <path class="reticle-diamond" d="M60 24L96 60L60 96L24 60Z" />
          </svg>
          <UIcon :name="authorIcon(data.kind)" class="console-chain-icon" />
        </div>
        <div class="dossier-name">
          <span class="console-label">Subject</span>
          <h3>{{ data.name ?? data.key }}</h3>
          <p class="dossier-aliases">
            <span v-for="alias in data.aliases" :key="alias">{{ alias }}</span>
            <span v-for="chain in data.chains" :key="chain" class="dossier-chain"
              ><UIcon :name="CHAIN_ICONS[chain] ?? 'i-lucide-link'" class="size-3.5" />{{
                chain
              }}</span
            >
          </p>
          <p v-if="data.about" class="dossier-about">{{ data.about }}</p>
        </div>
      </div>

      <div class="dossier-readout">
        <dl class="dossier-metrics">
          <div>
            <dt>Puzzles</dt>
            <dd>{{ data.puzzles }}</dd>
          </div>
          <div>
            <dt>Prize recorded</dt>
            <dd>{{ formatPrizeTotals(data.prize) }}</dd>
          </div>
          <div>
            <dt>Still unsolved</dt>
            <dd class="dossier-accent">
              {{ data.unsolved }} · {{ formatPrizeTotals(data.unsolvedPrize) }}
            </dd>
          </div>
        </dl>
        <div
          class="dossier-gauge"
          :aria-label="`${data.puzzles - data.unsolved} of ${data.puzzles} puzzles closed`"
        >
          <span
            class="dossier-ticks"
            :class="{ 'dossier-ticks-dense': data.ticks.length > 64 }"
            aria-hidden="true"
          >
            <span
              v-for="(status, index) in data.ticks"
              :key="index"
              :class="status === 'unsolved' ? 'dossier-tick-open' : 'dossier-tick-closed'"
            />
          </span>
          <span class="dossier-gauge-read"
            >closed {{ data.puzzles - data.unsolved }} / {{ data.puzzles }}</span
          >
        </div>
      </div>
    </div>

    <div class="dossier-band dossier-trail">
      <dl class="dossier-channels">
        <dt class="console-label">
          Channels <span aria-hidden="true">[ {{ data.profiles.length }} ]</span>
        </dt>
        <dd v-if="data.profiles.length === 0" class="dossier-empty">
          No profile. The transactions are the only trail.
        </dd>
        <dd v-for="link in data.profiles" :key="link.url">
          <span class="dossier-tag">{{ link.name }}</span>
          <a :href="link.url" target="_blank" rel="noopener">{{ hostPath(link.url) }}</a>
        </dd>
      </dl>
      <dl v-if="data.addresses.length > 0" class="console-address dossier-addresses">
        <dt class="console-label">
          {{ data.addresses.length === 1 ? "Address" : "Addresses" }}
          <span aria-hidden="true">[ funded from ]</span>
        </dt>
        <dd v-for="address in data.addresses" :key="address">{{ address }}</dd>
      </dl>
    </div>

    <div class="dossier-band dossier-log">
      <p class="console-label dossier-log-title">
        Log <span aria-hidden="true">[ what public sources say · {{ data.facts.length }} ]</span>
      </p>
      <UTimeline
        :items="log"
        size="3xs"
        color="neutral"
        :ui="{
          root: 'gap-0',
          item: 'gap-4 pb-3 last:pb-0',
          container: 'gap-0',
          indicator: 'dossier-log-mark',
          separator: 'dossier-log-rule',
          wrapper: 'min-w-0 -mt-1',
        }"
      >
        <template #wrapper="{ item }">
          <div class="dossier-entry">
            <span class="dossier-entry-date">{{ item.date }}</span>
            <div class="dossier-entry-body">
              <p>{{ item.title }}</p>
              <a :href="item.source" target="_blank" rel="noopener">{{ hostPath(item.source) }}</a>
            </div>
          </div>
        </template>
      </UTimeline>
    </div>

    <footer class="dossier-footer">
      <ul class="dossier-collections">
        <li v-for="row in data.collections" :key="row.key">
          <NuxtLink :to="row.to">{{ row.title }} <span aria-hidden="true">→</span></NuxtLink>
          <span
            >{{ row.total }} puzzles · {{ row.unsolved }} open · since
            {{ row.firstStarted.slice(0, 10) }}</span
          >
        </li>
      </ul>
      <span class="dossier-meta">local dataset / no network</span>
    </footer>
  </section>
</template>

<style scoped>
.dossier {
  --console-line: color-mix(in srgb, var(--ui-border) 75%, transparent);
  --console-corner: color-mix(in srgb, var(--ui-text-muted) 55%, var(--ui-bg));
  --console-accent: color-mix(in srgb, var(--ui-primary) 65%, var(--ui-text-highlighted));
  position: relative;
  padding: 1px;
  isolation: isolate;
  font-family: var(--font-mono);
  font-size: 12px;
}
.dossier::before,
.dossier::after {
  content: "";
  position: absolute;
  pointer-events: none;
  clip-path: polygon(
    0 0,
    calc(100% - 16px) 0,
    100% 16px,
    100% 100%,
    16px 100%,
    0 calc(100% - 16px)
  );
}
.dossier::before {
  inset: 0;
  z-index: -2;
  background: var(--console-line);
}
.dossier::after {
  inset: 1px;
  z-index: -1;
  background: var(--ui-bg);
}
.dossier-cross {
  position: absolute;
  z-index: 1;
  width: 12px;
  line-height: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--console-corner);
  pointer-events: none;
}
.dossier-cross-tl {
  top: -7px;
  left: -7px;
}
.dossier-cross-br {
  right: -7px;
  bottom: -7px;
}
.dossier-tag {
  display: inline-block;
  margin-right: 8px;
  padding: 1px 5px;
  font-size: 10px;
  line-height: 1.4;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
  box-shadow: inset 0 0 0 1px var(--console-line);
}
.dossier-bar,
.dossier-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 10px 20px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.dossier-bar {
  padding-right: 28px;
  background: color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg));
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
}
.dossier-ruler {
  height: 5px;
  border-top: 1px solid var(--console-line);
  background-image: repeating-linear-gradient(
    90deg,
    var(--console-corner) 0 1px,
    transparent 1px 12px
  );
  background-size: 12px 3px;
  background-repeat: repeat-x;
  background-position: 20px 0;
}
.dossier-id {
  color: var(--ui-text-highlighted);
  font-size: 13px;
  letter-spacing: 0;
  text-transform: none;
}
.dossier-meta {
  color: var(--ui-text-dimmed);
  text-transform: none;
  letter-spacing: 0.04em;
}
.dossier-band {
  padding: 16px 20px;
  border-top: 1px solid var(--console-line);
}
.dossier-subject {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 20px 28px;
  border-top: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M16 18h4m-2-2v4' fill='none' stroke='%23818a94' stroke-opacity='.1'/%3E%3C/svg%3E");
  background-size: 36px 36px;
  background-position: 24px 20px;
}
.dossier-identity {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  min-width: 0;
}
.dossier-name {
  min-width: 0;
}
.dossier-name h3 {
  margin: 4px 0 6px;
  font-family: var(--font-sans);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--ui-text-highlighted);
  overflow-wrap: anywhere;
}
.dossier-aliases {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin: 0 0 10px;
  color: var(--ui-text-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.dossier-chain {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--ui-text-dimmed);
}
.dossier-about {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
.dossier-readout {
  position: relative;
  min-width: 0;
  background: var(--ui-bg);
  outline: 1px dashed var(--console-line);
  outline-offset: -1px;
}
.dossier-readout::before,
.dossier-readout::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;
}
.dossier-readout::before {
  top: -1px;
  left: -1px;
  border-top: 1px solid var(--console-corner);
  border-left: 1px solid var(--console-corner);
}
.dossier-readout::after {
  right: -1px;
  bottom: -1px;
  border-right: 1px solid var(--console-corner);
  border-bottom: 1px solid var(--console-corner);
}
.dossier-metrics {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.5fr) minmax(0, 1fr);
  margin: 0;
}
.dossier-metrics > div {
  padding: 10px 14px 8px;
}
.dossier-metrics > div + div {
  border-left: 1px solid var(--console-line);
}
.dossier-metrics dt {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.dossier-metrics dd {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.dossier-metrics dd.dossier-accent {
  color: var(--console-accent);
}
.dossier-gauge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px 10px;
  border-top: 1px solid var(--console-line);
}
.dossier-ticks {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 2px;
  align-items: flex-end;
  min-width: 0;
}
.dossier-ticks > span {
  width: 3px;
  height: 10px;
  box-shadow: inset 0 0 0 1px var(--console-corner);
}
.dossier-ticks > .dossier-tick-closed {
  background: repeating-linear-gradient(180deg, var(--console-corner) 0 2px, transparent 2px 3px);
}
.dossier-ticks > .dossier-tick-open {
  height: 6px;
  box-shadow: inset 0 0 0 1px var(--console-accent);
}
.dossier-ticks-dense {
  gap: 1px;
}
.dossier-ticks-dense > span {
  width: 2px;
}
.dossier-gauge-read {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-dimmed);
  white-space: nowrap;
}
.dossier-trail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px 28px;
}
.dossier-channels {
  margin: 0;
  min-width: 0;
}
.dossier-channels dt > span,
.dossier-addresses dt > span,
.dossier-log-title > span {
  color: var(--ui-text-dimmed);
}
.dossier-channels dd {
  display: flex;
  align-items: baseline;
  margin: 8px 0 0;
}
.dossier-channels dd .dossier-tag {
  flex: none;
  min-width: 5.5rem;
  text-align: center;
}
.dossier-channels a {
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.dossier-channels a:hover,
.dossier-collections a:hover,
.dossier-entry a:hover {
  color: var(--console-accent);
}
.dossier-empty {
  margin: 8px 0 0;
  color: var(--ui-text-dimmed);
}
.dossier-addresses {
  margin: 0;
  align-self: start;
}
.dossier-addresses dd + dd {
  margin-top: 2px;
}
.dossier-log-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;
}
.dossier-log-title::before {
  content: "";
  flex: 1;
  order: 1;
  height: 1px;
  background: var(--console-line);
}
.dossier-log-title::after {
  content: "";
  order: 2;
  width: 28px;
  height: 7px;
  background: repeating-linear-gradient(135deg, var(--console-corner) 0 1px, transparent 1px 4px);
  box-shadow: inset 0 0 0 1px var(--console-line);
}
.dossier-log-title > span {
  order: 0;
}
.dossier-log :deep(.dossier-log-mark) {
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 0;
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--console-corner);
  color: transparent;
}
.dossier-log :deep(.dossier-log-mark > *) {
  display: none;
}
.dossier-log :deep(.dossier-log-rule) {
  width: 1px;
  margin-top: 4px;
  border-radius: 0;
  background: var(--console-line);
}
.dossier-entry {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  gap: 16px;
}
.dossier-entry-date {
  padding-top: 3px;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-dimmed);
}
.dossier-entry-body {
  min-width: 0;
}
.dossier-entry p {
  margin: 0 0 3px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.55;
  color: var(--ui-text-highlighted);
}
.dossier-entry a {
  font-size: 11px;
  color: var(--ui-text-muted);
  overflow-wrap: anywhere;
}
.dossier-footer {
  border-top: 1px solid var(--console-line);
  text-transform: none;
  letter-spacing: 0;
}
.dossier-collections {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.dossier-collections a {
  color: var(--ui-text-highlighted);
}
.dossier-collections a > span {
  color: var(--ui-text-dimmed);
}
.dossier-collections span {
  margin-left: 10px;
  color: var(--ui-text-dimmed);
  font-size: 11px;
}
@media (width < 900px) {
  .dossier-subject,
  .dossier-trail {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (width < 640px) {
  .dossier-identity {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 14px;
  }
  .dossier-metrics {
    grid-template-columns: minmax(0, 1fr);
  }
  .dossier-metrics > div + div {
    border-left: 0;
    border-top: 1px solid var(--console-line);
  }
  .dossier-entry {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
}
@media (width < 400px) {
  .dossier-bar,
  .dossier-footer,
  .dossier-band {
    padding-inline: 14px;
  }
  .dossier-identity {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
  }
  .dossier-channels dd {
    flex-wrap: wrap;
    gap: 2px 0;
  }
}
</style>
