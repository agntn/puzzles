<script setup lang="ts">
import { COLLECTIONS } from "../../utils/puzzles";
import { clip, shorten, verdictLabel } from "../../utils/format";
import { FACTS_STATIC, WALK } from "../../utils/landing";
import type { LandingSample } from "../../utils/samples";

const props = defineProps<{ sample: LandingSample; loaded: readonly string[] }>();

/** The dial: one position per collection, clockwise from the top, in manifest order. */
const C = 200;
const STEP = 360 / Math.max(COLLECTIONS.length, 1);

/**
 * A point on the dial.
 *
 * @param {number} radius - Distance from the center in SVG units.
 * @param {number} degrees - Clockwise from the top.
 * @returns {[number, number]} The x and y coordinates.
 */
function polar(radius: number, degrees: number): [number, number] {
  const rad = (degrees * Math.PI) / 180;
  return [C + radius * Math.sin(rad), C - radius * Math.cos(rad)];
}

/**
 * An arc along one ring.
 *
 * @param {number} radius - The ring.
 * @param {number} center - The arc's middle, clockwise from the top.
 * @param {number} span - Angular width in degrees.
 * @returns {string} The path data.
 */
function arc(radius: number, center: number, span: number): string {
  const [ax, ay] = polar(radius, center - span / 2);
  const [bx, by] = polar(radius, center + span / 2);
  return `M ${ax} ${ay} A ${radius} ${radius} 0 0 1 ${bx} ${by}`;
}

/**
 * The wedge: an annular sector centered on the top, rotated into place by its group.
 *
 * @param {number} inner - Inner radius.
 * @param {number} outer - Outer radius.
 * @param {number} span - Angular width in degrees.
 * @returns {string} The path data.
 */
function sector(inner: number, outer: number, span: number): string {
  const [ax, ay] = polar(outer, -span / 2);
  const [bx, by] = polar(outer, span / 2);
  const [cx, cy] = polar(inner, span / 2);
  const [dx, dy] = polar(inner, -span / 2);
  return `M ${ax} ${ay} A ${outer} ${outer} 0 0 1 ${bx} ${by} L ${cx} ${cy} A ${inner} ${inner} 0 0 0 ${dx} ${dy} Z`;
}

const RING = 164;
const WEDGE = sector(96, RING - 10, STEP);
const BEZEL = arc(RING + 14, 0, STEP);

/** A notch per position inside the ring and a longer one every six, like the graduation of a safe dial. */
const NOTCHES = COLLECTIONS.map((_, index) => {
  const long = index % 6 === 0;
  const [x1, y1] = polar(RING - 14, index * STEP);
  const [x2, y2] = polar(RING - (long ? 26 : 19), index * STEP);
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}).join(" ");

/**
 * One position on the ring: the collection's closed share hatched, the share still open as an accent
 * arc at the clockwise end, the way the share bar above marks them.
 */
const positions = COLLECTIONS.map((entry, index) => {
  const facts = FACTS_STATIC.find((row) => row.key === entry.key);
  const total = facts?.total ?? 0;
  const unsolved = facts?.statuses.unsolved ?? 0;
  const span = STEP - 3;
  const start = index * STEP - span / 2;
  const split = start + span * (total === 0 ? 1 : 1 - unsolved / total);
  const piece = (from: number, to: number) =>
    to - from < 0.01 ? "" : arc(RING, (from + to) / 2, to - from);
  return { key: entry.key, closed: piece(start, split), open: piece(split, start + span) };
});

const activeIndex = computed(() =>
  Math.max(
    0,
    COLLECTIONS.findIndex((entry) => entry.key === props.sample.collection),
  ),
);

/** The wedge turns the short way round, so the step from the last position to the first is one, not a lap. */
const angle = ref(activeIndex.value * STEP);
watch(activeIndex, (index) => {
  const target = index * STEP;
  const delta = ((((target - angle.value) % 360) + 540) % 360) - 180;
  angle.value += delta;
});

/**
 * A record's timestamp as milliseconds; the dataset writes UTC without the zone.
 *
 * @param {string} date - `YYYY-MM-DD HH:MM:SS` as the record prints it.
 * @returns {number} Milliseconds since the epoch.
 */
function time(date: string): number {
  return Date.parse(`${date.replace(" ", "T")}Z`);
}

/**
 * The time axis every sample shares: from the year of the first puzzle in the dataset to the year after
 * the last one started. Read off the static facts, so the prerender and the browser draw the same axis.
 */
const FIRST_YEAR = new Date(
  Math.min(...FACTS_STATIC.map((row) => time(row.firstStarted))),
).getUTCFullYear();
const LAST_YEAR =
  new Date(Math.max(...FACTS_STATIC.map((row) => time(row.lastStarted)))).getUTCFullYear() + 1;
const T0 = Date.UTC(FIRST_YEAR, 0, 1);
const T1 = Date.UTC(LAST_YEAR, 0, 1);
const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, index) => ({
  year: FIRST_YEAR + index,
  at: (Date.UTC(FIRST_YEAR + index, 0, 1) - T0) / (T1 - T0),
}));
const at = (date: string) => Math.min(1, Math.max(0, (time(date) - T0) / (T1 - T0)));

/** The walk's collection is in flight until its module lands in `loaded`; the cursor loops only then. */
const busy = computed(() => !props.loaded.includes(props.sample.collection));

/** Position of the sample on the walk, the instrument's file number. */
const position = computed(() => WALK.indexOf(props.sample.id) + 1);

/** The part of the id after the collection key; a singleton has none. */
const name = computed(() =>
  props.sample.id.startsWith(`${props.sample.collection}/`)
    ? props.sample.id.slice(props.sample.collection.length + 1)
    : props.sample.id,
);

/** The prize as the record prints it, the currency split off so the amount can lead. */
const prize = computed(() => {
  const match = /^(\S+) (\S+)$/.exec(props.sample.prize);
  return match ? { amount: match[1], unit: match[2] } : { amount: props.sample.prize, unit: "" };
});

const verified = computed(() => props.sample.verdict === "verified");
const unavailable = computed(() => props.sample.verdict === "unavailable");

/** The lock in the hub: shut while the prize waits, open once someone found the key, a timer when it ran out. */
const LOCKS: Readonly<Record<string, { icon: string; word: string }>> = {
  unsolved: { icon: "i-lucide-lock-keyhole", word: "locked" },
  solved: { icon: "i-lucide-lock-keyhole-open", word: "solved" },
  claimed: { icon: "i-lucide-lock-keyhole-open", word: "claimed" },
  swept: { icon: "i-lucide-lock-keyhole-open", word: "swept" },
  expired: { icon: "i-lucide-timer-off", word: "expired" },
};
const lock = computed(() => LOCKS[props.sample.status] ?? LOCKS.unsolved!);
const locked = computed(() => props.sample.status === "unsolved");

/** What a solver holds: the search range of a numbered puzzle, otherwise the key material published so far. */
const SECRET_TEXT: Readonly<Record<string, string>> = {
  hex: "raw key published",
  wif: "WIF key published",
  encrypted: "BIP38, sealed",
  seed: "seed phrase published",
  mini: "mini key published",
  none: "not published",
};
const key = computed(() => {
  const { bits, secret } = props.sample;
  if (bits !== undefined) return `2^${bits - 1} … 2^${bits} − 1`;
  return SECRET_TEXT[secret] ?? secret;
});

/** One sentence on the puzzle, in words a visitor reads before the values. */
const about = computed(() => {
  const { chain, kind, bits, secret } = props.sample;
  const where = `A ${chain[0]!.toUpperCase()}${chain.slice(1)} ${kind.toUpperCase()} address.`;
  if (bits !== undefined) return `${where} The private key is a ${bits}-bit number.`;
  if (secret === "none") return `${where} No private key has been published.`;
  if (secret === "encrypted") return `${where} Its key is published, sealed with BIP38.`;
  return `${where} Its private key has been published.`;
});

/** The record on the time axis: from the day it went on chain to the day it opened, or to the axis' end. */
const span = computed(() => {
  const { startedAt, solvedAt } = props.sample;
  const from = at(startedAt);
  const to = solvedAt === undefined ? 1 : at(solvedAt);
  return { from, width: Math.max(to - from, 0.004), open: solvedAt === undefined };
});
const heldText = computed(() => {
  if (locked.value) return `locked since ${props.sample.startedAt.slice(0, 10)}`;
  return props.sample.solveTime === undefined ? lock.value.word : `held ${props.sample.solveTime}`;
});

const dialLabel = computed(
  () =>
    `A combination lock of ${COLLECTIONS.length} collections, set to ${props.sample.collection}. ` +
    `${props.sample.id} is ${lock.value.word}. The ring shows each collection's open and closed puzzles.`,
);
</script>

<template>
  <div class="tool-console console-wide landing-lock">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="console-bar">
      <span class="console-title lock-call"
        ><span class="console-tag">Call</span>await get("{{ sample.id }}")<span class="console-file"
          >{{ String(position).padStart(2, "0") }} / {{ WALK.length }}</span
        ></span
      >
      <span class="console-meta">{{ sample.chain }} · {{ sample.kind }}</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true">
      <span
        :key="`${sample.id}-${busy}`"
        class="console-cursor"
        :class="{ 'console-cursor-busy': busy }"
      />
    </div>

    <!-- The subject: the lock on the left, the record it guards on the right. -->
    <div class="console-band console-subject-band lock-subject">
      <div :key="`scan-${sample.id}`" class="console-scan" aria-hidden="true" />
      <div class="lock-face">
        <svg viewBox="0 0 400 400" role="img" :aria-label="dialLabel">
          <path class="dial-frame" d="M36 4H4V36M364 4H396V36M396 364V396H364M36 396H4V364" />
          <path class="dial-notches" :d="NOTCHES" />
          <g class="dial-sweep" :style="{ transform: `rotate(${angle}deg)` }">
            <path class="dial-wedge" :d="WEDGE" />
            <path class="dial-bezel" :d="BEZEL" />
            <path class="dial-pointer" d="M194 8L206 8L200 16Z" />
          </g>
          <g
            v-for="(row, index) in positions"
            :key="row.key"
            class="dial-position"
            :data-active="index === activeIndex"
          >
            <path v-if="row.closed" class="dial-closed" :d="row.closed" />
            <path v-if="row.open" class="dial-open" :d="row.open" />
          </g>
          <circle class="dial-hub-ring" :cx="C" :cy="C" r="96" />
          <path
            :key="`arcs-${sample.id}`"
            class="dial-lock"
            d="M200 112A88 88 0 0 1 288 200M200 288A88 88 0 0 1 112 200"
          />
        </svg>
        <div :key="`hub-${sample.id}`" class="dial-hub" :data-locked="locked" aria-hidden="true">
          <UIcon :name="lock.icon" class="dial-hub-icon" />
          <span class="dial-hub-word">{{ lock.word }}</span>
          <span class="dial-hub-key">{{ clip(sample.collection, 14) }}</span>
        </div>
      </div>

      <div class="lock-identity">
        <span class="console-label"
          >Puzzle / <span class="console-label-key">{{ sample.collection }}</span></span
        >
        <h3 class="lock-id">
          <span class="lock-collection">{{ sample.collection }}</span
          ><template v-if="name !== sample.id">/{{ name }}</template>
        </h3>
        <p class="lock-about">{{ about }}</p>

        <dl class="lock-facts">
          <div>
            <dt>Prize</dt>
            <dd class="lock-prize" :class="{ 'lock-accent': locked }">
              {{ prize.amount }}<span v-if="prize.unit">{{ prize.unit }}</span>
            </dd>
          </div>
          <div>
            <dt>Key</dt>
            <dd :class="{ 'lock-accent': sample.bits !== undefined }">{{ key }}</dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              <UTooltip :text="sample.address"
                ><span tabindex="0" class="lock-short">{{
                  shorten(sample.address, 8, 6)
                }}</span></UTooltip
              >
            </dd>
          </div>
          <div>
            <dt>Verify</dt>
            <dd :class="{ 'lock-accent': verified, 'lock-failed': sample.verdict === 'failed' }">
              {{ verdictLabel(verified, unavailable) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- The time the lock held: every sample on one axis, from the first puzzle to the last. -->
    <div class="console-band lock-time">
      <p class="console-label console-rule-title">
        <span
          >On chain
          <span aria-hidden="true">[ {{ FIRST_YEAR }} to {{ LAST_YEAR - 1 }} ]</span></span
        >
        <span class="console-mark" aria-hidden="true" />
      </p>
      <div
        class="lock-axis"
        role="img"
        :aria-label="`${sample.id}: on chain from ${sample.startedAt.slice(0, 10)}${
          sample.solvedAt ? ` to ${sample.solvedAt.slice(0, 10)}` : ', still locked'
        }`"
      >
        <span
          v-for="tick in YEARS"
          :key="tick.year"
          class="lock-year"
          :style="{ left: `${tick.at * 100}%` }"
          aria-hidden="true"
          ><span v-if="tick.year < LAST_YEAR">{{ tick.year }}</span></span
        >
        <span
          :key="`span-${sample.id}`"
          class="lock-span"
          :data-open="span.open"
          :style="{ left: `${span.from * 100}%`, width: `${span.width * 100}%` }"
          aria-hidden="true"
        >
          <span class="lock-span-read" :data-right="span.from > 0.6">{{ heldText }}</span>
        </span>
      </div>
    </div>

    <footer class="console-footer console-footer-plain">
      <span>Local dataset / no network</span>
      <NuxtLink :to="`/collections/${sample.id}`" class="lock-link"
        ><span aria-hidden="true">→ </span>{{ sample.id }}</NuxtLink
      >
    </footer>
  </div>
</template>

<style scoped>
.landing-lock {
  text-align: left;
}
.lock-call {
  min-width: 0;
  overflow-wrap: anywhere;
}
/* The subject band: the lock where the dossiers put their reticle, the record beside it. */
.lock-subject {
  grid-template-columns: 17rem minmax(0, 1fr);
  gap: 20px 40px;
  align-items: center;
  padding: 24px 28px;
}
.lock-face {
  position: relative;
  width: 100%;
}
.lock-face svg {
  display: block;
  width: 100%;
  height: auto;
}
.dial-frame {
  fill: none;
  stroke: var(--console-corner);
  opacity: 0.5;
}
.dial-notches {
  stroke: var(--console-corner);
  opacity: 0.55;
}
.dial-sweep {
  transform-origin: 200px 200px;
  transition: transform 700ms cubic-bezier(0.34, 1.35, 0.5, 1);
}
.dial-wedge {
  fill: color-mix(in srgb, var(--ui-primary) 9%, transparent);
}
.dial-bezel {
  fill: none;
  stroke: var(--console-accent);
  stroke-width: 2.5;
}
.dial-pointer {
  fill: var(--console-accent);
}
/* The bounty ring: every collection's closed share hatched, what is still unclaimed in the accent. */
.dial-closed {
  fill: none;
  stroke: var(--console-corner);
  stroke-width: 9;
  stroke-dasharray: 1 2.5;
  opacity: 0.6;
}
.dial-open {
  fill: none;
  stroke: var(--console-accent);
  stroke-width: 9;
  opacity: 0.4;
  transition: opacity 0.4s ease;
}
.dial-position[data-active="true"] .dial-open {
  opacity: 1;
}
.dial-hub-ring {
  fill: none;
  stroke: var(--console-line);
}
.dial-lock {
  fill: none;
  stroke: var(--console-accent);
  opacity: 0.6;
  transform-origin: 200px 200px;
  animation: console-lock 800ms ease-out;
}
.dial-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  justify-items: center;
  gap: 4px;
  width: 42%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}
.dial-hub-icon {
  width: 26px;
  height: 26px;
  color: var(--ui-text-muted);
}
.dial-hub-word {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ui-text-highlighted);
}
.dial-hub-key {
  font-size: 11px;
  color: var(--ui-text-dimmed);
  white-space: nowrap;
}
.dial-hub[data-locked="true"] .dial-hub-icon,
.dial-hub[data-locked="true"] .dial-hub-word {
  color: var(--console-accent);
}

.lock-identity {
  min-width: 0;
}
.lock-id {
  margin: 6px 0 8px;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.2;
  color: var(--console-accent);
  overflow-wrap: anywhere;
}
.lock-collection {
  color: var(--ui-text-highlighted);
}
/* The instrument's prose: Figtree at the page's reading size, the way the dossiers write their about line. */
.lock-about {
  max-width: 34rem;
  margin: 0;
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.6;
  color: var(--ui-text-muted);
}
/* Four readouts in one row, the hero's metric face at a smaller size: label, then the value. */
.lock-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 22px 0 0;
  font-variant-numeric: tabular-nums;
}
.lock-facts > div {
  min-width: 0;
  padding: 2px 24px 4px;
}
.lock-facts > div:first-child {
  padding-left: 0;
}
.lock-facts > div + div {
  box-shadow: inset 1px 0 0 var(--console-line);
}
.lock-facts dt {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
.lock-facts dd {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.3;
  color: var(--ui-text-highlighted);
  white-space: nowrap;
}
.lock-facts dd.lock-prize {
  margin-top: 4px;
  font-size: 22px;
  line-height: 1.1;
}
.lock-prize > span {
  margin-left: 0.35em;
  font-size: 12px;
  color: var(--ui-text-dimmed);
}

/* The time band: one axis of years, the record's span on it, hatched once it opened, accent while it holds. */
.lock-time {
  padding: 14px 28px 20px;
}
.lock-time > .console-rule-title {
  margin: 0 0 12px;
}
.lock-axis {
  position: relative;
  height: 44px;
  margin: 30px 0 22px;
  border-bottom: 1px solid var(--console-line);
}
.lock-year {
  position: absolute;
  bottom: -1px;
  width: 1px;
  height: 7px;
  background: var(--console-corner);
}
.lock-year > span {
  position: absolute;
  top: 12px;
  left: 4px;
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--ui-text-dimmed);
  white-space: nowrap;
}
.lock-span {
  position: absolute;
  bottom: 8px;
  height: 12px;
  min-width: 3px;
  background: repeating-linear-gradient(135deg, var(--console-corner) 0 1px, transparent 1px 4px);
  box-shadow: inset 0 0 0 1px var(--console-corner);
  transform-origin: left;
  animation: lock-grow 700ms ease-out both;
}
.lock-span[data-open="true"] {
  background: color-mix(in srgb, var(--ui-primary) 12%, transparent);
  box-shadow: inset 0 0 0 1px var(--console-accent);
}
/* Nodes at both ends: hollow where it went on chain, filled where it opened, so a short solve still shows. */
.lock-span::before,
.lock-span::after {
  content: "";
  position: absolute;
  top: 2px;
  width: 7px;
  height: 7px;
  background: var(--ui-bg);
  box-shadow: inset 0 0 0 1px var(--ui-text-muted);
}
.lock-span::before {
  left: -4px;
}
.lock-span::after {
  right: -4px;
  background: var(--ui-text-highlighted);
  box-shadow: none;
}
.lock-span[data-open="true"]::before {
  box-shadow: inset 0 0 0 1px var(--console-accent);
}
.lock-span[data-open="true"]::after {
  display: none;
}
.lock-span-read {
  position: absolute;
  bottom: 20px;
  left: 0;
  font-size: 12px;
  color: var(--ui-text-highlighted);
  white-space: nowrap;
}
.lock-span-read[data-right="true"] {
  right: 0;
  left: auto;
}
.lock-span[data-open="true"] .lock-span-read {
  color: var(--console-accent);
}
@keyframes lock-grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.lock-accent {
  color: var(--console-accent) !important;
}
.lock-failed {
  color: var(--puzzles-del) !important;
}
.lock-short {
  white-space: nowrap;
}
.lock-short:focus-visible,
.lock-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 2px;
}
.lock-link {
  margin-left: auto;
  color: var(--ui-text-highlighted);
  text-transform: none;
  letter-spacing: 0.04em;
}
.lock-link:hover {
  color: var(--console-accent);
}
@media (width < 72rem) {
  .lock-subject {
    grid-template-columns: 14rem minmax(0, 1fr);
    gap: 20px 28px;
  }
  .lock-facts {
    grid-template-columns: repeat(2, minmax(0, auto));
    row-gap: 14px;
  }
  .lock-facts > div:nth-child(3) {
    padding-left: 0;
    box-shadow: none;
  }
  .lock-year:nth-child(even) > span {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .dial-sweep,
  .dial-open {
    transition: none;
  }
  .dial-lock,
  .lock-span {
    animation: none;
  }
}
</style>
