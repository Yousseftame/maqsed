export function normalizeAdInfo(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item === "string") {
      const text = item.trim();
      return text ? [text] : [];
    }
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const text = String(record.text || record.value || "").trim();
      return text ? [text] : [];
    }
    return [];
  });
}

export function sanitizeAdInfo(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean);
}
