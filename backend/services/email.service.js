import { sendEmailIfConfigured } from "./mailer.service.js";

import { verificationTemplate } from "../templates/emails/verification.template.js";
import { passwordResetTemplate } from "../templates/emails/passwordReset.template.js";

export const sendVerificationOTP = async (email, otp) => {
	return await sendEmailIfConfigured({
		to: email,
		subject: "Verify Your AgriLink Account",
		html: verificationTemplate(otp),
	});
};

export const sendPasswordResetOTP = async (email, otp) => {
	return await sendEmailIfConfigured({
		to: email,
		subject: "Reset Your AgriLink Password",
		html: passwordResetTemplate(otp),
	});
};

// import { sendEmail } from "./mailer.service.js";
// import { verificationTemplate } from "../templates/emails/verification.template.js";
// import { passwordResetTemplate } from "../templates/emails/passwordReset.template.js";

// export const sendVerificationOTP = async (email, otp) => {
// 	return sendEmail({
// 		to: email,
// 		subject: "Verify Your AgriLink Account",
// 		html: verificationTemplate(otp),
// 	});
// };

// export const sendPasswordResetOTP = async (email, otp) => {
// 	return sendEmail({
// 		to: email,
// 		subject: "Reset Your AgriLink Password",
// 		html: passwordResetTemplate(otp),
// 	});
// };


// import { hasEmailConfig, buildTransporter } from "../config/mail.config.js";

// /**
//  * Sends an email only if SMTP is configured.
//  * Returns { sent: true } on success, { sent: false, reason } otherwise.
//  * Never throws — callers can decide whether a failed/skip send should
//  * block the calling flow (e.g. signup) or just be logged.
//  */
// export const sendEmailIfConfigured = async ({ to, subject, html }) => {
// 	if (!hasEmailConfig()) {
// 		console.warn(
// 			`[mailer] SMTP not configured — skipping email to ${to} ("${subject}")`
// 		);
// 		return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
// 	}

// 	const transporter = buildTransporter();

// 	try {
// 		const info = await transporter.sendMail({
// 			from: process.env.FROM_EMAIL,
// 			to,
// 			subject,
// 			html,
// 		});

// 		console.log(`[mailer] Email sent to ${to} (messageId: ${info.messageId})`);
// 		return { sent: true, messageId: info.messageId };
// 	} catch (err) {
// 		console.error(`[mailer] Failed to send email to ${to}:`, err.message);
// 		return { sent: false, reason: "SEND_FAILED", error: err.message };
// 	}
// };