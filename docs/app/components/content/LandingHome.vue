<script setup lang="ts">
import { CHAIN_ICONS, COLLECTIONS } from "../../utils/puzzles";
import { FACTS_STATIC, STATS_STATIC } from "../../utils/landing";
import { formatPrizeTotals } from "../../utils/format";

const { samples, loaded, tick, paused, current, step } = useLandingPuzzle();

const unsolvedBtc = STATS_STATIC.unsolvedPrize.BTC.toFixed(2);

/** Chains that hold at least one puzzle, read off the same fixtures as the rows. */
const chainCount = new Set(FACTS_STATIC.flatMap((row) => row.chains)).size;

const { copied, copy } = useCopied();

/** The collection list highlights whichever collection the panels are showing. */
const activeCollection = computed(() => current.value.collection);

const rows = computed(() =>
  COLLECTIONS.map((entry) => {
    const facts = FACTS_STATIC.find((row) => row.key === entry.key);
    return {
      ...entry,
      total: facts?.total ?? 0,
      open: facts?.statuses.unsolved ?? 0,
      unsolvedPrize: formatPrizeTotals(facts?.unsolvedPrize ?? {}),
      chainIcons: (facts?.chains ?? []).map((chain) => CHAIN_ICONS[chain] ?? "i-lucide-link"),
    };
  }),
);

const customCode = [
  ["kw", "import"],
  ["", " { NamedCollection, bitcoinPuzzle, hex, p2pkh, party, registerCollection } "],
  ["kw", "from"],
  ["", " "],
  ["str", '"@agntn/puzzles"'],
  ["", ";"],
] as const;
</script>

<template>
  <div class="puzzles-landing not-prose">
    <header
      class="puzzles-hero mx-auto w-full max-w-[var(--ui-container)] px-8 pt-24 pb-20 text-center sm:px-12 lg:px-16"
    >
      <h1
        class="mx-auto max-w-3xl text-4xl leading-[1.08] font-medium tracking-tight text-balance text-highlighted sm:text-5xl lg:text-[3.75rem]"
      >
        Every puzzle, <span class="text-primary">one record.</span>
      </h1>
      <p class="mx-auto mt-6 max-w-xl text-base leading-7 text-muted">
        {{ STATS_STATIC.total }} public crypto bounties and puzzles in
        {{ COLLECTIONS.length }} collections, {{ unsolvedBtc }} BTC of it still unclaimed. Each one
        is a typed record: address, key material, prize, what happened on chain. One library behind
        the CLI, an MCP server and the Pi and OMP extensions, with live balances from the explorers.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
        <UButton to="/guide" color="primary" trailing-icon="i-lucide-arrow-right">
          Get started
        </UButton>
        <UButton
          to="https://github.com/agntn/puzzles"
          target="_blank"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-github"
        >
          Star on GitHub
        </UButton>
      </div>
      <button
        type="button"
        class="puzzles-install mt-5"
        :aria-label="copied === 'install' ? 'Copied' : 'Copy install command'"
        @click="copy('install', 'pnpm add @agntn/puzzles')"
      >
        <span class="text-dimmed">$</span>
        <span>pnpm add @agntn/puzzles</span>
        <UIcon
          :name="copied === 'install' ? 'i-lucide-check' : 'i-lucide-copy'"
          class="size-3.5 text-dimmed"
        />
      </button>

      <div
        class="mx-auto mt-16 hidden max-w-6xl md:block"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <LandingFlow :sample="current" :tick="tick" :loaded="loaded" />
      </div>
    </header>

    <LandingFeature
      title="Data as code, one file per puzzle"
      to="/guide/records"
      link="Puzzle records"
      :checks="[
        'A record is a PuzzleSpec literal handed to a factory for its chain: bitcoinPuzzle, decredPuzzle, arweavePuzzle',
        'Addresses, keys and transactions come from builders, so an absent field is absent, never null',
        'Status is written down, not derived. A claim transaction plus a published key still means solved',
      ]"
    >
      There's no JSON to edit and no build step that generates data. Each puzzle is a TypeScript
      file with one literal in it, and the type checker reads it before any test does. The panel
      walks through {{ samples.length }} records from every collection, key material included, the
      way they sit on disk.
      <template #visual>
        <div @mouseenter="paused = true" @mouseleave="paused = false">
          <LandingRecord :sample="current" />
          <div class="mt-3 flex items-center justify-between font-mono text-[11px] text-dimmed">
            <NuxtLink
              :to="`/collections/${current.id}`"
              class="truncate hover:text-highlighted hover:underline"
              >{{ current.id }} · {{ current.chain }} · {{ current.status }}</NuxtLink
            >
            <span class="inline-flex shrink-0 gap-1">
              <button
                type="button"
                class="puzzles-copy"
                aria-label="Previous puzzle"
                @click="step(-1)"
              >
                <UIcon name="i-lucide-chevron-left" class="size-3.5" />
              </button>
              <button type="button" class="puzzles-copy" aria-label="Next puzzle" @click="step(1)">
                <UIcon name="i-lucide-chevron-right" class="size-3.5" />
              </button>
            </span>
          </div>
        </div>
      </template>
    </LandingFeature>

    <LandingFeature
      title="A key that derives its address, or a plain no"
      to="/guide/verification"
      link="How verification works"
      :checks="[
        'verifyPuzzle reads the one secret a record exposes: hex, WIF, BIP38 payload, seed phrase or mini key',
        'A solved puzzle with its key published derives the stored address, in your browser, secp256k1 and all',
        'No key, an encrypted key, a mini key: unavailable is a verdict, not an exception',
      ]"
      reverse
    >
      A published key is a claim, so the library checks it: derive the address, compare. The data
      gate runs the same check on every record, so a wrong hex digit fails the build instead of
      shipping. Here it runs on the current sample with the code the CLI ships.
      <template #visual>
        <div @mouseenter="paused = true" @mouseleave="paused = false">
          <LandingVerify :sample="current" />
        </div>
      </template>
    </LandingFeature>

    <LandingFeature
      title="A manifest of keys, records on first use"
      to="/guide/registry"
      link="Registry and lazy loading"
      :checks="[
        'collectionKeys() and hasCollection() answer from the manifest without loading anything',
        'get(\'b1000/71\') imports the b1000 module and nothing else; all() loads every collection once',
        'registerCollection({ key, load }) adds yours, lazily too, and the aggregate views refresh',
      ]"
    >
      Importing the package evaluates no puzzle records. Each registry key has its own lazy
      <code class="font-mono text-[13px] text-highlighted">import()</code>, so a bundler splits each
      collection into its own chunk. Only ever ask about
      <code class="font-mono text-[13px] text-highlighted">b1000</code>? The other collections stay
      unloaded. This panel shows the walk loading one collection at a time.
      <template #visual>
        <div @mouseenter="paused = true" @mouseleave="paused = false">
          <LandingRegistry :sample="current" :loaded="loaded" />
        </div>
      </template>
    </LandingFeature>

    <section class="puzzles-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-20 sm:px-12 lg:px-16">
        <div class="max-w-2xl">
          <h2 class="text-2xl font-medium tracking-tight text-highlighted sm:text-[1.75rem]">
            {{ COLLECTIONS.length }} collections, {{ chainCount }} chains, one page per puzzle
          </h2>
          <p class="mt-4 text-sm leading-6 text-muted">
            Each collection is a class with an author and its puzzle list, published on its own
            entry as
            <code class="font-mono text-[13px] text-highlighted"
              >@agntn/puzzles/collections/&lt;key&gt;</code
            >. Every puzzle has a page with its record, its transactions, its key material and its
            live balance. The numbers here come from the library at build time.
          </p>
        </div>
        <div class="puzzles-frame mt-10 overflow-hidden rounded-xl">
          <div
            class="hidden grid-cols-[1.25rem_minmax(0,13rem)_minmax(0,1fr)_5rem_7rem_9rem_1rem] gap-x-3 border-b border-muted px-4 py-2.5 font-mono text-[10px] tracking-[0.1em] text-dimmed uppercase lg:grid"
          >
            <span />
            <span>collection</span>
            <span />
            <span>chains</span>
            <span class="text-right">puzzles · open</span>
            <span class="text-right">unclaimed</span>
            <span />
          </div>
          <ol class="divide-y divide-muted">
            <li v-for="entry in rows" :key="entry.key">
              <NuxtLink
                :to="entry.to"
                class="puzzles-row grid-cols-[1.25rem_minmax(0,1fr)_1rem] lg:grid-cols-[1.25rem_minmax(0,13rem)_minmax(0,1fr)_5rem_7rem_9rem_1rem]"
                :class="{ 'puzzles-row-active': entry.key === activeCollection }"
              >
                <UIcon :name="entry.icon" class="size-4 text-dimmed" />
                <span class="min-w-0">
                  <span class="block truncate text-sm font-medium text-highlighted">{{
                    entry.title
                  }}</span>
                  <span class="block truncate font-mono text-[11px] text-dimmed lg:hidden"
                    >{{ entry.total }} puzzles · {{ entry.open }} open<template
                      v-if="entry.unsolvedPrize !== '-'"
                    >
                      · {{ entry.unsolvedPrize }}</template
                    ></span
                  >
                </span>
                <span class="hidden truncate text-xs leading-5 text-muted lg:block">{{
                  entry.blurb
                }}</span>
                <span class="hidden items-center gap-1.5 lg:flex">
                  <UIcon
                    v-for="icon in entry.chainIcons"
                    :key="icon"
                    :name="icon"
                    class="size-3.5 text-dimmed"
                  />
                </span>
                <span class="hidden text-right font-mono text-[12px] text-muted lg:block"
                  >{{ entry.total }} · {{ entry.open }}</span
                >
                <span
                  class="hidden truncate text-right font-mono text-[12px] lg:block"
                  :class="entry.unsolvedPrize === '-' ? 'text-dimmed' : 'text-primary'"
                  >{{ entry.unsolvedPrize }}</span
                >
                <UIcon name="i-lucide-arrow-right" class="size-4 text-dimmed" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/guide/custom"
                class="puzzles-row grid-cols-[1.25rem_minmax(0,1fr)_1rem] lg:grid-cols-[1.25rem_minmax(0,13rem)_minmax(0,1fr)_auto_1rem]"
              >
                <UIcon name="i-lucide-plus" class="size-4 text-dimmed" />
                <span class="block truncate text-sm font-medium text-highlighted">Yours</span>
                <span class="hidden truncate text-xs leading-5 text-muted lg:block"
                  >A class extending NamedCollection or NumericCollection, registered with a loader
                  so it stays lazy like the built-ins.</span
                >
                <span class="hidden font-mono text-[12px] text-dimmed lg:block"
                  >registerCollection({ key, load })</span
                >
                <UIcon name="i-lucide-arrow-right" class="size-4 text-dimmed" />
              </NuxtLink>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <LandingFeature
      title="Nineteen authors, every fact with its page"
      to="/authors"
      link="Author dossiers"
      :checks="[
        'A key, a kind, aliases, the channels they publish through and the addresses they fund from',
        'facts are sentences a public page states, with that page as source and a date where it has one',
        'Pseudonyms stay pseudonyms: klems and Tiamat are the handle and what they signed with it',
      ]"
      reverse
    >
      Who funded a puzzle says something about how it was built. So every collection's author is a
      record, not a name and a link, and
      <code class="font-mono text-[13px] text-highlighted">getAuthor(key)</code> answers with it.
      The card follows the walk: it shows whoever published the puzzle on screen.
      <template #visual>
        <div @mouseenter="paused = true" @mouseleave="paused = false">
          <LandingAuthor :sample="current" />
        </div>
      </template>
    </LandingFeature>

    <LandingFeature
      title="Nine tools, three hosts, one executor each"
      to="/guide/agents"
      link="MCP, Pi and OMP"
      :checks="[
        'puzzles_stats, puzzles_collections, puzzles_authors, puzzles_author, puzzles_show, puzzles_hints, puzzles_list, puzzles_verify, puzzles_balance',
        'The text carries the whole record: address, status, prize, key material, transactions, explorer links',
        'Limits live in one facts table and the executors enforce them, so a host that skips schema validation hits the same wall',
      ]"
    >
      <code class="font-mono text-[13px] text-highlighted">puzzles mcp</code> serves the tools over
      stdio, the Pi and OMP extensions render them in the terminal. All three call the same
      functions, so they answer identically and a fix lands once. Only
      <code class="font-mono text-[13px] text-highlighted">puzzles_balance</code> reaches out to a
      block explorer, and it says so in its annotations.
      <template #visual>
        <div
          @mouseenter="paused = true"
          @mouseleave="paused = false"
          @focusin="paused = true"
          @focusout="paused = false"
        >
          <LandingToolCall :sample="current" @previous="step(-1)" @next="step(1)" />
        </div>
      </template>
    </LandingFeature>

    <LandingFeature
      title="Extend Collection, register a loader"
      to="/guide/custom"
      link="Custom collections"
      :checks="[
        'A static key, an author from party(), and puzzles built with the same factories',
        'registerCollection({ key, load }) keeps yours lazy; registerCollection(instance) is fine too',
        'get, all, stats and the tools see it on the next call, and the same instance twice is a no-op',
      ]"
      reverse
    >
      A collection outside the package is the same shape as one inside it: a class extending
      <code class="font-mono text-[13px] text-highlighted">NamedCollection</code> or
      <code class="font-mono text-[13px] text-highlighted">NumericCollection</code> with its puzzle
      list. Register a loader and the registry treats it like a built-in, including the part where
      nothing loads until someone asks.
      <template #visual>
        <div class="puzzles-frame overflow-hidden rounded-xl">
          <div class="flex items-center gap-2 border-b border-muted px-4 py-3">
            <UIcon name="i-vscode-icons-file-type-typescript" class="size-4" />
            <span class="text-sm text-default">mine.ts</span>
          </div>
          <pre
            class="puzzles-code"
          ><code><span class="puzzles-code-line puzzles-code-line-wrap"><template v-for="([cls, text], index) in customCode" :key="index"><span :class="cls === '' ? '' : `tok-${cls}`">{{ text }}</span></template></span><span class="puzzles-code-line"> </span><span class="puzzles-code-line"><span class="tok-kw">export const</span> minePuzzleFirst = <span class="tok-fn">bitcoinPuzzle</span>({</span><span class="puzzles-code-line">  <span class="tok-key">id</span>: <span class="tok-str">"mine/first"</span>,</span><span class="puzzles-code-line">  <span class="tok-key">address</span>: <span class="tok-fn">p2pkh</span>(<span class="tok-str">"1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"</span>),</span><span class="puzzles-code-line">  <span class="tok-key">sourceUrl</span>: <span class="tok-str">"https://example.com/first"</span>,</span><span class="puzzles-code-line">  <span class="tok-key">startedAt</span>: <span class="tok-str">"2026-01-01 00:00:00"</span>,</span><span class="puzzles-code-line">  <span class="tok-key">key</span>: <span class="tok-fn">hex</span>(<span class="tok-str">"00…01"</span>, <span class="tok-const">1</span>),</span><span class="puzzles-code-line">});</span><span class="puzzles-code-line"> </span><span class="puzzles-code-line"><span class="tok-kw">export class</span> <span class="tok-fn">MineCollection</span> <span class="tok-kw">extends</span> NamedCollection {</span><span class="puzzles-code-line">  <span class="tok-kw">static readonly</span> key = <span class="tok-str">"mine"</span>;</span><span class="puzzles-code-line">  <span class="tok-kw">static readonly</span> author = <span class="tok-fn">party</span>(<span class="tok-str">"you"</span>);</span><span class="puzzles-code-line">  <span class="tok-kw">static readonly</span> puzzles = [minePuzzleFirst];</span><span class="puzzles-code-line">  <span class="tok-fn">constructor</span>() {</span><span class="puzzles-code-line">    <span class="tok-kw">super</span>(MineCollection.key, MineCollection.author, MineCollection.puzzles);</span><span class="puzzles-code-line">  }</span><span class="puzzles-code-line">}</span><span class="puzzles-code-line"> </span><span class="puzzles-code-line puzzles-code-line-wrap"><span class="tok-cm">// Lazy, like the built-ins: the module loads on the first get("mine/first").</span></span><span class="puzzles-code-line puzzles-code-line-wrap"><span class="tok-fn">registerCollection</span>({ key: <span class="tok-str">"mine"</span>, load: () =&gt; <span class="tok-kw">import</span>(<span class="tok-str">"./mine"</span>).then((m) =&gt; <span class="tok-kw">new</span> m.<span class="tok-fn">MineCollection</span>()) });</span></code></pre>
        </div>
      </template>
    </LandingFeature>

    <section class="puzzles-section">
      <div
        class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-20 text-center sm:px-12 lg:px-16"
      >
        <h2 class="text-2xl font-medium tracking-tight text-highlighted sm:text-3xl">
          Start with one command
        </h2>
        <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Pre-1.0, so pin exact versions. The records are public data about public puzzles. Every
          key in here was public before it got here. A balance is what the explorer said five
          minutes ago at most.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
          <UButton to="/guide" color="primary" trailing-icon="i-lucide-arrow-right">
            Read the guide
          </UButton>
          <UButton to="/playground" color="neutral" variant="outline">
            Open the playground
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
