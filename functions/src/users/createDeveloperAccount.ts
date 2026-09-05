import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createDeveloperAccount = onCall(async (request) => {
  // Ensure the caller is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to create a developer account.");
  }

  // Check if caller is admin
  const callerUid = request.auth.uid;
  const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
  if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
     throw new HttpsError("permission-denied", "Only administrators can create developer accounts.");
  }

  const { firstName, lastName, email, password, phone, company, usersPerDeveloper } = request.data;

  if (!email || !password || !firstName) {
    throw new HttpsError("invalid-argument", "Missing required fields (email, password, firstName).");
  }

  try {
    logger.info(`Creating developer account for ${email}`);
    
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
      role: "developer",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName: firstName,
      lastName: lastName || "",
      phoneNumber: phone || "",
      companyName: company || "",
      usersPerDeveloper: Number(usersPerDeveloper) || 0,
      status: "active",
      developerStats: {
        projectsCount: 0,
        unitsCount: 0,
      },
    });

    logger.info(`✅ Successfully created developer account: ${uid}`);

    return { 
      success: true, 
      uid, 
      message: "Developer account created successfully" 
    };
  } catch (error: any) {
    logger.error("❌ Error creating developer account:", error);
    
    if (error.code === 'auth/email-already-exists') {
      throw new HttpsError("already-exists", "The email address is already in use by another account.");
    }
    
    throw new HttpsError("internal", error.message || "Failed to create developer account");
  }
});
