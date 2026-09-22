<script setup lang="ts">
import * as library from "@agntn/puzzles";
import { type CollectionSummary, PuzzlesError, selectPuzzles, type Status } from "@agntn/puzzles";
import {
  collectionsTool,
  facts,
  listTool,
  showTool,
  statsTool,
  verifyTool,
} from "@agntn/puzzles/tools";
import type { BalanceAnswer } from "../../../server/api/balance/[...id]";
import { balanceApiPath, balanceText } from "../../composables/useBalance";
import { CHAIN_ICONS, COLLECTIONS, STATUSES } from "../../utils/puzzles";
import { WALK } from "../../utils/landing";
import { toPuzzleView, type PuzzleView } from "../../utils/puzzle-view";
import { addressLiteral, factoryName, statusLiteral } from "../../utils/samples";
import { statusCountLabels } from "../../../../src/core/utils.ts";
import {
  fetchErrorData,
  formatPrize,
  host,
  hostPath,
  listCommandLine,
  shellArg,
  shorten,
  verdictLabel,
} from "../../utils/format";

type Operation = "show" | "list" | "verify" | "balance" | "collections" | "stats";

const OPERATIONS: ReadonlyArray<{
  key: Operation;
  label: string;
  tool: string;
  description: string;
}> = [
  {
    key: "show",
    label: "Show",
    tool: facts.tools.show.name,
    description: facts.tools.show.description,
  },
  {
    key: "list",
    label: "List",
    tool: facts.tools.list.name,
    description: facts.tools.list.description,
  },
  {
    key: "verify",
    label: "Verify",
    tool: facts.tools.verify.name,
    description: facts.tools.verify.description,
  },
  {
    key: "balance",
    label: "Balance",
    tool: facts.tools.balance.name,
    description: facts.tools.balance.description,
  },
  {
    key: "collections",
    label: "Collections",
    tool: facts.tools.collections.name,
    description: facts.tools.collections.description,
  },
  {
    key: "stats",
    label: "Stats",
    tool: facts.tools.stats.name,
    description: facts.tools.stats.description,
  },
];

const NOTES: Readonly<Record<Operation, string>> = {
  show: "",
  verify: "",
  balance:
    "The worker asks the chain's explorer and caches the answer for five minutes. Ethereum needs the Etherscan key the worker holds. The CLI reads yours from ETHERSCAN_API_KEY.",
  list: `A page holds ${facts.parameters.limit.maximum} puzzles at most. Ask for more and the tool says no, same as its schema.`,
  collections:
    "The rows puzzles collections prints. One per collection, with the author and a count per status.",
  stats:
    "Totals over every collection. Loading them all is the one thing this call does that a show doesn't.",
};

const route = useRoute();
const router = useRouter();

const operation = ref<Operation>("show");
const id = ref("b1000/71");
const collection = ref("");
const status = ref("");
const withPubkey = ref(false);
const limit = ref("50");

const needsId = computed(
  () => operation.value === "show" || operation.value === "verify" || operation.value === "balance",
);
const isList = computed(() => operation.value === "list");

interface ShowAnswer {
  kind: "show";
  view: PuzzleView;
  text: string;
}
interface ListAnswer {
  kind: "list";
  matched: number;
  rows: { id: string; status: Status; prize: string; address: string }[];
  text: string;
}
interface VerifyAnswer {
  kind: "verify";
  verified: boolean;
  unavailable: boolean;
  detail: string;
  text: string;
}
interface BalanceAnswerView {
  kind: "balance";
  balance: BalanceAnswer;
  text: string;
}
interface CollectionsAnswer {
  kind: "collections";
  rows: readonly CollectionSummary[];
  text: string;
}
interface StatsAnswer {
  kind: "stats";
  cells: { label: string; value: string }[];
  text: string;
}
interface ErrorAnswer {
  kind: "error";
  name: string;
  message: string;
}
type Answer =
  | ShowAnswer
  | ListAnswer
  | VerifyAnswer
  | BalanceAnswerView
  | CollectionsAnswer
  | StatsAnswer
  | ErrorAnswer;

const answer = ref<Answer | undefined>();
const running = ref(false);
/** Wall-clock milliseconds of the call that produced `answer`, measured in this page. */
const elapsed = ref(0);
/** Counts answers so the scan line runs once per new one. */
const scan = ref(0);
let sequence = 0;

function failure(error: unknown): ErrorAnswer {
  const data = fetchErrorData(error);
  const fallback = error instanceof Error ? error.message : String(error);
  return {
    kind: "error",
    name: error instanceof PuzzlesError ? error.name : (data.statusMessage ?? "Error"),
    message: data.message ?? fallback,
  };
}

function firstText(result: { content: readonly { text: string }[] }): string {
  return result.content.map((part) => part.text).join("");
}

async function computeShow(trimmed: string): Promise<ShowAnswer> {
  const [result, puzzle] = await Promise.all([showTool(trimmed), library.requirePuzzle(trimmed)]);
  const collection = await library.requireCollection(puzzle.collection());
  const text = firstText(result);
  return { kind: "show", view: toPuzzleView(library, puzzle, text, collection.hints), text };
}

async function computeList(): Promise<ListAnswer> {
  const params = {
    collection: collection.value || undefined,
    status: status.value || undefined,
    withPubkey: withPubkey.value || undefined,
    limit: limit.value.trim() === "" ? undefined : Number(limit.value),
  };
  const result = await listTool(params);
  const details = result.details as { matched: number; returned: number };
  const puzzles = await selectPuzzles({
    collection: params.collection,
    status: params.status as Status | undefined,
    withPubkey: params.withPubkey,
  });
  const rows = puzzles.slice(0, details.returned).map((puzzle) => ({
    id: puzzle.id(),
    status: puzzle.status(),
    prize: formatPrize(puzzle.prize(), puzzle.prizeCurrency()),
    address: puzzle.address().value,
  }));
  return { kind: "list", matched: details.matched, rows, text: firstText(result) };
}

async function computeVerify(trimmed: string): Promise<VerifyAnswer> {
  const result = await verifyTool(trimmed);
  const details = result.details as {
    verified: boolean;
    unavailable?: boolean;
    error: string | null;
    derivedAddress: string | null;
  };
  return {
    kind: "verify",
    verified: details.verified,
    unavailable: details.unavailable === true,
    detail: details.verified ? (details.derivedAddress ?? "") : (details.error ?? ""),
    text: firstText(result),
  };
}

/**
 * The worker makes the explorer call, so the text is the tool's line rebuilt from its answer.
 *
 * @param {string} trimmed - The puzzle identifier, trimmed.
 * @returns {Promise<BalanceAnswerView>} The balance and the line `puzzles_balance` would print.
 */
async function computeBalance(trimmed: string): Promise<BalanceAnswerView> {
  const balance = await $fetch<BalanceAnswer>(balanceApiPath(trimmed));
  return { kind: "balance", balance, text: balanceText(balance) };
}

async function computeCollections(): Promise<CollectionsAnswer> {
  const result = await collectionsTool();
  const details = result.details as { collections: CollectionsAnswer["rows"] };
  return { kind: "collections", rows: details.collections, text: firstText(result) };
}

async function computeStats(): Promise<StatsAnswer> {
  const result = await statsTool();
  const details = result.details as Record<string, unknown>;
  const labels = [
    "total",
    "solved",
    "unsolved",
    "claimed",
    "swept",
    "expired",
    "with_pubkey",
    "data_version",
  ];
  const cells = labels.map((label) => ({
    label: label.replaceAll("_", " "),
    value: String(details[label] ?? ""),
  }));
  return { kind: "stats", cells, text: firstText(result) };
}

function compute(): Promise<Answer> {
  const trimmed = id.value.trim();
  switch (operation.value) {
    case "show":
      return computeShow(trimmed);
    case "list":
      return computeList();
    case "verify":
      return computeVerify(trimmed);
    case "balance":
      return computeBalance(trimmed);
    case "collections":
      return computeCollections();
    default:
      return computeStats();
  }
}

/** Only the newest request writes the answer, so a slow balance never lands under a later show. */
async function run() {
  const mine = ++sequence;
  running.value = true;
  const started = performance.now();
  let next: Answer;
  try {
    next = await compute();
  } catch (error) {
    next = failure(error);
  }
  if (mine === sequence) {
    elapsed.value = Math.round(performance.now() - started);
    answer.value = next;
    running.value = false;
    scan.value += 1;
  }
}

const current = computed(() => OPERATIONS.find((row) => row.key === operation.value)!);

/** The header line of the response instrument: the tool and its argument as one call. */
const call = computed(() =>
  needsId.value ? `${current.value.tool}("${id.value.trim()}")` : `${current.value.tool}()`,
);

/** Where the answer came from, for the footer. Only a balance leaves the page. */
const locality = computed(() =>
  operation.value === "balance" ? "Docs worker / chain explorer" : "Local dataset / no network",
);

/** The same call as one CLI line. */
const cliLine = computed(() => {
  if (needsId.value) return `puzzles ${operation.value} ${shellArg(id.value.trim())}`;
  if (!isList.value) return `puzzles ${operation.value}`;
  return listCommandLine({
    collection: collection.value,
    status: status.value,
    withPubkey: withPubkey.value,
    limit: limit.value,
  });
});

/** The same call as a tool invocation, the JSON an MCP client sends. */
const toolCall = computed(() => {
  const args: Record<string, string | number | boolean> = {};
  if (needsId.value) args.id = id.value.trim();
  if (isList.value) {
    if (collection.value) args.collection = collection.value;
    if (status.value) args.status = status.value;
    if (withPubkey.value) args.withPubkey = true;
    if (limit.value.trim() !== "") args.limit = Number(limit.value);
  }
  return JSON.stringify({ name: current.value.tool, arguments: args }, null, 2);
});

function loadSample(sampleId: string) {
  id.value = sampleId;
  if (!needsId.value) operation.value = "show";
}

const { copied: copiedKey, copy } = useCopied();

/**
 * The list filters from a query. Only values the form knows are read, the rest is ignored.
 *
 * @param {Readonly<Record<string, unknown>>} query - The route query.
 */
function readListQuery(query: Readonly<Record<string, unknown>>) {
  if (
    typeof query.collection === "string" &&
    COLLECTIONS.some((row) => row.key === query.collection)
  ) {
    collection.value = query.collection;
  }
  if (typeof query.status === "string" && STATUSES.includes(query.status))
    status.value = query.status;
  if (query.pubkey === "1") withPubkey.value = true;
  if (typeof query.limit === "string" && /^\d+$/u.test(query.limit)) limit.value = query.limit;
}

/**
 * Query in, state out: the operation, the identifier and the list filters.
 *
 * @param {Readonly<Record<string, unknown>>} query - The route query.
 */
function readQuery(query: Readonly<Record<string, unknown>>) {
  const op = String(query.op ?? "");
  if (OPERATIONS.some((row) => row.key === op)) {
    operation.value = op as Operation;
  }
  if (typeof query.id === "string") id.value = query.id;
  readListQuery(query);
}

const shareQuery = computed(() => {
  const query: Record<string, string> = { op: operation.value };
  if (needsId.value) query.id = id.value.trim();
  if (isList.value) {
    if (collection.value) query.collection = collection.value;
    if (status.value) query.status = status.value;
    if (withPubkey.value) query.pubkey = "1";
    if (limit.value.trim() !== "") query.limit = limit.value.trim();
  }
  return query;
});

/** Deep link once after mount. A prerendered page hydrates with an empty query at first. */
function applyDeepLink() {
  if (Object.keys(route.query).length > 0) {
    readQuery(route.query as Record<string, unknown>);
    return;
  }
  watch(
    () => route.query,
    (query) => readQuery(query as Record<string, unknown>),
    {
      once: true,
      flush: "post",
    },
  );
}

/** Typing an identifier updates the link at once and runs the call after a short pause. */
const RUN_DELAY = 250;
let runTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  applyDeepLink();
  watch(
    shareQuery,
    (query, previous) => {
      void router.replace({ query });
      clearTimeout(runTimer);
      if (previous === undefined) {
        void run();
        return;
      }
      runTimer = setTimeout(() => void run(), RUN_DELAY);
    },
    { immediate: true },
  );
});

onUnmounted(() => clearTimeout(runTimer));

const shareLink = computed(() => {
  if (!import.meta.client) {
    return "";
  }
  const url = new URL(window.location.href);
  url.search = new URLSearchParams(shareQuery.value).toString();
  return url.toString();
});

/** What the response header shows on the right: the state of the call, never a decoration. */
const verdict = computed(() => {
  const value = answer.value;
  if (value?.kind !== "verify") return undefined;
  return {
    label: verdictLabel(value.verified, value.unavailable),
    klass: value.verified ? "puzzles-state-ok" : value.unavailable ? "" : "puzzles-state-failed",
  };
});

/**
 * The subject glyph of a verdict: the shield the outcome earns.
 *
 * @param {boolean} verified - Whether the key derived the address.
 * @param {boolean} unavailable - Whether there was nothing to derive.
 * @returns {string} The Lucide icon name.
 */
function verdictIcon(verified: boolean, unavailable: boolean): string {
  if (verified) return "i-lucide-shield-check";
  return unavailable ? "i-lucide-shield-question" : "i-lucide-shield-x";
}

/**
 * One tick per transaction: money in stays hatched, money out opens in the accent.
 *
 * @param {PuzzleView} view - The record on screen.
 * @returns {("closed" | "open")[]} One entry per transaction, in record order.
 */
function transactionTicks(view: PuzzleView): ("closed" | "open")[] {
  return view.transactionRows.map((row) =>
    /sweep|claim|decrease/u.test(row.type) ? "open" : "closed",
  );
}

/**
 * One tick per puzzle in the dataset, the unsolved ones open.
 *
 * @param {StatsAnswer["cells"]} cells - The totals as the panel lists them.
 * @returns {("closed" | "open")[]} Closed puzzles first, then the open ones.
 */
function statsTicks(cells: StatsAnswer["cells"]): ("closed" | "open")[] {
  const count = (label: string) => Number(cells.find((cell) => cell.label === label)?.value ?? 0);
  const unsolved = count("unsolved");
  const closed = Math.max(count("total") - unsolved, 0);
  return [
    ...Array.from({ length: closed }, (): "closed" => "closed"),
    ...Array.from({ length: unsolved }, (): "open" => "open"),
  ];
}

/**
 * One line under the record's name: what it is called, when it started and, when it did, when it
 * was solved, plus how many transactions the record carries.
 *
 * @param {PuzzleView} view - The record on screen.
 * @returns {string} The sentence.
 */
function recordSentence(view: PuzzleView): string {
  const dates = [`started ${view.startedAt.slice(0, 10)}`];
  if (view.solvedAt !== undefined) dates.push(`solved ${view.solvedAt.slice(0, 10)}`);
  const count = `${view.transactions} ${view.transactions === 1 ? "transaction" : "transactions"}`;
  return `${view.name} · ${dates.join(", ")}. ${count} on record.`;
}

/**
 * The record as its module writes it, in one line: the factory, the address builder, the status
 * when it is not the default and the key builder chain when the record has one.
 *
 * @param {PuzzleView} view - The record on screen.
 * @returns {string} The literal, shortened to what identifies the record.
 */
function recordLiteral(view: PuzzleView): string {
  const fields = [`address: ${addressLiteral(view)}`];
  if (view.status !== "unsolved") fields.push(`status: ${statusLiteral(view.status)}`);
  if (view.keyLiteral !== undefined) fields.push(`key: ${view.keyLiteral}`);
  return `${factoryName(view.chain)}({\n${fields.map((field) => `  ${field},`).join("\n")}\n})`;
}

interface LiteralToken {
  readonly text: string;
  readonly cls: string;
}

/**
 * Colors a record literal the way the landing colors its record file: builders and factories as
 * functions, quoted values as strings, field names as keys, numbers as constants. The tokens
 * concatenate back to the input; long quoted values are shortened for the screen only.
 *
 * @param {string} literal - The record literal.
 * @returns {LiteralToken[]} The literal in order, each piece with its class.
 */
function literalTokens(literal: string): LiteralToken[] {
  const pattern = /"[^"]*"|\b[A-Za-z_]\w*(?=\()|\b[a-z]\w*(?=:)|\bStatus\.\w+|\b\d+\b/gu;
  const tokens: LiteralToken[] = [];
  let last = 0;
  for (const match of literal.matchAll(pattern)) {
    const text = match[0];
    if (match.index > last) tokens.push({ text: literal.slice(last, match.index), cls: "" });
    const cls = text.startsWith('"')
      ? "tok-str"
      : /^\d/u.test(text)
        ? "tok-const"
        : literal[match.index + text.length] === ":"
          ? "tok-key"
          : "tok-fn";
    tokens.push({
      text: text.startsWith('"') ? `"${shorten(text.slice(1, -1), 12, 8)}"` : text,
      cls,
    });
    last = match.index + text.length;
  }
  if (last < literal.length) tokens.push({ text: literal.slice(last), cls: "" });
  return tokens;
}

/** The position of the operation among the six, for the file number on the bar. */
const position = computed(() => OPERATIONS.findIndex((row) => row.key === operation.value) + 1);

/** The response dialog's title: the call the text came from. */
const responseTitle = computed(() => {
  const value = answer.value;
  if (value === undefined || value.kind === "error") return "";
  return needsId.value ? `${current.value.tool} · ${id.value.trim()}` : current.value.tool;
});
</script>

<template>
  <div class="playground">
    <form class="tool-console console-wide" @submit.prevent>
      <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
      <span class="console-cross console-cross-br" aria-hidden="true">+</span>
      <header class="console-bar">
        <span class="console-title"
          ><span class="console-tag">Call</span>{{ current.tool
          }}<span class="console-file"
            >{{ String(position).padStart(2, "0") }} / {{ OPERATIONS.length }}</span
          ></span
        >
        <span class="console-meta" aria-label="Supported hosts: MCP, Pi and OMP"
          >MCP · Pi · OMP</span
        >
        <span class="console-mark" aria-hidden="true" />
      </header>
      <div class="console-ruler" aria-hidden="true"><span class="console-cursor" /></div>

      <div class="console-band playground-band-first playground-columns">
        <div class="playground-column">
          <p class="console-label console-rule-title">
            <span
              >Operation <span aria-hidden="true">[ {{ OPERATIONS.length }} ]</span></span
            >
            <span class="console-mark" aria-hidden="true" />
          </p>
          <div role="group" aria-label="Operation" class="playground-ops console-draw">
            <button
              v-for="(row, index) in OPERATIONS"
              :key="row.key"
              type="button"
              class="console-lead"
              :aria-pressed="operation === row.key"
              @click="operation = row.key"
            >
              <span class="console-tag">{{ row.label }}</span>
              <span>{{ row.tool }}</span>
              <span
                class="console-leader"
                aria-hidden="true"
                :style="{ animationDelay: `${index * 60}ms` }"
              />
            </button>
          </div>
          <p class="console-about playground-tool-about">{{ current.description }}</p>
        </div>

        <div class="playground-column">
          <p class="console-label console-rule-title">
            <span
              >{{ needsId ? "Input" : isList ? "Filters" : "Input" }}
              <span aria-hidden="true"
                >[ {{ needsId ? "id" : isList ? "collection · status · limit" : "none" }} ]</span
              ></span
            >
            <span class="console-mark" aria-hidden="true" />
          </p>

          <div v-if="needsId || isList" class="console-readout">
            <dl class="console-readout-rows">
              <div v-if="needsId">
                <dt><label for="playground-id">id</label></dt>
                <dd>
                  <input
                    id="playground-id"
                    v-model="id"
                    type="text"
                    placeholder="b1000/71, gsmg, zden/decred_janus"
                    spellcheck="false"
                    autocomplete="off"
                    list="puzzles-ids"
                  />
                  <datalist id="puzzles-ids">
                    <option v-for="sampleId in WALK" :key="sampleId" :value="sampleId" />
                  </datalist>
                </dd>
              </div>
              <template v-else>
                <div>
                  <dt><label for="playground-collection">collection</label></dt>
                  <dd>
                    <select id="playground-collection" v-model="collection">
                      <option value="">every collection</option>
                      <option v-for="row in COLLECTIONS" :key="row.key" :value="row.key">
                        {{ row.key }} · {{ row.title }}
                      </option>
                    </select>
                  </dd>
                </div>
                <div>
                  <dt><label for="playground-status">status</label></dt>
                  <dd>
                    <select id="playground-status" v-model="status">
                      <option value="">any status</option>
                      <option v-for="row in STATUSES" :key="row" :value="row">{{ row }}</option>
                    </select>
                  </dd>
                </div>
                <div>
                  <dt><label for="playground-limit">limit</label></dt>
                  <dd>
                    <input
                      id="playground-limit"
                      v-model="limit"
                      type="text"
                      inputmode="numeric"
                      spellcheck="false"
                    />
                  </dd>
                </div>
                <div>
                  <dt><label for="playground-pubkey">public key</label></dt>
                  <dd>
                    <label class="console-check">
                      <input id="playground-pubkey" v-model="withPubkey" type="checkbox" />
                      <span>{{ withPubkey ? "only records with one" : "any record" }}</span>
                    </label>
                  </dd>
                </div>
              </template>
            </dl>
          </div>
          <p v-else class="console-empty">
            {{ current.tool }} takes no arguments. The call runs on the whole dataset.
          </p>

          <div v-if="needsId" class="console-chips" role="group" aria-label="Sample identifiers">
            <button
              v-for="sampleId in WALK"
              :key="sampleId"
              type="button"
              :aria-pressed="id.trim() === sampleId"
              @click="loadSample(sampleId)"
            >
              {{ sampleId }}
            </button>
          </div>

          <p v-if="NOTES[operation] !== ''" class="console-note">{{ NOTES[operation] }}</p>
        </div>
      </div>

      <div class="console-band playground-columns">
        <div class="playground-column">
          <p class="console-label console-rule-title">
            <span>CLI <span aria-hidden="true">[ same call ]</span></span>
            <span class="console-mark" aria-hidden="true" />
            <button
              type="button"
              class="console-button"
              :data-copied="copiedKey === 'cli'"
              @click="copy('cli', cliLine)"
            >
              <UIcon
                :name="copiedKey === 'cli' ? 'i-lucide-check' : 'i-lucide-copy'"
                class="size-3"
                aria-hidden="true"
              />
              {{ copiedKey === "cli" ? "copied" : "copy" }}
            </button>
          </p>
          <pre class="console-snippet"><span>$ </span>{{ cliLine }}</pre>
        </div>
        <div class="playground-column">
          <p class="console-label console-rule-title">
            <span>Tool <span aria-hidden="true">[ what an MCP client sends ]</span></span>
            <span class="console-mark" aria-hidden="true" />
            <button
              type="button"
              class="console-button"
              :data-copied="copiedKey === 'tool'"
              @click="copy('tool', toolCall)"
            >
              <UIcon
                :name="copiedKey === 'tool' ? 'i-lucide-check' : 'i-lucide-copy'"
                class="size-3"
                aria-hidden="true"
              />
              {{ copiedKey === "tool" ? "copied" : "copy" }}
            </button>
          </p>
          <pre class="console-snippet">{{ toolCall }}</pre>
        </div>
      </div>

      <footer class="console-footer console-footer-plain">
        <ul class="console-links">
          <li>
            <button
              type="button"
              :data-copied="copiedKey === 'link'"
              @click="copy('link', shareLink)"
            >
              <span aria-hidden="true">→ </span
              >{{ copiedKey === "link" ? "permalink copied" : "copy the permalink" }}
            </button>
          </li>
        </ul>
        <span class="console-meta">every state is a link</span>
      </footer>
    </form>

    <section class="tool-console console-wide" aria-live="polite">
      <span class="console-cross console-cross-tl" aria-hidden="true">+</span>
      <span class="console-cross console-cross-br" aria-hidden="true">+</span>
      <header class="console-bar">
        <span class="console-title playground-call"
          ><span class="console-tag">{{ current.label }}</span
          >{{ call }}</span
        >
        <span v-if="running" class="console-meta playground-running">
          <UIcon name="i-lucide-loader-circle" class="size-3 animate-spin" aria-hidden="true" />
          running
        </span>
        <span v-else-if="answer?.kind === 'list'" class="console-meta"
          ><span class="console-ticks-bar" aria-hidden="true"
            ><span
              v-for="row in answer.rows"
              :key="row.id"
              :class="
                row.status === 'unsolved' ? 'console-tick-open' : 'console-tick-closed'
              " /></span
          >{{ answer.rows.length }} of {{ answer.matched }} matching</span
        >
        <span v-else-if="answer?.kind === 'collections'" class="console-meta"
          ><span class="console-ticks-bar" aria-hidden="true"
            ><span
              v-for="row in answer.rows"
              :key="row.key"
              :class="row.unsolved > 0 ? 'console-tick-open' : 'console-tick-closed'" /></span
          >{{ answer.rows.length }} collections</span
        >
        <span v-else-if="answer?.kind === 'show'" class="console-meta"
          >{{ answer.view.status }} · {{ answer.view.prize }}</span
        >
        <span v-else-if="answer?.kind === 'error'" class="console-meta">{{ answer.name }}</span>
        <span class="console-mark" aria-hidden="true" />
      </header>
      <div class="console-ruler" aria-hidden="true">
        <span v-if="running" class="console-cursor console-cursor-busy" />
        <span v-else-if="scan > 0" :key="scan" class="console-cursor" />
      </div>

      <template v-if="answer?.kind === 'show'">
        <div class="console-band console-subject-band">
          <div :key="scan" class="console-scan" aria-hidden="true" />
          <div class="console-identity-block">
            <ConsoleReticle
              :key="answer.view.id"
              :icon="CHAIN_ICONS[answer.view.chain] ?? 'i-lucide-link'"
            />
            <div class="console-name">
              <span class="console-label">Record / {{ answer.view.collection }}</span>
              <h3 class="console-name-mono">{{ answer.view.id }}</h3>
              <p class="console-aliases">
                <span class="console-chain"
                  ><UIcon
                    :name="CHAIN_ICONS[answer.view.chain] ?? 'i-lucide-link'"
                    class="size-3.5"
                  />{{ answer.view.chain }}</span
                >
                <span>{{ answer.view.kind }}</span>
                <StatusPill :status="answer.view.status" />
              </p>
              <p class="console-about">{{ recordSentence(answer.view) }}</p>
              <p class="console-label console-rule-title playground-literal-title">
                <span>Record <span aria-hidden="true">[ as written ]</span></span>
                <span class="console-mark" aria-hidden="true" />
                <button
                  type="button"
                  class="console-button"
                  :data-copied="copiedKey === 'record'"
                  @click="copy('record', recordLiteral(answer.view))"
                >
                  <UIcon
                    :name="copiedKey === 'record' ? 'i-lucide-check' : 'i-lucide-copy'"
                    class="size-3"
                    aria-hidden="true"
                  />
                  {{ copiedKey === "record" ? "copied" : "copy" }}
                </button>
              </p>
              <pre
                class="console-snippet playground-literal"
              ><code><span v-for="(token, index) in literalTokens(recordLiteral(answer.view))" :key="index" :class="token.cls">{{ token.text }}</span></code></pre>
            </div>
          </div>
          <div class="console-readout">
            <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
              <circle cx="3" cy="12" r="2.5" />
              <path d="M5.5 12H14L22 20H32" />
            </svg>
            <dl :key="scan" class="console-readout-rows console-animate">
              <div :style="{ animationDelay: '0ms' }">
                <dt>Prize</dt>
                <dd class="console-accent">{{ answer.view.prize }}</dd>
              </div>
              <div :style="{ animationDelay: '45ms' }">
                <dt>Public key</dt>
                <dd>{{ answer.view.pubkey ? "published" : "unknown" }}</dd>
              </div>
              <div :style="{ animationDelay: '90ms' }">
                <dt>Key material</dt>
                <dd>
                  {{
                    answer.view.secret === "none"
                      ? answer.view.bits === undefined
                        ? "none published"
                        : `${answer.view.bits}-bit search width`
                      : answer.view.secret
                  }}
                </dd>
              </div>
              <div :style="{ animationDelay: '135ms' }">
                <dt>Verification</dt>
                <dd>
                  {{
                    verdictLabel(
                      answer.view.verdict === "verified",
                      answer.view.verdict === "unavailable",
                    )
                  }}
                </dd>
              </div>
              <div :style="{ animationDelay: '180ms' }">
                <dt>Solved</dt>
                <dd>
                  {{
                    answer.view.solvedAt === undefined
                      ? answer.view.status === "unsolved"
                        ? "not yet"
                        : "unknown"
                      : `${answer.view.solvedAt.slice(0, 10)} · ${answer.view.solveTime ?? ""}`
                  }}
                </dd>
              </div>
            </dl>
            <div
              v-if="answer.view.transactions > 0"
              class="console-gauge"
              :aria-label="`${answer.view.transactions} transactions on record`"
            >
              <span
                class="console-ticks"
                :class="{ 'console-ticks-dense': answer.view.transactions > 64 }"
                aria-hidden="true"
              >
                <span
                  v-for="(tick, index) in transactionTicks(answer.view)"
                  :key="index"
                  :class="tick === 'open' ? 'console-tick-open' : 'console-tick-closed'"
                  :style="{ animationDelay: `${Math.min(index * 12, 720)}ms` }"
                />
              </span>
              <span class="console-gauge-read">tx {{ answer.view.transactions }}</span>
            </div>
          </div>
        </div>

        <div class="console-band playground-trail">
          <dl class="playground-channels">
            <dt class="console-label">Links <span aria-hidden="true">[ 3 ]</span></dt>
            <dd class="console-lead">
              <span class="console-tag">page</span>
              <NuxtLink :to="`/collections/${answer.view.id}`"
                >/collections/{{ answer.view.id }}</NuxtLink
              >
              <span class="console-leader" aria-hidden="true" />
            </dd>
            <dd class="console-lead">
              <span class="console-tag">explorer</span>
              <a :href="answer.view.explorer" target="_blank" rel="noopener">{{
                host(answer.view.explorer)
              }}</a>
              <span class="console-leader" aria-hidden="true" />
            </dd>
            <dd class="console-lead">
              <span class="console-tag">source</span>
              <a :href="answer.view.source" target="_blank" rel="noopener">{{
                hostPath(answer.view.source)
              }}</a>
              <span class="console-leader" aria-hidden="true" />
            </dd>
          </dl>
          <div class="playground-target">
            <dl class="console-address">
              <dt class="console-label">
                Address <span aria-hidden="true">[ {{ answer.view.kind }} ]</span>
              </dt>
              <dd class="console-node">{{ answer.view.address }}</dd>
            </dl>
            <div class="playground-balance">
              <span class="console-label"
                >Balance <span aria-hidden="true">[ explorer ]</span></span
              >
              <BalanceLine :id="answer.view.id" :status="answer.view.status" />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="answer?.kind === 'list'">
        <ol
          v-if="answer.rows.length > 0"
          :key="scan"
          class="console-rows console-animate playground-list"
        >
          <li
            v-for="(row, index) in answer.rows"
            :key="row.id"
            :style="{ animationDelay: `${Math.min(index * 30, 600)}ms` }"
          >
            <NuxtLink :to="`/collections/${row.id}`">{{ row.id }}</NuxtLink>
            <StatusPill :status="row.status" />
            <span class="playground-prize">{{ row.prize }}</span>
            <span class="playground-address">
              <span class="console-leader" aria-hidden="true" />
              <button type="button" :title="row.address" @click="loadSample(row.id)">
                {{ shorten(row.address, 14, 8) }}
              </button>
            </span>
          </li>
        </ol>
        <p v-else class="console-band console-empty playground-band-empty">No record matches.</p>
      </template>

      <template v-else-if="answer?.kind === 'collections'">
        <ol :key="scan" class="console-rows console-animate playground-collections">
          <li
            v-for="(row, index) in answer.rows"
            :key="row.key"
            :style="{ animationDelay: `${Math.min(index * 30, 600)}ms` }"
          >
            <NuxtLink :to="`/collections/${row.key}`">{{ row.key }}</NuxtLink>
            <span class="playground-author">{{ row.author ?? "unknown" }}</span>
            <span class="playground-statuses">{{ statusCountLabels(row).join(" · ") }}</span>
            <span class="playground-count"
              ><span class="console-leader" aria-hidden="true" />{{ row.total }}</span
            >
          </li>
        </ol>
      </template>

      <div v-else-if="answer?.kind === 'verify'" class="console-band console-subject-band">
        <div :key="scan" class="console-scan" aria-hidden="true" />
        <div class="console-identity-block">
          <ConsoleReticle
            :key="`${id}-${answer.verified}`"
            :icon="verdictIcon(answer.verified, answer.unavailable)"
          />
          <div class="console-name">
            <span class="console-label">Verdict / {{ id.trim() }}</span>
            <h3>{{ verdictLabel(answer.verified, answer.unavailable) }}</h3>
            <p class="console-about">
              <template v-if="answer.verified">
                The published key derives the stored address. This page just ran the derivation
                itself.
              </template>
              <template v-else-if="answer.unavailable">
                Nothing to derive: {{ answer.detail }}. A verdict, not an error, so the tool leaves
                isError unset.
              </template>
              <template v-else>
                The key on record doesn't derive the stored address: {{ answer.detail }}. The data
                gate would've stopped this on main.
              </template>
            </p>
          </div>
        </div>
        <div v-if="answer.verified" class="console-readout">
          <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
            <circle cx="3" cy="12" r="2.5" />
            <path d="M5.5 12H14L22 20H32" />
          </svg>
          <dl :key="scan" class="console-readout-rows console-animate">
            <div :style="{ animationDelay: '0ms' }">
              <dt>Derived</dt>
              <dd class="console-accent">{{ answer.detail }}</dd>
            </div>
            <div :style="{ animationDelay: '45ms' }">
              <dt>Matches</dt>
              <dd>the stored address</dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-else-if="answer?.kind === 'balance'" class="console-band console-subject-band">
        <div :key="scan" class="console-scan" aria-hidden="true" />
        <div class="console-identity-block">
          <ConsoleReticle
            :key="answer.balance.id"
            :icon="CHAIN_ICONS[answer.balance.chain] ?? 'i-lucide-link'"
          />
          <div class="console-name">
            <span class="console-label">Balance / {{ answer.balance.chain }}</span>
            <h3 class="console-name-mono">
              {{ answer.balance.amount }} {{ answer.balance.symbol }}
            </h3>
            <p class="console-about">
              What the explorer said for {{ answer.balance.id }} at
              {{ answer.balance.fetchedAt.slice(11, 19) }} UTC. The worker keeps it for five
              minutes.
            </p>
          </div>
        </div>
        <div class="console-readout">
          <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
            <circle cx="3" cy="12" r="2.5" />
            <path d="M5.5 12H14L22 20H32" />
          </svg>
          <dl :key="scan" class="console-readout-rows console-animate">
            <div :style="{ animationDelay: '0ms' }">
              <dt>Confirmed</dt>
              <dd class="console-accent">{{ answer.balance.confirmed }}</dd>
            </div>
            <div :style="{ animationDelay: '45ms' }">
              <dt>Unconfirmed</dt>
              <dd>{{ answer.balance.unconfirmed }}</dd>
            </div>
            <div :style="{ animationDelay: '90ms' }">
              <dt>Decimals</dt>
              <dd>{{ answer.balance.decimals }}</dd>
            </div>
            <div :style="{ animationDelay: '135ms' }">
              <dt>Fetched</dt>
              <dd>{{ answer.balance.fetchedAt }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-else-if="answer?.kind === 'stats'" class="console-band console-subject-band">
        <div :key="scan" class="console-scan" aria-hidden="true" />
        <div class="console-identity-block">
          <ConsoleReticle key="stats" icon="i-lucide-sigma" />
          <div class="console-name">
            <span class="console-label">Totals / every collection</span>
            <h3 class="console-name-mono">{{ answer.cells[0]?.value }} puzzles</h3>
            <p class="console-about">
              Every collection loaded and counted. The data version is the hash of all of them, so a
              changed record changes it.
            </p>
          </div>
        </div>
        <div class="console-readout">
          <svg class="console-link" viewBox="0 0 32 40" fill="none" aria-hidden="true">
            <circle cx="3" cy="12" r="2.5" />
            <path d="M5.5 12H14L22 20H32" />
          </svg>
          <dl :key="scan" class="console-readout-rows console-animate">
            <div
              v-for="(cell, index) in answer.cells"
              :key="cell.label"
              :style="{ animationDelay: `${index * 45}ms` }"
            >
              <dt>{{ cell.label }}</dt>
              <dd :class="{ 'console-accent': index === 0 }">{{ cell.value }}</dd>
            </div>
          </dl>
          <div class="console-gauge" aria-label="One tick per puzzle, the unsolved ones open">
            <span class="console-ticks console-ticks-dense" aria-hidden="true">
              <span
                v-for="(tick, index) in statsTicks(answer.cells)"
                :key="index"
                :class="tick === 'open' ? 'console-tick-open' : 'console-tick-closed'"
                :style="{ animationDelay: `${Math.min(index * 3, 720)}ms` }"
              />
            </span>
            <span class="console-gauge-read"
              >open {{ answer.cells.find((cell) => cell.label === "unsolved")?.value }} /
              {{ answer.cells[0]?.value }}</span
            >
          </div>
        </div>
      </div>

      <div
        v-else-if="answer?.kind === 'error'"
        class="console-band console-subject-band console-subject-band-single"
      >
        <div :key="scan" class="console-scan" aria-hidden="true" />
        <div class="console-identity-block">
          <ConsoleReticle :key="answer.message" icon="i-lucide-circle-alert" />
          <div class="console-name">
            <span class="console-label">Error / {{ current.tool }}</span>
            <h3 class="console-name-mono">{{ answer.name }}</h3>
            <p class="console-about">{{ answer.message }}</p>
            <p class="console-note">
              Known collections: {{ COLLECTIONS.map((entry) => entry.key).join(", ") }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="console-band console-subject-band console-subject-band-single">
        <p class="console-empty playground-loading">
          <UIcon name="i-lucide-loader-circle" class="size-3.5 animate-spin" aria-hidden="true" />
          Loading the library and the first collection.
        </p>
      </div>

      <ConsoleResponse
        v-if="answer !== undefined && answer.kind !== 'error'"
        :title="responseTitle"
        :text="answer.text"
      />

      <footer class="console-footer console-footer-plain">
        <ul class="console-links">
          <li v-if="answer?.kind === 'show'">
            <NuxtLink :to="`/collections/${answer.view.id}`"
              ><span aria-hidden="true">→ </span>puzzle page</NuxtLink
            >
          </li>
          <li v-if="answer?.kind === 'show' || answer?.kind === 'balance'">
            <button type="button" @click="operation = operation === 'show' ? 'verify' : 'show'">
              <span aria-hidden="true">→ </span
              >{{ operation === "show" ? "verify this record" : "show this record" }}
            </button>
          </li>
        </ul>
        <span class="console-meta"
          >{{ locality.toLowerCase()
          }}<template v-if="answer !== undefined">
            · {{ running ? "running" : `${elapsed} ms` }}</template
          ></span
        >
      </footer>
    </section>
  </div>
</template>

<style scoped>
.playground {
  display: grid;
  gap: 40px;
}
.playground-columns {
  display: grid;
  gap: 24px 48px;
}
.playground-column {
  min-width: 0;
}
@media (width >= 56rem) {
  .playground-columns {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}
@media (width >= 80rem) {
  .playground-ops {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
/* The playground carries more rows than a dossier, so its bands breathe a little wider. */
.playground .console-bar {
  padding-block: 12px;
}
.playground .console-band {
  padding: 22px 24px 24px;
}
.playground .console-rule-title {
  margin-bottom: 18px;
}
.playground .console-readout-rows > div {
  padding: 12px 16px;
}
.playground .console-chips {
  gap: 8px;
  margin-top: 18px;
}
.playground .console-chips button {
  padding: 3px 9px;
}
.playground .console-note {
  margin-top: 16px;
  line-height: 1.8;
}
.playground .console-snippet {
  padding: 12px 16px;
  line-height: 1.8;
}
.playground .console-footer {
  padding: 14px 24px;
}
.playground .console-rows li {
  padding: 12px 24px;
}
.playground .console-lead {
  margin-top: 12px;
}
.playground-band-first {
  border-top: 0;
}
.playground-tool-about {
  margin-top: 20px;
  font-size: 14px;
}
.playground-literal-title {
  margin: 18px 0 10px;
}
.playground-literal {
  font-size: 11.5px;
  overflow: visible;
}
.playground-ops {
  display: grid;
  gap: 0 40px;
  margin-top: -12px;
}
.playground-ops .console-lead {
  padding: 2px 0;
}
.playground-ops .console-lead > span:not(.console-tag, .console-leader) {
  white-space: nowrap;
}
.playground-trail {
  gap: 24px 36px;
}
.playground-balance {
  margin-top: 16px;
}
@media (width < 400px) {
  .playground .console-band,
  .playground .console-footer,
  .playground .console-rows li {
    padding-inline: 14px;
  }
}
.playground-ops .console-lead > span:not(.console-tag, .console-leader) {
  color: var(--ui-text-muted);
}
.playground-ops .console-lead[aria-pressed="true"] > span:not(.console-tag, .console-leader),
.playground-ops .console-lead:hover > span:not(.console-tag, .console-leader) {
  color: var(--ui-text-highlighted);
}
.playground-call {
  overflow-wrap: anywhere;
}
.playground-running {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.playground-trail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}
.playground-channels {
  margin: 0;
  min-width: 0;
}
.playground-channels dt > span,
.playground-target dt > span,
.playground-balance > .console-label > span {
  color: var(--ui-text-dimmed);
}
.playground-target {
  min-width: 0;
}
.playground-target .console-address {
  margin: 0;
}
.playground-balance {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 16px;
}
.playground-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.playground-band-empty {
  margin: 0;
}
.playground-list li {
  grid-template-columns: minmax(0, 1fr) auto;
}
.playground-prize,
.playground-address {
  display: none;
}
.playground-prize {
  color: var(--ui-text-dimmed);
}
.playground-address {
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.playground-collections li {
  grid-template-columns: 8rem minmax(0, 1fr) auto;
}
.playground-author {
  color: var(--ui-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.playground-statuses {
  display: none;
  color: var(--ui-text-dimmed);
}
.playground-count {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 4rem;
  color: var(--ui-text-highlighted);
}
@media (width >= 40rem) {
  .playground-list li {
    grid-template-columns: 12rem 6rem 7rem minmax(0, 1fr);
  }
  .playground-prize {
    display: block;
  }
  .playground-address {
    display: flex;
  }
  .playground-collections li {
    grid-template-columns: 8rem 10rem minmax(0, 1fr) 6rem;
  }
  .playground-statuses {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
@media (width < 900px) {
  .playground-trail {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
