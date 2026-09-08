export const ALL_SEARCH = "All";

export type UnitSearchValues = {
  relation: string;
  type: string;
  city: string;
  neighborhood: string;
};

const SEARCH_KEYS = ["relation", "type", "city", "neighborhood"] as const;

export function readUnitSearch(searchParams: { get: (name: string) => string | null }): UnitSearchValues {
  const get = (key: string) => searchParams.get(key)?.trim() || ALL_SEARCH;
  return {
    relation: get("relation"),
    type: get("type"),
    city: get("city"),
    neighborhood: get("neighborhood"),
  };
}

export function unitSearchHref(
  values: Partial<UnitSearchValues>,
  current?: { toString: () => string }
) {
  const next = new URLSearchParams(current?.toString() || "");
  SEARCH_KEYS.forEach((key) => {
    if (values[key] === undefined) return;
    const value = values[key];
    if (!value || value === ALL_SEARCH) next.delete(key);
    else next.set(key, value);
  });
  const query = next.toString();
  return query ? `/units?${query}` : "/units";
}
