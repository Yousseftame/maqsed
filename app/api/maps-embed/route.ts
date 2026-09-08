import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/lib/i18n/types";
import {
  isGoogleMapsUrl,
  resolveGoogleMapsUrl,
  toGoogleMapsEmbed,
} from "@/lib/google-maps-embed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url") || "";
  const locale: Locale = isLocale(searchParams.get("hl")) ? (searchParams.get("hl") as Locale) : "ar";

  if (!isGoogleMapsUrl(raw)) {
    return new NextResponse("Invalid maps url", { status: 400 });
  }

  try {
    const resolved = await resolveGoogleMapsUrl(raw);
    const embed = toGoogleMapsEmbed(resolved, locale);
    if (!embed) {
      return new NextResponse("Could not build embed", { status: 400 });
    }
    return NextResponse.redirect(embed, 302);
  } catch {
    return new NextResponse("Could not resolve maps url", { status: 502 });
  }
}
