---
name: puzzles
description: Look up public crypto puzzles, bounties and challenges in the @agntn/puzzles dataset through its puzzles_* agent tools or the `puzzles` CLI. Use when a task asks what puzzles exist, which address belongs to which puzzle, what the author hinted, whether a recorded key checks out, or how much is still on a prize address. For code that imports the package use puzzles-library; for adding or fixing a record use puzzles-records.
metadata:
  author: oritwoen
  version: "0.21.2"
---

# puzzles

The dataset grows, so this skill does not list what is in it. Ask the tools. They read the same registry as the library and answer from the installed version, which is the only list that is never stale.

## Find your way in

1. **What exists.** `puzzles_collections` gives every collection with its author and status counts. `puzzles_stats` gives dataset totals. Both are local and cheap.
2. **Which puzzles.** `puzzles_list` with a `collection`, `chain`, `status` or `withPubkey` filter. Holding an address, pass it as `address` instead of paging. An empty result means no puzzle pays there.
3. **One puzzle.** `puzzles_show` with an identifier taken from a list row. Then `puzzles_hints` for what the author and the community said, with sources, and `puzzles_stages` when the puzzle runs in several stages, to see which ones already have a public answer.
4. **Checks.** `puzzles_verify` derives the address from the recorded key material, locally. `puzzles_balance` is the only call that reaches the network.
5. **Who.** `puzzles_authors` and `puzzles_author` for who published a collection and what public pages say about them. `puzzles_solvers` and `puzzles_solver` for who took a prize and what else they solved; `puzzles_solver` also takes a puzzle identifier, so `b1000/135` answers with its solver.

No tools in this harness? The CLI prints the same answers: `puzzles collections`, `puzzles list`, `puzzles show <id> --json`, `puzzles hints <id>`, `puzzles stages <id>`, `puzzles verify <id>`, `puzzles balance <id>`, `puzzles authors [key]`, `puzzles solvers [key]`. Run it without installing through `pnpm dlx @agntn/puzzles <command>`, or expose the tools with `puzzles mcp`.

## Identifiers

An identifier is `collection/name`, for example `b1000/90`. A collection with a single puzzle uses its key alone, like `gsmg`, with no slash. Do not build identifiers from a pattern you expect. Copy them from a `puzzles_list` row. A miss is cheap anyway: it names the known collections, or how many puzzles the collection holds with one real identifier.

## Reading the answers

- **Status** is recorded, never guessed from the chain. `solved` means the solution is public. `claimed` means the prize is gone and the key is not published. `swept` means someone took it after the public key leaked. `expired` means the author took it back. Everything else is `unsolved`.
- **Absent means unknown.** A record leaves out what nobody published: no key, no solver, no prize. Nothing is null, and a missing field is not a zero.
- **A hint is not a fact.** `official` comes from the puzzle's author, `community` from anyone else, and neither says the hint is right. The `source` is where it was published. A published `answer` responds to one hint and is not a verified key.
- **An unverifiable puzzle is an answer.** `puzzles_verify` reports `unverifiable` when the record holds no key material. That is a result, not a tool error. `not verified` is the one to worry about: the recorded key does not derive the address.
- **Balances are live.** Ethereum needs an Etherscan key through `apiKey` or `ETHERSCAN_API_KEY`. There is no retry or rate limiting, so don't loop the call over hundreds of addresses.

## Pitfalls

- Listing the whole dataset to find one address or one collection. Use the filter the tool already takes.
- Raising `limit` to see more rows. Follow the returned next offset with the same filters instead.
- Treating a status count or a balance from an earlier call as current after the dataset or the chain moved.
- Reading `unsolved` as "nobody knows anything". Check `puzzles_hints` first, since part of the answer may already be public.

## Related

- [puzzles-library](../puzzles-library/SKILL.md) for the TypeScript API behind the tools.
- [puzzles-records](../puzzles-records/SKILL.md) for adding or fixing a record in the repository.
