import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export const verifyOfferOtp = onCall(async (request) => {
  const { offerId, otp } = request.data;

  if (!offerId || !otp) {
    throw new HttpsError("invalid-argument", "Missing offerId or otp");
  }

  const db = getFirestore();
  const offerRef = db.collection("offers").doc(offerId);
  const offerDoc = await offerRef.get();

  if (!offerDoc.exists) {
    throw new HttpsError("not-found", "Offer not found");
  }

  const offerData = offerDoc.data();

  if (offerData?.secretCode !== otp) {
    throw new HttpsError("permission-denied", "Invalid OTP");
  }

  // OTP matches! Provision user if necessary.
  const email = offerData?.developerEmail;
  if (!email) {
    throw new HttpsError("internal", "Offer is missing developer email");
  }

  let userRecord;
  try {
    userRecord = await getAuth().getUserByEmail(email);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      // Create user
      userRecord = await getAuth().createUser({
        email: email,
        emailVerified: true,
        displayName: offerData?.developerName || "Developer",
      });
    } else {
      throw error;
    }
  }

  // Securely link the user's UID to the offer so Firestore Rules can allow them to read/update it
  await offerRef.update({ developerUid: userRecord.uid });
  
  // Create Custom Token for seamless login
  const customToken = await getAuth().createCustomToken(userRecord.uid);

  return { success: true, token: customToken };
});
