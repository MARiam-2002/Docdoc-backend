import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";
import { asyncHandler } from "./asyncHandler.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOtp = asyncHandler(async (phoneNumber, otp) => {
  const message = await client.messages.create({
    body: `Hello from docodoc OTP is: ${otp}`,
    from: "+19013502281",
    to: phoneNumber,
  });
  return message;
});
