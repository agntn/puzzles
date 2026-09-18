# Live test scope

## Scope

Manual roundtrips against the public explorers behind `Puzzle.balance()`. Not part of `pnpm test`, `pnpm test:packed`, release, or publish CI.

## Conventions

- Run with `pnpm test:live`; the Ethereum case needs `ETHERSCAN_API_KEY` and skips without it.
- Assert shape and chain, not drifting amounts.
- Keep an explicit timeout on the cases that wait on a slow public instance, such as dcrdata.
