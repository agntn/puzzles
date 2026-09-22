/** A missing puzzle must not resolve the verification crypto. Run from the package root. */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

const roots = new Set<string>();

/**
 * Classifies one resolved module as signing crypto, or leaves it out.
 *
 * @param {string} url - Module URL from the resolve hook.
 * @returns {void}
 */
function note(url: string): void {
  if (/\/core\/verify\.(?:ts|mjs)(?:[?#]|$)/u.test(url)) {
    roots.add("verify");
  } else if (/\/core\/crypto\.(?:ts|mjs)(?:[?#]|$)/u.test(url)) {
    roots.add("crypto");
  } else if (url.includes("/node_modules/@agntn/keys/")) {
    roots.add("keys");
  } else if (url.includes("/node_modules/@noble/curves/")) {
    roots.add("curves");
  }
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    const resolved = nextResolve(specifier, context);
    note(resolved.url);
    return resolved;
  },
});

const { verifyTool } = await import("../src/tool-operations.ts");
const miss = "b1000/99999";

try {
  await verifyTool(miss);
  assert.fail(`${miss} resolved to a puzzle`);
} catch (error) {
  assert.match(
    error instanceof Error ? error.message : String(error),
    new RegExp(`^Puzzle not found: ${miss}\\. Collection b1000 holds `, "u"),
  );
}

assert.deepEqual([...roots].sort(), [], "a missing puzzle resolved the verification crypto");

const result = await verifyTool("b1000/1");
assert.match(result.content[0]?.text ?? "", /^b1000\/1: verified,/u);
assert.ok(roots.has("keys"), "verifying b1000/1 never resolved @agntn/keys");

console.log(JSON.stringify({ miss, cryptoOnMiss: 0, verified: true }));
