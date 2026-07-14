// import nodemailer from "nodemailer";

// const hasEmailConfig = () => {
// 	return Boolean(
// 		process.env.SMTP_HOST &&
// 		process.env.SMTP_PORT &&
// 		process.env.SMTP_USER &&
// 		process.env.SMTP_PASS &&
// 		process.env.FROM_EMAIL
// 	);
// };

// const buildTransporter = () => {
// 	if (!hasEmailConfig()) {
// 		return null;
// 	}

// 	return nodemailer.createTransport({
// 		host: process.env.SMTP_HOST,
// 		port: Number(process.env.SMTP_PORT),
// 		secure: false,
// 		auth: {
// 			user: process.env.SMTP_USER,
// 			pass: process.env.SMTP_PASS,
// 		},
//         family : 4
// 	});
// };

// const transporter = buildTransporter();

// export default transporter;

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default resend;


// import nodemailer from "nodemailer";

// const hasEmailConfig = () => {
// 	return Boolean(
// 		process.env.SMTP_HOST &&
// 		process.env.SMTP_PORT &&
// 		process.env.SMTP_USER &&
// 		process.env.SMTP_PASS &&
// 		process.env.FROM_EMAIL
// 	);
// };

// let cachedTransporter = null;

// const buildTransporter = () => {
// 	if (!hasEmailConfig()) {
// 		return null;
// 	}

// 	// Reuse the same transporter instance instead of creating a new one
// 	// (and a new connection pool) on every call.
// 	if (cachedTransporter) {
// 		return cachedTransporter;
// 	}

// 	const port = Number(process.env.SMTP_PORT);

// 	cachedTransporter = nodemailer.createTransport({
// 		host: process.env.SMTP_HOST,
// 		port,
// 		secure: port === 465, // true only for port 465 (implicit TLS); 587 uses STARTTLS
// 		auth: {
// 			user: process.env.SMTP_USER,
// 			pass: process.env.SMTP_PASS,
// 		},
// 		family: 4, // force IPv4 - avoids ENETUNREACH on hosts with broken/no IPv6 routing
// 		connectionTimeout: 10000, // fail fast instead of hanging if network is unreachable
// 		pool: true, // reuse connections instead of opening a new one per email
// 		maxConnections: 5,
// 		maxMessages: 100,
// 	});

// 	return cachedTransporter;
// };

// export { hasEmailConfig, buildTransporter };


// import nodemailer from "nodemailer";

// const hasEmailConfig = () => {
//     return Boolean(
//         process.env.SMTP_HOST &&
//         process.env.SMTP_PORT &&
//         process.env.SMTP_USER &&
//         process.env.SMTP_PASS &&
//         process.env.FROM_EMAIL
//     );
// };

// const buildTransporter = () => {
//     if (!hasEmailConfig()) {
//         console.warn(
//             "[mail.config] SMTP not configured — email sending is disabled."
//         );
//         return null;
//     }

//     const port = Number(process.env.SMTP_PORT);

//     const transport = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port,
//         secure: port === 465, // true for 465 (implicit TLS), false for 587 (STARTTLS)
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//         },
//         family: 4, // force IPv4 - avoids ENETUNREACH on hosts with broken/no IPv6 routing
//         connectionTimeout: 10000, // fail fast instead of hanging on a dead connection
//         pool: true, // reuse connections instead of opening a new one per email
//         maxConnections: 5,
//         maxMessages: 100,
//     });

//     transport.verify((err) => {
//         if (err) {
//             console.error("[mail.config] SMTP verification failed:", err.message);
//         } else {
//             console.log("[mail.config] SMTP transporter ready.");
//         }
//     });

//     return transport;
// };

// const transporter = buildTransporter();

// export default transporter;


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_PASSWORD,
  },
});

export default transporter;