import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";
import { WALK } from "../../docs/app/utils/landing.ts";
import { collectionKeys, collections, all } from "../../src/index.ts";
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
 * A count as the prose writes it.
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
 * README, the landing copy, and the guide pages that speak for the whole dataset.
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
    ...guide.sort(),
  ];
}

const files = proseFiles();
const puzzles = await all();
const expected = {
  tools: spellOut(Object.keys(facts.tools).length),
  factories: spellOut(chains.length),
} as const;

describe("the prose counts what the registry ships", () => {
  it("lists every collection in the registry class tree", async () => {
    const guide = readFileSync(path.join(root, "docs/content/1.guide/03.registry.md"), "utf8");
    const tree = guide.split("## Where the collections come from")[1] ?? "";
    for (const collection of await collections()) {
      expect(tree).toContain(collection.constructor.name);
    }
  });

  it("keeps the skills general instead of listing the collections", () => {
    const skills = readdirSync(path.join(root, "skills"), { recursive: true, encoding: "utf8" })
      .filter((name) => name.endsWith(".md"))
      .map((name) => readFileSync(path.join(root, "skills", name), "utf8"))
      .join("\n");
    const named = collectionKeys().filter((key) =>
      new RegExp(String.raw`[\x60"]${key}[\x60"/]|\b${key}/`).test(skills),
    );
    // A few collections serve as examples. The tools list the rest, so the skills do not grow with the dataset.
    expect(named.length, named.join(", ")).toBeLessThanOrEqual(5);
  });

  it("keeps the playground's sample counts aligned with the landing walk", () => {
    const guide = readFileSync(path.join(root, "docs/content/1.guide/10.playground.md"), "utf8");
    const paragraphs = guide.split("\n").filter((line) => line.includes("walk"));
    const counts = paragraphs.flatMap((line) => countsIn(line, "puzzles"));
    expect(counts).toEqual([spellOut(WALK.length), spellOut(WALK.length)]);
  });

  it("keeps Zden's documented key counts aligned with its records", () => {
    const guide = readFileSync(path.join(root, "docs/content/2.collections/03.zden.md"), "utf8");
    const zden = puzzles.filter((puzzle) => puzzle.collection() === "zden");
    expect(countsIn(guide, "carry the public key")).toEqual([
      spellOut(zden.filter((puzzle) => puzzle.hasPubkey()).length),
    ]);
    expect(countsIn(guide, "carry the private key")).toEqual([
      spellOut(zden.filter((puzzle) => puzzle.hasPrivateKey()).length),
    ]);
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
    for (const noun of ["tools", "factories"] as const) {
      expect(
        corpus.flatMap((text) => countsIn(text, noun)),
        noun,
      ).not.toHaveLength(0);
    }
  });

  it.each(files)("%s", (file) => {
    const text = readFileSync(path.join(root, file), "utf8");
    for (const noun of ["tools", "factories"] as const) {
      for (const count of countsIn(text, noun)) {
        expect(count, `${noun} in ${file}`).toBe(expected[noun]);
      }
    }
  });

  /*
   * How many puzzles, collections and populated chains the dataset holds changes with every record. The docs pages
   * ask the library through `:dataset-count` and `::dataset-stats`; README, frontmatter and the
   * site config cannot call it, so they do not quote the number at all.
   */
  it.each(files)("%s quotes no dataset total", (file) => {
    const text = readFileSync(path.join(root, file), "utf8");
    expect(countsIn(text, "collections"), `collections in ${file}`).toEqual([]);
    expect(countsIn(text, "chains"), `chains in ${file}`).toEqual([]);
    expect(text, `puzzle total in ${file}`).not.toMatch(
      new RegExp(String.raw`(?<![\d.])${puzzles.length}(?![\d.])`),
    );
  });
});
