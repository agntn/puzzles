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
import { COLLECTIONS, STATUSES } from "../../utils/puzzles";
import { WALK } from "../../utils/landing";
import { toPuzzleView, type PuzzleView } from "../../utils/puzzle-view";
import { statusCountLabels } from "../../../../src/core/utils.ts";
import { fetchErrorData, formatPrize, shellArg, shorten, verdictLabel } from "../../utils/format";

type Operation = "show" | "list" | "verify" | "balance" | "collections" | "stats";

const OPERATIONS: ReadonlyArray<{ key: Operation; label: string; tool: string }> = [
  { key: "show", label: "Show", tool: facts.tools.show.name },
  { key: "list", label: "List", tool: facts.tools.list.name },
  { key: "verify", label: "Verify", tool: facts.tools.verify.name },
  { key: "balance", label: "Balance", tool: facts.tools.balance.name },
  { key: "collections", label: "Collections", tool: facts.tools.collections.name },
  { key: "stats", label: "Stats", tool: facts.tools.stats.name },
];

const NOTES: Readonly<Record<Operation, string>> = {
  show: "",
  verify: "",
  balance: "",
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
  let next: Answer;
  try {
    next = await compute();
  } catch (error) {
    next = failure(error);
  }
  if (mine === sequence) {
    answer.value = next;
    running.value = false;
  }
}

const current = computed(() => OPERATIONS.find((row) => row.key === operation.value)!);

/** The same call as one CLI line. */
const cliLine = computed(() => {
  if (needsId.value) return `puzzles ${operation.value} ${shellArg(id.value.trim())}`;
  if (!isList.value) return `puzzles ${operation.value}`;
  const parts = ["puzzles list"];
  if (collection.value) parts.push(shellArg(collection.value));
  if (status.value) parts.push(`--status ${status.value}`);
  if (withPubkey.value) parts.push("--with-pubkey");
  return parts.join(" ");
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
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
    <form class="puzzles-frame flex flex-col gap-5 self-start rounded-xl p-5" @submit.prevent>
      <div class="puzzles-seg flex-wrap" role="group" aria-label="Operation">
        <button
          v-for="row in OPERATIONS"
          :key="row.key"
          type="button"
          :aria-pressed="operation === row.key"
          @click="operation = row.key"
        >
          {{ row.label }}
        </button>
      </div>

      <label v-if="needsId" class="flex flex-col gap-1.5">
        <span class="puzzles-eyebrow"
          >id<span class="normal-case tracking-normal text-dimmed">
            · collection/name, or the key of a singleton</span
          ></span
        >
        <input
          v-model="id"
          class="puzzles-field"
          type="text"
          placeholder="b1000/71, gsmg, zden/decred_janus"
          spellcheck="false"
          autocomplete="off"
          list="puzzles-ids"
        />
        <datalist id="puzzles-ids">
          <option v-for="sampleId in WALK" :key="sampleId" :value="sampleId" />
        </datalist>
      </label>

      <template v-if="isList">
        <label class="flex flex-col gap-1.5">
          <span class="puzzles-eyebrow">collection</span>
          <select v-model="collection" class="puzzles-field">
            <option value="">every collection</option>
            <option v-for="row in COLLECTIONS" :key="row.key" :value="row.key">
              {{ row.key }} · {{ row.title }}
            </option>
          </select>
        </label>
        <label class="flex flex-col gap-1.5">
          <span class="puzzles-eyebrow">status</span>
          <select v-model="status" class="puzzles-field">
            <option value="">any status</option>
            <option v-for="row in STATUSES" :key="row" :value="row">{{ row }}</option>
          </select>
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex flex-col gap-1.5">
            <span class="puzzles-eyebrow">limit</span>
            <input
              v-model="limit"
              class="puzzles-field"
              type="text"
              inputmode="numeric"
              spellcheck="false"
            />
          </label>
          <label class="flex items-end gap-2 pb-2 text-sm text-muted">
            <input
              v-model="withPubkey"
              type="checkbox"
              class="size-4 accent-[var(--puzzles-fill)]"
            />
            <span>only with a public key</span>
          </label>
        </div>
      </template>

      <div v-if="needsId">
        <p class="puzzles-eyebrow mb-2">samples · one per collection at least</p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="sampleId in WALK"
            :key="sampleId"
            type="button"
            class="puzzles-chip"
            :class="{ 'puzzles-chip-ok': id.trim() === sampleId }"
            @click="loadSample(sampleId)"
          >
            {{ sampleId }}
          </button>
        </div>
      </div>
      <p v-if="NOTES[operation] !== ''" class="text-[12px] leading-5 text-dimmed">
        {{ NOTES[operation] }}
      </p>
      <p v-if="operation === 'balance'" class="text-[12px] leading-5 text-dimmed">
        The worker asks the chain's explorer and caches the answer for five minutes. Ethereum needs
        the Etherscan key the worker holds. The CLI reads yours from ETHERSCAN_API_KEY.
      </p>
    </form>

    <div class="flex min-w-0 flex-col gap-4">
      <div class="puzzles-frame overflow-hidden rounded-xl">
        <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
          <p class="min-w-0 truncate font-mono text-xs text-muted">
            <span class="text-dimmed">{{ current.tool }}</span>
            <span class="ms-2 text-highlighted">{{ needsId ? `("${id.trim()}")` : "()" }}</span>
          </p>
          <span v-if="running" class="puzzles-state shrink-0">
            <UIcon name="i-lucide-loader-circle" class="size-3 animate-spin" />
            running
          </span>
          <span
            v-else-if="answer?.kind === 'verify'"
            class="puzzles-state shrink-0"
            :class="
              answer.verified
                ? 'puzzles-state-ok'
                : answer.unavailable
                  ? ''
                  : 'puzzles-state-failed'
            "
          >
            {{ verdictLabel(answer.verified, answer.unavailable) }}
          </span>
          <span
            v-else-if="answer?.kind === 'error'"
            class="puzzles-state puzzles-state-failed shrink-0"
          >
            {{ answer.name }}
          </span>
        </div>

        <div v-if="answer?.kind === 'show'" class="p-3">
          <PuzzleCard :view="answer.view" compact />
          <pre class="puzzles-tool mt-3 rounded-lg bg-muted! p-4! text-sm">{{ answer.text }}</pre>
        </div>

        <template v-else-if="answer?.kind === 'list'">
          <ol class="divide-y divide-muted">
            <li
              v-for="row in answer.rows"
              :key="row.id"
              class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-2.5 font-mono text-[12px] sm:grid-cols-[10rem_6rem_7rem_minmax(0,1fr)]"
            >
              <NuxtLink
                :to="`/collections/${row.id}`"
                class="truncate text-highlighted hover:underline"
                >{{ row.id }}</NuxtLink
              >
              <StatusPill :status="row.status" />
              <span class="hidden text-dimmed sm:block">{{ row.prize }}</span>
              <button
                type="button"
                class="hidden truncate text-left text-muted hover:text-highlighted sm:block"
                :title="row.address"
                @click="loadSample(row.id)"
              >
                {{ shorten(row.address, 14, 8) }}
              </button>
            </li>
          </ol>
          <p class="border-t border-muted px-4 py-3 font-mono text-[11px] text-dimmed">
            {{ answer.rows.length }} of {{ answer.matched }} matching puzzles · an id opens its
            page, an address shows it here
          </p>
        </template>

        <div v-else-if="answer?.kind === 'verify'" class="px-4 py-4">
          <p class="text-sm leading-6" :class="answer.verified ? 'text-highlighted' : 'text-muted'">
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
          <pre class="puzzles-output mt-3 rounded-lg bg-muted text-sm">{{ answer.text }}</pre>
        </div>

        <div v-else-if="answer?.kind === 'balance'" class="px-4 py-4">
          <p class="font-mono text-2xl text-highlighted">
            {{ answer.balance.amount }} {{ answer.balance.symbol }}
          </p>
          <p class="mt-1 font-mono text-[11px] text-dimmed">
            {{ answer.balance.confirmed }} confirmed · {{ answer.balance.unconfirmed }} unconfirmed
            base units · {{ answer.balance.decimals }} decimals · fetched
            {{ answer.balance.fetchedAt.slice(11, 19) }} UTC
          </p>
          <pre class="puzzles-output mt-3 rounded-lg bg-muted text-sm">{{ answer.text }}</pre>
        </div>

        <template v-else-if="answer?.kind === 'collections'">
          <ol class="divide-y divide-muted">
            <li
              v-for="row in answer.rows"
              :key="row.key"
              class="grid grid-cols-[7rem_3rem_1fr] gap-3 px-4 py-2.5 font-mono text-[12px] sm:grid-cols-[8rem_3rem_16rem_1fr]"
            >
              <NuxtLink :to="`/collections/${row.key}`" class="text-highlighted hover:underline">{{
                row.key
              }}</NuxtLink>
              <span class="text-muted">{{ row.total }}</span>
              <span class="hidden text-dimmed sm:block">{{
                statusCountLabels(row).join(" · ")
              }}</span>
              <span class="truncate text-muted">{{ row.author ?? "unknown" }}</span>
            </li>
          </ol>
          <pre class="puzzles-output border-t border-muted text-sm">{{ answer.text }}</pre>
        </template>

        <template v-else-if="answer?.kind === 'stats'">
          <FactGrid :facts="answer.cells.map((cell) => ({ ...cell, mono: true }))" :columns="4" />
          <pre class="puzzles-output border-t border-muted text-sm">{{ answer.text }}</pre>
        </template>

        <div v-else-if="answer?.kind === 'error'" class="px-4 py-5">
          <p class="text-sm leading-6 text-muted">{{ answer.message }}</p>
          <p class="mt-2 font-mono text-[11px] text-dimmed">
            Known collections: {{ COLLECTIONS.map((entry) => entry.key).join(", ") }}
          </p>
        </div>

        <div v-else class="px-4 py-5">
          <p class="inline-flex items-center gap-2 text-sm leading-6 text-dimmed">
            <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
            Loading the library and the first collection.
          </p>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="puzzles-frame overflow-hidden rounded-xl">
          <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
            <p class="font-mono text-xs text-muted">
              <UIcon
                name="i-vscode-icons-file-type-shell"
                class="me-1 inline size-3.5 align-[-2px]"
              />
              <span class="text-highlighted">CLI</span>
            </p>
            <button
              type="button"
              class="puzzles-copy"
              :data-copied="copiedKey === 'cli'"
              @click="copy('cli', cliLine)"
            >
              <UIcon
                :name="copiedKey === 'cli' ? 'i-lucide-check' : 'i-lucide-copy'"
                class="size-3.5"
              />
              {{ copiedKey === "cli" ? "copied" : "copy" }}
            </button>
          </div>
          <pre
            class="puzzles-rotating"
          ><code><span class="text-dimmed">$ </span>{{ cliLine }}</code></pre>
        </div>

        <div class="puzzles-frame overflow-hidden rounded-xl">
          <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3">
            <p class="min-w-0 truncate font-mono text-xs text-muted">
              <UIcon
                name="i-vscode-icons-file-type-json"
                class="me-1 inline size-3.5 align-[-2px]"
              />
              <span class="text-highlighted">{{ current.tool }}</span>
            </p>
            <div class="flex shrink-0 items-center gap-1">
              <button
                type="button"
                class="puzzles-copy"
                :data-copied="copiedKey === 'link'"
                @click="copy('link', shareLink)"
              >
                <UIcon
                  :name="copiedKey === 'link' ? 'i-lucide-check' : 'i-lucide-arrow-up-right'"
                  class="size-3.5"
                />
                {{ copiedKey === "link" ? "copied" : "permalink" }}
              </button>
              <button
                type="button"
                class="puzzles-copy"
                :data-copied="copiedKey === 'tool'"
                @click="copy('tool', toolCall)"
              >
                <UIcon
                  :name="copiedKey === 'tool' ? 'i-lucide-check' : 'i-lucide-copy'"
                  class="size-3.5"
                />
                {{ copiedKey === "tool" ? "copied" : "copy" }}
              </button>
            </div>
          </div>
          <pre class="puzzles-rotating"><code>{{ toolCall }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
