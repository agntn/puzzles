<script setup lang="ts">
import { COLLECTIONS } from "../../utils/puzzles";
import { collectionWindow } from "../../utils/flow";
import { clip, shorten, verdictLabel } from "../../utils/format";
import type { LandingSample } from "../../utils/samples";

const props = defineProps<{ sample: LandingSample; tick: number; loaded: readonly string[] }>();

const W = 1200;
const H = 400;
const CALL = { x: 24, y: 120, w: 340, h: 160 };
const NODE = { x: 510, w: 200, h: 30, gap: 7 };
const RESULT = { x: 870, y: 20, w: 306, h: 360 };

const visible = computed(() =>
  collectionWindow(
    COLLECTIONS.map((entry) => entry.key),
    props.sample.collection,
  ),
);

const nodes = computed(() => {
  const keys = visible.value.keys;
  const top = (H - (keys.length * NODE.h + Math.max(0, keys.length - 1) * NODE.gap)) / 2;
  return keys.map((key, index) => ({
    key,
    label: key,
    y: top + index * (NODE.h + NODE.gap),
    active: key === props.sample.collection,
    loaded: props.loaded.includes(key),
  }));
});

function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

const trunkPaths = computed(() =>
  nodes.value.map((node) => ({
    d: curvePath(CALL.x + CALL.w, CALL.y + CALL.h / 2, NODE.x, node.y + NODE.h / 2),
    active: node.active,
  })),
);

const branchPaths = computed(() =>
  nodes.value.map((node) => ({
    d: curvePath(NODE.x + NODE.w, node.y + NODE.h / 2, RESULT.x, RESULT.y + RESULT.h / 2),
    active: node.active,
  })),
);

/** Rows of the puzzle card: short values share a line, the address and the range get their own. */
const rows = computed(() => {
  const sample = props.sample;
  const keyRow =
    sample.range === undefined
      ? {
          label: "public key",
          value: sample.pubkey === undefined ? "unknown" : shorten(sample.pubkey, 14, 8),
        }
      : { label: "key range", value: `2^${(sample.bits ?? 1) - 1} to 2^${sample.bits ?? 1} - 1` };
  return [
    [
      { label: "chain", value: sample.chain },
      { label: "status", value: sample.status },
    ],
    [
      { label: "prize", value: clip(sample.prize, 16) },
      { label: "key", value: sample.secret },
    ],
    [{ label: "address", value: shorten(sample.address, 18, 10) }],
    [keyRow],
  ];
});

const verdict = computed(() =>
  verdictLabel(props.sample.verdict === "verified", props.sample.verdict === "unavailable"),
);

/**
 * Fira Code advances 0.6 em per glyph; budget 0.62 em to leave room inside the box.
 *
 * @param {string} text - The text to fit.
 * @param {number} width - Available width in SVG units.
 * @param {number} max - The largest font size to use.
 * @returns {number} The font size in SVG units.
 */
function fit(text: string, width: number, max: number): number {
  return Math.min(max, Math.floor(width / (Math.max(text.length, 1) * 0.62)));
}
const inputSize = computed(() => fit(props.sample.id, CALL.w - 36, 22));
</script>

<template>
  <svg
    :viewBox="`0 0 ${W} ${H}`"
    class="puzzles-flow"
    role="img"
    aria-label="One identifier goes to the manifest, loads its collection module and comes back as a puzzle record"
  >
    <g class="puzzles-flow-wires">
      <path
        v-for="(path, index) in trunkPaths"
        :key="`t${index}`"
        :d="path.d"
        :class="{ 'puzzles-flow-wire-dim': !path.active }"
      />
      <path
        v-for="(path, index) in branchPaths"
        :key="`b${index}`"
        :d="path.d"
        :class="{ 'puzzles-flow-wire-dim': !path.active }"
      />
    </g>
    <g :key="tick" class="puzzles-flow-pulses">
      <template v-for="(path, index) in trunkPaths" :key="`pt${index}`">
        <path v-if="path.active" :d="path.d" class="puzzles-flow-pulse" />
      </template>
      <template v-for="(path, index) in branchPaths" :key="`pb${index}`">
        <path v-if="path.active" :d="path.d" class="puzzles-flow-pulse puzzles-flow-pulse-late" />
      </template>
    </g>

    <g class="puzzles-flow-node">
      <rect :x="CALL.x" :y="CALL.y" :width="CALL.w" :height="CALL.h" rx="10" />
      <text :x="CALL.x + 18" :y="CALL.y + 30" class="puzzles-flow-label">await get(id)</text>
      <text
        :x="CALL.x + 18"
        :y="CALL.y + 74"
        class="puzzles-flow-domain puzzles-flow-accent"
        :style="{ fontSize: `${inputSize}px` }"
      >
        <tspan :key="sample.id" class="puzzles-derive">{{ sample.id }}</tspan>
      </text>
      <text :x="CALL.x + 18" :y="CALL.y + 106" class="puzzles-flow-mono">
        collectionKeys() // {{ COLLECTIONS.length }} keys, no records
      </text>
      <text :x="CALL.x + 18" :y="CALL.y + 132" class="puzzles-flow-label">
        {{ loaded.length }} of {{ COLLECTIONS.length }} modules loaded by this page
      </text>
    </g>

    <text :x="NODE.x + NODE.w / 2" y="48" text-anchor="middle" class="puzzles-flow-label">
      {{ visible.start + 1 }} to {{ visible.start + nodes.length }} of {{ COLLECTIONS.length }}
    </text>
    <text
      v-if="nodes.length < COLLECTIONS.length"
      :x="NODE.x + NODE.w / 2"
      y="365"
      text-anchor="middle"
      class="puzzles-flow-label"
    >
      + {{ COLLECTIONS.length - nodes.length }} other collections
    </text>

    <g
      v-for="node in nodes"
      :key="node.key"
      class="puzzles-flow-node"
      :class="{ 'puzzles-flow-dim': !node.active && !node.loaded }"
    >
      <rect :x="NODE.x" :y="node.y" :width="NODE.w" :height="NODE.h" rx="7" />
      <text :x="NODE.x + 14" :y="node.y + 20" class="puzzles-flow-small">{{ node.label }}</text>
      <text :x="NODE.x + NODE.w - 14" :y="node.y + 20" text-anchor="end" class="puzzles-flow-label">
        {{ node.active ? "loading" : node.loaded ? "loaded" : "" }}
      </text>
    </g>

    <g class="puzzles-flow-node">
      <rect :x="RESULT.x" :y="RESULT.y" :width="RESULT.w" :height="RESULT.h" rx="10" />
      <text :x="RESULT.x + 18" :y="RESULT.y + 28" class="puzzles-flow-label">Puzzle</text>
      <text
        :x="RESULT.x + RESULT.w - 18"
        :y="RESULT.y + 28"
        text-anchor="end"
        class="puzzles-flow-mono"
      >
        {{ clip(sample.collection, 22) }}
      </text>
      <line
        :x1="RESULT.x + 1"
        :x2="RESULT.x + RESULT.w - 1"
        :y1="RESULT.y + 44"
        :y2="RESULT.y + 44"
        class="puzzles-flow-rule"
      />
      <text :x="RESULT.x + 18" :y="RESULT.y + 68" class="puzzles-flow-label">verifyPuzzle</text>
      <text :x="RESULT.x + 18" :y="RESULT.y + 96" class="puzzles-flow-domain puzzles-flow-accent">
        <tspan :key="sample.id" class="puzzles-derive">{{ verdict }}</tspan>
      </text>
      <template v-for="(row, rowIndex) in rows" :key="`${sample.id}-${rowIndex}`">
        <g v-for="(field, column) in row" :key="field.label" class="puzzles-derive">
          <text
            :x="RESULT.x + 18 + column * 140"
            :y="RESULT.y + 136 + rowIndex * 56"
            class="puzzles-flow-label"
          >
            {{ field.label }}
          </text>
          <text
            :x="RESULT.x + 18 + column * 140"
            :y="RESULT.y + 156 + rowIndex * 56"
            class="puzzles-flow-small"
          >
            {{ field.value }}
          </text>
        </g>
      </template>
    </g>
  </svg>
</template>
