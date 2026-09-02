import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const deleteDeveloperAccount = onCall(async (request) => {
  // Ensure the caller is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to delete a developer account.");
  }

  // Check if caller is admin
  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
     throw new HttpsError("permission-denied", "Only administrators can delete developer accounts.");
  }

  const { uid } = request.data;

  if (!uid) {
    throw new HttpsError("invalid-argument", "Missing required field (uid).");
  }

  try {
    logger.info(`Admin ${callerUid} deleting developer account: ${uid}`);
    
    // 1. Delete the Firestore document
    await admin.firestore().collection("users").doc(uid).delete();

    // 2. Delete the Firebase Auth user
    await admin.auth().deleteUser(uid);

    logger.info(`✅ Successfully deleted developer account: ${uid}`);

    return { 
      success: true, 
      uid, 
      message: "Developer account deleted successfully" 
    };
  } catch (error: any) {
    logger.error("❌ Error deleting developer account:", error);
    
    throw new HttpsError("internal", error.message || "Failed to delete developer account");
  }
});
