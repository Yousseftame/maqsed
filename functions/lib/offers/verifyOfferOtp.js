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
exports.verifyOfferOtp = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Initialize admin app if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Callable function for developers to verify their OTP.
 * If successful, returns the full offer details.
 */
exports.verifyOfferOtp = (0, https_1.onCall)(async (request) => {
    const { offerId, otp } = request.data;
    if (!offerId || !otp) {
        throw new https_1.HttpsError("invalid-argument", "offerId and otp are required.");
    }
    try {
        const offerRef = admin.firestore().collection("offers").doc(offerId);
        const offerSnap = await offerRef.get();
        if (!offerSnap.exists) {
            throw new https_1.HttpsError("not-found", "Offer not found.");
        }
        const offerData = offerSnap.data();
        if (offerData?.secretCode !== otp) {
            throw new https_1.HttpsError("permission-denied", "Invalid OTP.");
        }
        // Optional: Mark the offer as 'viewed' if it was 'pending'
        if (offerData?.status === "pending") {
            await offerRef.update({
                status: "viewed",
                viewedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        // Return the offer details securely to the frontend
        return {
            success: true,
            offer: {
                id: offerSnap.id,
                title: offerData?.title,
                projectName: offerData?.projectName,
                technicalDetails: offerData?.technicalDetails,
                financialAmount: offerData?.financialAmount,
                developerName: offerData?.developerName,
                status: offerData?.status === "pending" ? "viewed" : offerData?.status,
                createdAt: offerData?.createdAt,
            },
        };
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError("internal", "An error occurred while verifying the OTP.");
    }
});
//# sourceMappingURL=verifyOfferOtp.js.map