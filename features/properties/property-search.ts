export const ALL_SEARCH = "All";
export const PROPERTIES_RESULTS_ID = "properties-results";

export type PropertySearchValues = {
  status: string;
  type: string;
  city: string;
  neighborhood: string;
};

const SEARCH_KEYS = ["status", "type", "city", "neighborhood"] as const;

export function readPropertySearch(searchParams: { get: (name: string) => string | null }): PropertySearchValues {
  const get = (key: string) => searchParams.get(key)?.trim() || ALL_SEARCH;
  return {
    status: get("status"),
    type: get("type"),
    city: get("city"),
    neighborhood: get("neighborhood"),
  };
}

export function propertySearchHref(
  values: Partial<PropertySearchValues>,
  current?: { toString: () => string }
) {
  const next = new URLSearchParams(current?.toString() || "");
  next.delete("floor");
  next.delete("budget");
  SEARCH_KEYS.forEach((key) => {
    if (values[key] === undefined) return;
    const value = values[key];
    if (!value || value === ALL_SEARCH) next.delete(key);
    else next.set(key, value);
  });
  const query = next.toString();
  return query ? `/properties?${query}` : "/properties";
}

export function propertySearchResultsHref(values: Partial<PropertySearchValues>) {
  return `${propertySearchHref(values)}#${PROPERTIES_RESULTS_ID}`;
}

export function isPublicProjectStatus(status: string | undefined) {
  const value = String(status || "").toLowerCase().replace(/\s+/g, "");
  return value === "active" || value === "soon" || value === "upcoming" || value === "soldout";
}
