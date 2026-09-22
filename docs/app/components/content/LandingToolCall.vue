<script setup lang="ts">
import type { LandingSample } from "../../utils/samples";
import { CHAIN_ICONS } from "../../utils/puzzles";

const props = defineProps<{ sample: LandingSample }>();
const emit = defineEmits<{ previous: []; next: [] }>();
const scan = ref(0);

watch(
  () => props.sample.id,
  () => {
    scan.value += 1;
  },
);
</script>

<template>
  <div class="tool-console">
    <header class="console-bar">
      <span class="console-title">puzzles_show</span>
      <span class="console-hosts" aria-label="Supported hosts: MCP, Pi and OMP"
        >MCP · Pi · OMP</span
      >
    </header>

    <div class="console-request">
      <span class="console-label"><span class="console-index">01</span> Input / id</span>
      <code>{{ sample.id }}</code>
      <span aria-hidden="true">↳</span>
    </div>

    <div class="console-result">
      <div v-if="scan > 0" :key="scan" class="console-scan" aria-hidden="true" />
      <div class="console-result-heading">
        <span class="console-label"><span class="console-index">02</span> Record summary</span>
        <StatusPill :status="sample.status" />
      </div>
      <div class="console-subject">
        <ConsoleReticle :key="sample.id" :icon="CHAIN_ICONS[sample.chain] ?? 'i-lucide-link'" />
        <div class="console-identity">
          <span class="console-label">Collection / {{ sample.collection }}</span>
          <h3>{{ sample.id }}</h3>
          <span>{{ sample.chain }} / {{ sample.kind }}</span>
        </div>
      </div>
      <dl class="console-metrics">
        <div>
          <dt>Prize</dt>
          <dd>{{ sample.prize }}</dd>
        </div>
        <div>
          <dt>Transactions</dt>
          <dd>{{ sample.transactions }}</dd>
        </div>
      </dl>
      <dl class="console-address">
        <dt class="console-label">Address <span aria-hidden="true">[ target ]</span></dt>
        <dd>{{ sample.address }}</dd>
      </dl>
      <dl class="console-key">
        <div>
          <dt class="console-label">Public key</dt>
          <dd>{{ sample.pubkey ? "Published" : "Unknown" }}</dd>
        </div>
        <div>
          <dt class="console-label">Started</dt>
          <dd>{{ sample.startedAt || "Unknown" }}</dd>
        </div>
      </dl>
    </div>

    <ConsoleResponse :title="`puzzles_show · ${sample.id}`" :text="sample.tool" />

    <footer class="console-footer">
      <span>Local dataset / no network</span>
      <div class="console-controls" aria-label="Sample records">
        <button type="button" aria-label="Previous record" @click="emit('previous')">
          <UIcon name="i-lucide-chevron-left" />
        </button>
        <span>Record</span>
        <button type="button" aria-label="Next record" @click="emit('next')">
          <UIcon name="i-lucide-chevron-right" />
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.console-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.console-controls > span {
  color: var(--ui-text-dimmed);
  font-size: 10px;
}
.console-controls button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  color: var(--ui-text-muted);
  border: 1px solid var(--console-line);
  cursor: pointer;
}
.console-controls button:hover {
  color: var(--console-accent);
  border-color: var(--console-corner);
  background: color-mix(in srgb, var(--ui-text-muted) 8%, var(--ui-bg));
}
.console-controls button:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
</style>
