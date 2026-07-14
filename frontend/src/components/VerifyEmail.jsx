import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const VerifyEmail = () => {
	const navigate = useNavigate();

	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const [email] = useState(sessionStorage.getItem("verificationEmail"));

	const inputRefs = useRef([]);

	useEffect(() => {
		const storedEmail = sessionStorage.getItem("verificationEmail");

		if (!storedEmail) {
			navigate("/register");
		}
	}, []);

	useEffect(() => {
		if (countdown === 0) return;

		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown]);

	const handleChange = (value, index) => {
		if (!/^\d?$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < 5) {
			inputRefs.current[index + 1].focus();
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();

		const pasted = e.clipboardData.getData("text").trim().slice(0, 6);

		if (!/^\d+$/.test(pasted)) return;

		const digits = pasted.split("");

		const newOtp = [...otp];

		digits.forEach((digit, i) => {
			newOtp[i] = digit;
		});

		setOtp(newOtp);

		const nextIndex = Math.min(digits.length, 5);

		inputRefs.current[nextIndex]?.focus();
	};

	const handleVerify = async () => {
		const finalOtp = otp.join("");

		if (finalOtp.length !== 6) {
			return toast.error("Enter the complete OTP.");
		}

		try {
			setLoading(true);

			const response = await axios.post(`${apiurl}/auth/verify-email`, {
				email,
				otp: finalOtp,
			});

			toast.success(response.data.message);

			sessionStorage.removeItem("verificationEmail");

			navigate("/login");
		} catch (error) {
			toast.error(error.response?.data?.message || "Verification failed.");
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		try {
			const response = await axios.post(`${apiurl}/auth/resend-otp`, { email });

			toast.success(response.data.message);

			setCountdown(60);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to resend OTP.");
		}
	};

	return (
		<div className="min-h-screen flex justify-center items-center bg-gray-100">
			<div className="bg-white shadow-lg rounded-xl p-8 w-[420px]">
				<h2 className="text-3xl font-bold text-center text-green-700">
					Verify Email
				</h2>

				<p className="text-center mt-3 text-gray-600">OTP has been sent to</p>

				<p className="text-center font-semibold text-green-700">{email}</p>

				<div className="flex justify-center gap-3 mt-8" onPaste={handlePaste}>
					{otp.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type="text"
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(e.target.value, index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							className="w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:border-green-500"
						/>
					))}
				</div>

				<button
					onClick={handleVerify}
					disabled={loading}
					className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold cursor-pointer"
				>
					{loading ? "Verifying..." : "Verify Email"}
				</button>

				<div className="mt-6 text-center">
					{countdown > 0 ? (
						<p className="text-gray-500">Resend OTP in {countdown}s</p>
					) : (
						<button
							onClick={handleResendOTP}
							className="text-green-600 hover:underline font-semibold cursor-pointer"
						>
							Resend OTP
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default VerifyEmail;
