/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions/v2";

// Set global options for all functions
setGlobalOptions({ maxInstances: 10, region: "us-central1" });

// Export the offer functions
export * from "./offers/onOfferCreated";
export * from "./offers/verifyOfferOtp";
export * from "./offers/onOfferResponded";

