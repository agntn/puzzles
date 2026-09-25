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
  { key: "book_quiz", load: () => import("./book_quiz.ts").then((m) => m.bookQuiz) },
  { key: "coin_artist", load: () => import("./coin_artist.ts").then((m) => m.coinArtist) },
  { key: "dug", load: () => import("./dug.ts").then((m) => m.dug) },
  { key: "genesis", load: () => import("./genesis.ts").then((m) => m.genesis) },
  { key: "gsmg", load: () => import("./gsmg.ts").then((m) => m.gsmg) },
  { key: "hash_collision", load: () => import("./hash_collision.ts").then((m) => m.hashCollision) },
  {
    key: "iamabananaamaa",
    load: () => import("./iamabananaamaa.ts").then((m) => m.iAmABananaAmaa),
  },
  { key: "ktimesg", load: () => import("./ktimesg.ts").then((m) => m.kTimesG) },
  { key: "ledger_donjon", load: () => import("./ledger_donjon.ts").then((m) => m.ledgerDonjon) },
  { key: "luckylurker", load: () => import("./luckylurker.ts").then((m) => m.luckyLurker) },
  { key: "mineshop", load: () => import("./mineshop.ts").then((m) => m.mineshop) },
  { key: "mini", load: () => import("./mini.ts").then((m) => m.mini) },
  { key: "movie_enigma", load: () => import("./movie_enigma.ts").then((m) => m.movieEnigma) },
  {
    key: "picture_puzzle",
    load: () => import("./picture_puzzle.ts").then((m) => m.picturePuzzle),
  },
  { key: "quizchain", load: () => import("./quizchain.ts").then((m) => m.quizchain) },
  { key: "rushwallet", load: () => import("./rushwallet.ts").then((m) => m.rushwallet) },
  {
    key: "satoshi_birthday_quiz",
    load: () => import("./satoshi_birthday_quiz.ts").then((m) => m.satoshiBirthdayQuiz),
  },
  { key: "warp", load: () => import("./warp.ts").then((m) => m.warp) },
  { key: "wickex", load: () => import("./wickex.ts").then((m) => m.wickex) },
  { key: "zden", load: () => import("./zden.ts").then((m) => m.zden) },
] as const;
