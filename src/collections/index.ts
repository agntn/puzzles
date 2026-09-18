import type { CollectionEntry } from "../core/registry.ts";

/**
 * Every collection shipped with the package, in manifest order. Only the key lives here. A module
 * is imported on the first lookup for its key, so importing the package evaluates no records and a
 * bundler splits each collection into its own chunk.
 */
export const builtins: readonly CollectionEntry[] = [
  { key: "arweave", load: () => import("./arweave.ts").then((m) => m.arweave) },
  { key: "b1000", load: () => import("./b1000.ts").then((m) => m.b1000) },
  { key: "ballet", load: () => import("./ballet.ts").then((m) => m.ballet) },
  { key: "bitaps", load: () => import("./bitaps.ts").then((m) => m.bitaps) },
  { key: "bitimage", load: () => import("./bitimage.ts").then((m) => m.bitimage) },
  { key: "gsmg", load: () => import("./gsmg.ts").then((m) => m.gsmg) },
  { key: "hash_collision", load: () => import("./hash-collision.ts").then((m) => m.hashCollision) },
  { key: "rushwallet", load: () => import("./rushwallet.ts").then((m) => m.rushwallet) },
  { key: "warp", load: () => import("./warp.ts").then((m) => m.warp) },
  { key: "zden", load: () => import("./zden.ts").then((m) => m.zden) },
];
