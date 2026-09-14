import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const updateDeveloperPassword = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to update a developer password.");
  }

  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  const callerRole = callerDoc.data()?.role;
  if (!callerDoc.exists || (callerRole !== "admin" && callerRole !== "superAdmin")) {
    throw new HttpsError("permission-denied", "Only administrators can change a developer password.");
  }

  const { uid, password } = request.data;
  const nextPassword = typeof password === "string" ? password : "";

  if (!uid || !nextPassword) {
    throw new HttpsError("invalid-argument", "Missing required fields (uid, password).");
  }

  if (nextPassword.length < 6 || nextPassword.length > 128 || /\r|\n/.test(nextPassword)) {
    throw new HttpsError("invalid-argument", "Password must be between 6 and 128 characters.");
  }

  const targetRef = admin.firestore().collection("users").doc(uid);
  const targetDoc = await targetRef.get();
  if (!targetDoc.exists) {
    throw new HttpsError("not-found", "Account not found.");
  }

  if (targetDoc.data()?.role !== "developer") {
    throw new HttpsError("failed-precondition", "This function can only update developer passwords.");
  }

  try {
    logger.info(`Admin ${callerUid} updating password for developer ${uid}`);

    await admin.auth().updateUser(uid, { password: nextPassword });
    await targetRef.update({ password: nextPassword });

    logger.info(`Successfully updated developer password: ${uid}`);

    return {
      success: true,
      uid,
      message: "Developer password updated successfully",
    };
  } catch (error: any) {
    logger.error("Error updating developer password:", error);
    throw new HttpsError("internal", error.message || "Failed to update developer password");
  }
});
