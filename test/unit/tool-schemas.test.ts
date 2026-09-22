import { Value } from "typebox/value";
import { describe, expect, it } from "vite-plus/test";
import { puzzleToolSchemas } from "../../packages/shared/puzzles-tool-schemas.ts";
import { chains } from "../../src/core/chains.ts";
import { InvalidArgumentError } from "../../src/core/errors.ts";
import { authorTool, facts, hintsTool, listTool, showTool } from "../../src/tool-operations.ts";

const schemas = puzzleToolSchemas(facts);

describe("tool schemas and executors share one argument contract", () => {
  it("accepts the limit range the facts declare and rejects everything else", () => {
    expect(Value.Check(schemas.list, { limit: facts.parameters.limit.minimum })).toBe(true);
    expect(Value.Check(schemas.list, { limit: facts.parameters.limit.maximum })).toBe(true);
    expect(Value.Check(schemas.list, { limit: 0 })).toBe(false);
    expect(Value.Check(schemas.list, { limit: facts.parameters.limit.maximum + 1 })).toBe(false);
    expect(Value.Check(schemas.list, { limit: 1.5 })).toBe(false);
  });

  it("accepts only nonnegative safe integer offsets", () => {
    for (const offset of [0, 50, Number.MAX_SAFE_INTEGER]) {
      expect(Value.Check(schemas.list, { offset })).toBe(true);
    }
    for (const offset of [-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1, "50", null]) {
      expect(Value.Check(schemas.list, { offset })).toBe(false);
    }
    expect(schemas.list.properties.offset).toMatchObject(facts.parameters.offset);
  });

  it("accepts exactly the statuses the library defines", () => {
    for (const status of facts.statuses) {
      expect(Value.Check(schemas.list, { status })).toBe(true);
    }
    expect(Value.Check(schemas.list, { status: "bogus" })).toBe(false);
    expect(Value.Check(schemas.list, { status: "" })).toBe(false);
  });

  it("publishes list status as one enum that says what each value means", () => {
    const status = schemas.list.properties.status;

    expect(status).toMatchObject({
      enum: [...facts.statuses],
      description: facts.parameters.status.description,
    });
    expect(status).not.toHaveProperty("anyOf");
    expect(facts.parameters.status.description).toBe(
      "Lifecycle status: unsolved, solved, claimed (prize taken, key unpublished), swept (taken after the public key leaked), or expired (the author took it back)",
    );
  });

  it("accepts exactly the chains the library supports", () => {
    /* The facts spell the list out so tool discovery skips @agntn/chains; this is the pin. */
    expect(facts.chains).toEqual(chains);
    for (const chain of chains) {
      expect(Value.Check(schemas.list, { chain })).toBe(true);
    }
    expect(Value.Check(schemas.list, { chain: "solana" })).toBe(false);
    expect(Value.Check(schemas.list, { chain: "" })).toBe(false);
    expect(schemas.list.properties.chain).toMatchObject({
      enum: [...facts.chains],
      description: facts.parameters.chain.description,
    });
  });

  it("takes an address as free text the executor bounds, not an enum", () => {
    const { address } = facts.parameters;

    expect(Value.Check(schemas.list, { address: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH" })).toBe(true);
    expect(Value.Check(schemas.list, { address: "" })).toBe(false);
    expect(Value.Check(schemas.list, { address: "x".repeat(address.maxLength + 1) })).toBe(false);
    expect(Value.Check(schemas.list, { address: 42 })).toBe(false);
    expect(schemas.list.properties.address).toMatchObject(address);
  });

  it("bounds identifiers and keys the same way on every tool", () => {
    const { id, collection, apiKey } = facts.parameters;

    expect(Value.Check(schemas.show, { id: "" })).toBe(false);
    expect(Value.Check(schemas.show, { id: "x".repeat(id.maxLength + 1) })).toBe(false);
    expect(Value.Check(schemas.hints, { id: "" })).toBe(false);
    expect(Value.Check(schemas.hints, { id: "warp/challenge_1" })).toBe(true);
    expect(Value.Check(schemas.verify, { id: "b1000/1" })).toBe(true);
    expect(Value.Check(schemas.list, { collection: "x".repeat(collection.maxLength + 1) })).toBe(
      false,
    );
    expect(
      Value.Check(schemas.balance, { id: "b1000/1", apiKey: "x".repeat(apiKey.maxLength + 1) }),
    ).toBe(false);
  });

  it("bounds the author key like the executor does", async () => {
    const { author } = facts.parameters;

    expect(Value.Check(schemas.author, { key: "" })).toBe(false);
    expect(Value.Check(schemas.author, { key: "x".repeat(author.maxLength + 1) })).toBe(false);
    expect(Value.Check(schemas.author, { key: "peter-todd" })).toBe(true);
    expect(Value.Check(schemas.authors, {})).toBe(true);
    await expect(authorTool("")).rejects.toBeInstanceOf(InvalidArgumentError);
    await expect(authorTool("x".repeat(author.maxLength + 1))).rejects.toBeInstanceOf(
      InvalidArgumentError,
    );
  });

  it("tracks the facts, so a changed limit shows up in the schema", () => {
    /* Positive control for the guard above: a drifted table must produce a drifted schema. */
    const drifted = puzzleToolSchemas({
      ...facts,
      parameters: { ...facts.parameters, limit: { ...facts.parameters.limit, maximum: 600 } },
    });

    expect(Value.Check(drifted.list, { limit: 600 })).toBe(true);
    expect(Value.Check(schemas.list, { limit: 600 })).toBe(false);
  });

  it("enforces the same limits in the executors when a host skips validation", async () => {
    await expect(listTool({ limit: 0 })).rejects.toThrow(/limit/);
    await expect(listTool({ limit: 1.5 })).rejects.toThrow(/limit/);
    await expect(listTool({ limit: facts.parameters.limit.maximum + 1 })).rejects.toThrow(/limit/);
    await expect(listTool({ status: "bogus" })).rejects.toThrow(/status/);
    await expect(listTool({ chain: "solana" })).rejects.toThrow(/chain/);
    for (const chain of [42, null, {}, ["bitcoin"]]) {
      await expect(listTool({ chain } as never)).rejects.toThrow(InvalidArgumentError);
    }
    await expect(
      listTool({ collection: "x".repeat(facts.parameters.collection.maxLength + 1) }),
    ).rejects.toThrow(/collection/);
    await expect(listTool({ address: "" })).rejects.toThrow(/address/);
    await expect(
      listTool({ address: "x".repeat(facts.parameters.address.maxLength + 1) }),
    ).rejects.toThrow(/address/);
    for (const address of [42, null, {}, ["1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"]]) {
      await expect(listTool({ address } as never)).rejects.toThrow(InvalidArgumentError);
    }
    await expect(showTool("")).rejects.toThrow(/id/);
    await expect(showTool("x".repeat(facts.parameters.id.maxLength + 1))).rejects.toThrow(/id/);
    await expect(hintsTool("")).rejects.toThrow(/id/);
    await expect(hintsTool("x".repeat(facts.parameters.id.maxLength + 1))).rejects.toThrow(/id/);
    expect((await listTool({ collection: "gsmg", limit: 1 })).details).toMatchObject({
      matched: 1,
      returned: 1,
    });
  });
});
