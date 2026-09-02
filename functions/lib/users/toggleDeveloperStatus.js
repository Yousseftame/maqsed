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
exports.toggleDeveloperStatus = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.toggleDeveloperStatus = (0, https_1.onCall)(async (request) => {
    // Ensure the caller is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be logged in to toggle developer status.");
    }
    // Check if caller is admin
    const callerUid = request.auth.uid;
    const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
    if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
        throw new https_1.HttpsError("permission-denied", "Only administrators can toggle developer status.");
    }
    const { targetUid, status } = request.data;
    if (!targetUid || !status) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields (targetUid, status).");
    }
    if (status !== "active" && status !== "disabled") {
        throw new https_1.HttpsError("invalid-argument", "Status must be 'active' or 'disabled'.");
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
    }
    catch (error) {
        logger.error("Error toggling developer status:", error);
        throw new https_1.HttpsError("internal", error.message || "Failed to toggle developer status");
    }
});
//# sourceMappingURL=toggleDeveloperStatus.js.map