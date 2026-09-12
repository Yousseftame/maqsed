import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const toggleDeveloperStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to toggle developer status.");
  }

  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  const callerRole = callerDoc.data()?.role;
  const isAdminCaller = callerRole === "admin" || callerRole === "superAdmin";
  const isDeveloperCaller = callerRole === "developer";

  if (!callerDoc.exists || (!isAdminCaller && !isDeveloperCaller)) {
    throw new HttpsError("permission-denied", "Only administrators can toggle developer status.");
  }

  const { targetUid, status } = request.data;

  if (!targetUid || !status) {
    throw new HttpsError("invalid-argument", "Missing required fields (targetUid, status).");
  }

  if (status !== "active" && status !== "disabled") {
    throw new HttpsError("invalid-argument", "Status must be 'active' or 'disabled'.");
  }

  if (targetUid === callerUid) {
    throw new HttpsError("failed-precondition", "You cannot change your own account status.");
  }

  const targetDoc = await admin.firestore().collection("users").doc(targetUid).get();
  const target = targetDoc.data();
  const targetRole = target?.role;

  if (isDeveloperCaller) {
    if (!targetDoc.exists || targetRole !== "employee" || target?.developerUid !== callerUid) {
      throw new HttpsError("permission-denied", "You can only change employees that belong to your account.");
    }
  } else if (targetRole === "admin" || targetRole === "superAdmin") {
    if (callerRole !== "superAdmin") {
      throw new HttpsError("permission-denied", "Only super administrators can change admin account status.");
    }
  }

  try {
    logger.info(`Toggling account status for ${targetUid} to ${status}`);

    await admin.auth().updateUser(targetUid, {
      disabled: status === "disabled",
    });

    await admin.firestore().collection("users").doc(targetUid).update({
      status: status,
    });

    logger.info(`Successfully toggled account status: ${targetUid} -> ${status}`);

    return {
      success: true,
      uid: targetUid,
      status,
    };
  } catch (error: any) {
    logger.error("Error toggling developer status:", error);
    throw new HttpsError("internal", error.message || "Failed to toggle developer status");
  }
});
