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
exports.updateAdminAccount = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
const permissions_1 = require("./permissions");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.updateAdminAccount = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be logged in to update an admin account.");
    }
    const callerUid = request.auth.uid;
    const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
    const callerRole = callerDoc.data()?.role;
    if (!callerDoc.exists || callerRole !== "superAdmin") {
        throw new https_1.HttpsError("permission-denied", "Only super administrators can update admin accounts.");
    }
    const { uid, firstName, lastName, phone, permissions } = request.data;
    if (!uid || !firstName) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields (uid, firstName).");
    }
    const targetRef = admin.firestore().collection("users").doc(uid);
    const targetDoc = await targetRef.get();
    if (!targetDoc.exists) {
        throw new https_1.HttpsError("not-found", "Account not found.");
    }
    const targetRole = targetDoc.data()?.role;
    if (targetRole !== "admin" && targetRole !== "superAdmin") {
        throw new https_1.HttpsError("failed-precondition", "This function can only update admin accounts.");
    }
    try {
        logger.info(`SuperAdmin ${callerUid} updating admin account ${uid}`);
        const updates = {
            displayName: firstName,
            lastName: lastName || "",
            phoneNumber: phone || "",
        };
        if (targetRole === "admin" && uid !== callerUid) {
            updates.permissions = (0, permissions_1.sanitizePermissions)(permissions);
        }
        await targetRef.update(updates);
        logger.info(`Successfully updated admin account: ${uid}`);
        return {
            success: true,
            uid,
            message: "Admin account updated successfully",
        };
    }
    catch (error) {
        logger.error("Error updating admin account:", error);
        throw new https_1.HttpsError("internal", error.message || "Failed to update admin account");
    }
});
//# sourceMappingURL=updateAdminAccount.js.map