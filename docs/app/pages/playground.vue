<script setup lang="ts">
import { version } from "@agntn/puzzles";
import { facts } from "@agntn/puzzles/tools";
import { COLLECTIONS } from "../utils/puzzles";

definePageMeta({ layout: "default" });

const title = "Playground";
const description =
  "Show one puzzle, list a collection, verify a published key, or read the statistics. In the browser, same library the CLI and the agent tools run.";
/** The OG pipeline drops commas from its props, so the card gets a version written without them. */
const cardDescription =
  "Show one puzzle. List a collection. Verify a published key. Read the statistics. In the browser with the library itself.";

/** Every agent tool the library defines; the playground runs the same executors. */
const toolCount = Object.keys(facts.tools).length;

useSeo({
  title,
  description,
  type: "article",
  breadcrumbs: [{ title: "Playground", path: "/playground" }],
});

defineOgImage(
  "Docs",
  { headline: "Playground", title, description: cardDescription },
  {
    alt: "The @agntn/puzzles playground: show, list, verify, collections, authors and stats in the browser",
  },
);
</script>

<template>
  <div class="puzzles-landing not-prose">
    <header class="puzzles-hero hero-page">
      <div class="hero-zone">
        <span class="hero-cross hero-cross-tl" aria-hidden="true">+</span>
        <span class="hero-cross hero-cross-tr" aria-hidden="true">+</span>
        <span class="hero-bracket hero-bracket-l" aria-hidden="true" />
        <span class="hero-bracket hero-bracket-r" aria-hidden="true" />

        <p class="console-id">
          <span class="console-id-tag">ID</span>
          <span>playground</span>
          <span class="console-id-sep" aria-hidden="true">/</span>
          <span>@agntn/puzzles v{{ version }}</span>
        </p>

        <h1 class="hero-title">
          Any puzzle, any collection.<br class="playground-break" />
          <span>Right here.</span>
        </h1>
        <p class="hero-lead">
          The page imports @agntn/puzzles and runs it in your browser. Balances go through the
          worker to the chain's explorer. Every state is a link you can send to someone.
        </p>

        <dl class="hero-metrics">
          <div>
            <dt>Tools</dt>
            <dd>{{ toolCount }}</dd>
            <dd class="hero-metric-sub">same as MCP, Pi and OMP</dd>
          </div>
          <div>
            <dt>Collections</dt>
            <dd>{{ COLLECTIONS.length }}</dd>
            <dd class="hero-metric-sub">load on first use</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd class="hero-metric-accent">1 <span>call</span></dd>
            <dd class="hero-metric-sub">the balance lookup</dd>
          </div>
        </dl>

        <p class="playground-note">
          <span class="console-tag">Note</span>
          <span
            >Verified means a published key derives the stored address, not that the address still
            holds anything. The balance is what the explorer said, five minutes ago at most.</span
          >
        </p>
      </div>

      <div class="hero-instrument hero-instrument-keep">
        <svg class="hero-circuit" viewBox="0 0 160 56" aria-hidden="true">
          <path class="hero-circuit-rail" d="M80 0V16L96 32V56" />
          <path class="hero-circuit-live" d="M80 0V16L96 32V56" pathLength="1" />
          <path class="hero-circuit-seg" d="M96 38V48" />
          <rect class="hero-circuit-node" x="92.5" y="52.5" width="7" height="7" />
        </svg>
        <span class="hero-circuit-tag" aria-hidden="true">call</span>
        <PuzzlesPlayground />
      </div>
    </header>
  </div>
</template>

<style scoped>
/* One sentence per line on wide screens; narrow, the title wraps where it fits. */
@media (width < 64rem) {
  .playground-break {
    display: none;
  }
}
/* The note reads as a line of the zone, like the share bar's legend on the landing: no box of its own. */
.playground-note {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
  max-width: 44rem;
  margin: 28px auto 0;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
  color: var(--ui-text-muted);
}
.playground-note > .console-tag {
  flex: none;
  margin: 0;
  color: var(--console-accent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--console-accent) 55%, transparent);
}
</style>
