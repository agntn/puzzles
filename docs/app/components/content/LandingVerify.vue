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
    value: `{ verified: true, derivedAddress: "${shorten(sample.detail, 10, 8)}" }`,
    note: "the derived address equals the stored one",
    state: "ok",
  }),
  unavailable: (sample) => ({
    value: "{ verified: false, unavailable: true }",
    note: `${sample.detail}. An answer, not an exception`,
    state: "dim",
  }),
  failed: (sample) => ({
    value: `{ verified: false, error: "${sample.detail}" }`,
    note: sample.detail,
    state: "failed",
  }),
};

function verifyRow(sample: LandingSample): Row {
  return { key: "verify", call: "await verifyPuzzle(puzzle)", ...VERDICTS[sample.verdict](sample) };
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
  <div class="tool-console">
    <header class="console-bar">
      <span class="console-title">verifyPuzzle</span>
      <span class="console-hosts">secp256k1 · in your browser</span>
    </header>

    <div class="console-request">
      <span class="console-label"><span class="console-index">01</span> Input / id</span>
      <code>{{ sample.id }}</code>
      <span aria-hidden="true">↳</span>
    </div>

    <div class="console-result">
      <div v-if="scan > 0" :key="scan" class="console-scan" aria-hidden="true" />
      <span class="console-label"><span class="console-index">02</span> Verdict</span>
      <div class="console-subject">
        <ConsoleReticle :key="sample.id" :icon="verdictIcon(verified, unavailable)" />
        <div class="console-identity">
          <span class="console-label">Collection / {{ sample.collection }}</span>
          <h3 :class="{ 'verify-ok': verified, 'verify-failed': sample.verdict === 'failed' }">
            {{ verdictLabel(verified, unavailable) }}
          </h3>
          <span>{{ sample.chain }} / {{ sample.kind }}</span>
        </div>
      </div>
      <span class="console-label"><span class="console-index">03</span> Derivation</span>
      <ol :key="sample.id" class="console-readout console-animate verify-steps">
        <li
          v-for="(row, index) in rows"
          :key="row.key"
          :style="{ animationDelay: `${index * 45}ms` }"
        >
          <code class="tok-fn">{{ row.call }}</code>
          <p class="verify-value" :data-state="row.state">{{ row.value }}</p>
          <p class="verify-note">{{ row.note }}</p>
        </li>
      </ol>
    </div>

    <footer class="console-footer">
      <span>Local dataset / no network</span>
      <NuxtLink
        :to="`/playground?op=verify&id=${encodeURIComponent(sample.id)}`"
        class="verify-link"
        >run it in the playground <UIcon name="i-lucide-arrow-right" class="size-3.5"
      /></NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.console-identity h3.verify-ok {
  color: var(--console-accent);
}
.console-identity h3.verify-failed {
  color: var(--puzzles-del);
}
.verify-steps {
  display: grid;
  margin: 10px 0 2px;
}
.verify-steps > li {
  padding: 10px 14px;
}
.verify-steps > li + li {
  border-top: 1px solid var(--console-line);
}
.verify-steps code {
  font-size: 12px;
  overflow-wrap: anywhere;
}
/* The value the call returned, marked like the gauge: accent for a result, hollow for nothing, red for a mismatch. */
.verify-value {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 6px 0 0;
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
  margin: 4px 0 0 17px;
  font-family: var(--font-sans);
  font-size: 12px;
  line-height: 1.5;
  color: var(--ui-text-dimmed);
}
.verify-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: var(--ui-text-muted);
  text-transform: none;
  letter-spacing: 0.04em;
}
.verify-link:hover {
  color: var(--console-accent);
}
.verify-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
@media (width < 400px) {
  .verify-steps > li {
    padding-inline: 12px;
  }
}
</style>
