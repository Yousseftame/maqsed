import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import * as crypto from "crypto";

// Initialize admin app if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Generate a random 6-digit OTP
 */
function generateOTP(): string {
  // Generate a random number between 100000 and 999999
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Triggered when a new offer is created in the 'offers' collection.
 * Generates an OTP, saves it to the offer document, and logs it (simulating Email/WhatsApp).
 */
export const onOfferCreated = onDocumentCreated("offers/{offerId}", async (event) => {
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

  } catch (error) {
    logger.error(`❌ Error generating OTP for offer ${offerId}:`, error);
  }
});
