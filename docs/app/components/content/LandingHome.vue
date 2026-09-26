<script setup lang="ts">
import { COLLECTIONS } from "../../utils/puzzles";
import { FACTS_STATIC } from "../../utils/landing";

const { samples, loaded, paused, current, step } = useLandingPuzzle();

/** Chains that hold at least one puzzle, read off the same fixtures as the collection roster. */
const chainCount = new Set(FACTS_STATIC.flatMap((row) => row.chains)).size;

/** The collection list highlights whichever collection the panels are showing. */
const activeCollection = computed(() => current.value.collection);
</script>

<template>
  <div class="puzzles-landing not-prose">
    <LandingHero :sample="current" :loaded="loaded" @pause="paused = $event" />

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
          <LandingRecord :sample="current" @previous="step(-1)" @next="step(1)" />
        </div>
      </template>
    </LandingFeature>

    <LandingFeature
      title="A key that derives its address, or a plain no"
      to="/guide/verification"
      link="How verification works"
      :checks="[
        'verify() reads the one secret a record exposes: hex, WIF, BIP38 payload, seed phrase or mini key',
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
      <code class="puzzles-code">import()</code>, so a bundler splits each collection into its own
      chunk. Only ever ask about <code class="puzzles-code">b1000</code>? The other collections stay
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
            entry. Every puzzle has a page with its record, its transactions, its key material and
            its live balance. The numbers here come from the library at build time.
          </p>
          <!-- The entry path as a lead, like the addresses and calls in the instruments, so the copy never breaks around it. -->
          <p class="landing-entry">
            <span class="console-tag">Import</span>
            <code>@agntn/puzzles/collections/&lt;key&gt;</code>
          </p>
        </div>
        <LandingCollections :active="activeCollection" class="mt-10" />
      </div>
    </section>

    <LandingFeature
      title="Twenty-six authors, every fact with its page"
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
      <code class="puzzles-code">getAuthor(key)</code> answers with it. The card follows the walk:
      it shows whoever published the puzzle on screen.
      <template #visual>
        <div @mouseenter="paused = true" @mouseleave="paused = false">
          <LandingAuthor :sample="current" />
        </div>
      </template>
    </LandingFeature>

    <LandingFeature
      title="Twelve tools, three hosts, one executor each"
      to="/guide/agents"
      link="MCP, Pi and OMP"
      :checks="[
        'puzzles_stats, puzzles_collections, puzzles_authors, puzzles_author, puzzles_show, puzzles_hints, puzzles_stages, puzzles_list, puzzles_verify, puzzles_balance',
        'The text carries the whole record: address, status, prize, key material, transactions, explorer links',
        'Limits live in one facts table and the executors enforce them, so a host that skips schema validation hits the same wall',
      ]"
    >
      <code class="puzzles-code">puzzles mcp</code> serves the tools over stdio, the Pi and OMP
      extensions render them in the terminal. All three call the same functions, so they answer
      identically and a fix lands once. Only
      <code class="puzzles-code">puzzles_balance</code> reaches out to a block explorer, and it says
      so in its annotations.
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
      <code class="puzzles-code">NamedCollection</code> or
      <code class="puzzles-code">NumericCollection</code> with its puzzle list. Register a loader
      and the registry treats it like a built-in, including the part where nothing loads until
      someone asks.
      <template #visual>
        <LandingCustom />
      </template>
    </LandingFeature>

    <section class="puzzles-section">
      <div class="mx-auto w-full max-w-[var(--ui-container)] px-8 py-20 sm:px-12 lg:px-16">
        <LandingStart />
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-entry {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-top: 14px;
  font-family: var(--font-mono);
  font-size: 13px;
}
.landing-entry > .console-tag {
  margin: 0;
}
.landing-entry > code {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
</style>
