/**
 * Keeps the active collection visible without making the hero grow with the registry.
 *
 * @param {readonly string[]} keys - Collection keys in manifest order.
 * @param {string} active - The collection selected by the landing's shared clock.
 * @returns {{ start: number; keys: readonly string[] }} At most seven keys and their starting index.
 */
export function collectionWindow(
  keys: readonly string[],
  active: string,
): { start: number; keys: readonly string[] } {
  const size = 7;
  const index = Math.max(0, keys.indexOf(active));
  const start = Math.max(0, Math.min(index - Math.floor(size / 2), keys.length - size));
  return { start, keys: keys.slice(start, start + size) };
}
