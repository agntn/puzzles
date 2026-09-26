<script setup lang="ts">
import { version } from "@agntn/puzzles";

definePageMeta({ layout: "default" });

const title = "Changelog";
const description =
  "Every release of @agntn/puzzles, newest first: collections and puzzles added, solves, fixes and breaking changes. Also as an RSS feed.";
/** The OG pipeline drops commas from its props, so the card gets a version written without them. */
const cardDescription =
  "Every release of @agntn/puzzles. New collections and puzzles. Solves. Fixes. Breaking changes. Also as RSS.";

const { data: releases } = await useFetch("/api/changelog", { default: () => [] });

const latest = computed(() => releases.value[0]);
const oldest = computed(() => releases.value.at(-1));
const entries = computed(() =>
  releases.value.flatMap((release) => release.groups.flatMap((group) => group.entries)),
);
const breaking = computed(() => entries.value.filter((entry) => entry.breaking).length);

useSeo({
  title,
  description,
  type: "article",
  breadcrumbs: [{ title: "Changelog", path: "/changelog" }],
});

defineOgImage(
  "Docs",
  { headline: "Changelog", title, description: cardDescription },
  { alt: "The @agntn/puzzles changelog: every release, newest first" },
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
          <span>changelog</span>
          <span class="console-id-sep" aria-hidden="true">/</span>
          <span>@agntn/puzzles v{{ version }}</span>
        </p>

        <h1 class="hero-title">
          Every release, <br class="changelog-break" />
          <span>newest first.</span>
        </h1>
        <p class="hero-lead">
          New collections and puzzles, solves, fixes and breaking changes, read from CHANGELOG.md
          when the site builds. A feed reader gets the same list.
        </p>

        <dl class="hero-metrics">
          <div>
            <dt>Releases</dt>
            <dd>{{ releases.length }}</dd>
            <dd class="hero-metric-sub">since v{{ oldest?.version }}</dd>
          </div>
          <div>
            <dt>Latest</dt>
            <dd class="hero-metric-accent">v{{ latest?.version }}</dd>
            <dd class="hero-metric-sub">{{ latest?.date?.slice(0, 10) }}</dd>
          </div>
          <div>
            <dt>Entries</dt>
            <dd>{{ entries.length }}</dd>
            <dd class="hero-metric-sub">{{ breaking }} breaking</dd>
          </div>
        </dl>

        <p class="changelog-subscribe">
          <span class="console-tag">RSS</span>
          <a href="/changelog.xml" type="application/rss+xml">puzzles.agntn.dev/changelog.xml</a>
        </p>
      </div>

      <div class="hero-instrument hero-instrument-keep">
        <svg class="hero-circuit" viewBox="0 0 160 56" aria-hidden="true">
          <path class="hero-circuit-rail" d="M80 0V16L96 32V56" />
          <path class="hero-circuit-live" d="M80 0V16L96 32V56" pathLength="1" />
          <path class="hero-circuit-seg" d="M96 38V48" />
          <rect class="hero-circuit-node" x="92.5" y="52.5" width="7" height="7" />
        </svg>
        <span class="hero-circuit-tag" aria-hidden="true">log</span>
        <ChangelogFeed :releases="releases" />
      </div>
    </header>
  </div>
</template>

<style scoped>
@media (width < 64rem) {
  .changelog-break {
    display: none;
  }
}
/* The feed reads as a line of the zone, like the playground's note: no box of its own. */
.changelog-subscribe {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 12px;
  margin: 28px auto 0;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ui-text-muted);
}
.changelog-subscribe > .console-tag {
  margin: 0;
  color: var(--console-accent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--console-accent) 55%, transparent);
}
.changelog-subscribe > a {
  color: var(--ui-text-highlighted);
  text-decoration: underline;
  text-decoration-color: var(--console-line);
  text-underline-offset: 3px;
}
.changelog-subscribe > a:hover {
  color: var(--console-accent);
}
</style>
