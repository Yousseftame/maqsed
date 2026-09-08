import { NextResponse } from "next/server";
import {
  isViewId,
  isViewKind,
  recordPublicView,
  recordPublicViewUnauthenticated,
  recordPublicViewViaFunction,
} from "@/lib/views/record-public-view.server";

export const runtime = "nodejs";

function isDenied(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error ? String((error as { code: unknown }).code) : "";
  const message = error instanceof Error ? error.message : String(error || "");
  return (
    code.includes("permission-denied") ||
    code.includes("PERMISSION_DENIED") ||
    message.toLowerCase().includes("permission")
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const kind = body?.kind;
  const id = typeof body?.id === "string" ? body.id.trim() : "";

  if (!isViewKind(kind) || !isViewId(id)) {
    return NextResponse.json({ error: "Invalid view" }, { status: 400 });
  }

  try {
    await recordPublicViewUnauthenticated(kind, id);
    return NextResponse.json({ ok: true });
  } catch (unauthError) {
    if (!isDenied(unauthError)) {
      console.error("recordPublicView unauthenticated failed", unauthError);
    }
  }

  try {
    await recordPublicView(kind, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (!isDenied(error)) {
      console.error("recordPublicView failed", error);
      return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
    }

    try {
      await recordPublicViewViaFunction(kind, id);
      return NextResponse.json({ ok: true });
    } catch (functionError) {
      console.error("recordPublicView function failed", functionError);
      return NextResponse.json({ error: "Failed to record view" }, { status: 403 });
    }
  }
}
