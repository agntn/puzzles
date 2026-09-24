<script setup lang="ts">
import { addressLiteral, exportName, factoryName, statusLiteral } from "../../utils/samples";
import type { LandingSample } from "../../utils/samples";
import { clip, shorten } from "../../utils/format";

const props = defineProps<{ sample: LandingSample }>();
const emit = defineEmits<{ previous: []; next: [] }>();
const { copied, copy } = useCopied();

interface Segment {
  readonly text: string;
  readonly cls: string;
  readonly roll: boolean;
  /** The value as the record writes it, when the screen shows it shortened. */
  readonly full?: string;
  /** Punctuation that rolls and wraps with the value, so a wrapped value never leaves it alone. */
  readonly tail?: string;
}

interface Line {
  readonly key: string;
  readonly segments: readonly Segment[];
}

const BUILDERS = [
  "hex",
  "wif",
  "encryptedWif",
  "seed",
  "derivation",
  "mini",
  "bits",
  "share",
  "source",
];

function seg(text: string, cls = "", roll = false): Segment {
  return { text, cls, roll };
}

const fileName = computed(
  () =>
    `src/collections/${props.sample.collection}/${props.sample.id.replace(/^[^/]+\//u, "").replaceAll("_", "-")}.ts`,
);

/** The pieces the record imports: the factory, the address builder and the key builders it uses. */
const imports = computed(() => {
  const sample = props.sample;
  const names = new Set<string>([factoryName(sample.chain), sample.kind]);
  if (sample.redeemScript !== undefined) names.add("redeemScript");
  if (sample.status !== "unsolved") names.add("Status");
  if (sample.pubkeyFormat !== undefined) names.add(sample.pubkeyFormat);
  for (const builder of BUILDERS) {
    if (new RegExp(`(?:^|[^A-Za-z.])${builder}\\(`, "u").test(sample.keyLiteral ?? ""))
      names.add(builder);
  }
  return [...names].sort((a, b) => a.localeCompare(b)).join(", ");
});

/**
 * Long hex values and keys are shortened for the panel; the copy button hands out the whole value.
 *
 * @param {string} literal - A builder call with quoted values inside.
 * @returns {string} The same call with every long quoted value cut to its head and tail.
 */
function short(literal: string): string {
  return literal.replaceAll(
    /"([0-9a-fA-F]{40,}|[135KLbczDx][A-Za-z0-9_'-]{30,})"/gu,
    (_match, value: string) => `"${shorten(value, 10, 6)}"`,
  );
}

function field(key: string, value: string, cls: string, full = value): Line {
  return {
    key,
    segments: [
      seg("  "),
      seg(key, "tok-key"),
      seg(": "),
      { ...seg(value, cls, true), full, tail: "," },
    ],
  };
}

const lines = computed<Line[]>(() => {
  const sample = props.sample;
  const address = addressLiteral(sample);
  const source = `"${sample.source}"`;
  const rows: Line[] = [
    {
      key: "import",
      segments: [
        seg("import", "tok-kw"),
        seg(" { "),
        seg(imports.value, "", true),
        seg(" } "),
        seg("from", "tok-kw"),
        seg(" "),
        seg('"@agntn/puzzles"', "tok-str"),
        seg(";"),
      ],
    },
    { key: "blank", segments: [] },
    {
      key: "open",
      segments: [
        seg("export const", "tok-kw"),
        seg(" "),
        seg(exportName(sample.id), "", true),
        seg(" = "),
        seg(factoryName(sample.chain), "tok-fn"),
        seg("({"),
      ],
    },
    field("id", `"${sample.id}"`, "tok-str"),
    field("address", short(address), "", address),
    field("sourceUrl", `"${clip(sample.source, 44)}"`, "tok-str", source),
    field("startedAt", `"${sample.startedAt}"`, "tok-str"),
  ];
  if (sample.status !== "unsolved")
    rows.push(field("status", statusLiteral(sample.status), "tok-fn"));
  if (sample.prizeAmount !== undefined)
    rows.push(field("prize", String(sample.prizeAmount), "tok-const"));
  if (sample.currency !== undefined)
    rows.push(field("currency", `"${sample.currency}"`, "tok-str"));
  if (sample.pubkey !== undefined && sample.pubkeyFormat !== undefined) {
    rows.push(
      field(
        "pubkey",
        `${sample.pubkeyFormat}("${shorten(sample.pubkey, 10, 6)}")`,
        "",
        `${sample.pubkeyFormat}("${sample.pubkey}")`,
      ),
    );
  }
  if (sample.keyLiteral !== undefined)
    rows.push(field("key", short(sample.keyLiteral), "", sample.keyLiteral));
  if (sample.transactions > 0) {
    rows.push(field("transactions", `[ /* ${sample.transactions} recorded */ ]`, "tok-cm"));
  }
  rows.push({ key: "close", segments: [seg("});")] });
  return rows;
});

/**
 * Splits a value where code breaks naturally, after a slash and before a chained call, so a
 * narrow panel wraps `sha1.ts` or `.wif(` whole instead of cutting a name in two.
 *
 * @param {string} value - A path or a builder call.
 * @returns {string[]} The pieces, which join back to the value.
 */
function pieces(value: string): string[] {
  return value.split(/(?<=\/)|(?<=\))(?=\.)/u);
}

/** What the copy button hands out: the panel's lines with every value whole. */
const text = computed(() =>
  lines.value
    .map((line) =>
      line.segments
        .map((segment) => `${segment.full ?? segment.text}${segment.tail ?? ""}`)
        .join(""),
    )
    .join("\n"),
);
</script>

<template>
  <div class="tool-console landing-record">
    <header class="console-bar">
      <span class="console-title record-file"
        ><span class="console-tag">File</span
        ><Transition name="puzzles-roll" mode="out-in"
          ><span :key="fileName" class="puzzles-roll-slot"
            ><template v-for="(piece, index) in pieces(fileName)" :key="index"
              ><wbr v-if="index > 0" />{{ piece }}</template
            ></span
          ></Transition
        ></span
      >
      <span class="console-hosts">{{ lines.length - 3 }} fields</span>
    </header>

    <div class="record-body">
      <p class="console-label console-rule-title">
        <span>Record <span aria-hidden="true">[ as written ]</span></span>
        <span class="console-mark" aria-hidden="true" />
        <button
          type="button"
          class="console-button"
          :data-copied="copied === 'record'"
          @click="copy('record', text)"
        >
          <UIcon
            :name="copied === 'record' ? 'i-lucide-check' : 'i-lucide-copy'"
            class="size-3"
            aria-hidden="true"
          />
          {{ copied === "record" ? "copied" : "copy" }}
        </button>
      </p>
      <pre
        class="console-snippet record-code"
      ><code><span v-for="line in lines" :key="line.key" class="record-line"><template v-for="(segment, index) in line.segments" :key="index"><Transition v-if="segment.roll" name="puzzles-roll" mode="out-in"><span :key="segment.text" class="puzzles-roll-slot"><span :class="segment.cls"><template v-for="(piece, part) in pieces(segment.text)" :key="part"><wbr v-if="part > 0" />{{ piece }}</template></span>{{ segment.tail }}</span></Transition><span v-else :class="segment.cls">{{ segment.text }}</span></template></span></code></pre>
    </div>

    <footer class="console-footer console-footer-plain">
      <NuxtLink :to="`/collections/${sample.id}`" class="record-link"
        ><span aria-hidden="true">→ </span>{{ sample.id }}
        <span>· {{ sample.chain }} · {{ sample.status }}</span></NuxtLink
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
.record-file {
  min-width: 0;
  overflow-wrap: anywhere;
}
.record-body {
  padding: 14px 20px 16px;
}
.record-body > .console-rule-title {
  margin-bottom: 10px;
}
/* Line numbers in a gutter; a wrapped value continues four columns in, never under the number. */
.record-code {
  padding-left: 0;
  font-size: 11.5px;
  counter-reset: line;
}
.record-line {
  display: block;
  min-height: 1.7em;
  padding-left: calc(3.25em + 4ch);
  text-indent: calc(-3.25em - 4ch);
}
.record-line::before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  width: 2.25em;
  margin-right: 1em;
  text-align: right;
  text-indent: 0;
  color: var(--ui-text-dimmed);
  user-select: none;
}
.record-line * {
  text-indent: 0;
}
.record-link {
  min-width: 0;
  color: var(--ui-text-highlighted);
  overflow-wrap: anywhere;
}
.record-link > span {
  color: var(--ui-text-dimmed);
}
.record-link:hover {
  color: var(--console-accent);
}
.record-link:focus-visible {
  outline: 1px solid var(--ui-primary);
  outline-offset: 3px;
}
@media (width < 640px) {
  .record-body > .console-rule-title > .console-mark {
    display: none;
  }
}
@media (width < 400px) {
  .record-body {
    padding-inline: 14px;
  }
  .record-body > .console-rule-title > span:first-child > span {
    display: none;
  }
  .record-code {
    font-size: 11px;
  }
  .record-line {
    padding-left: calc(2.5em + 2ch);
    text-indent: calc(-2.5em - 2ch);
  }
  .record-line::before {
    width: 1.75em;
    margin-right: 0.75em;
  }
}
</style>
