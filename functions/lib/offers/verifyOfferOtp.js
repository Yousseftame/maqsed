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
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
if (admin.apps.length === 0) {
    admin.initializeApp();
}
function serializeOffer(id, data) {
    const offer = { id, ...data };
    delete offer.secretCode;
    for (const [key, value] of Object.entries(offer)) {
        if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
            offer[key] = value.toDate().toISOString();
        }
    }
    return offer;
}
function applyCors(res) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
}
/**
 * 1st-gen HTTP function so guests can verify without Cloud Run IAM/CORS issues.
 */
exports.verifyOfferOtp = functions.region("us-central1").https.onRequest(async (req, res) => {
    applyCors(res);
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed", code: "invalid" });
        return;
    }
    const { offerId, otp, status } = req.body || {};
    if (!offerId || !otp) {
        res.status(400).json({ error: "offerId and otp are required.", code: "invalid" });
        return;
    }
    if (status != null && status !== "accepted" && status !== "rejected") {
        res.status(400).json({ error: "status must be accepted or rejected.", code: "invalid" });
        return;
    }
    try {
        const offerRef = admin.firestore().collection("offers").doc(String(offerId));
        const offerSnap = await offerRef.get();
        if (!offerSnap.exists) {
            res.status(404).json({ error: "Offer not found.", code: "not-found" });
            return;
        }
        const offerData = offerSnap.data() || {};
        if (offerData.secretCode !== String(otp)) {
            res.status(403).json({ error: "Invalid OTP.", code: "permission-denied" });
            return;
        }
        if (status === "accepted" || status === "rejected") {
            await offerRef.update({
                status,
                respondedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            offerData.status = status;
        }
        else if (offerData.status === "pending") {
            await offerRef.update({
                status: "viewed",
                viewedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            offerData.status = "viewed";
        }
        else if (!offerData.viewedAt) {
            await offerRef.update({
                viewedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        res.status(200).json({
            success: true,
            offer: serializeOffer(offerSnap.id, offerData),
        });
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "An error occurred while verifying the OTP.", code: "internal" });
    }
});
//# sourceMappingURL=verifyOfferOtp.js.map