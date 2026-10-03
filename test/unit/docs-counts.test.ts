import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";
import { WALK } from "../../docs/app/utils/landing.ts";
import { collectionKeys, collections, all, Status, type Puzzle } from "../../src/index.ts";
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

/** The nouns a hint count stands in front of: hints, and the author's messages in OP_RETURN. */
const HINTS = String.raw`(?:(?:official|community|public) )*hints?|(?:Bitcoin )?OP_RETURN (?:messages|replies)`;

const numberWords = new Set(Array.from({ length: 100 }, (_, count) => spellOut(count)));

/**
 * Every count in front of a noun, as a word or in digits: `twelve collections`, `7 tools`.
 *
 * @param {string} text - Prose to scan.
 * @param {string} noun - The plural noun the count precedes, as a regular expression fragment.
 * @returns {string[]} The counts, each as the word `spellOut` writes.
 */
function countsIn(text: string, noun: string): string[] {
  const counts: string[] = [];
  const qualifier = noun === "tools" ? "(?: agent)?" : "";
  const pattern = new RegExp(
    String.raw`(?<!#)\b([A-Za-z]+(?:-[A-Za-z]+)?|\d{1,2})${qualifier} (?:${noun})\b`,
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
    "docs/AGENTS.md",
    "docs/content/index.md",
    "docs/content/2.collections/00.index.md",
    "docs/app/app.config.ts",
    "docs/nuxt.config.ts",
    "docs/app/components/content/LandingHome.vue",
    ...guide.sort(),
  ];
}

/**
 * The pages about a puzzle that is still open: its collection page, its author's page and its story.
 *
 * @param {readonly Puzzle[]} puzzles - Every record in the registry.
 * @returns {Promise<string[]>} Paths relative to the repository root.
 */
async function livePages(puzzles: readonly Puzzle[]): Promise<string[]> {
  const open = puzzles.filter((puzzle) => puzzle.status() === Status.Unsolved);
  const keys = new Set(open.map((puzzle) => puzzle.collection()));
  const ids = new Set(open.map((puzzle) => puzzle.id()));
  const authors = new Set(
    (await collections())
      .filter((collection) => keys.has(collection.key))
      .map((collection) => collection.author.key),
  );
  const pages = (dir: string, keep: (key: string, text: string) => boolean) =>
    readdirSync(path.join(root, dir), { recursive: true, encoding: "utf8" })
      .filter((name) => name.endsWith(".md"))
      .filter((name) =>
        keep(name.slice(0, -".md".length), readFileSync(path.join(root, dir, name), "utf8")),
      )
      .map((name) => path.join(dir, name));
  return [
    ...pages("docs/content/2.collections", (name) => keys.has(name.replace(/^\d+\./, ""))),
    ...pages("docs/content/3.authors", (_, text) =>
      authors.has(/::author-facts\{author="([^"]+)"\}/.exec(text)?.[1]),
    ),
    ...pages("docs/stories", (name) => ids.has(name)),
  ].sort();
}

/**
 * A page without its fenced blocks, which quote a record the way its source file writes it.
 *
 * @param {string} text - Markdown.
 * @returns {string} The prose around the blocks.
 */
function outsideFences(text: string): string {
  return text.replaceAll(/^```[\s\S]*?^```/gm, "");
}

const files = proseFiles();
const puzzles = await all();
const live = await livePages(puzzles);
const expected = {
  tools: spellOut(Object.keys(facts.tools).length),
} as const;

describe("the prose counts what the registry ships", () => {
  it("lists every collection in the registry class tree", async () => {
    const guide = readFileSync(path.join(root, "docs/content/1.guide/03.registry.md"), "utf8");
    const tree = guide.split("## Where the collections come from")[1] ?? "";
    for (const collection of await collections()) {
      expect(tree).toContain(collection.constructor.name);
    }
  });

  it("names only manifest keys in the collectionKeys() example", () => {
    const guide = readFileSync(path.join(root, "docs/content/1.guide/03.registry.md"), "utf8");
    const example = /^collectionKeys\(\); \/\/ \[(.*)\]/m.exec(guide)?.[1] ?? "";
    const named = [...example.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
    expect(named).not.toHaveLength(0);
    expect(collectionKeys()).toEqual(expect.arrayContaining(named));
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
    expect(countsIn("Eleven singletons, the 11 singleton ids", "singleton(?:s| ids)")).toEqual([
      "eleven",
      "eleven",
    ]);
    expect(countsIn("Twenty-six authors, puzzles authors", "authors")).toEqual(["twenty-six"]);
    expect(
      countsIn("22 Bitcoin OP_RETURN messages, two hints, Vault #2 hints, two replies", HINTS),
    ).toEqual(["twenty-two", "two"]);
    expect(
      countsIn(
        outsideFences('Four hints.\n```ts\nfact("one of the twelve hints")\n```\nOne hint.'),
        HINTS,
      ),
    ).toEqual(["four", "one"]);
    expect(live).toContain("docs/content/2.collections/15.genesis.md");
    expect(live).toContain("docs/content/3.authors/11.genesis-author.md");
    const corpus = files.map((file) => readFileSync(path.join(root, file), "utf8"));
    expect(corpus.flatMap((text) => countsIn(text, "tools"))).not.toHaveLength(0);
  });

  it.each(files)("%s", (file) => {
    const text = readFileSync(path.join(root, file), "utf8");
    for (const count of countsIn(text, "tools")) {
      expect(count, `tools in ${file}`).toBe(expected.tools);
    }
  });

  /*
   * How many puzzles, collections, singletons, authors and populated chains the dataset holds changes with every
   * record. The docs pages ask the library through `:dataset-count` and `::dataset-stats`; README, frontmatter and
   * the site config cannot call it, so they do not quote the number at all.
   */
  it.each(files)("%s quotes no dataset total", (file) => {
    const text = readFileSync(path.join(root, file), "utf8");
    for (const noun of ["collections", "chains", "authors", "singleton(?:s| ids)"]) {
      expect(countsIn(text, noun), `${noun} in ${file}`).toEqual([]);
    }
    expect(text, `puzzle total in ${file}`).not.toMatch(
      new RegExp(String.raw`(?<![\d.])${puzzles.length}(?![\d.])`),
    );
  });

  /*
   * An open puzzle keeps gaining hints: Genesis answers in OP_RETURN every few days. Its collection page, its
   * author's page and its story ask `:dataset-count{of="hints"}` for the number instead of spelling it out.
   */
  it.each(live)("%s quotes no hint count of an open puzzle", (file) => {
    const text = outsideFences(readFileSync(path.join(root, file), "utf8"));
    expect(countsIn(text, HINTS), `hints in ${file}`).toEqual([]);
  });
});
