# Types

## Puzzle

Every puzzle is a record built by a factory for its chain and read through the abstract `Puzzle` contract. Reads are methods, and a record only declares what the puzzle actually has.

```ts
abstract class Puzzle {
  // required, the last one comes from the chain base
  abstract id(): string; // "b1000/66", "gsmg"
  abstract address(): Address;
  abstract sourceUrl(): string;
  abstract startedAt(): string;
  abstract chain(): Chain;

  // optional, defaults in parentheses
  status(): Status; // (unsolved)
  pubkey(): Pubkey | undefined;
  key(): Readonly<Key> | undefined;
  prize(): number | undefined;
  currency(): string | undefined;
  solvedAt(): string | undefined;
  solveTime(): number | undefined; // seconds
  preGenesis(): boolean; // (false)
  transactions(): readonly Transaction[]; // ([])
  solver(): Party | undefined;
  assets(): Assets | undefined;
  hints(): readonly Hint[]; // ([])
}
```

Per-chain bases fill in `chain()`: `BitcoinPuzzle`, `EthereumPuzzle`, `LitecoinPuzzle`, `DecredPuzzle`, `ArweavePuzzle`, `MoneroPuzzle`.

### Derived methods

```ts
puzzle.collection(); // "b1000"
puzzle.name(); // "66"
puzzle.keyData(); // serializable key material, or undefined
puzzle.prizeCurrency(); // explicit currency, else the chain symbol
puzzle.hasPubkey();
puzzle.hasPrivateKey();
puzzle.keyRange(); // readonly [bigint, bigint] | undefined
puzzle.transaction(type);
puzzle.fundingTransaction();
puzzle.claimTransaction();
puzzle.formattedSolveTime(); // "1y 2mo 3d"
puzzle.assetPath(); // "assets/zden/level_4/puzzle.png"
puzzle.assetUrl(); // raw GitHub URL
/** Each file with its kind, path and URL: the image, the hints, the solution. */
puzzle.assetLinks();
await puzzle.balance({ apiKey?, baseUrl?, timeout? }); // Balance through the chain's @agntn/explorers provider
puzzle.explorerUrl();
puzzle.claimExplorerUrl();
puzzle.toJSON(); // PuzzleData, absent fields omitted
```

## Building a puzzle

Constructors from `parts.ts` keep optional fields absent instead of empty:

```ts
p2pkh(value, hash160?);
p2wpkh(value, hash160?);
p2wsh(value);
p2sh(value, hash160, redeemScript(hash, script)?);
standard(value, hash160?); // Ethereum, Arweave

compressed(value);
uncompressed(value);

funding(txid, date, amount);
increase(txid, date, amount);
decrease(txid, date, amount);
pubkeyReveal(txid, date, amount);
claim(txid, date, amount);
sweep(txid, date, amount);

assets({ puzzle, solution, hints, sourceUrl });
party(name, { addresses, profiles });
profile(name, url);
official(text, source, confirmation(url, description?), { date? }); // from the author
community(text, source, confirmation(url, description?), { date? }); // from anyone else, right or not
```

A hint's `source` is where it was published and `confirmation` is what shows the source said it, an archive capture, the author's reply or a transaction. Neither says the hint is right; `kind` says who gave it. A hint shared by a whole collection sits on the collection once, `super(key, author, puzzles, hints)`, and a puzzle inherits it:

```ts
collection.hints; // readonly Hint[], the shared ones
collection.hintsFor(query); // the collection's, then the puzzle's own
collection.hintsById(id);
```

Key material chains from whichever starter fits, then adds what else is known:

```ts
hex("00…01", 1).wif("KwDi…"); // raw key plus its WIF, 1-bit search space
bits(135); // nothing published beyond the range
wif("5J34…").passphrase("HY4r0uWn").salt("a@b.c"); // WarpWallet
encryptedWif("6PnW…", { passphrase: "335Y-…" }); // BIP38
passphrase("594Y-…"); // passphrase known, key not published
seed("session cigar grape…", "m/84'/0'/0'/0/0").xpub("zpub…");
derivation("m/84'/0'/0'/0/0").shares(3, 5, [share(1, "…"), share(2, "…")]);
mini("S6c56bnX…");
seed("…", "m/44'/0'/0'/0/0").entropy("1808d3…", source(url, "kitten tweet"), "Required");
```

## Serialized shapes

```ts
interface Address {
  value: string;
  kind: "p2pkh" | "p2sh" | "p2wpkh" | "p2wsh" | "standard";
  hash160?: string;
  redeem_script?: RedeemScript;
}

interface KeyData {
  hex?: string; // 64-character hex
  bits?: number; // search-space width
  wif?: Wif; // encrypted / decrypted / passphrase / salt
  seed?: Seed; // phrase, path, xpub, entropy
  mini?: string;
  shares?: Shares;
}

interface Transaction {
  tx_type: TransactionType;
  txid: string;
  date: string;
  amount: number;
}

interface Hint {
  kind: "official" | "community";
  text: string; // one line, as the source states it
  source: string; // URL
  confirmation: { url: string; description?: string };
  date?: string;
}
```

`PuzzleData` is what `toJSON()` returns: `id`, `chain`, `address`, `status`, `source_url`, `start_date`, plus whatever the puzzle overrode.

## Chain

```ts
const Chain: {
  Arweave: "arweave";
  Bitcoin: "bitcoin";
  Decred: "decred";
  Ethereum: "ethereum";
  Litecoin: "litecoin";
  Monero: "monero";
};

chainSymbol(chain); // "BTC"
chainName(chain); // "Bitcoin"
chainDecimals(chain); // 8
parseChain("btc"); // "bitcoin" | undefined, also @agntn/chains aliases such as "mainnet"
addressExplorerUrl(chain, address); // on the chain's default explorer from @agntn/chains
transactionExplorerUrl(chain, txid);
isValidAddress(chain, address); // format check from @agntn/chains
isValidTransactionId(chain, txid);
```

Names, symbols, decimals, explorer bases, and address rules come from `@agntn/chains`; `Chain` is the six-key subset this dataset uses.

## Balance

```ts
class Balance {
  readonly chain: Chain;
  readonly confirmed: bigint; // base units
  readonly unconfirmed: bigint; // signed mempool delta, 0n when the provider has none
  readonly decimals: number;
  total(): bigint;
  confirmedUnits(): number;
  totalUnits(): number;
}

interface BalanceOptions {
  apiKey?: string; // Etherscan requires one
  baseUrl?: string; // override the provider endpoint
  timeout?: number; // milliseconds, provider default 15 s
}
// Errors: InvalidAddressError, UnsupportedChainError (Monero), BalanceProviderError; API keys are redacted.
```

## Verification

```ts
verifyPuzzle(puzzle); // VerifyResult, synchronous
await collection.verify(query); // Promise<VerifyResult>, loads the crypto on first use
secretOf(puzzle.keyData()); // Secret | undefined: hex, wif, encrypted, seed (with a phrase), or mini

type VerifyResult = VerifySuccess | VerifyFailure;
// success: { verified: true, privateKey, derivedAddress, expectedAddress, error: null }
// failure: { verified: false, privateKey: null, derivedAddress, expectedAddress, error, unavailable }
```

## Registry and dataset

```ts
// Synchronous, from the manifest: nothing is loaded.
builtins; // readonly CollectionEntry[]: { key, load: () => Promise<Collection> }
collectionKeys(); // keys in registration order
hasCollection(name); // canonical key or historical alias
registerCollection(collection); // an instance, or { key, load } for a lazy one

// Asynchronous: a collection module is imported on first use.
await getCollection(name); // Collection | undefined
await requireCollection(name); // throws UnknownCollectionError
await collections(); // every instance, registration order, shared array until the next registration
await collectionSummaries(); // { key, author, total, claimed, expired, solved, swept, unsolved }[]
await all(); // every puzzle instance
await selectPuzzles({ address?, collection?, chain?, status?, withPubkey? }); // filtered across the registry
await get(id); // Puzzle | undefined, exact identifier only, loads one collection
await requirePuzzle(id); // throws PuzzleNotFoundError
await stats(); // totals, status counts, prize sums
await dataVersion(); // deterministic 12-char hash
await dataset(); // { version, data_version, collections }

// One collection, synchronous, through its own entry.
import { b1000, B1000Collection } from "@agntn/puzzles/collections/b1000";
```

## Errors

`PuzzlesError` covers `PuzzleNotFoundError` and `UnknownCollectionError`.
`BalanceError` covers `InvalidAddressError`, `UnsupportedChainError`, and `BalanceProviderError`.
