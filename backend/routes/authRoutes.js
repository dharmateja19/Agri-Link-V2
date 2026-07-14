import { Router } from "express";

import {
	registerUser,
	verifyEmail,
	resendVerificationOTP,
	loginUser,
	logoutUser,
	forgotPassword,
	resetPassword,
	verifyResetOTP
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);

router.post("/verify-email", verifyEmail);

router.post("/resend-otp", resendVerificationOTP);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-otp", verifyResetOTP);

router.post("/reset-password", resetPassword);

export default router;
