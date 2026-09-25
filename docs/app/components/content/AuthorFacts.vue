<script setup lang="ts">
import { authors, dataVersion, getAuthor, requireCollection } from "@agntn/puzzles";
import { authorFacts, authorIcon } from "../../utils/authors";
import { formatPrizeTotals, hostPath } from "../../utils/format";
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";

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
    return {
      ...authorFacts(
        entry,
        collections,
        await authors(),
        (key) => collectionEntry(key)?.title ?? key,
      ),
      dataVersion: await dataVersion(),
    };
  },
);

/** The facts as timeline items; the source link renders through the description slot. */
const log = computed(() =>
  (data.value?.facts ?? []).map((entry, order) => ({
    order,
    date: entry.date ?? "undated",
    title: entry.text,
    description: entry.source,
    source: entry.source,
    ui: { indicator: entry.date === undefined ? "dossier-log-mark-open" : "" },
  })),
);
</script>

<template>
  <section v-if="data" class="dossier not-prose my-6" aria-label="Author record">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="dossier-bar">
      <span class="dossier-id"
        ><span class="console-tag">ID</span>{{ data.key
        }}<span class="console-file"
          >{{ String(data.position).padStart(2, "0") }} / {{ data.total }}</span
        ></span
      >
      <span class="console-meta"
        >{{ data.kind ?? "kind unknown" }} · {{ data.collections.length }}
        {{ data.collections.length === 1 ? "collection" : "collections" }} ·
        {{ data.firstStarted.slice(0, 10)
        }}<template v-if="data.lastStarted.slice(0, 10) !== data.firstStarted.slice(0, 10)">
          → {{ data.lastStarted.slice(0, 10) }}</template
        ></span
      >
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span class="console-cursor" /></div>

    <div class="dossier-band console-subject-band">
      <div class="console-scan" aria-hidden="true" />
      <div class="console-identity-block">
        <ConsoleReticle :key="data.key" :icon="authorIcon(data.kind)" />
        <div class="console-name">
          <span class="console-label">Subject</span>
          <h3>{{ data.name ?? data.key }}</h3>
          <p class="console-aliases">
            <span v-for="alias in data.aliases" :key="alias">{{ alias }}</span>
            <span v-for="chain in data.chains" :key="chain" class="console-chain"
              ><UIcon :name="CHAIN_ICONS[chain] ?? 'i-lucide-link'" class="size-3.5" />{{
                chain
              }}</span
            >
          </p>
          <p v-if="data.about" class="console-about">{{ data.about }}</p>
        </div>
      </div>

      <div class="console-readout">
        <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
          <circle cx="3" cy="12" r="2.5" />
          <path d="M5.5 12H14L22 20H32" />
        </svg>
        <dl class="console-readout-rows">
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
            <dd class="console-accent">
              {{ data.unsolved }} · {{ formatPrizeTotals(data.unsolvedPrize) }}
            </dd>
          </div>
        </dl>
        <div
          class="console-gauge"
          :aria-label="`${data.puzzles - data.unsolved} of ${data.puzzles} puzzles closed`"
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
        <dd v-if="data.profiles.length === 0" class="console-empty">
          No profile. The transactions are the only trail.
        </dd>
        <dd v-for="link in data.profiles" :key="link.url" class="console-lead">
          <span class="console-tag">{{ link.name }}</span>
          <a :href="link.url" target="_blank" rel="noopener">{{ hostPath(link.url) }}</a>
          <span class="console-leader" aria-hidden="true" />
        </dd>
      </dl>
      <dl v-if="data.addresses.length > 0" class="console-address dossier-addresses">
        <dt class="console-label">
          {{ data.addresses.length === 1 ? "Address" : "Addresses" }}
          <span aria-hidden="true">[ funded from ]</span>
        </dt>
        <dd v-for="address in data.addresses" :key="address" class="console-node">{{ address }}</dd>
      </dl>
    </div>

    <div class="dossier-band dossier-log">
      <p class="console-label console-rule-title dossier-log-title">
        <span
          >Log
          <span aria-hidden="true"
            >[ what public sources say · {{ data.facts.length }} ]</span
          ></span
        >
        <span class="console-mark" aria-hidden="true" />
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
          <div class="dossier-entry" :style="{ animationDelay: `${item.order * 90}ms` }">
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
          <NuxtLink :to="row.to"><span aria-hidden="true">→ </span>{{ row.title }}</NuxtLink>
          <span
            >{{ row.total }} puzzles · {{ row.unsolved }} open · since
            {{ row.firstStarted.slice(0, 10) }}</span
          >
        </li>
      </ul>
      <span class="console-meta"
        >local dataset / no network · data {{ data.dataVersion.slice(0, 4) }}
        {{ data.dataVersion.slice(4, 8) }} {{ data.dataVersion.slice(8, 12) }}</span
      >
    </footer>
  </section>
</template>
