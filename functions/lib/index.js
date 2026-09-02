"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDeveloperStatus = exports.deleteDeveloperAccount = exports.createDeveloperAccount = void 0;
const v2_1 = require("firebase-functions/v2");
// Set global options for all functions
(0, v2_1.setGlobalOptions)({ maxInstances: 10, region: "us-central1" });
// Export the offer functions
__exportStar(require("./offers/onOfferCreated"), exports);
__exportStar(require("./offers/verifyOfferOtp"), exports);
__exportStar(require("./offers/onOfferResponded"), exports);
// Export the users functions
var createDeveloperAccount_1 = require("./users/createDeveloperAccount");
Object.defineProperty(exports, "createDeveloperAccount", { enumerable: true, get: function () { return createDeveloperAccount_1.createDeveloperAccount; } });
var deleteDeveloperAccount_1 = require("./users/deleteDeveloperAccount");
Object.defineProperty(exports, "deleteDeveloperAccount", { enumerable: true, get: function () { return deleteDeveloperAccount_1.deleteDeveloperAccount; } });
var toggleDeveloperStatus_1 = require("./users/toggleDeveloperStatus");
Object.defineProperty(exports, "toggleDeveloperStatus", { enumerable: true, get: function () { return toggleDeveloperStatus_1.toggleDeveloperStatus; } });
//# sourceMappingURL=index.js.map