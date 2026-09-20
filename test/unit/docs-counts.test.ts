import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { all, collectionKeys, collections } from "../../src/index.ts";
import { chains } from "../../src/core/chains.ts";
import { facts } from "../../src/tool-operations.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));

const ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/**
 * A count as the prose writes it. Kept local so this file never imports `docs/app`.
 *
 * @param {number} count - A whole number from 0 through 99.
 * @returns {string} The English word, lowercase.
 */
function spellOut(count: number): string {
  if (count < 0 || count >= 100) {
    throw new RangeError(`prose count ${count} is outside 0-99`);
  }
  if (count < 20) return ONES[count]!;
  const ones = count % 10;
  const tens = TENS[(count - ones) / 10]!;
  return ones === 0 ? tens : `${tens}-${ONES[ones]}`;
}

const numberWords = new Set(Array.from({ length: 100 }, (_, count) => spellOut(count)));

/**
 * Every count in front of a noun, as a word or in digits: `twelve collections`, `7 tools`.
 *
 * @param {string} text - Prose to scan.
 * @param {string} noun - The plural noun the count precedes.
 * @returns {string[]} The counts, each as the word `spellOut` writes.
 */
function countsIn(text: string, noun: string): string[] {
  const counts: string[] = [];
  const qualifier = noun === "tools" ? "(?: agent)?" : "";
  const pattern = new RegExp(
    String.raw`\b([A-Za-z]+(?:-[A-Za-z]+)?|\d{1,2})${qualifier} ${noun}\b`,
    "gi",
  );
  for (const match of text.matchAll(pattern)) {
    const token = match[1]!;
    const word = /^\d+$/.test(token) ? spellOut(Number(token)) : token.toLowerCase();
    if (numberWords.has(word)) counts.push(word);
  }
  return counts;
}

/**
 * README, the skill, the landing copy, and the guide pages that speak for the whole dataset.
 *
 * @returns {string[]} Paths relative to the repository root.
 */
function proseFiles(): string[] {
  const guide = readdirSync(path.join(root, "docs/content/1.guide"), {
    recursive: true,
    encoding: "utf8",
  })
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join("docs/content/1.guide", name));
  return [
    "README.md",
    "AGENTS.md",
    "docs/content/index.md",
    "docs/content/2.collections/00.index.md",
    "docs/app/app.config.ts",
    "docs/nuxt.config.ts",
    "docs/app/components/content/LandingHome.vue",
    "skills/puzzles/SKILL.md",
    ...guide.sort(),
  ];
}

const files = proseFiles();
const puzzles = await all();
const populatedChains = new Set(puzzles.map((puzzle) => puzzle.chain()));
const expected = {
  collections: spellOut(collectionKeys().length),
  tools: spellOut(Object.keys(facts.tools).length),
  factories: spellOut(chains.length),
  chains: spellOut(populatedChains.size),
} as const;

describe("the prose counts what the registry ships", () => {
  it("lists every collection in the skill's ID table and the registry class tree", async () => {
    const skill = readFileSync(path.join(root, "skills/puzzles/SKILL.md"), "utf8");
    const table = skill.split("## Puzzle ID format")[1]?.split("## Library")[0] ?? "";
    const guide = readFileSync(path.join(root, "docs/content/1.guide/03.registry.md"), "utf8");
    const tree = guide.split("## Where the collections come from")[1] ?? "";
    for (const collection of await collections()) {
      expect(table).toContain(`| \`${collection.key}\``);
      expect(tree).toContain(collection.constructor.name);
    }
  });

  it("finds the counts it checks", () => {
    expect(countsIn("Twelve collections on five chains, 12 collections", "collections")).toEqual([
      "twelve",
      "twelve",
    ]);
    expect(countsIn("Seven tools, seven agent tools, 7 tools", "tools")).toEqual([
      "seven",
      "seven",
      "seven",
    ]);
    expect(countsIn("Six factories, five chains", "factories")).toEqual(["six"]);
    expect(countsIn("Six factories, five chains", "chains")).toEqual(["five"]);
    expect(countsIn("Twenty collections, 20 collections", "collections")).toEqual([
      "twenty",
      "twenty",
    ]);
    expect(countsIn("the other eleven, 50 puzzles by default", "collections")).toHaveLength(0);
    const corpus = files.map((file) => readFileSync(path.join(root, file), "utf8"));
    for (const noun of ["collections", "tools", "factories", "chains"] as const) {
      expect(
        corpus.flatMap((text) => countsIn(text, noun)),
        noun,
      ).not.toHaveLength(0);
    }
  });

  it.each(files)("%s", (file) => {
    const text = readFileSync(path.join(root, file), "utf8");
    for (const noun of ["collections", "tools", "factories", "chains"] as const) {
      for (const count of countsIn(text, noun)) {
        expect(count, `${noun} in ${file}`).toBe(expected[noun]);
      }
    }
  });
});
