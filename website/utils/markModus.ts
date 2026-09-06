/**
 * Wraps occurrences of "modus" (with optional trailing period) in <mark> tags
 * @param text - The text to process
 * @returns The text with modus wrapped in mark tags
 */
export function markModus(text: string): string {
  return text.replace(/modus\.?/gi, '<mark>$&</mark>')
}
