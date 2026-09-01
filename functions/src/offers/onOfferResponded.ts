import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize admin app if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Triggered when an offer is updated.
 * Handles the logic for converting an accepted offer into a Contract.
 */
export const onOfferResponded = onDocumentUpdated("offers/{offerId}", async (event) => {
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
    } catch (error) {
      logger.error(`❌ Error creating contract for offer ${offerId}:`, error);
    }
  }

  // Check if status changed to 'rejected'
  if (beforeData.status !== "rejected" && afterData.status === "rejected") {
    logger.info(`Offer ${offerId} was rejected.`);
    // You can send a notification to the admin here if needed.
  }
});
