/**
 * The text of the first content part of an MCP tool result, or an empty string when it has none.
 *
 * @param {unknown} result - What `client.callTool()` returned.
 * @returns {string} The text.
 */
export function firstText(result: unknown): string {
  if (typeof result !== "object" || result === null || !("content" in result)) {
    return "";
  }
  const { content } = result;
  if (!Array.isArray(content)) {
    return "";
  }
  const first: unknown = content[0];
  return typeof first === "object" && first !== null && "text" in first ? String(first.text) : "";
}
