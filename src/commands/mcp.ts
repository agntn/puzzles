import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "mcp",
    description: "Run the puzzle data MCP server over stdio",
  },
  /** citty resolves every subcommand to print usage, so the SDK loads here and `--help` stays light. */
  async run() {
    const [{ createMcpServer }, { StdioServerTransport }] = await Promise.all([
      import("../mcp.ts"),
      import("@modelcontextprotocol/sdk/server/stdio.js"),
    ]);
    await createMcpServer().connect(new StdioServerTransport());
  },
});
