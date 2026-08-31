import * as crypto from 'crypto';

export function generateOTP(): string {
  // Generates a 6-digit OTP
  const otp = crypto.randomInt(100000, 999999);
  return otp.toString();
}
