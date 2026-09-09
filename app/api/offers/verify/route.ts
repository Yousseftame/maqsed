import { NextRequest, NextResponse } from "next/server";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const maxDuration = 30;

function asString(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function serializeOffer(id: string, data: DocumentData) {
  const offer: Record<string, unknown> = { id, ...data };
  delete offer.secretCode;
  for (const [key, value] of Object.entries(offer)) {
    if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
      offer[key] = (value as { toDate: () => Date }).toDate().toISOString();
    }
  }
  return offer;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const offerId = asString(body?.offerId, 128);
  const otp = asString(body?.otp, 12);
  const status = body?.status === "accepted" || body?.status === "rejected" ? body.status : undefined;

  if (!offerId || !/^[A-Za-z0-9_-]+$/.test(offerId) || !/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: "Invalid payload", code: "invalid" }, { status: 400 });
  }

  try {
    const db = getAdminDb();
    const offerRef = db.collection("offers").doc(offerId);
    const offerSnap = await offerRef.get();

    if (!offerSnap.exists) {
      return NextResponse.json({ error: "Offer not found.", code: "not-found" }, { status: 404 });
    }

    const offerData = offerSnap.data() || {};
    if (offerData.secretCode !== otp) {
      return NextResponse.json({ error: "Invalid OTP.", code: "permission-denied" }, { status: 403 });
    }

    if (status === "accepted" || status === "rejected") {
      await offerRef.update({
        status,
        respondedAt: FieldValue.serverTimestamp(),
      });
      offerData.status = status;
    } else if (offerData.status === "pending") {
      await offerRef.update({
        status: "viewed",
        viewedAt: FieldValue.serverTimestamp(),
      });
      offerData.status = "viewed";
    } else if (!offerData.viewedAt) {
      await offerRef.update({
        viewedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      success: true,
      offer: serializeOffer(offerSnap.id, offerData),
    });
  } catch (error) {
    console.error("Offer verify failed", error);
    return NextResponse.json({ error: "Failed to verify the secure code.", code: "internal" }, { status: 500 });
  }
}
