/**
 * Resolves a file from /public against the site's base path, so "/images/hero.jpg" also works
 * when the site lives in a sub-folder (GitHub Pages: https://user.github.io/repo-name/).
 * Full URLs are returned unchanged.
 */
export function asset(path: string): string {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
