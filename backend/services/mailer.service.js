// import transporter from "../config/mail.config.js";

// export const sendEmailIfConfigured = async ({
// 	to,
// 	subject,
// 	html,
// 	text,
// }) => {
// 	if (!transporter || !to) {
// 		return { sent: false };
// 	}

// 	try {
// 		await transporter.sendMail({
// 			from: process.env.FROM_EMAIL,
// 			to,
// 			subject,
// 			html,
// 			text,
// 		});

// 		return {
// 			sent: true,
// 		};
// 	} catch (error) {
// 		console.error("Email send failed:", error);

// 		return {
// 			sent: false,
// 		};
// 	}
// };

// import resend from "../config/mail.config.js";

// export const sendEmail = async ({ to, subject, html }) => {
// 	try {
// 		const response = await resend.emails.send({
// 			from: "onboarding@resend.dev",
// 			to,
// 			subject,
// 			html,
// 		});

// 		return {
// 			success: true,
// 			data: response,
// 		};
// 	} catch (error) {
// 		console.error("Resend Error:", error);

// 		return {
// 			success: false,
// 			error,
// 		};
// 	}
// };

// // import resend from "../config/mail.config.js";

// // export const sendEmail = async ({ to, subject, html }) => {
// // 	try {
// // 		const response = await resend.emails.send({
// // 			from: "onboarding@resend.dev",
// // 			to,
// // 			subject,
// // 			html,
// // 		});

// // 		console.log("Resend Response:", response);

// // 		return {
// // 			success: true,
// // 			data: response,
// // 		};
// // 	} catch (error) {
// // 		console.error("Resend Error:");
// // 		console.error(error);

// // 		throw error;
// // 	}
// // };

// import transporter from "../config/mail.config.js";

// export const sendEmailIfConfigured = async ({ to, subject, html, text }) => {
// 	if (!transporter || !to) {
// 		return { sent: false };
// 	}

// 	try {
// 		const res = await transporter.sendMail({
// 			from: process.env.FROM_EMAIL,
// 			to,
// 			subject,
// 			html,
// 			text,
// 		});
// 		// console.log(res)

// 		return {
// 			sent: true,
// 		};
// 	} catch (error) {
// 		console.error("Email send failed:", error);

// 		return {
// 			sent: false,
// 		};
// 	}
// };

import transporter from "../config/mail.config.js";

export const sendEmailIfConfigured = async ({ to, subject, html, text }) => {
	try {
		await transporter.sendMail({
			from: process.env.FROM_EMAIL,
			to,
			subject,
			html,
			text,
		});

		return { sent: true };
	} catch (error) {
		console.error("Email send failed:", error);
		return { sent: false };
	}
};
