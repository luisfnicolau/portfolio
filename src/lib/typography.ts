const NBSP = " ";

/**
 * Keeps numbers with their units and arrows with what they point from, so a line never breaks
 * inside "~1.49 s" or starts with "→".
 */
export function tidy(text: string): string {
  return text
    .replace(/(\d) (ms|s|GB|MB|KB|×)(?=[\s,.;:)]|$)/g, `$1${NBSP}$2`)
    .replace(/ →/g, `${NBSP}→`);
}
