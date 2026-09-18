<script setup lang="ts">
import type { LandingSample } from "../../utils/samples";

defineProps<{ sample: LandingSample }>();
</script>

<template>
  <div class="puzzles-frame overflow-hidden rounded-xl">
    <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
      <p class="font-mono text-xs text-muted">
        <span class="text-dimmed">tool</span>
        <span class="ms-2 text-highlighted">puzzles_show</span>
      </p>
      <p class="font-mono text-[11px] text-dimmed">MCP · Pi · OMP</p>
    </div>
    <div class="divide-y divide-muted">
      <div class="px-4 py-4">
        <p class="puzzles-eyebrow mb-3">input</p>
        <pre class="puzzles-tool"><code>{
  <span class="tok-key">"id"</span>: <span class="tok-str">"<Transition name="puzzles-roll" mode="out-in"><span :key="sample.id" class="puzzles-roll-slot">{{ sample.id }}</span></Transition>"</span>
}</code></pre>
      </div>
      <div class="px-4 py-4">
        <p class="puzzles-eyebrow mb-3">output · content[0].text</p>
        <pre
          :key="sample.tool"
          class="puzzles-tool puzzles-derive"
        ><code>{{ sample.tool }}</code></pre>
      </div>
    </div>
  </div>
</template>
