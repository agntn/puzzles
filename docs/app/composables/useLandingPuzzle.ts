import * as library from "@agntn/puzzles";
import { showTool } from "@agntn/puzzles/tools";
import { LANDING_STATIC, WALK } from "../utils/landing";
import { toSample, type LandingSample } from "../utils/samples";

/**
 * One clock for every landing panel. The static samples render first. Each step then loads its
 * puzzle through `get()`, which imports that one collection module, and the registry panel lights
 * it up.
 *
 * @returns {object} The samples, the loaded collections, the clock and its controls.
 */
export function useLandingPuzzle() {
  const samples = ref<LandingSample[]>([...LANDING_STATIC]);
  const loaded = ref<string[]>([]);
  const tick = ref(0);
  const paused = ref(false);
  const index = computed(() => tick.value % samples.value.length);
  const current = computed(() => samples.value[index.value]!);

  let timer: number | undefined;
  const requested = new Set<string>();

  /**
   * Wraps at both ends, so the previous button on the first sample lands on the last one.
   *
   * @param {number} delta - Steps forward, or backward when negative.
   */
  function step(delta: number) {
    tick.value = (tick.value + delta + samples.value.length) % samples.value.length;
  }

  /**
   * Replaces the static copy of one sample with what the library computes in the browser.
   *
   * @param {string} id - The puzzle identifier to load.
   */
  async function load(id: string) {
    if (requested.has(id)) return;
    requested.add(id);
    const puzzle = await library.get(id);
    if (puzzle === undefined) return;
    const text = (await showTool(id)).content[0]?.text ?? "";
    const position = WALK.indexOf(id);
    if (position !== -1) {
      samples.value[position] = await toSample(library, puzzle, text);
    }
    const collection = puzzle.collection();
    if (!loaded.value.includes(collection)) {
      loaded.value = [...loaded.value, collection];
    }
  }

  function stopWalk() {
    if (timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  }

  function startWalk() {
    stopWalk();
    if (!import.meta.client || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    timer = window.setInterval(() => {
      if (!paused.value && !document.hidden) {
        step(1);
      }
    }, 4600);
  }

  onMounted(() => {
    void load(current.value.id);
    watch(
      () => current.value.id,
      (id) => {
        void load(id);
      },
    );
    startWalk();
  });
  onUnmounted(stopWalk);

  return { samples, loaded, tick, index, paused, current, step };
}
