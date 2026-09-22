<script setup lang="ts">
import { authors } from "@agntn/puzzles";
import { authorIcon, authorRows } from "../../utils/authors";

/** Every author, loaded once for the prerender and again in the browser on navigation. */
const { data } = await useAsyncData("author-rows", async () => authorRows(await authors()));

const rows = computed(() => data.value ?? []);
</script>

<template>
  <section v-if="rows.length > 0" class="roster not-prose my-6" aria-label="Authors">
    <span class="roster-cross roster-cross-tl" aria-hidden="true">+</span>
    <span class="roster-cross roster-cross-br" aria-hidden="true">+</span>
    <header class="roster-bar">
      <span class="roster-title">authors()</span>
      <span class="roster-meta">{{ rows.length }} subjects · every name is a page</span>
    </header>
    <div class="roster-ruler" aria-hidden="true" />
    <ol class="roster-rows">
      <li v-for="row in rows" :key="row.key">
        <NuxtLink :to="row.to" class="roster-name">
          <UIcon :name="authorIcon(row.kind)" class="size-3.5" aria-hidden="true" />
          <span>{{ row.name }}</span>
        </NuxtLink>
        <span class="roster-id">{{ row.key }}</span>
        <span class="roster-about">{{ row.about }}</span>
        <span class="roster-count">{{ row.collections.join(", ") }} · {{ row.puzzles }}</span>
      </li>
    </ol>
    <footer class="roster-bar roster-footer">
      <span>local dataset / no network</span>
      <span class="roster-meta">getAuthor(key) opens one</span>
    </footer>
  </section>
</template>

<style scoped>
.roster {
  --console-line: color-mix(in srgb, var(--ui-border) 75%, transparent);
  --console-corner: color-mix(in srgb, var(--ui-text-muted) 55%, var(--ui-bg));
  --console-accent: color-mix(in srgb, var(--ui-primary) 65%, var(--ui-text-highlighted));
  position: relative;
  padding: 1px;
  isolation: isolate;
  font-family: var(--font-mono);
  font-size: 12px;
}
.roster::before,
.roster::after {
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
.roster::before {
  inset: 0;
  z-index: -2;
  background: var(--console-line);
}
.roster::after {
  inset: 1px;
  z-index: -1;
  background: var(--ui-bg);
}
.roster-cross {
  position: absolute;
  z-index: 1;
  width: 12px;
  line-height: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--console-corner);
  pointer-events: none;
}
.roster-cross-tl {
  top: -7px;
  left: -7px;
}
.roster-cross-br {
  right: -7px;
  bottom: -7px;
}
.roster-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 10px 28px 10px 20px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
  background: color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg));
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
}
.roster-footer {
  padding-right: 20px;
  border-top: 1px solid var(--console-line);
  background: transparent;
  clip-path: none;
  text-transform: none;
  letter-spacing: 0.04em;
}
.roster-title {
  color: var(--ui-text-highlighted);
  font-size: 13px;
  letter-spacing: 0;
  text-transform: none;
}
.roster-meta {
  color: var(--ui-text-dimmed);
  text-transform: none;
  letter-spacing: 0.04em;
}
.roster-ruler {
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
.roster-rows {
  margin: 0;
  padding: 0;
  list-style: none;
}
.roster-rows li {
  display: grid;
  grid-template-columns: 11rem 9rem minmax(0, 1fr) 11rem;
  gap: 4px 16px;
  align-items: baseline;
  padding: 9px 20px;
  border-top: 1px solid var(--console-line);
}
.roster-rows li:first-child {
  border-top: 0;
}
.roster-rows li:hover {
  background: color-mix(in srgb, var(--ui-text-muted) 4%, var(--ui-bg));
}
.roster-name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--ui-text-highlighted);
}
.roster-name > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.roster-name:hover {
  color: var(--console-accent);
}
.roster-id {
  display: inline-block;
  justify-self: start;
  padding: 1px 5px;
  font-size: 10px;
  line-height: 1.4;
  letter-spacing: 0.08em;
  color: var(--ui-text-muted);
  box-shadow: inset 0 0 0 1px var(--console-line);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.roster-about {
  min-width: 0;
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
  color: var(--ui-text-muted);
}
.roster-count {
  text-align: right;
  font-size: 11px;
  color: var(--ui-text-dimmed);
  overflow-wrap: anywhere;
}
@media (width < 900px) {
  .roster-rows li {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .roster-about {
    grid-column: 1 / -1;
  }
  .roster-id {
    justify-self: end;
  }
  .roster-count {
    grid-column: 1 / -1;
    text-align: left;
  }
}
@media (width < 400px) {
  .roster-bar,
  .roster-rows li {
    padding-inline: 14px;
  }
}
</style>
