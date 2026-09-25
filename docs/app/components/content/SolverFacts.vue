<script setup lang="ts">
import type { Status } from "@agntn/puzzles";
import { dataVersion, getSolver, requirePuzzle, solvers } from "@agntn/puzzles";
import { authorIcon } from "../../utils/authors";
import { formatPrizeTotals, hostPath } from "../../utils/format";
import { CHAIN_ICONS, collectionEntry } from "../../utils/puzzles";
import { solverFacts } from "../../utils/solvers";

const props = defineProps<{ solver: string }>();

/** The solver and its puzzles load on the server for the prerender and again on navigation. */
const { data } = await useAsyncData(
  () => `solver-facts-${props.solver}`,
  async () => {
    const entry = await getSolver(props.solver);
    if (entry === undefined) {
      throw createError({ statusCode: 404, statusMessage: `Unknown solver ${props.solver}` });
    }
    const puzzles = await Promise.all(entry.solves.map((solve) => requirePuzzle(solve.id)));
    return {
      ...solverFacts(entry, puzzles, await solvers(), (key) => collectionEntry(key)?.title ?? key),
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
  <section v-if="data" class="dossier not-prose my-6" aria-label="Solver record">
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
        >{{ data.kind ?? "kind unknown" }} · {{ data.solves.length }}
        {{ data.solves.length === 1 ? "solve" : "solves"
        }}<template v-if="data.firstSolved">
          · {{ data.firstSolved.slice(0, 10)
          }}<template v-if="data.lastSolved.slice(0, 10) !== data.firstSolved.slice(0, 10)">
            → {{ data.lastSolved.slice(0, 10) }}</template
          ></template
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
            <dt>Solves</dt>
            <dd>{{ data.solves.length }}</dd>
          </div>
          <div>
            <dt>Prize recorded</dt>
            <dd>{{ formatPrizeTotals(data.prize) }}</dd>
          </div>
          <div v-if="data.authorPage">
            <dt>Also author</dt>
            <dd class="console-accent">
              <NuxtLink :to="data.authorPage">{{
                data.authored.map((row) => row.title).join(", ")
              }}</NuxtLink>
            </dd>
          </div>
        </dl>
        <div
          class="console-gauge"
          :aria-label="`${data.solves.length} ${data.solves.length === 1 ? 'solve' : 'solves'}`"
        >
          <span class="console-ticks" aria-hidden="true">
            <span
              v-for="(solve, index) in data.solves"
              :key="solve.id"
              class="console-tick-closed"
              :style="{ animationDelay: `${Math.min(index * 12, 720)}ms` }"
            />
          </span>
          <span class="console-gauge-read">solved {{ data.solves.length }}</span>
        </div>
      </div>
    </div>

    <div class="dossier-band">
      <p class="console-label console-rule-title">
        <span
          >Solves
          <span class="solver-dim" aria-hidden="true">[ {{ data.solves.length }} ]</span></span
        >
        <span class="console-mark" aria-hidden="true" />
      </p>
      <ul class="solver-solves">
        <li
          v-for="(solve, index) in data.solves"
          :key="solve.id"
          :style="{ animationDelay: `${Math.min(index * 30, 600)}ms` }"
        >
          <NuxtLink :to="solve.to" class="solver-solve-id">{{ solve.id }}</NuxtLink>
          <StatusPill :status="solve.status as Status" />
          <span class="console-leader" aria-hidden="true" />
          <span class="solver-solve-date">{{ solve.solvedAt.slice(0, 10) || "undated" }}</span>
          <span class="solver-solve-prize">{{ solve.prize }}</span>
        </li>
      </ul>
    </div>

    <div class="dossier-band dossier-trail">
      <dl class="dossier-channels">
        <dt class="console-label">
          Channels <span aria-hidden="true">[ {{ data.profiles.length }} ]</span>
        </dt>
        <dd v-if="data.profiles.length === 0" class="console-empty">
          No profile. The handle on the solve is the only trail.
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
          <span aria-hidden="true">[ prize went to ]</span>
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
        <li>
          <NuxtLink to="/solvers"><span aria-hidden="true">→ </span>Solvers</NuxtLink>
        </li>
        <li v-if="data.authorPage">
          <NuxtLink :to="data.authorPage"
            ><span aria-hidden="true">→ </span>{{ data.name ?? data.key }} as author</NuxtLink
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

<style scoped>
.solver-dim {
  color: var(--ui-text-dimmed);
}
.solver-solves {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}
.solver-solves li {
  display: grid;
  grid-template-columns: auto auto minmax(1.5rem, 1fr) auto 8.5rem;
  align-items: center;
  gap: 12px;
  padding: 5px 0;
  animation: solver-row 360ms ease-out both;
}
.solver-solves li + li {
  border-top: 1px dashed var(--console-line);
}
.solver-solves .console-leader {
  display: block;
}
.solver-solve-id {
  color: var(--ui-text-highlighted);
  font-size: 13px;
}
.solver-solve-id:hover {
  color: var(--console-accent);
}
.solver-solve-date {
  color: var(--ui-text-dimmed);
  font-size: 11px;
  white-space: nowrap;
}
.solver-solve-prize {
  text-align: right;
  color: var(--ui-text-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
@keyframes solver-row {
  from {
    transform: translateX(-8px);
  }
  to {
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .solver-solves li {
    animation: none;
  }
}
@media (width < 640px) {
  .solver-solves li {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 2px 12px;
  }
  .solver-solves .console-leader {
    display: none;
  }
  .solver-solve-prize {
    text-align: left;
  }
}
</style>
