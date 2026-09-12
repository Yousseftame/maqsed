import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const recordPublicView = onRequest({ cors: true, invoker: "private" }, async (request, response) => {
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
