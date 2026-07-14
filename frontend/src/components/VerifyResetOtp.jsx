import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const VerifyResetOTP = () => {
	const navigate = useNavigate();

	const [email] = useState(sessionStorage.getItem("resetEmail"));

	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);
	const [countdown, setCountdown] = useState(60);

	const inputRefs = useRef([]);

	useEffect(() => {
		if (!email) {
			navigate("/forgot-password");
		}
	}, [email, navigate]);

	useEffect(() => {
		if (countdown === 0) return;

		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown]);

	const handleChange = (value, index) => {
		if (!/^\d?$/.test(value)) return;

		const updated = [...otp];
		updated[index] = value;
		setOtp(updated);

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

		const updated = [...otp];

		digits.forEach((digit, index) => {
			updated[index] = digit;
		});

		setOtp(updated);
	};

	const handleVerifyOTP = async () => {
		const finalOTP = otp.join("");

		if (finalOTP.length !== 6) {
			return toast.error("Please enter a valid OTP.");
		}

		try {
			setLoading(true);

			const response = await axios.post(
				`${apiurl}/auth/verify-reset-otp`,
				{
					email,
					otp: finalOTP,
				}
			);

			toast.success(response.data.message);

			navigate("/reset-password");
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"OTP verification failed."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		try {
			const response = await axios.post(
				`${apiurl}/auth/forgot-password`,
				{
					email,
				}
			);

			toast.success(response.data.message);

			setCountdown(60);
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to resend OTP."
			);
		}
	};

	return (
		<div className="bg-gray-300 min-h-screen flex justify-center items-center pt-[70px]">
			<div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-lg">
				<h2 className="text-3xl font-bold text-green-700 text-center mb-6">
					Verify OTP
				</h2>

				<p className="text-center text-gray-600">
					We've sent a password reset OTP to
				</p>

				<p className="text-center font-semibold text-green-700 mt-2">
					{email}
				</p>

				<div
					className="flex justify-center gap-3 mt-8"
					onPaste={handlePaste}
				>
					{otp.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type="text"
							maxLength={1}
							value={digit}
							onChange={(e) =>
								handleChange(e.target.value, index)
							}
							onKeyDown={(e) =>
								handleKeyDown(e, index)
							}
							className="w-12 h-14 border border-gray-400 rounded text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					))}
				</div>

				<button
					onClick={handleVerifyOTP}
					disabled={loading}
					className={`w-full mt-8 py-2 rounded cursor-pointer text-white transition ${
						loading
							? "bg-green-400 cursor-not-allowed"
							: "bg-green-600 hover:bg-green-700"
					}`}
				>
					{loading ? "Verifying..." : "Verify OTP"}
				</button>

				<div className="mt-6 text-center">
					{countdown > 0 ? (
						<p className="text-gray-500">
							Resend OTP in {countdown}s
						</p>
					) : (
						<button
							onClick={handleResendOTP}
							className="text-green-600 hover:underline cursor-pointer font-semibold"
						>
							Resend OTP
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default VerifyResetOTP;