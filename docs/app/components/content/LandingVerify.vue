<script setup lang="ts">
import type { LandingSample } from "../../utils/samples";
import { shorten, verdictIcon, verdictLabel } from "../../utils/format";

const props = defineProps<{ sample: LandingSample }>();

interface Row {
  readonly key: string;
  readonly call: string;
  readonly value: string;
  readonly note: string;
  readonly state: "ok" | "dim" | "failed";
}

const SECRET_TEXT: Readonly<Record<string, string>> = {
  hex: "a raw private key, verification derives the address from it",
  wif: "a Wallet Import Format key, decoded to the raw key first",
  encrypted: "a BIP38 payload, sealed until someone types the passphrase",
  seed: "a BIP39 phrase, derived along its path",
  mini: "a mini private key, not verified yet",
  none: "no private key representation, so nothing to derive",
};

function secretRow(sample: LandingSample): Row {
  const none = sample.secret === "none";
  return {
    key: "secret",
    call: "secretOf(puzzle.keyData())",
    value: none ? "undefined" : `{ kind: "${sample.secret}" }`,
    note: SECRET_TEXT[sample.secret] ?? sample.secret,
    state: none ? "dim" : "ok",
  };
}

function pubkeyRow(sample: LandingSample): Row {
  const known = sample.pubkey !== undefined;
  return {
    key: "pubkey",
    call: "puzzle.hasPubkey()",
    value: known ? "true" : "false",
    note: known
      ? `${sample.pubkeyFormat ?? ""} ${shorten(sample.pubkey ?? "", 14, 10)}`
      : "the address has never spent, so its public key is still hidden",
    state: known ? "ok" : "dim",
  };
}

/** The verdict row per outcome: the value the library returns and what it means here. */
const VERDICTS: Readonly<
  Record<LandingSample["verdict"], (sample: LandingSample) => Pick<Row, "value" | "note" | "state">>
> = {
  verified: (sample) => ({
    value: "{ verified: true }",
    note: `derivedAddress ${shorten(sample.detail, 10, 8)} equals the stored one`,
    state: "ok",
  }),
  unavailable: (sample) => ({
    value: "{ verified: false, unavailable }",
    note: `${sample.detail}. An answer, not an exception`,
    state: "dim",
  }),
  failed: (sample) => ({
    value: "{ verified: false, error }",
    note: sample.detail,
    state: "failed",
  }),
};

function verifyRow(sample: LandingSample): Row {
  return { key: "verify", call: "await verify(puzzle)", ...VERDICTS[sample.verdict](sample) };
}

const rows = computed(() => [
  secretRow(props.sample),
  pubkeyRow(props.sample),
  verifyRow(props.sample),
]);
const verified = computed(() => props.sample.verdict === "verified");
const unavailable = computed(() => props.sample.verdict === "unavailable");
const scan = ref(0);

watch(
  () => props.sample.id,
  () => {
    scan.value += 1;
  },
);
</script>

<template>
  <div class="tool-console landing-verify">
    <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
    <span class="console-cross console-cross-br" aria-hidden="true">+</span>
    <header class="console-bar">
      <!-- prettier-ignore -->
      <span class="console-title"><span class="console-tag">Call</span>verify(<span class="tok-str">{{ JSON.stringify(sample.id) }}</span>)</span>
      <span class="console-meta">secp256k1 · in your browser</span>
      <span class="console-mark" aria-hidden="true" />
    </header>
    <div class="console-ruler" aria-hidden="true">
      <span :key="sample.id" class="console-cursor" />
    </div>

    <!-- The verdict on the crosses grid, then the three calls behind it, each with what it returned. -->
    <div class="verify-subject">
      <div v-if="scan > 0" :key="scan" class="console-scan" aria-hidden="true" />
      <div class="verify-identity">
        <ConsoleReticle :key="sample.id" :icon="verdictIcon(verified, unavailable)" />
        <div class="verify-name">
          <span class="console-label"
            >Verdict / <span class="console-label-key">{{ sample.collection }}</span></span
          >
          <h3 :class="{ 'verify-ok': verified, 'verify-failed': sample.verdict === 'failed' }">
            {{ verdictLabel(verified, unavailable) }}
          </h3>
          <span class="verify-aliases">{{ sample.chain }} / {{ sample.kind }}</span>
        </div>
      </div>
      <ol :key="sample.id" class="console-readout console-animate verify-steps">
        <li
          v-for="(row, index) in rows"
          :key="row.key"
          :style="{ animationDelay: `${index * 45}ms` }"
        >
          <code class="tok-fn verify-call">{{ row.call }}</code>
          <span class="verify-value" :data-state="row.state">{{ row.value }}</span>
          <p class="verify-note">{{ row.note }}</p>
        </li>
      </ol>
    </div>

    <footer class="console-footer console-footer-plain">
      <span>Local dataset / no network</span>
      <NuxtLink
        :to="`/playground?op=verify&id=${encodeURIComponent(sample.id)}`"
        class="verify-link"
        ><span aria-hidden="true">→ </span>run it in the playground</NuxtLink
      >
    </footer>
  </div>
</template>

<style scoped>
/* The subject band: crosses behind it, the verdict with its shield, the three calls in one readout under it. */
.verify-subject {
  position: relative;
  display: grid;
  gap: 16px;
  padding: 18px 20px 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M16 18h4m-2-2v4' fill='none' stroke='%23818a94' stroke-opacity='.1'/%3E%3C/svg%3E");
  background-size: 36px 36px;
  background-position: 24px 20px;
}
.verify-subject > :not(.console-scan) {
  position: relative;
}
.verify-identity {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}
.verify-name {
  min-width: 0;
}
.verify-name h3 {
  margin: 4px 0 6px;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.25;
  color: var(--ui-text-highlighted);
}
.verify-name h3.verify-ok {
  color: var(--console-accent);
}
.verify-name h3.verify-failed {
  color: var(--puzzles-del);
}
.verify-aliases {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ui-text-muted);
}
/* One row per call: the call, then the value it returned with a marker, one line on what it means under both. */
.verify-steps {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
  container-type: inline-size;
}
.verify-steps > li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 2px 16px;
  padding: 9px 12px;
}
.verify-steps > li + li {
  border-top: 1px solid var(--console-line);
}
.verify-call {
  min-width: 0;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.verify-value {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--ui-text-muted);
}
.verify-value::before {
  content: "";
  flex: none;
  width: 7px;
  height: 7px;
  box-shadow: inset 0 0 0 1px var(--console-corner);
}
.verify-value[data-state="ok"] {
  color: var(--ui-text-highlighted);
}
.verify-value[data-state="ok"]::before {
  background: var(--console-accent);
  box-shadow: none;
}
.verify-value[data-state="failed"] {
  color: var(--puzzles-del);
}
.verify-value[data-state="failed"]::before {
  box-shadow: inset 0 0 0 1px var(--puzzles-del);
}
.verify-note {
  grid-column: 1 / -1;
  margin: 0;
  font-family: var(--font-sans);
  font-size: 12px;
  line-height: 1.5;
  color: var(--ui-text-dimmed);
}
.verify-link {
  margin-left: auto;
  color: var(--ui-text-highlighted);
}
.verify-link:hover {
  color: var(--console-accent);
}
.verify-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
@media (width < 400px) {
  .verify-subject {
    padding-inline: 14px;
  }
  .verify-identity {
    grid-template-columns: 64px minmax(0, 1fr);
    gap: 12px;
  }
}
/* Too narrow for the longest call and value side by side: every value goes under its call, never just one. */
@container (width < 30rem) {
  .verify-steps > li {
    grid-template-columns: minmax(0, 1fr);
  }
  .verify-value {
    white-space: normal;
  }
}
</style>
