import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { sanitizePermissions } from "./permissions";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const updateAdminAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to update an admin account.");
  }

  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  const callerRole = callerDoc.data()?.role;
  if (!callerDoc.exists || callerRole !== "superAdmin") {
    throw new HttpsError("permission-denied", "Only super administrators can update admin accounts.");
  }

  const { uid, firstName, lastName, phone, permissions } = request.data;

  if (!uid || !firstName) {
    throw new HttpsError("invalid-argument", "Missing required fields (uid, firstName).");
  }

  const targetRef = admin.firestore().collection("users").doc(uid);
  const targetDoc = await targetRef.get();
  if (!targetDoc.exists) {
    throw new HttpsError("not-found", "Account not found.");
  }

  const targetRole = targetDoc.data()?.role;
  if (targetRole !== "admin" && targetRole !== "superAdmin") {
    throw new HttpsError("failed-precondition", "This function can only update admin accounts.");
  }

  try {
    logger.info(`SuperAdmin ${callerUid} updating admin account ${uid}`);

    const updates: Record<string, unknown> = {
      displayName: firstName,
      lastName: lastName || "",
      phoneNumber: phone || "",
    };

    if (targetRole === "admin" && uid !== callerUid) {
      updates.permissions = sanitizePermissions(permissions);
    }

    await targetRef.update(updates);

    logger.info(`Successfully updated admin account: ${uid}`);

    return {
      success: true,
      uid,
      message: "Admin account updated successfully",
    };
  } catch (error: any) {
    logger.error("Error updating admin account:", error);
    throw new HttpsError("internal", error.message || "Failed to update admin account");
  }
});
