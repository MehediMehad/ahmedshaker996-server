import crypto from "crypto";
import sentEmailUtility from "../../utils/sentEmailUtility";
import { emailText } from "../../utils/emailTemplate";

// Function to generate OTP and expiry for a user
export const generateOTP = () => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  const hexCode = crypto.randomBytes(16).toString("hex");
  return { otpCode, expiry, hexCode };
};

export const saveOrUpdateOTP = async (email: string, otpCode: string, expiry: Date, identifier: string, prisma: any) => {
    return await prisma.otp.upsert({
      where: { email },
      update: { otp: otpCode, expiry, hexCode: identifier },
      create: { email, otp: otpCode, expiry, hexCode: identifier },
    });
  };

export const sendOTPEmail = async (email: string, otpCode: string) => {
    await sentEmailUtility(
      email,
      "Verify Your Email",
      emailText("Verify Your Email", otpCode)
    );
  };