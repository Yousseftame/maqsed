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
exports.recordPublicView = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.recordPublicView = (0, https_1.onRequest)({ cors: true, invoker: "private" }, async (request, response) => {
    if (request.method === "OPTIONS") {
        response.status(204).send("");
        return;
    }
    if (request.method !== "POST") {
        response.status(405).json({ error: "Method not allowed" });
        return;
    }
    const body = typeof request.body === "object" && request.body ? request.body : {};
    const payload = body.data && typeof body.data === "object" ? body.data : body;
    const kind = payload.kind;
    const id = String(payload.id || "").trim();
    if ((kind !== "property" && kind !== "unit") || !id) {
        response.status(400).json({ error: "Invalid view target." });
        return;
    }
    const collection = kind === "property" ? "properties" : "units";
    const ref = admin.firestore().collection(collection).doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
        response.status(404).json({ error: "Document not found." });
        return;
    }
    await ref.update({
        views: admin.firestore.FieldValue.increment(1),
    });
    response.status(200).json({ ok: true });
});
//# sourceMappingURL=recordPublicView.js.map