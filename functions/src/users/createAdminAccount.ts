import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createAdminAccount = onCall(async (request) => {
  // Ensure the caller is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to create an admin account.");
  }

  // Check if caller is superAdmin
  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  const callerRole = callerDoc.data()?.role;
  if (!callerDoc.exists || callerRole !== "superAdmin") {
     throw new HttpsError("permission-denied", "Only super administrators can create admin accounts.");
  }

  const { firstName, lastName, email, password, phone } = request.data;

  if (!email || !password || !firstName) {
    throw new HttpsError("invalid-argument", "Missing required fields (email, password, firstName).");
  }

  try {
    logger.info(`SuperAdmin creating admin account for ${email}`);
    
    // 1. Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName || ""}`.trim(),
    });

    const uid = userRecord.uid;

    // 2. Create the Firestore document
    await admin.firestore().collection("users").doc(uid).set({
      uid,
      email,
      role: "admin",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: firstName,
      lastName: lastName || "",
      phoneNumber: phone || "",
      status: "active",
    });

    logger.info(`✅ Successfully created admin account: ${uid}`);

    return { 
      success: true, 
      uid, 
      message: "Admin account created successfully" 
    };
  } catch (error: any) {
    logger.error("❌ Error creating admin account:", error);
    
    if (error.code === 'auth/email-already-exists') {
      throw new HttpsError("already-exists", "The email address is already in use by another account.");
    }
    
    throw new HttpsError("internal", error.message || "Failed to create admin account");
  }
});
