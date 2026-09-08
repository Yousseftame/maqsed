import type { Locale } from "@/lib/i18n/types";

const SHORT_HOSTS = new Set(["maps.app.goo.gl", "goo.gl", "maps.app.goo.gle"]);

function hostname(url: URL) {
  return url.hostname.toLowerCase().replace(/^www\./, "");
}

export function isGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = hostname(url);
    if (SHORT_HOSTS.has(host) || host.endsWith(".goo.gl")) return true;
    if (host === "maps.google.com" || host.endsWith(".maps.google.com")) return true;
    if (host === "google.com" || host.startsWith("google.") || host.includes(".google.")) {
      return url.pathname.startsWith("/maps");
    }
    return false;
  } catch {
    return false;
  }
}

function isShortMapsUrl(value: string): boolean {
  try {
    const host = hostname(new URL(value));
    return SHORT_HOSTS.has(host) || host.endsWith(".goo.gl");
  } catch {
    return false;
  }
}

export function toGoogleMapsEmbed(url: string, locale: Locale = "ar"): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const lang = locale === "ar" ? "ar" : "en";

  if (/\/maps\/embed/i.test(trimmed) || /[?&]output=embed/i.test(trimmed)) {
    return trimmed;
  }

  const atMatch = trimmed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(\d+(?:\.\d+)?)z)?/);
  if (atMatch) {
    const zoom = atMatch[3] || "16";
    return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&z=${Math.round(Number(zoom) || 16)}&hl=${lang}&output=embed`;
  }

  const dataMatch = trimmed.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (dataMatch) {
    return `https://maps.google.com/maps?q=${dataMatch[1]},${dataMatch[2]}&z=16&hl=${lang}&output=embed`;
  }

  try {
    const parsed = new URL(trimmed);
    const query =
      parsed.searchParams.get("q") ||
      parsed.searchParams.get("query") ||
      parsed.searchParams.get("ll") ||
      parsed.searchParams.get("destination");
    if (query && !/^https?:\/\//i.test(query)) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=${lang}&output=embed`;
    }

    const place = parsed.pathname.match(/\/maps\/place\/([^/]+)/i);
    if (place?.[1]) {
      return `https://maps.google.com/maps?q=${place[1]}&z=16&hl=${lang}&output=embed`;
    }
  } catch {
    /* use fallback */
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&z=16&hl=${lang}&output=embed`;
}

export async function resolveGoogleMapsUrl(input: string): Promise<string> {
  let current = input.trim();
  if (!isGoogleMapsUrl(current)) return current;

  for (let i = 0; i < 6 && isShortMapsUrl(current); i += 1) {
    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const location = response.headers.get("location");
    if (!location) break;

    const next = new URL(location, current).toString();
    if (!isGoogleMapsUrl(next)) break;
    current = next;
  }

  return current;
}
