<script setup lang="ts">
import { authors } from "@agntn/puzzles";
import { authorIcon, authorRows } from "../../utils/authors";

/** Every author, loaded once for the prerender and again in the browser on navigation. */
const { data } = await useAsyncData("author-rows", async () => authorRows(await authors()));

const rows = computed(() => data.value ?? []);
</script>

<template>
  <section v-if="rows.length > 0" class="roster not-prose my-6" aria-label="Authors">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
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
        <span class="roster-count"
          ><span class="roster-leader" aria-hidden="true" />{{ row.collections.join(", ") }} ·
          {{ row.puzzles }}</span
        >
      </li>
    </ol>
    <footer class="roster-bar roster-footer">
      <span>local dataset / no network</span>
      <span class="roster-meta">getAuthor(key) opens one</span>
    </footer>
  </section>
</template>
