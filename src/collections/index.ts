/**
 * Every collection shipped with the package, in manifest order. Only the key lives here. A module
 * is imported on the first lookup for its key, so importing the package evaluates no records and a
 * bundler splits each collection into its own chunk. The list keeps its literal type, so
 * `getCollection("b1000")` knows the query type of the collection it loads.
 */
export const builtins = [
  { key: "arweave", load: () => import("./arweave.ts").then((m) => m.arweave) },
  { key: "b1000", load: () => import("./b1000.ts").then((m) => m.b1000) },
  { key: "ballet", load: () => import("./ballet.ts").then((m) => m.ballet) },
  { key: "bitaps", load: () => import("./bitaps.ts").then((m) => m.bitaps) },
  { key: "bitimage", load: () => import("./bitimage.ts").then((m) => m.bitimage) },
  { key: "book-quiz", load: () => import("./book-quiz.ts").then((m) => m.bookQuiz) },
  {
    key: "brave-new-world",
    load: () => import("./brave-new-world.ts").then((m) => m.braveNewWorld),
  },
  { key: "coin-artist", load: () => import("./coin-artist.ts").then((m) => m.coinArtist) },
  { key: "dug", load: () => import("./dug.ts").then((m) => m.dug) },
  { key: "genesis", load: () => import("./genesis.ts").then((m) => m.genesis) },
  { key: "gsmg", load: () => import("./gsmg.ts").then((m) => m.gsmg) },
  { key: "hash-collision", load: () => import("./hash-collision.ts").then((m) => m.hashCollision) },
  {
    key: "iamabananaamaa",
    load: () => import("./iamabananaamaa.ts").then((m) => m.iAmABananaAmaa),
  },
  { key: "ktimesg", load: () => import("./ktimesg.ts").then((m) => m.kTimesG) },
  { key: "ledger-donjon", load: () => import("./ledger-donjon.ts").then((m) => m.ledgerDonjon) },
  { key: "luckylurker", load: () => import("./luckylurker.ts").then((m) => m.luckyLurker) },
  { key: "mineshop", load: () => import("./mineshop.ts").then((m) => m.mineshop) },
  { key: "mini", load: () => import("./mini.ts").then((m) => m.mini) },
  { key: "movie-enigma", load: () => import("./movie-enigma.ts").then((m) => m.movieEnigma) },
  {
    key: "picture-puzzle",
    load: () => import("./picture-puzzle.ts").then((m) => m.picturePuzzle),
  },
  { key: "quizchain", load: () => import("./quizchain.ts").then((m) => m.quizchain) },
  { key: "rushwallet", load: () => import("./rushwallet.ts").then((m) => m.rushwallet) },
  {
    key: "satoshi-birthday-quiz",
    load: () => import("./satoshi-birthday-quiz.ts").then((m) => m.satoshiBirthdayQuiz),
  },
  { key: "teikhos", load: () => import("./teikhos.ts").then((m) => m.teikhos) },
  { key: "warp", load: () => import("./warp.ts").then((m) => m.warp) },
  { key: "wickex", load: () => import("./wickex.ts").then((m) => m.wickex) },
  { key: "zden", load: () => import("./zden.ts").then((m) => m.zden) },
] as const;
