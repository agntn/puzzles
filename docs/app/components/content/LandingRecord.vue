<script setup lang="ts">
import { addressLiteral, exportName, factoryName, statusLiteral } from "../../utils/samples";
import type { LandingSample } from "../../utils/samples";
import { clip, shorten } from "../../utils/format";

const props = defineProps<{ sample: LandingSample }>();

interface Segment {
  readonly text: string;
  readonly cls: string;
  readonly roll: boolean;
}

interface Line {
  readonly key: string;
  readonly segments: readonly Segment[];
  readonly wrap: boolean;
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
 * Long hex values and keys are shortened for the panel; the record on disk carries the whole value.
 *
 * @param {string} literal - A builder call with quoted values inside.
 * @returns {string} The same call with every long quoted value cut to its head and tail.
 */
function short(literal: string): string {
  return literal.replaceAll(
    /"([0-9a-fA-F]{40,}|[15KLbczDx][A-Za-z0-9_'-]{30,})"/gu,
    (_match, value: string) => `"${shorten(value, 10, 6)}"`,
  );
}

function field(key: string, value: string, cls: string, wrap = false): Line {
  return {
    key,
    wrap,
    segments: [seg("  "), seg(key, "tok-key"), seg(": "), seg(value, cls, true), seg(",")],
  };
}

const lines = computed<Line[]>(() => {
  const sample = props.sample;
  const rows: Line[] = [
    {
      key: "import",
      wrap: true,
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
    { key: "blank", wrap: false, segments: [seg(" ")] },
    {
      key: "open",
      wrap: false,
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
    field("address", short(addressLiteral(sample)), "", true),
    field("sourceUrl", `"${clip(sample.source, 44)}"`, "tok-str", true),
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
      field("pubkey", `${sample.pubkeyFormat}("${shorten(sample.pubkey, 10, 6)}")`, "", true),
    );
  }
  if (sample.keyLiteral !== undefined) rows.push(field("key", short(sample.keyLiteral), "", true));
  if (sample.transactions > 0) {
    rows.push(field("transactions", `[ /* ${sample.transactions} recorded */ ]`, "tok-cm"));
  }
  rows.push({ key: "close", wrap: false, segments: [seg("});")] });
  return rows;
});
</script>

<template>
  <div class="puzzles-frame overflow-hidden rounded-xl">
    <div class="flex items-center gap-2 border-b border-muted px-4 py-3">
      <UIcon name="i-vscode-icons-file-type-typescript" class="size-4" />
      <span class="min-w-0 truncate text-sm text-default">
        <Transition name="puzzles-roll" mode="out-in">
          <span :key="fileName">{{ fileName }}</span>
        </Transition>
      </span>
      <span class="ms-auto shrink-0 font-mono text-[11px] text-dimmed"
        >{{ lines.length - 3 }} fields</span
      >
    </div>
    <pre
      class="puzzles-code"
    ><code><span v-for="line in lines" :key="line.key" class="puzzles-code-line" :class="{ 'puzzles-code-line-wrap': line.wrap }"><template v-for="(segment, index) in line.segments" :key="index"><Transition v-if="segment.roll" name="puzzles-roll" mode="out-in"><span :key="segment.text" class="puzzles-roll-slot" :class="segment.cls">{{ segment.text }}</span></Transition><span v-else :class="segment.cls">{{ segment.text }}</span></template></span></code></pre>
  </div>
</template>
