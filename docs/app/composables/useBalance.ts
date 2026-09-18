import type { BalanceAnswer } from "../../server/api/balance/[...id]";
import { fetchErrorData } from "../utils/format";

export type BalanceState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly balance: BalanceAnswer }
  | { readonly status: "failed"; readonly error: string };

/**
 * Mirrors the `puzzles_balance` text in `src/tool-operations.ts`: `<id>: <units> on <chain>`.
 *
 * @param {BalanceAnswer} balance - The worker's answer.
 * @returns {string} The line the tool would print.
 */
export function balanceText(balance: BalanceAnswer): string {
  return `${balance.id}: ${balance.units} on ${balance.chain}`;
}

/**
 * The worker's route for one puzzle's balance, every path segment encoded on its own.
 *
 * @param {string} id - The puzzle identifier.
 * @returns {string} The path under `/api/balance/`.
 */
export function balanceApiPath(id: string): string {
  return `/api/balance/${id.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * The message of a failed `$fetch`: the worker's own text when it sent one, the error's otherwise.
 *
 * @param {unknown} error - Whatever `$fetch` rejected with.
 * @returns {string} A sentence for the balance line.
 */
function failureText(error: unknown): string {
  const { message } = fetchErrorData(error);
  if (message !== undefined && message !== "") return message;
  return error instanceof Error ? error.message : String(error);
}

/**
 * The live balance of one puzzle through the worker's `/api/balance/:id`, loaded after mount so a
 * prerendered page never bakes a number in. Only the newest request writes the state.
 *
 * @param {() => string} id - Reads the current puzzle identifier.
 * @returns {{ state: Ref<BalanceState>; load: () => Promise<void> }} The state and a way to ask again.
 */
export function useBalance(id: () => string) {
  const state = ref<BalanceState>({ status: "idle" });
  let sequence = 0;

  async function load() {
    const mine = ++sequence;
    const current = id();
    if (current === "") {
      state.value = { status: "idle" };
      return;
    }
    state.value = { status: "loading" };
    let next: BalanceState;
    try {
      next = { status: "ready", balance: await $fetch<BalanceAnswer>(balanceApiPath(current)) };
    } catch (error) {
      next = { status: "failed", error: failureText(error) };
    }
    if (mine === sequence) state.value = next;
  }

  onMounted(() => {
    void load();
    watch(id, () => {
      void load();
    });
  });

  return { state, load };
}
