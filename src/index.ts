export { version } from "./version.ts";

/** Collections load on demand through the registry. Import one directly from `@agntn/puzzles/collections/<key>`. */
export { builtins } from "./collections/index.ts";

export {
  Collection,
  NamedCollection,
  NumericCollection,
  SingletonCollection,
} from "./core/collection.ts";

export {
  ArweavePuzzle,
  arweavePuzzle,
  BitcoinPuzzle,
  bitcoinPuzzle,
  DecredPuzzle,
  decredPuzzle,
  EthereumPuzzle,
  ethereumPuzzle,
  LitecoinPuzzle,
  litecoinPuzzle,
  MoneroPuzzle,
  moneroPuzzle,
  Puzzle,
  Status,
  type AssetLink,
  type PuzzleData,
  type PuzzleSpec,
} from "./core/puzzle.ts";

export {
  AddressKind,
  answer,
  assets,
  bits,
  compressed,
  claim,
  community,
  confirmation,
  decrease,
  derivation,
  encryptedWif,
  funding,
  hex,
  HintKind,
  increase,
  Key,
  mini,
  official,
  p2pkh,
  p2sh,
  p2wpkh,
  party,
  passphrase,
  profile,
  pubkeyReveal,
  PubkeyFormat,
  redeemScript,
  secretOf,
  seed,
  share,
  shares,
  source,
  standard,
  sweep,
  TransactionType,
  uncompressed,
  wif,
  type Address,
  type Answer,
  type Assets,
  type Confirmation,
  type Entropy,
  type EntropySource,
  type Hint,
  type HintOptions,
  type KeyData,
  type Party,
  type Passphrase,
  type Profile,
  type Pubkey,
  type RedeemScript,
  type Secret,
  type Seed,
  type Share,
  type Shares,
  type Transaction,
  type Wif,
} from "./core/parts.ts";

export {
  collectionKeys,
  collections,
  getCollection,
  hasCollection,
  registerCollection,
  requireCollection,
  type AnyCollection,
  type CollectionEntry,
} from "./core/registry.ts";

export {
  all,
  collectionSummaries,
  dataset,
  datasetCollections,
  dataVersion,
  get,
  requirePuzzle,
  selectPuzzles,
  stats,
  type CollectionSummary,
  type Dataset,
  type DatasetCollection,
  type PuzzleQuery,
  type Stats,
} from "./core/dataset.ts";

export {
  addressExplorerUrl,
  Chain,
  chainDecimals,
  chainName,
  chains,
  chainSymbol,
  isValidAddress,
  isValidTransactionId,
  parseChain,
  transactionExplorerUrl,
} from "./core/chains.ts";

export {
  BalanceError,
  BalanceProviderError,
  InvalidAddressError,
  UnsupportedChainError,
  type BalanceOptions,
} from "./core/balance.ts";

export { Balance } from "./core/types.ts";

export {
  InvalidArgumentError,
  PuzzleNotFoundError,
  PuzzlesError,
  UnknownCollectionError,
} from "./core/errors.ts";

export {
  verifyPuzzle,
  type VerifyFailure,
  type VerifyResult,
  type VerifySuccess,
} from "./core/verify.ts";
