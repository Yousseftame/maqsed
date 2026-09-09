import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

function serializeOffer(id: string, data: admin.firestore.DocumentData) {
  const offer: Record<string, unknown> = { id, ...data };
  delete offer.secretCode;
  for (const [key, value] of Object.entries(offer)) {
    if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
      offer[key] = (value as { toDate: () => Date }).toDate().toISOString();
    }
  }
  return offer;
}

function applyCors(res: functions.Response) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * 1st-gen HTTP function so guests can verify without Cloud Run IAM/CORS issues.
 */
export const verifyOfferOtp = functions.region("us-central1").https.onRequest(async (req, res) => {
  applyCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed", code: "invalid" });
    return;
  }

  const { offerId, otp, status } = req.body || {};

  if (!offerId || !otp) {
    res.status(400).json({ error: "offerId and otp are required.", code: "invalid" });
    return;
  }

  if (status != null && status !== "accepted" && status !== "rejected") {
    res.status(400).json({ error: "status must be accepted or rejected.", code: "invalid" });
    return;
  }

  try {
    const offerRef = admin.firestore().collection("offers").doc(String(offerId));
    const offerSnap = await offerRef.get();

    if (!offerSnap.exists) {
      res.status(404).json({ error: "Offer not found.", code: "not-found" });
      return;
    }

    const offerData = offerSnap.data() || {};

    if (offerData.secretCode !== String(otp)) {
      res.status(403).json({ error: "Invalid OTP.", code: "permission-denied" });
      return;
    }

    if (status === "accepted" || status === "rejected") {
      await offerRef.update({
        status,
        respondedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      offerData.status = status;
    } else if (offerData.status === "pending") {
      await offerRef.update({
        status: "viewed",
        viewedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      offerData.status = "viewed";
    } else if (!offerData.viewedAt) {
      await offerRef.update({
        viewedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.status(200).json({
      success: true,
      offer: serializeOffer(offerSnap.id, offerData),
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "An error occurred while verifying the OTP.", code: "internal" });
  }
});
