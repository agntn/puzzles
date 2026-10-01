import { validateInput, type ToolDefinition } from "@agntn/tools";
import { describe, expect, it } from "vite-plus/test";
import { chains } from "../../src/core/chains.ts";
import { InvalidArgumentError } from "../../src/core/errors.ts";
import {
  authorTool,
  facts,
  hintsTool,
  listTool,
  showTool,
  stagesTool,
  solverTool,
  toolArguments,
} from "../../src/tool-operations.ts";
import { puzzlesTools } from "../../src/tools.ts";

/** Each definition under the short name `facts.tools` and `toolArguments` use. */
const schemas = Object.fromEntries(
  Object.entries(facts.tools).map(([short, { name }]) => [
    short,
    puzzlesTools.find((tool) => tool.name === name) as ToolDefinition,
  ]),
) as Record<keyof typeof facts.tools, ToolDefinition>;

/* Whether the core validation every surface runs accepts the arguments. */
const check = (tool: keyof typeof facts.tools, args: unknown): boolean =>
  validateInput(schemas[tool], args).ok;

describe("tool schemas and executors share one argument contract", () => {
  it("accepts the limit range the facts declare and rejects everything else", () => {
    expect(check("list", { limit: facts.parameters.limit.minimum })).toBe(true);
    expect(check("list", { limit: facts.parameters.limit.maximum })).toBe(true);
    expect(check("list", { limit: 0 })).toBe(false);
    expect(check("list", { limit: facts.parameters.limit.maximum + 1 })).toBe(false);
    expect(check("list", { limit: 1.5 })).toBe(false);
  });

  it("accepts only nonnegative safe integer offsets", () => {
    for (const offset of [0, 50, Number.MAX_SAFE_INTEGER]) {
      expect(check("list", { offset })).toBe(true);
    }
    for (const offset of [-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1, "50", null]) {
      expect(check("list", { offset })).toBe(false);
    }
    expect(schemas.list.input.properties.offset).toMatchObject(facts.parameters.offset);
  });

  it("accepts exactly the statuses the library defines", () => {
    for (const status of facts.statuses) {
      expect(check("list", { status })).toBe(true);
    }
    expect(check("list", { status: "bogus" })).toBe(false);
    expect(check("list", { status: "" })).toBe(false);
  });

  it("publishes list status as one enum that says what each value means", () => {
    const status = schemas.list.input.properties.status;

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
      expect(check("list", { chain })).toBe(true);
    }
    expect(check("list", { chain: "solana" })).toBe(false);
    expect(check("list", { chain: "" })).toBe(false);
    expect(schemas.list.input.properties.chain).toMatchObject({
      enum: [...facts.chains],
      description: facts.parameters.chain.description,
    });
  });

  it("takes an address as free text the executor bounds, not an enum", () => {
    const { address } = facts.parameters;

    expect(check("list", { address: "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH" })).toBe(true);
    expect(check("list", { address: "" })).toBe(false);
    expect(check("list", { address: "x".repeat(address.maxLength + 1) })).toBe(false);
    expect(check("list", { address: 42 })).toBe(false);
    expect(schemas.list.input.properties.address).toMatchObject(address);
  });

  it("bounds identifiers and keys the same way on every tool", () => {
    const { id, collection, apiKey } = facts.parameters;

    expect(check("show", { id: "" })).toBe(false);
    expect(check("show", { id: "x".repeat(id.maxLength + 1) })).toBe(false);
    expect(check("hints", { id: "" })).toBe(false);
    expect(check("hints", { id: "warp/challenge-1" })).toBe(true);
    expect(check("stages", { id: "" })).toBe(false);
    expect(check("stages", { id: "gsmg" })).toBe(true);
    expect(check("verify", { id: "b1000/1" })).toBe(true);
    expect(check("list", { collection: "" })).toBe(false);
    expect(check("list", { collection: "x".repeat(collection.maxLength + 1) })).toBe(false);
    expect(check("balance", { id: "b1000/1", apiKey: "x".repeat(apiKey.maxLength + 1) })).toBe(
      false,
    );
  });

  it("bounds the author key like the executor does", async () => {
    const { author } = facts.parameters;

    expect(check("author", { key: "" })).toBe(false);
    expect(check("author", { key: "x".repeat(author.maxLength + 1) })).toBe(false);
    expect(check("author", { key: "peter-todd" })).toBe(true);
    expect(check("authors", {})).toBe(true);
    await expect(authorTool("")).rejects.toBeInstanceOf(InvalidArgumentError);
    await expect(authorTool("x".repeat(author.maxLength + 1))).rejects.toBeInstanceOf(
      InvalidArgumentError,
    );
  });

  it("bounds the solver key like the executor does", async () => {
    const { solver } = facts.parameters;

    expect(check("solver", { key: "" })).toBe(false);
    expect(check("solver", { key: "x".repeat(solver.maxLength + 1) })).toBe(false);
    expect(check("solver", { key: "retired-coder" })).toBe(true);
    expect(check("solvers", {})).toBe(true);
    await expect(solverTool("")).rejects.toBeInstanceOf(InvalidArgumentError);
    await expect(solverTool("x".repeat(solver.maxLength + 1))).rejects.toBeInstanceOf(
      InvalidArgumentError,
    );
  });

  it("rejects a key no tool parameter declares, except on the tools that take none", () => {
    for (const [tool, schema] of Object.entries(schemas)) {
      const declared = Object.keys(schema.input.properties);
      if (declared.length === 0) {
        expect(check(tool as keyof typeof schemas, { _: "" }), tool).toBe(true);
      } else {
        expect(schema.input, tool).toMatchObject({ additionalProperties: false });
        expect(check(tool as keyof typeof schemas, { stray: true }), tool).toBe(false);
      }
    }
    expect(check("list", { with_pubkey: true })).toBe(false);
    expect(check("list", { withPubkey: true })).toBe(true);
  });

  it("names the same arguments in the executors' table as in each schema", () => {
    for (const [tool, schema] of Object.entries(schemas)) {
      expect([...toolArguments[tool as keyof typeof toolArguments]].sort(), tool).toEqual(
        Object.keys(schema.input.properties).sort(),
      );
    }
    expect(Object.keys(toolArguments).sort()).toEqual(Object.keys(facts.tools).sort());
  });

  it("builds every parameter from its entry in the facts", () => {
    for (const schema of Object.values(schemas)) {
      for (const [parameter, property] of Object.entries(schema.input.properties)) {
        const fact = parameter === "key" ? undefined : facts.parameters[parameter as "id"];
        if (fact !== undefined) {
          expect(property, `${schema.name} ${parameter}`).toMatchObject(fact);
        }
      }
    }
    expect(schemas.author.input.properties["key"]).toMatchObject(facts.parameters.author);
    expect(schemas.solver.input.properties["key"]).toMatchObject(facts.parameters.solver);
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
    await expect(listTool({ collection: "" })).rejects.toThrow("Invalid collection");
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
    await expect(stagesTool("")).rejects.toThrow(/id/);
    await expect(stagesTool("x".repeat(facts.parameters.id.maxLength + 1))).rejects.toThrow(/id/);
    await expect(listTool({ with_pubkey: true } as never)).rejects.toThrow(
      'Invalid arguments: unknown property "with_pubkey", expected one of address, chain, collection, limit, offset, status, withPubkey',
    );
    for (const params of [null, "b1000", ["b1000"]]) {
      await expect(listTool(params as never)).rejects.toThrow(
        "Invalid arguments: expected an object",
      );
    }
    await expect(listTool({ collection: "gsmg", state: "solved" } as never)).rejects.toThrow(
      InvalidArgumentError,
    );
    expect((await listTool({ collection: "gsmg", limit: 1 })).details).toMatchObject({
      matched: 1,
      returned: 1,
    });
  });
});
