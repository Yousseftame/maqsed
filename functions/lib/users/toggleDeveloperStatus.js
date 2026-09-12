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
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be logged in to toggle developer status.");
    }
    const callerUid = request.auth.uid;
    const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
    const callerRole = callerDoc.data()?.role;
    const isAdminCaller = callerRole === "admin" || callerRole === "superAdmin";
    const isDeveloperCaller = callerRole === "developer";
    if (!callerDoc.exists || (!isAdminCaller && !isDeveloperCaller)) {
        throw new https_1.HttpsError("permission-denied", "Only administrators can toggle developer status.");
    }
    const { targetUid, status } = request.data;
    if (!targetUid || !status) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields (targetUid, status).");
    }
    if (status !== "active" && status !== "disabled") {
        throw new https_1.HttpsError("invalid-argument", "Status must be 'active' or 'disabled'.");
    }
    if (targetUid === callerUid) {
        throw new https_1.HttpsError("failed-precondition", "You cannot change your own account status.");
    }
    const targetDoc = await admin.firestore().collection("users").doc(targetUid).get();
    const target = targetDoc.data();
    const targetRole = target?.role;
    if (isDeveloperCaller) {
        if (!targetDoc.exists || targetRole !== "employee" || target?.developerUid !== callerUid) {
            throw new https_1.HttpsError("permission-denied", "You can only change employees that belong to your account.");
        }
    }
    else if (targetRole === "admin" || targetRole === "superAdmin") {
        if (callerRole !== "superAdmin") {
            throw new https_1.HttpsError("permission-denied", "Only super administrators can change admin account status.");
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
    }
    catch (error) {
        logger.error("Error toggling developer status:", error);
        throw new https_1.HttpsError("internal", error.message || "Failed to toggle developer status");
    }
});
//# sourceMappingURL=toggleDeveloperStatus.js.map