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
exports.onOfferResponded = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
// Initialize admin app if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Triggered when an offer is updated.
 * Handles the logic for converting an accepted offer into a Contract.
 */
exports.onOfferResponded = (0, firestore_1.onDocumentUpdated)("offers/{offerId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        logger.error("No data associated with the event.");
        return;
    }
    const beforeData = snapshot.before.data();
    const afterData = snapshot.after.data();
    const offerId = event.params.offerId;
    // Check if status changed to 'accepted'
    if (beforeData.status !== "accepted" && afterData.status === "accepted") {
        logger.info(`Offer ${offerId} was accepted! Creating Contract...`);
        try {
            // Create a contract document
            const contractRef = admin.firestore().collection("contracts").doc();
            await contractRef.set({
                offerId: offerId,
                title: `${afterData.title} - Contract`,
                projectName: afterData.projectName,
                financialAmount: afterData.financialAmount,
                technicalDetails: afterData.technicalDetails,
                developerName: afterData.developerName,
                developerEmail: afterData.developerEmail,
                status: "active",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            logger.info(`✅ Successfully created Contract: ${contractRef.id} for Offer: ${offerId}`);
        }
        catch (error) {
            logger.error(`❌ Error creating contract for offer ${offerId}:`, error);
        }
    }
    // Check if status changed to 'rejected'
    if (beforeData.status !== "rejected" && afterData.status === "rejected") {
        logger.info(`Offer ${offerId} was rejected.`);
        // You can send a notification to the admin here if needed.
    }
});
//# sourceMappingURL=onOfferResponded.js.map