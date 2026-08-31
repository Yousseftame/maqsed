import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export const onOfferAcceptedTrigger = onDocumentUpdated("offers/{offerId}", async (event) => {
    if (!event.data) return;

    const newValue = event.data.after.data();
    const previousValue = event.data.before.data();
    const offerId = event.params.offerId;

  // Only run if status changed from something else to 'accepted'
  if (newValue.status === 'accepted' && previousValue.status !== 'accepted') {
    const db = getFirestore();
    
    // 1. Create a Contract
    const contractRef = db.collection('contracts').doc();
    await contractRef.set({
      offerId: offerId,
      developerEmail: newValue.developerEmail,
      developerUid: newValue.developerUid || null,
      createdAt: FieldValue.serverTimestamp(),
      status: 'active',
      details: newValue, // copy offer details or specific fields
    });

    // 2. Ensure user has 'developer' role in Firestore
    try {
      const userRecord = await getAuth().getUserByEmail(newValue.developerEmail);
      const userRef = db.collection('users').doc(userRecord.uid);
      await userRef.set({
        role: 'developer',
        email: newValue.developerEmail,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      
      logger.info("OFFER ACCEPTED - Provisioned Developer Role and Contract", { uid: userRecord.uid, contractId: contractRef.id });
    } catch (e) {
      logger.error("Failed to provision developer role", e);
    }
  }
});
