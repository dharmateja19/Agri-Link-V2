import crypto from "crypto";

const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

export const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};

export const compareOTP = (otp, hashedOTP) => {
    return hashOTP(otp) === hashedOTP;
};

export const getOTPExpiry = () => {
    return new Date(
        Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );
};

export const isOTPExpired = (expiryTime) => {
    return new Date() > expiryTime;
};

export const canResendOTP = (lastOTPSentAt) => {
    if (!lastOTPSentAt) return true;

    const cooldown =
        OTP_RESEND_COOLDOWN_SECONDS * 1000;

    return (
        Date.now() - lastOTPSentAt.getTime() >= cooldown
    );
};

export const hasExceededMaxAttempts = (attempts) => {
    return attempts >= MAX_OTP_ATTEMPTS;
};