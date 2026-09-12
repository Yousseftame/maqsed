import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const deleteDeveloperAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to delete a developer account.");
  }

  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  const callerRole = callerDoc.data()?.role;
  const isAdminCaller = callerRole === "admin" || callerRole === "superAdmin";
  const isDeveloperCaller = callerRole === "developer";

  if (!callerDoc.exists || (!isAdminCaller && !isDeveloperCaller)) {
    throw new HttpsError("permission-denied", "Only administrators can delete developer accounts.");
  }

  const { uid } = request.data;

  if (!uid) {
    throw new HttpsError("invalid-argument", "Missing required field (uid).");
  }

  if (uid === callerUid) {
    throw new HttpsError("failed-precondition", "You cannot delete your own account.");
  }

  const targetDoc = await admin.firestore().collection("users").doc(uid).get();
  const target = targetDoc.data();
  const targetRole = target?.role;

  if (isDeveloperCaller) {
    if (!targetDoc.exists || targetRole !== "employee" || target?.developerUid !== callerUid) {
      throw new HttpsError("permission-denied", "You can only delete employees that belong to your account.");
    }
  } else if (targetRole === "admin" || targetRole === "superAdmin") {
    if (callerRole !== "superAdmin") {
      throw new HttpsError("permission-denied", "Only super administrators can delete admin accounts.");
    }
  }

  try {
    logger.info(`${isDeveloperCaller ? "Developer" : "Admin"} ${callerUid} deleting account: ${uid}`);

    if (targetRole === "developer") {
      const employeesSnap = await admin
        .firestore()
        .collection("users")
        .where("developerUid", "==", uid)
        .get();

      for (const employeeDoc of employeesSnap.docs) {
        await employeeDoc.ref.delete();
        try {
          await admin.auth().deleteUser(employeeDoc.id);
        } catch (employeeError: any) {
          logger.warn(`Failed to delete employee auth user ${employeeDoc.id}:`, employeeError);
        }
      }
    }

    await admin.firestore().collection("users").doc(uid).delete();
    await admin.auth().deleteUser(uid);

    logger.info(`Successfully deleted account: ${uid}`);

    return {
      success: true,
      uid,
      message: "Developer account deleted successfully",
    };
  } catch (error: any) {
    logger.error("Error deleting account:", error);
    throw new HttpsError("internal", error.message || "Failed to delete developer account");
  }
});
