import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize admin app if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Callable function for developers to verify their OTP.
 * If successful, returns the full offer details.
 */
export const verifyOfferOtp = onCall(async (request) => {
  const { offerId, otp } = request.data;

  if (!offerId || !otp) {
    throw new HttpsError("invalid-argument", "offerId and otp are required.");
  }

  try {
    const offerRef = admin.firestore().collection("offers").doc(offerId);
    const offerSnap = await offerRef.get();

    if (!offerSnap.exists) {
      throw new HttpsError("not-found", "Offer not found.");
    }

    const offerData = offerSnap.data();

    if (offerData?.secretCode !== otp) {
      throw new HttpsError("permission-denied", "Invalid OTP.");
    }

    // Optional: Mark the offer as 'viewed' if it was 'pending'
    if (offerData?.status === "pending") {
      await offerRef.update({
        status: "viewed",
        viewedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Return the offer details securely to the frontend
    return {
      success: true,
      offer: {
        id: offerSnap.id,
        title: offerData?.title,
        projectName: offerData?.projectName,
        technicalDetails: offerData?.technicalDetails,
        financialAmount: offerData?.financialAmount,
        developerName: offerData?.developerName,
        status: offerData?.status === "pending" ? "viewed" : offerData?.status,
        createdAt: offerData?.createdAt,
      },
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "An error occurred while verifying the OTP.");
  }
});
