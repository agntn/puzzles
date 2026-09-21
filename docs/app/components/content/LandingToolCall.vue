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
.tool-console {
  --console-line: color-mix(in srgb, var(--ui-border) 75%, transparent);
  --console-corner: color-mix(in srgb, var(--ui-text-muted) 55%, var(--ui-bg));
  --console-accent: color-mix(in srgb, var(--ui-primary) 65%, var(--ui-text-highlighted));
  position: relative;
  width: 100%;
  max-width: 35rem;
  margin-inline: auto;
  padding: 1px;
  isolation: isolate;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 12px;
}
.tool-console::before,
.tool-console::after {
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
.tool-console::before {
  inset: 0;
  z-index: -2;
  background: var(--console-line);
}
.tool-console::after {
  inset: 1px;
  z-index: -1;
  background: var(--ui-bg);
}
.console-bar,
.console-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 9px 20px;
  color: var(--ui-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}
.console-bar {
  align-items: center;
  padding: 12px 28px 12px 20px;
  border-bottom: 1px solid var(--console-line);
  background: color-mix(in srgb, var(--ui-text-muted) 5%, var(--ui-bg));
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%);
}
.console-title {
  color: var(--ui-text-highlighted);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}
.console-hosts {
  color: var(--ui-text-dimmed);
  text-transform: none;
  white-space: nowrap;
}
.console-request {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 7px 20px;
  border-bottom: 1px solid var(--console-line);
}
.console-request code {
  flex: 1;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.console-request > span:last-child {
  color: var(--ui-text-dimmed);
  font-size: 18px;
}
.console-label {
  color: var(--ui-text-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.console-result {
  position: relative;
  padding: 14px 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M16 18h4m-2-2v4' fill='none' stroke='%23818a94' stroke-opacity='.1'/%3E%3C/svg%3E");
  background-size: 36px 36px;
  background-position: 24px 20px;
}
.console-result > :not(.console-scan) {
  position: relative;
}
.console-scan {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}
.console-scan::after {
  content: "";
  position: absolute;
  inset: 0;
  border-bottom: 1px solid var(--console-corner);
  animation: console-scan 700ms ease-out both;
}
@keyframes console-scan {
  from {
    transform: translateY(-100%);
    opacity: 0.7;
  }
  to {
    transform: translateY(0);
    opacity: 0;
  }
}
.console-result-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.console-index {
  display: inline-block;
  margin-right: 10px;
  color: var(--ui-text-dimmed);
  font-size: 11px;
}
.console-subject {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  margin: 14px 0;
}
.console-identity {
  min-width: 0;
}
.console-identity h3 {
  font-family: var(--font-mono);
  color: var(--ui-text-highlighted);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
  overflow-wrap: anywhere;
  margin: 6px 0;
}
.console-identity > span {
  color: var(--ui-text-muted);
  text-transform: uppercase;
  font-size: 11px;
}
.console-metrics {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  margin: 0;
  border-block: 1px solid var(--console-line);
}
.console-metrics > div {
  padding: 9px 0;
  background: var(--ui-bg);
}
.console-metrics > div + div {
  border-left: 1px solid var(--console-line);
  padding-left: 20px;
}
.console-metrics dt {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ui-text-muted);
}
.console-metrics dd {
  margin: 7px 0 0;
  font-size: 18px;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.console-metrics > div:first-child dd {
  color: var(--console-accent);
}
.console-address {
  position: relative;
  margin: 12px 0 0;
  padding: 9px 12px;
  border-inline: 1px solid var(--console-line);
  background: var(--ui-bg);
}
.console-address::before,
.console-address::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 6px;
  border-color: var(--ui-primary);
  pointer-events: none;
}
.console-address::before {
  top: 0;
  left: -1px;
  border-top: 1px solid var(--console-corner);
  border-left: 1px solid var(--console-corner);
}
.console-address::after {
  bottom: 0;
  right: -1px;
  border-bottom: 1px solid var(--console-corner);
  border-right: 1px solid var(--console-corner);
}
.console-address dt {
  display: flex;
  justify-content: space-between;
}
.console-address dt > span {
  color: var(--ui-text-dimmed);
}
.console-address dd {
  margin: 7px 0 0;
  overflow-wrap: anywhere;
  line-height: 1.8;
  color: var(--ui-text-highlighted);
}
.console-key {
  display: grid;
  gap: 6px;
  color: var(--ui-text-muted);
  margin: 10px 0 0;
}
.console-key > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.console-key dd {
  margin: 0;
  text-align: right;
  font-size: 11px;
}
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
.console-footer {
  align-items: center;
  font-size: 11px;
  letter-spacing: 0.04em;
  padding-left: 20px;
  background: transparent;
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
.console-reticle {
  position: relative;
  aspect-ratio: 1;
  color: var(--ui-text-muted);
}
.console-reticle svg {
  display: block;
  width: 100%;
  stroke: currentColor;
  stroke-width: 1;
}
.reticle-frame {
  opacity: 0.5;
}
.reticle-sectors {
  stroke-width: 1;
  opacity: 0.45;
}
.reticle-ticks {
  stroke-dasharray: 1 7.55;
  stroke-width: 2;
  opacity: 0.3;
}
.reticle-lock {
  stroke: var(--console-accent);
  stroke-width: 1;
  opacity: 0.65;
  transform-origin: 60px 60px;
  animation: console-lock 800ms ease-out;
}
.reticle-axis {
  opacity: 0.7;
}
.reticle-diamond {
  stroke: var(--console-line);
}
.console-chain-icon {
  position: absolute;
  width: 26px;
  height: 26px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@keyframes console-lock {
  from {
    transform: rotate(-85deg);
  }
  to {
    transform: rotate(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .reticle-lock {
    animation: none;
  }
  .console-scan {
    display: none;
  }
}
@media (width < 640px) {
  .console-subject {
    grid-template-columns: 76px minmax(0, 1fr);
    gap: 14px;
  }
  .console-chain-icon {
    width: 24px;
    height: 24px;
  }
}
@media (width < 400px) {
  .console-subject {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
  }
  .console-result {
    padding: 12px 14px;
  }
  .console-request,
  .console-output {
    padding-inline: 14px;
  }
  .console-bar,
  .console-footer {
    padding-inline: 14px;
  }
  .console-metrics > div + div {
    padding-left: 12px;
  }
}
</style>
