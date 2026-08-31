import { getApps, initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin globally safely
if (!getApps().length) {
    initializeApp();
}

export { onOfferCreatedTrigger } from "./offers/onOfferCreated";
export { verifyOfferOtp } from "./offers/verifyOfferOtp";
export { onOfferAcceptedTrigger } from "./offers/onOfferAccepted";
