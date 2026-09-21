import { describe, expect, it } from "vitest";
import { LANDING_STATIC } from "../../docs/app/utils/landing.ts";
import { tokenizeToolResponse } from "../../docs/app/utils/tool-response.ts";

describe("tool response highlighting", () => {
  it("preserves every sample response exactly", () => {
    for (const sample of LANDING_STATIC) {
      const tokens = tokenizeToolResponse(sample.tool);
      expect(tokens.map((token) => token.text).join(""), sample.id).toBe(sample.tool);
    }
  });

  it("distinguishes labels, values, dates, hashes, statuses and URLs", () => {
    const text =
      "private key: unknown\nstarted: 2026-06-20 09:52:36\n  funding 0.00063126 BTC\nhash160: 0dd36fda9a3e1258ab5e265619a01013f6bbbaa2\nsource: https://example.com/2026/test\n";
    const tokens = tokenizeToolResponse(text);
    expect(tokens).toContainEqual({ text: "private key:", kind: "label" });
    expect(tokens).toContainEqual({ text: "unknown", kind: "status" });
    expect(tokens).toContainEqual({ text: "2026-06-20 09:52:36", kind: "date" });
    expect(tokens).toContainEqual({ text: "0.00063126 BTC", kind: "number" });
    expect(tokens).toContainEqual({
      text: "0dd36fda9a3e1258ab5e265619a01013f6bbbaa2",
      kind: "hash",
    });
    expect(tokens).toContainEqual({ text: "https://example.com/2026/test", kind: "url" });
    expect(tokens.map((token) => token.text).join("")).toBe(text);
  });

  it("preserves empty input, CRLF, tabs and markup as text", () => {
    expect(tokenizeToolResponse("")).toEqual([]);
    const text = '\t<script>alert("1")</script>\r\nkey: <img src=x onerror=alert(1)>\r\n';
    expect(
      tokenizeToolResponse(text)
        .map((token) => token.text)
        .join(""),
    ).toBe(text);
  });
});
