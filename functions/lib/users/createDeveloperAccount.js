"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeveloperAccount = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.createDeveloperAccount = (0, https_1.onCall)(async (request) => {
    // Ensure the caller is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be logged in to create a developer account.");
    }
    // Check if caller is admin
    const callerUid = request.auth.uid;
    const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
    if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
        throw new https_1.HttpsError("permission-denied", "Only administrators can create developer accounts.");
    }
    const { firstName, lastName, email, password, phone, company, usersPerDeveloper } = request.data;
    if (!email || !password || !firstName) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields (email, password, firstName).");
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
    }
    catch (error) {
        logger.error("❌ Error creating developer account:", error);
        if (error.code === 'auth/email-already-exists') {
            throw new https_1.HttpsError("already-exists", "The email address is already in use by another account.");
        }
        throw new https_1.HttpsError("internal", error.message || "Failed to create developer account");
    }
});
//# sourceMappingURL=createDeveloperAccount.js.map