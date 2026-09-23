<script setup lang="ts">
import type { LandingSample } from "../../utils/samples";
import { shorten } from "../../utils/format";

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
</script>

<template>
  <div class="puzzles-frame overflow-hidden rounded-xl">
    <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
      <p class="min-w-0 truncate font-mono text-xs text-muted">
        <span class="text-dimmed">puzzle</span>
        <span class="ms-2 text-highlighted">{{ sample.id }}</span>
      </p>
      <p class="shrink-0 font-mono text-[11px] text-dimmed">secp256k1 · in your browser</p>
    </div>
    <ol class="divide-y divide-muted">
      <li v-for="row in rows" :key="row.key" class="px-4 py-3.5">
        <pre class="puzzles-tool"><code><span class="tok-fn">{{ row.call }}</span></code></pre>
        <p
          :key="`${sample.id}-${row.key}`"
          class="puzzles-derive mt-2 flex items-start gap-2 font-mono text-[12px] leading-5"
          :class="row.state === 'ok' ? 'text-primary' : 'text-muted'"
        >
          <UIcon
            :name="row.state === 'failed' ? 'i-lucide-circle-x' : 'i-lucide-circle-check'"
            class="mt-0.5 size-4 shrink-0"
            :class="
              row.state === 'ok'
                ? 'text-primary'
                : row.state === 'failed'
                  ? 'puzzles-text-del'
                  : 'text-dimmed'
            "
          />
          <span class="min-w-0 break-all">{{ row.value }}</span>
        </p>
        <p class="mt-1.5 ps-6 text-[12px] leading-5 text-dimmed">{{ row.note }}</p>
      </li>
    </ol>
  </div>
</template>
