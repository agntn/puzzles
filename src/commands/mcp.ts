import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "mcp",
    description: "Run the puzzle data MCP server over stdio",
  },
  /** citty resolves every subcommand for `--help`, so the server and the SDK load only here. */
  async run() {
    const [{ createMcpServer }, { StdioServerTransport }] = await Promise.all([
      import("../mcp.ts"),
      import("@modelcontextprotocol/server/stdio"),
    ]);
    await createMcpServer().connect(new StdioServerTransport());
  },
});
