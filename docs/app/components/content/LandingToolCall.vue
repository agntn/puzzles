<script setup lang="ts">
import type { LandingSample } from "../../utils/samples";
import { CHAIN_ICONS } from "../../utils/puzzles";
import { tokenizeToolResponse } from "../../utils/tool-response";

const props = defineProps<{ sample: LandingSample }>();
const emit = defineEmits<{ previous: []; next: [] }>();
const scan = ref(0);
const response = shallowRef(props.sample);
const responseTokens = computed(() => tokenizeToolResponse(response.value.tool));
const { copied, copy } = useCopied();

function captureResponse(open: boolean) {
  if (open) response.value = props.sample;
}

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
        <div :key="sample.id" class="console-reticle" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <path class="reticle-frame" d="M24 5H5V24M96 5H115V24M115 96V115H96M24 115H5V96" />
            <circle class="reticle-ticks" cx="60" cy="60" r="49" />
            <path
              class="reticle-sectors"
              d="M39 10H49M71 10H81M110 39V49M110 71V81M81 110H71M49 110H39M10 81V71M10 49V39"
            />
            <path class="reticle-lock" d="M60 18A42 42 0 0 1 102 60M60 102A42 42 0 0 1 18 60" />
            <path
              class="reticle-axis"
              d="M60 0V12M108 60H120M60 108V120M0 60H12M30 60H38M82 60H90M60 30V38M60 82V90"
            />
            <path class="reticle-diamond" d="M60 24L96 60L60 96L24 60Z" />
          </svg>
          <UIcon :name="CHAIN_ICONS[sample.chain] ?? 'i-lucide-link'" class="console-chain-icon" />
        </div>
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

    <UModal
      :title="`puzzles_show · ${response.id}`"
      description="Full response from the selected record."
      :transition="false"
      :ui="{
        content: 'max-w-5xl rounded-sm shadow-none',
        header: 'min-h-0 py-4 pr-14',
        title: 'font-mono text-sm font-normal break-all',
        body: 'p-0 sm:p-0 min-h-0 overflow-hidden flex flex-col',
      }"
      @update:open="captureResponse"
    >
      <button type="button" class="console-output">
        <span><span class="console-index">03</span> Full tool response</span>
        <UIcon name="i-lucide-expand" class="size-3.5" aria-hidden="true" />
      </button>
      <template #body>
        <div class="response-toolbar">
          <span>content[0].text</span>
          <UButton
            color="neutral"
            variant="ghost"
            :icon="copied === response.id ? 'i-lucide-check' : 'i-lucide-copy'"
            @click="copy(response.id, response.tool)"
            >{{ copied === response.id ? "Copied" : "Copy response" }}</UButton
          >
        </div>
        <pre
          class="response-text"
          tabindex="0"
          aria-label="Full tool response"
        ><code><span v-for="(token, index) in responseTokens" :key="index" :class="`response-${token.kind}`">{{ token.text }}</span></code></pre>
      </template>
    </UModal>
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
.console-output {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  padding: 10px 20px;
  border-block: 1px solid var(--console-line);
  cursor: pointer;
  color: var(--ui-text-muted);
  text-align: left;
}
.console-output:hover {
  color: var(--ui-text-highlighted);
  background: color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg));
}
.console-output:focus-visible,
.response-text:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: -3px;
}
.response-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: none;
  padding: 8px 20px;
  border-bottom: 1px solid var(--ui-border-muted);
  color: var(--ui-text-muted);
  font-family: var(--font-mono);
  font-size: 12px;
}
.response-text {
  height: min(60dvh, 36rem);
  min-height: 0;
  margin: 0;
  padding: 20px;
  overflow: auto;
  overscroll-behavior: contain;
  white-space: pre;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.85;
  tab-size: 2;
  color: var(--ui-text-highlighted);
  background: var(--ui-bg);
}
.response-label {
  color: var(--ui-text-muted);
}
.response-url {
  color: var(--ui-primary);
}
.response-date {
  color: var(--ui-text-muted);
}
.response-hash {
  color: var(--ui-text-highlighted);
}
.response-status,
.response-number {
  color: var(--ui-primary);
}
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
