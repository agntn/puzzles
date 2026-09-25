<script setup lang="ts">
import type { LandingSample } from "../../utils/samples";
import { CHAIN_ICONS } from "../../utils/puzzles";
import { shorten } from "../../utils/format";

const props = defineProps<{ sample: LandingSample }>();
const emit = defineEmits<{ previous: []; next: [] }>();

/** The call in the short form the playground's response bar uses; the id quoted as a string. */
const call = computed(() => `puzzles_show(${JSON.stringify(props.sample.id)})`);
/** The part of the id after the collection key; a singleton has none. */
const name = computed(() =>
  props.sample.id.startsWith(`${props.sample.collection}/`)
    ? props.sample.id.slice(props.sample.collection.length + 1)
    : props.sample.id,
);
const open = computed(() => props.sample.status === "unsolved");

const scan = ref(0);
watch(
  () => props.sample.id,
  () => {
    scan.value += 1;
  },
);
</script>

<template>
  <div class="tool-console landing-call">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="console-bar">
      <!-- prettier-ignore -->
      <span class="console-title call-title"
        ><span class="console-tag">Call</span
        ><UTooltip :text="call"
          ><span tabindex="0" class="call-text"
            >puzzles_show(<span class="tok-str">{{ JSON.stringify(sample.id) }}</span>)</span
          ></UTooltip
        ></span
      >
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true">
      <span :key="sample.id" class="console-cursor" />
    </div>

    <!-- What the host sends, then what the tool answers: the record on the crosses grid and its readout. -->
    <div class="call-subject">
      <div v-if="scan > 0" :key="scan" class="console-scan" aria-hidden="true" />
      <div class="call-identity">
        <ConsoleReticle :key="sample.id" :icon="CHAIN_ICONS[sample.chain] ?? 'i-lucide-link'" />
        <div class="call-name">
          <span class="console-label"
            >Puzzle / <span class="console-label-key">{{ sample.collection }}</span></span
          >
          <h3>{{ name }}</h3>
          <p class="call-aliases">
            <span>{{ sample.chain }} / {{ sample.kind }}</span>
            <StatusPill :status="sample.status" />
          </p>
        </div>
      </div>
      <div class="console-readout call-readout">
        <dl class="console-readout-rows">
          <div>
            <dt>Prize</dt>
            <dd :class="{ 'call-accent': open }">{{ sample.prize }}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              <UTooltip :text="sample.address"
                ><span tabindex="0" class="call-short">{{
                  shorten(sample.address, 10, 8)
                }}</span></UTooltip
              >
            </dd>
          </div>
          <div>
            <dt>Public key</dt>
            <dd :class="{ 'call-dim': !sample.pubkey }">
              {{ sample.pubkey ? "published" : "hidden, never spent" }}
            </dd>
          </div>
          <div>
            <dt>On chain</dt>
            <dd>
              {{ sample.transactions }} tx
              <span v-if="sample.startedAt" class="call-dim"
                >· since {{ sample.startedAt.slice(0, 10) }}</span
              >
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <ConsoleResponse :title="`puzzles_show · ${sample.id}`" :text="sample.tool" />

    <footer class="console-footer console-footer-plain">
      <span aria-label="Supported hosts: MCP, Pi and OMP, no network"
        >MCP · Pi · OMP / no network</span
      >
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
/* The call on one line; a long id ends in an ellipsis, the whole call is in the tooltip. */
.call-title {
  display: flex;
  align-items: center;
  min-width: 0;
  white-space: nowrap;
}
.call-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
.call-text:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
/* The subject band: crosses behind it, the reticle with the record's name, the readout under them. */
.call-subject {
  position: relative;
  display: grid;
  gap: 16px;
  padding: 18px 20px 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M16 18h4m-2-2v4' fill='none' stroke='%23818a94' stroke-opacity='.1'/%3E%3C/svg%3E");
  background-size: 36px 36px;
  background-position: 24px 20px;
}
.call-subject > :not(.console-scan) {
  position: relative;
}
.call-identity {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}
.call-name {
  min-width: 0;
}
.call-name h3 {
  margin: 4px 0 6px;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.25;
  color: var(--ui-text-highlighted);
  overflow-wrap: anywhere;
}
.call-aliases {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.call-readout {
  align-self: stretch;
}
.call-readout .console-readout-rows > div {
  grid-template-columns: 6.5rem minmax(0, 1fr);
  padding: 8px 12px;
}
.call-accent {
  color: var(--console-accent) !important;
}
.call-dim {
  color: var(--ui-text-dimmed) !important;
}
.call-short {
  white-space: nowrap;
}
.call-short:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
@media (width < 400px) {
  .call-short {
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .call-subject {
    padding-inline: 14px;
  }
  .call-identity {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
