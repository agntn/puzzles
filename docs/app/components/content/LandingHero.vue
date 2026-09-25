<script setup lang="ts">
import { version } from "@agntn/puzzles";
import { COLLECTIONS } from "../../utils/puzzles";
import { STATS_STATIC } from "../../utils/landing";
import type { LandingSample } from "../../utils/samples";

defineProps<{ sample: LandingSample; loaded: readonly string[] }>();
const emit = defineEmits<{ pause: [paused: boolean] }>();

const INSTALL = "pnpm add @agntn/puzzles";
const { copied, copy } = useCopied();

const stats = STATS_STATIC;
const closed = stats.total - stats.unsolved;
const openShare = `${((stats.unsolved / stats.total) * 100).toFixed(2)}%`;
const unclaimed = stats.unsolvedPrize.BTC.toFixed(2);
/** Every other currency still unclaimed, in the order the library reports them. */
const otherUnclaimed = Object.entries(stats.unsolvedPrize)
  .filter(([currency]) => currency !== "BTC")
  .map(([currency, amount]) => `${Number(amount.toFixed(2))} ${currency}`)
  .join(" · ");
const data = stats.dataVersion.match(/.{4}/g)?.join(" ") ?? stats.dataVersion;
</script>

<template>
  <header class="puzzles-hero hero-page">
    <div class="hero-zone">
      <span class="hero-cross hero-cross-tl" aria-hidden="true">+</span>
      <span class="hero-cross hero-cross-tr" aria-hidden="true">+</span>
      <span class="hero-bracket hero-bracket-l" aria-hidden="true" />
      <span class="hero-bracket hero-bracket-r" aria-hidden="true" />

      <p class="console-id">
        <span class="console-id-tag">ID</span>
        <span>@agntn/puzzles</span>
        <span class="console-id-sep" aria-hidden="true">/</span>
        <span>v{{ version }}</span>
        <span class="console-id-data">data {{ data }}</span>
      </p>

      <h1 class="hero-title">Every puzzle, <span>one record.</span></h1>
      <p class="hero-lead">
        Public crypto bounties and puzzles, each one a typed record: address, key material, prize,
        what happened on chain. One library behind the CLI, an MCP server and the Pi and OMP
        extensions, with live balances from the explorers.
      </p>

      <dl class="hero-metrics">
        <div>
          <dt>Records</dt>
          <dd>{{ stats.total }}</dd>
          <dd class="hero-metric-sub">in {{ COLLECTIONS.length }} collections</dd>
        </div>
        <div>
          <dt>Unclaimed</dt>
          <dd class="hero-metric-accent">{{ unclaimed }} <span>BTC</span></dd>
          <dd class="hero-metric-sub">+ {{ otherUnclaimed }}</dd>
        </div>
        <div>
          <dt>Open</dt>
          <dd>
            {{ stats.unsolved }} <span>/ {{ stats.total }}</span>
          </dd>
          <dd class="hero-metric-sub">{{ openShare }} of the records</dd>
        </div>
      </dl>
      <div
        class="hero-share"
        role="img"
        :aria-label="`${closed} records closed, ${stats.unsolved} open`"
      >
        <span class="hero-share-closed" :style="{ flexGrow: closed }" />
        <span class="hero-share-open" :style="{ flexGrow: stats.unsolved }" />
      </div>
      <p class="hero-share-read" aria-hidden="true">
        <span>closed {{ closed }}</span
        ><span>open {{ stats.unsolved }}</span>
      </p>

      <div class="console-actions">
        <NuxtLink to="/guide" class="console-action console-action-primary">
          <span class="console-action-label">Get started</span>
          <span class="console-action-cell" aria-hidden="true"
            ><UIcon name="i-lucide-arrow-right" class="size-4"
          /></span>
        </NuxtLink>
        <NuxtLink to="https://github.com/agntn/puzzles" target="_blank" class="console-action">
          <span class="console-action-cell" aria-hidden="true"
            ><UIcon name="i-simple-icons-github" class="size-4"
          /></span>
          <span class="console-action-label">Star on GitHub</span>
        </NuxtLink>
      </div>
      <div class="console-install">
        <span class="console-install-tag">Install</span>
        <code><span class="console-install-prompt">$</span> {{ INSTALL }}</code>
        <button
          type="button"
          class="console-button"
          :data-copied="copied === 'install'"
          :aria-label="copied === 'install' ? 'Copied' : 'Copy install command'"
          @click="copy('install', INSTALL)"
        >
          <UIcon
            :name="copied === 'install' ? 'i-lucide-check' : 'i-lucide-copy'"
            class="size-3.5"
          />
        </button>
      </div>
    </div>

    <div
      class="hero-instrument"
      @mouseenter="emit('pause', true)"
      @mouseleave="emit('pause', false)"
      @focusin="emit('pause', true)"
      @focusout="emit('pause', false)"
    >
      <svg :key="sample.id" class="hero-circuit" viewBox="0 0 160 56" aria-hidden="true">
        <path class="hero-circuit-rail" d="M80 0V16L96 32V56" />
        <path class="hero-circuit-live" d="M80 0V16L96 32V56" pathLength="1" />
        <path class="hero-circuit-seg" d="M96 38V48" />
        <rect class="hero-circuit-node" x="92.5" y="52.5" width="7" height="7" />
      </svg>
      <span :key="`tag-${sample.id}`" class="hero-circuit-tag" aria-hidden="true">get(id)</span>
      <LandingLock :sample="sample" :loaded="loaded" />
    </div>
  </header>
</template>
