<script setup lang="ts">
import { collectionEntry } from "../../utils/puzzles";

/** The identifier is named `puzzle`, not `id`, because MDC keeps `id` for the element. */
const props = defineProps<{ puzzle: string }>();

/** Singletons render this inside their collection page through `::puzzle-page`. */
const { data } = await usePuzzlePage(props.puzzle);

const entry = computed(() =>
  data.value ? collectionEntry(data.value.view.collection) : undefined,
);
</script>

<template>
  <div v-if="data" class="not-prose">
    <PuzzleCard :view="data.view" />

    <div class="puzzles-frame mt-6 overflow-hidden rounded-xl">
      <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
        <p class="font-mono text-xs text-muted">
          <span class="text-dimmed">tool</span>
          <span class="ms-2 text-highlighted">puzzles_show</span>
        </p>
        <p class="font-mono text-[11px] text-dimmed">what a model reads · MCP · Pi · OMP</p>
      </div>
      <pre class="puzzles-tool p-4!"><code>{{ data.view.tool }}</code></pre>
    </div>

    <details class="puzzles-frame group mt-6 overflow-hidden rounded-xl">
      <summary
        class="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm text-default hover:bg-muted"
      >
        <UIcon name="i-vscode-icons-file-type-json" class="size-4" />
        puzzle.toJSON()
        <span class="ms-auto font-mono text-[11px] text-dimmed"
          >absent fields are absent, never null</span
        >
        <UIcon
          name="i-lucide-chevron-right"
          class="size-4 text-dimmed transition-transform group-open:rotate-90"
        />
      </summary>
      <pre class="puzzles-rotating border-t border-muted"><code>{{ data.view.json }}</code></pre>
    </details>

    <nav
      v-if="data.total > 1"
      class="mt-6 flex items-center justify-between gap-3 font-mono text-[12px]"
    >
      <NuxtLink
        v-if="data.previous"
        :to="`/collections/${data.previous}`"
        class="puzzles-chip hover:text-highlighted"
      >
        <UIcon name="i-lucide-chevron-left" class="size-3.5" />
        {{ data.previous }}
      </NuxtLink>
      <span v-else />
      <span class="text-dimmed"
        >{{ data.position }} of {{ data.total
        }}<template v-if="entry">
          in
          <NuxtLink :to="entry.to" class="text-muted hover:text-highlighted hover:underline">{{
            entry.title
          }}</NuxtLink></template
        ></span
      >
      <NuxtLink
        v-if="data.next"
        :to="`/collections/${data.next}`"
        class="puzzles-chip hover:text-highlighted"
      >
        {{ data.next }}
        <UIcon name="i-lucide-chevron-right" class="size-3.5" />
      </NuxtLink>
      <span v-else />
    </nav>
  </div>
</template>
