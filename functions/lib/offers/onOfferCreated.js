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
exports.onOfferCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
const crypto = __importStar(require("crypto"));
// Initialize admin app if not already initialized
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
    // Generate a random number between 100000 and 999999
    return crypto.randomInt(100000, 999999).toString();
}
/**
 * Triggered when a new offer is created in the 'offers' collection.
 * Generates an OTP, saves it to the offer document, and logs it (simulating Email/WhatsApp).
 */
exports.onOfferCreated = (0, firestore_1.onDocumentCreated)("offers/{offerId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        logger.error("No data associated with the event.");
        return;
    }
    const offerData = snapshot.data();
    const offerId = event.params.offerId;
    // We only want to process new offers that don't have a secretCode yet
    if (offerData.secretCode) {
        logger.info(`Offer ${offerId} already has a secretCode. Skipping.`);
        return;
    }
    try {
        const otp = generateOTP();
        // In a real production app, you might want to hash this OTP before saving it.
        // For simplicity and to allow the admin to view it during testing, we save it directly.
        await snapshot.ref.update({
            secretCode: otp,
            status: "pending", // Ensure status is explicitly pending
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        logger.info(`✅ Successfully generated and saved OTP for Offer: ${offerId}`);
        // ==========================================
        // SIMULATE EMAIL & WHATSAPP SENDING
        // ==========================================
        logger.info(`
    ====================================================================
    🔔 [SIMULATED EMAIL/WHATSAPP]
    To: ${offerData.developerEmail || "Unknown Email"} / ${offerData.developerPhone || "Unknown Phone"}
    Message: 
    Hello ${offerData.developerName || "Developer"},
    
    You have received a new Technical/Financial Offer from ActiveLink!
    To view and respond to the offer, please visit this secure link:
    
    🌐 https://your-domain.com/offer/${offerId}
    
    Your secure One-Time Password (OTP) to access the offer is:
    🔑 [ ${otp} ]
    ====================================================================
    `);
    }
    catch (error) {
        logger.error(`❌ Error generating OTP for offer ${offerId}:`, error);
    }
});
//# sourceMappingURL=onOfferCreated.js.map