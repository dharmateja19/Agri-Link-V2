import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import {
	generateOTP,
	hashOTP,
	getOTPExpiry,
	compareOTP,
	canResendOTP,
	hasExceededMaxAttempts,
	isOTPExpired,
} from "../services/otp.service.js";
import {
	sendVerificationOTP,
	sendPasswordResetOTP,
} from "../services/email.service.js";

export const registerUser = async (req, res) => {
	try {
		const { name, email, password, mobile, role, location } = req.body;

		const existingUser = await User.findOne({
			$or: [{ email }, { mobile }],
		});

		if (existingUser) {
			if (existingUser.email === email) {
				return res.status(409).json({
					success: false,
					message: "Email is already registered.",
				});
			}

			return res.status(409).json({
				success: false,
				message: "Mobile number is already registered.",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const otp = generateOTP();
		const hashedOTP = hashOTP(otp);

		const user = new User({
			name,
			email,
			password: hashedPassword,
			mobile,
			role,
			location,
			isVerified: false,
			emailVerificationOTP: hashedOTP,
			emailVerificationExpires: getOTPExpiry(),
			emailVerificationAttempts: 0,
			lastOTPSentAt: new Date(),
		});

		await user.save();

		try {
			await sendVerificationOTP(email, otp);
		} catch (error) {
			console.error("Email sending failed:", error);

			return res.status(500).json({
				success: false,
				message:
					"Account created successfully, but failed to send verification email. Please use the Resend OTP option.",
			});
		}

		return res.status(201).json({
			success: true,
			message:
				"Registration successful. Please verify your email using the OTP sent to your email address.",
			email,
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};

export const verifyEmail = async (req, res) => {
	try {
		const { email, otp } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		if (user.isVerified) {
			return res.status(400).json({
				success: false,
				message: "Email is already verified.",
			});
		}

		if (new Date() > user.emailVerificationExpires) {
			return res.status(400).json({
				success: false,
				message: "OTP has expired. Please request a new OTP.",
			});
		}

		const isValidOTP = compareOTP(otp, user.emailVerificationOTP);

		if (!isValidOTP) {
			user.emailVerificationAttempts += 1;
			await user.save();

			return res.status(400).json({
				success: false,
				message: "Invalid OTP.",
			});
		}

		user.isVerified = true;

		user.emailVerificationOTP = null;
		user.emailVerificationExpires = null;
		user.emailVerificationAttempts = 0;
		user.lastOTPSentAt = null;

		await user.save();

		return res.status(200).json({
			success: true,
			message: "Email verified successfully. You can now login.",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};

export const resendVerificationOTP = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		if (user.isVerified) {
			return res.status(400).json({
				success: false,
				message: "Email is already verified.",
			});
		}

		if (!canResendOTP(user.lastOTPSentAt)) {
			return res.status(429).json({
				success: false,
				message: "Please wait 60 seconds before requesting another OTP.",
			});
		}

		const otp = generateOTP();
		const hashedOTP = hashOTP(otp);

		user.emailVerificationOTP = hashedOTP;
		user.emailVerificationExpires = getOTPExpiry();
		user.emailVerificationAttempts = 0;
		user.lastOTPSentAt = new Date();

		await user.save();

		await sendVerificationOTP(email, otp);

		return res.status(200).json({
			success: true,
			message: "OTP sent successfully.",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		if (user.accountStatus !== "active") {
			return res.status(403).json({
				success: false,
				message: "Your account is inactive or blocked.",
			});
		}

		if (!user.isVerified) {
			return res.status(403).json({
				success: false,
				message: "Please verify your email before logging in.",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password.",
			});
		}

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);

		user.lastLogin = new Date();
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Login successful.",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};

export const logoutUser = async (req, res) => {
	try {
		return res.status(200).json({
			success: true,
			message: "Logged out successfully.",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(200).json({
				success: true,
				message:
					"If an account with this email exists, a password reset OTP has been sent.",
			});
		}

		if (!user.isVerified) {
			return res.status(200).json({
				success: true,
				message:
					"If an account with this email exists, a password reset OTP has been sent.",
			});
		}

		if (!canResendOTP(user.lastPasswordResetOTPSentAt)) {
			return res.status(200).json({
				success: true,
				message:
					"If an account with this email exists, a password reset OTP has been sent.",
			});
		}

		const otp = generateOTP();

		user.passwordResetOTP = hashOTP(otp);
		user.passwordResetExpires = getOTPExpiry();
		user.passwordResetAttempts = 0;
		user.lastPasswordResetOTPSentAt = new Date();

		await user.save();

		await sendPasswordResetOTP(email, otp);

		return res.status(200).json({
			success: true,
			message:
				"If an account with this email exists, a password reset OTP has been sent.",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};

export const verifyResetOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({
				success: false,
				message: "Email and OTP are required.",
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid password reset request.",
			});
		}

		if (!user.passwordResetOTP || !user.passwordResetExpires) {
			return res.status(400).json({
				success: false,
				message: "Please request a new OTP.",
			});
		}

		if (isOTPExpired(user.passwordResetExpires)) {
			user.passwordResetOTP = null;
			user.passwordResetExpires = null;
			user.passwordResetAttempts = 0;
			user.passwordResetVerified = false;

			await user.save();

			return res.status(400).json({
				success: false,
				message: "OTP has expired. Please request a new OTP.",
			});
		}

		const validOTP = compareOTP(otp, user.passwordResetOTP);

		if (!validOTP) {
			user.passwordResetAttempts += 1;

			if (hasExceededMaxAttempts(user.passwordResetAttempts)) {
				user.passwordResetOTP = null;
				user.passwordResetExpires = null;
				user.passwordResetAttempts = 0;
				user.passwordResetVerified = false;

				await user.save();

				return res.status(400).json({
					success: false,
					message: "Maximum OTP attempts exceeded. Please request a new OTP.",
				});
			}

			await user.save();

			return res.status(400).json({
				success: false,
				message: "Invalid OTP.",
			});
		}

		user.passwordResetVerified = true;

		user.passwordResetOTP = null;
		user.passwordResetExpires = null;
		user.passwordResetAttempts = 0;
		user.lastPasswordResetOTPSentAt = null;

		await user.save();

		return res.status(200).json({
			success: true,
			message: "OTP verified successfully.",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { email, newPassword } = req.body;

		if (!email || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Email and new password are required.",
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid password reset request.",
			});
		}

		if (!user.passwordResetVerified) {
			return res.status(403).json({
				success: false,
				message: "Please verify your OTP before resetting your password.",
			});
		}

		// Prevent using the same password again
		const isSamePassword = await bcrypt.compare(newPassword, user.password);

		if (isSamePassword) {
			return res.status(400).json({
				success: false,
				message: "New password cannot be the same as your current password.",
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;

		// Clear reset session
		user.passwordResetVerified = false;
		user.passwordResetOTP = null;
		user.passwordResetExpires = null;
		user.passwordResetAttempts = 0;
		user.lastPasswordResetOTPSentAt = null;

		await user.save();

		return res.status(200).json({
			success: true,
			message:
				"Password reset successfully. Please login with your new password.",
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	}
};
