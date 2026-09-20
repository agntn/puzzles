<script setup lang="ts">
import type { Hint } from "@agntn/puzzles";
import { hostPath } from "../../utils/format";

/** A hint as recorded, plus whether the whole collection shares it, for the chip. */
export interface HintItem extends Hint {
  readonly shared?: boolean;
}

defineProps<{ hints: readonly HintItem[] }>();
</script>

<template>
  <ul class="space-y-3">
    <li v-for="(hint, index) in hints" :key="index">
      <p class="text-sm text-highlighted">
        <span class="puzzles-chip me-2 font-mono text-[11px]">{{ hint.kind }}</span
        ><span v-if="hint.shared" class="puzzles-chip me-2 font-mono text-[11px]"
          >whole collection</span
        >{{ hint.text }}
      </p>
      <p class="mt-1 font-mono text-[11px] text-dimmed">
        <template v-if="hint.date">{{ hint.date }} · </template>source
        <a :href="hint.source" target="_blank" rel="noopener" class="hover:underline">{{
          hostPath(hint.source)
        }}</a>
        · confirmation
        <a :href="hint.confirmation.url" target="_blank" rel="noopener" class="hover:underline">{{
          hostPath(hint.confirmation.url)
        }}</a>
        <template v-if="hint.confirmation.description">
          ({{ hint.confirmation.description }})</template
        >
      </p>
      <details v-if="hint.answer" class="mt-2 text-sm">
        <summary class="cursor-pointer text-muted">Published answer</summary>
        <p class="mt-1 text-highlighted">{{ hint.answer.text }}</p>
        <p class="mt-1 font-mono text-[11px] text-dimmed">
          <template v-if="hint.answer.date">{{ hint.answer.date }} · </template>source
          <a :href="hint.answer.source" target="_blank" rel="noopener" class="hover:underline">{{
            hostPath(hint.answer.source)
          }}</a>
        </p>
      </details>
    </li>
  </ul>
</template>
