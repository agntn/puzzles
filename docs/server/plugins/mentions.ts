/** Toolkit 0.23 includes `types/hooks` without `.d.ts`, so its hook names load from here. */
import type {} from "../../node_modules/@nuxtjs/mcp-toolkit/dist/runtime/server/types/hooks.js";
import { facts } from "../../../src/tool-operations.ts";

/** ChatGPT finds its `@` picker tool in the server capabilities, and the toolkit can't set them. */
export default defineNitroPlugin(() => {
  useNitroApp().hooks.hook("mcp:server:created", ({ server }) => {
    server.server.registerCapabilities({
      extensions: { "openai/mentions": { searchTool: facts.publicTools.mentions.name } },
    });
  });
});
