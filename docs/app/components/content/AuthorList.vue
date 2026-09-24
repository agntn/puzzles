<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { authors } from "@agntn/puzzles";
import { authorIcon, authorRows, type AuthorRow } from "../../utils/authors";
import { ROSTER_CLASS, ROSTER_TABLE_UI } from "../../utils/roster";

/** Every author, loaded once for the prerender and again in the browser on navigation. */
const { data } = await useAsyncData("author-rows", async () => authorRows(await authors()));

const rows = computed(() => [...(data.value ?? [])]);

/** Empty until a header is clicked: the rows then keep the registry's order. */
const sorting = ref<{ id: string; desc: boolean }[]>([]);

const roster = useTemplateRef<HTMLElement>("roster");
useRosterFlip(
  () => roster.value,
  () => sorting.value,
);

const columns: TableColumn<AuthorRow>[] = [
  {
    accessorKey: "name",
    header: "Author",
    sortingFn: "text",
    meta: { class: { th: "w-[12.5rem]" } },
  },
  { accessorKey: "key", header: "Key", meta: { class: { th: "w-[10rem]" } } },
  { accessorKey: "about", header: "About", enableSorting: false },
  {
    id: "puzzles",
    header: "Puzzles",
    accessorFn: (row) => row.puzzles,
    meta: { class: { th: "w-[13rem]" } },
  },
];
</script>

<template>
  <section v-if="rows.length > 0" ref="roster" class="roster not-prose my-6" aria-label="Authors">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header :class="ROSTER_CLASS.bar">
      <span :class="ROSTER_CLASS.title">authors()</span>
      <span :class="ROSTER_CLASS.meta">{{ rows.length }} subjects · every name is a page</span>
    </header>
    <div class="roster-ruler" aria-hidden="true" />
    <UTable
      v-model:sorting="sorting"
      :data="rows"
      :columns="columns"
      :get-row-id="(row) => row.key"
      :ui="ROSTER_TABLE_UI"
    >
      <template #name-header="{ column }"><RosterSort :column="column" label="Author" /></template>
      <template #key-header="{ column }"><RosterSort :column="column" label="Key" /></template>
      <template #puzzles-header="{ column }"
        ><RosterSort :column="column" label="Puzzles"
      /></template>
      <template #name-cell="{ row }">
        <NuxtLink :to="row.original.to" :class="[ROSTER_CLASS.name, 'items-center']">
          <UIcon :name="authorIcon(row.original.kind)" class="size-3.5" aria-hidden="true" />
          <span class="truncate">{{ row.original.name }}</span>
        </NuxtLink>
      </template>
      <template #key-cell="{ row }">
        <span :class="ROSTER_CLASS.id">{{ row.original.key }}</span>
      </template>
      <template #about-cell="{ row }">
        <span :class="ROSTER_CLASS.about">{{ row.original.about }}</span>
      </template>
      <template #puzzles-cell="{ row }">
        <span :class="ROSTER_CLASS.count"
          ><span :class="ROSTER_CLASS.leader" aria-hidden="true" />{{
            row.original.collections.join(", ")
          }}
          · {{ row.original.puzzles }}</span
        >
      </template>
    </UTable>
    <footer :class="ROSTER_CLASS.footer">
      <span>local dataset / no network</span>
      <span :class="ROSTER_CLASS.meta">getAuthor(key) opens one</span>
    </footer>
  </section>
</template>
