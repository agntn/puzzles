/**
 * Relative links that answer from a puzzle page: `assets/` on this site, the rest on GitHub.
 *
 * @param {string} markdown - The file's text.
 * @param {string} path - The file's path from the repository root.
 * @param {string} repository - The repository's GitHub URL.
 * @returns {string} The text with every relative link made absolute.
 */
export function resolveFileLinks(markdown: string, path: string, repository: string): string {
  const base = new URL(path, "https://repo.invalid/");
  return markdown.replaceAll(/(\]\()([^)\s]+)/gu, (match, open: string, target: string) => {
    if (/^(?:[a-z][a-z\d+.-]*:|#|\/)/iu.test(target)) return match;
    const resolved = new URL(target, base);
    const file = decodeURIComponent(resolved.pathname.slice(1));
    const href = file.startsWith("assets/")
      ? `/${file.split("/").map(encodeURIComponent).join("/")}`
      : `${repository}/blob/main/${file}`;
    return `${open}${href}${resolved.hash}`;
  });
}

/** What a read of one file gave: its text, or why there's none. */
export type FileText = { readonly text: string } | { readonly reason: string };

/**
 * Reads a file the site serves as text, the way the viewer shows it.
 *
 * @param {string} url - The file's site path.
 * @returns {Promise<FileText>} The text, or the status or error that stopped it.
 */
export async function readFileText(url: string): Promise<FileText> {
  try {
    const response = await fetch(url);
    return response.ok ? { text: await response.text() } : { reason: `HTTP ${response.status}` };
  } catch (error) {
    return { reason: error instanceof Error ? error.message : String(error) };
  }
}
