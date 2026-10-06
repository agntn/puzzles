import { useCommitAssets } from "../../../src/core/asset-ref.ts";

/** Links the MCP tools hand out name the commit this site runs, where every new file is. */
export default defineNitroPlugin(() => {
  const { assetCommit } = useRuntimeConfig();
  if (assetCommit) {
    useCommitAssets(assetCommit);
  }
});
