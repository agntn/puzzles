<script setup lang="ts">
import { releaseAnchor, type ChangelogRelease } from "#shared/changelog";

/**
 * The release log: every release of CHANGELOG.md on `UChangelogVersions`, date and node on the
 * left, the version, its groups and their entries on the right, the feed in the footer.
 */
const props = defineProps<{ releases: readonly ChangelogRelease[] }>();

const dated = computed(() => props.releases.filter((release) => release.date));
const first = computed(() => dated.value.at(-1)?.date?.slice(0, 10));
const last = computed(() => dated.value[0]?.date?.slice(0, 10));

/**
 * How many entries of a release are marked breaking.
 *
 * @param {ChangelogRelease} release - The release.
 * @returns {number} The count.
 */
function breaking(release: ChangelogRelease): number {
  return release.groups.reduce(
    (sum, group) => sum + group.entries.filter((entry) => entry.breaking).length,
    0,
  );
}

/**
 * The time of day when the date carries one; heading dates are days only.
 *
 * @param {string} date - An ISO date.
 * @returns {string | undefined} `HH:MM` UTC, or nothing for a bare day.
 */
function time(date: string): string | undefined {
  return date.length > 10 ? date.slice(11, 16) : undefined;
}
</script>

<template>
  <section class="tool-console console-wide changelog not-prose" aria-label="Releases">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>

    <header class="console-bar">
      <span class="console-title"><span class="console-tag">Log</span>CHANGELOG.md</span>
      <span class="console-meta"
        ><span class="console-ticks-bar" aria-hidden="true"
          ><span
            v-for="release in releases"
            :key="release.version"
            :class="breaking(release) ? 'console-tick-open' : 'console-tick-closed'" /></span
        ><span class="changelog-nowrap">{{ releases.length }} releases</span
        ><template v-if="first && last">
          · <span class="changelog-nowrap">{{ first }} → {{ last }}</span></template
        ></span
      >
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true"><span class="console-cursor" /></div>

    <div class="console-band changelog-band">
      <UChangelogVersions
        :ui="{
          root: 'changelog-versions',
          container: 'gap-y-10 lg:gap-y-14',
          indicator: 'changelog-rail',
          beam: 'changelog-beam',
        }"
      >
        <UChangelogVersion
          v-for="(release, index) in releases"
          :id="releaseAnchor(release.version)"
          :key="release.version"
          :date="release.date"
          :ui="{
            root: 'changelog-version',
            container: 'changelog-version-body',
            indicator: 'changelog-indicator',
            dot: 'changelog-dot',
            dotInner: 'changelog-dot-inner',
            date: 'changelog-date',
            meta: 'changelog-meta',
            title: 'changelog-title',
            description: 'changelog-summary',
            footer: 'changelog-footer',
          }"
        >
          <template #date>
            <span>{{ release.date?.slice(0, 10) }}</span
            ><span v-if="release.date && time(release.date)">{{ time(release.date) }} UTC</span>
          </template>

          <template #title>
            <a :href="`#${releaseAnchor(release.version)}`" class="changelog-version-link"
              >v{{ release.version }}</a
            ><span v-if="index === 0" class="console-tag changelog-tag-accent">Latest</span
            ><span v-if="breaking(release)" class="console-tag changelog-tag-accent"
              >{{ breaking(release) }} breaking</span
            >
          </template>

          <template #description>
            <template v-for="(group, at) in release.groups" :key="group.title"
              ><span v-if="at > 0" class="changelog-sep"> · </span
              ><span class="changelog-nowrap"
                >{{ group.entries.length }} {{ group.title.toLowerCase() }}</span
              ></template
            >
          </template>

          <template #body>
            <div v-for="group in release.groups" :key="group.title" class="changelog-group">
              <p class="console-label console-rule-title">
                <span
                  >{{ group.title }}
                  <span aria-hidden="true">[ {{ group.entries.length }} ]</span></span
                >
                <span class="console-mark" aria-hidden="true" />
              </p>
              <ul class="changelog-entries">
                <li v-for="(entry, at) in group.entries" :key="at">
                  <span v-if="entry.scope" class="console-tag">{{ entry.scope }}</span
                  ><span v-if="entry.breaking" class="console-tag changelog-tag-accent"
                    >Breaking</span
                  ><template v-for="(span, part) in entry.spans" :key="part"
                    ><code v-if="span.kind === 'code'" class="puzzles-code">{{ span.text }}</code
                    ><strong v-else-if="span.kind === 'strong'">{{ span.text }}</strong
                    ><a
                      v-else-if="span.kind === 'link'"
                      :href="span.href"
                      target="_blank"
                      rel="noopener"
                      >{{ span.text }}</a
                    ><template v-else>{{ span.text }}</template></template
                  >
                </li>
              </ul>
            </div>
          </template>

          <template #footer>
            <span class="changelog-links">
              <a :href="release.url" target="_blank" rel="noopener">↗ release</a>
              <a v-if="release.compare" :href="release.compare" target="_blank" rel="noopener"
                >↗ compare</a
              >
            </span>
            <span v-if="release.contributors.length" class="changelog-contributors"
              >by
              <template v-for="(person, at) in release.contributors" :key="person.name"
                ><span v-if="at > 0">, </span
                ><a v-if="person.url" :href="person.url" target="_blank" rel="noopener">{{
                  person.name
                }}</a
                ><template v-else>{{ person.name }}</template></template
              ></span
            >
          </template>
        </UChangelogVersion>
      </UChangelogVersions>
    </div>

    <footer class="console-footer console-footer-plain">
      <span class="changelog-feed"
        ><span class="console-tag">RSS</span
        ><a href="/changelog.xml" type="application/rss+xml">/changelog.xml</a></span
      >
      <span class="console-meta">read from CHANGELOG.md at build · dates from npm</span>
    </footer>
  </section>
</template>

<style scoped>
.changelog-nowrap {
  white-space: nowrap;
}
.changelog-band {
  padding: 28px 20px 32px;
}

/* The rail: a quiet line with the beam in the accent, the date column to its left from lg. */
.changelog :deep(.changelog-rail) {
  background: var(--console-line);
}
.changelog :deep(.changelog-beam) {
  background: var(--console-accent);
}
.changelog :deep(.changelog-indicator) {
  align-items: flex-start;
}
.changelog :deep(.changelog-dot) {
  width: 9px;
  height: 9px;
  margin: 5px 4px 0 0;
  border-radius: 0;
  background: var(--ui-bg);
  box-shadow: inset 0 0 0 1px var(--console-corner);
  --tw-ring-shadow: 0 0 #0000;
}
.changelog :deep(.changelog-dot-inner) {
  width: 3px;
  height: 3px;
  border-radius: 0;
  background: var(--ui-text-muted);
}
.changelog :deep(.changelog-version:first-child .changelog-dot-inner) {
  background: var(--console-accent);
}
.changelog :deep(.changelog-date) {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--ui-text-muted);
  font-variant-numeric: tabular-nums;
}
.changelog :deep(.changelog-date > span + span) {
  font-size: 11px;
  color: var(--ui-text-dimmed);
}
.changelog :deep(.changelog-meta .changelog-date) {
  flex-direction: row;
  gap: 8px;
}
.changelog :deep(.changelog-version-body) {
  max-width: 52rem;
  margin: 0;
}
@media (width >= 64rem) {
  .changelog :deep(.changelog-version-body) {
    margin-left: 10rem;
  }
}
.changelog :deep(.changelog-version) {
  scroll-margin-top: 96px;
}
.changelog :deep(.changelog-title) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 400;
}
.changelog :deep(.changelog-title .console-tag) {
  margin: 0;
}
.changelog-version-link {
  margin-right: 4px;
  color: var(--ui-text-highlighted);
}
.changelog-version-link:hover {
  color: var(--console-accent);
}
.changelog :deep(.changelog-tag-accent) {
  color: var(--console-accent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--console-accent) 55%, transparent);
}
.changelog :deep(.changelog-summary) {
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-dimmed);
}
.changelog-sep {
  color: var(--ui-text-dimmed);
}
.changelog-group {
  margin-top: 22px;
}
.changelog-group .console-rule-title {
  margin-bottom: 10px;
}
.changelog-entries {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ui-text-toned);
  overflow-wrap: anywhere;
}
/* Entries carry whole paths and calls; unlike the landing's short snippets they wrap, box per line. */
.changelog-entries .puzzles-code {
  white-space: normal;
}
.changelog-entries li {
  position: relative;
  padding-left: 16px;
}
.changelog-entries li::before {
  content: "";
  position: absolute;
  top: 0.72em;
  left: 2px;
  width: 5px;
  height: 1px;
  background: var(--console-corner);
}
.changelog-entries a,
.changelog-contributors a {
  color: var(--ui-text-highlighted);
  text-decoration: underline;
  text-decoration-color: var(--console-line);
  text-underline-offset: 3px;
}
.changelog-entries a:hover,
.changelog-contributors a:hover,
.changelog-links a:hover,
.changelog-feed a:hover {
  color: var(--console-accent);
}
.changelog-entries strong {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.changelog :deep(.changelog-footer) {
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px dashed var(--console-line);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ui-text-dimmed);
}
.changelog-links {
  display: flex;
  gap: 16px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.changelog-links a,
.changelog-feed a {
  color: var(--ui-text-muted);
}
.changelog-feed {
  display: inline-flex;
  align-items: baseline;
  text-transform: none;
}
@media (width < 40rem) {
  .changelog-band {
    padding: 20px 14px 24px;
  }
}
</style>
