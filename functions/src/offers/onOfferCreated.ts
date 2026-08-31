import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { generateOTP } from "../utils/otp";

export const onOfferCreatedTrigger = onDocumentCreated("offers/{offerId}", async (event) => {
    const snap = event.data;
    if (!snap) return;

    const offerData = snap.data();
    
    // We only generate OTP if it's not already set
    if (offerData.secretCode) {
        return;
    }

    const secretCode = generateOTP();

    // Update the document with the generated secretCode
    await snap.ref.update({ secretCode });

    // TODO: Integrate Nodemailer / Twilio / WhatsApp Business API here
    const message = `A new technical/financial offer has been created for you. Your secret code is: ${secretCode}. Access it at https://yourdomain.com/offer/${event.params.offerId}`;
    
    // Print to logs so we can easily test the MVP flow without actual SMTP setup yet
    logger.info("OFFER CREATED - SECRETS (MOCK SEND)", {
      offerId: event.params.offerId,
      developerEmail: offerData.developerEmail,
      secretCode,
      message
    });
});
