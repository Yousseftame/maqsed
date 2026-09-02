import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const toggleDeveloperStatus = onCall(async (request) => {
  // Ensure the caller is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to toggle developer status.");
  }

  // Check if caller is admin
  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
     throw new HttpsError("permission-denied", "Only administrators can toggle developer status.");
  }

  const { targetUid, status } = request.data;

  if (!targetUid || !status) {
    throw new HttpsError("invalid-argument", "Missing required fields (targetUid, status).");
  }

  if (status !== "active" && status !== "disabled") {
    throw new HttpsError("invalid-argument", "Status must be 'active' or 'disabled'.");
  }

  try {
    logger.info(`Toggling developer status for ${targetUid} to ${status}`);
    
    // 1. Update Firebase Auth user
    const isDisabled = status === "disabled";
    await admin.auth().updateUser(targetUid, {
      disabled: isDisabled,
    });

    // 2. Update the Firestore document
    await admin.firestore().collection("users").doc(targetUid).update({
      status: status,
    });

    logger.info(`✅ Successfully toggled developer status: ${targetUid} -> ${status}`);

    return { 
      success: true, 
      uid: targetUid,
      status
    };
  } catch (error: any) {
    logger.error("Error toggling developer status:", error);
    throw new HttpsError("internal", error.message || "Failed to toggle developer status");
  }
});
