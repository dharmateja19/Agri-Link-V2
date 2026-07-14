import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const ResetPassword = () => {
	const navigate = useNavigate();

	const [email] = useState(sessionStorage.getItem("resetEmail"));

	const [passwords, setPasswords] = useState({
		newPassword: "",
		confirmPassword: "",
	});

	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!email) {
			navigate("/forgot-password");
		}
	}, [email, navigate]);

	const handleChange = (e) => {
		setPasswords({
			...passwords,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			passwords.newPassword !== passwords.confirmPassword
		) {
			return toast.error("Passwords do not match.");
		}

		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

		if (!passwordRegex.test(passwords.newPassword)) {
			return toast.error(
				"Password must contain at least 6 characters, including uppercase, lowercase, number and special character."
			);
		}

		try {
			setLoading(true);

			const response = await axios.post(
				`${apiurl}/auth/reset-password`,
				{
					email,
					newPassword: passwords.newPassword,
				}
			);

			toast.success(response.data.message);

			sessionStorage.removeItem("resetEmail");

			navigate("/login");

		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Password reset failed."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gray-300 min-h-screen flex justify-center items-center pt-[70px]">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-lg"
			>
				<h2 className="text-3xl font-bold text-green-700 text-center">
					Create New Password
				</h2>

				<p className="text-center text-gray-600 mt-3">
					Your identity has been verified.
				</p>

				<div className="flex justify-center mt-4 mb-6">
					<div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
						✓ OTP Verified Successfully
					</div>
				</div>

				<label className="font-semibold">
					New Password
				</label>

				<input
					type={showPassword ? "text" : "password"}
					name="newPassword"
					value={passwords.newPassword}
					onChange={handleChange}
					placeholder="Enter new password"
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
				/>

				<label className="mt-4 block font-semibold">
					Confirm Password
				</label>

				<input
					type={showPassword ? "text" : "password"}
					name="confirmPassword"
					value={passwords.confirmPassword}
					onChange={handleChange}
					placeholder="Confirm password"
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
				/>

				<div className="mt-4 flex items-center">
					<input
						type="checkbox"
						id="showPassword"
						className="mr-2"
						checked={showPassword}
						onChange={() =>
							setShowPassword(!showPassword)
						}
					/>

					<label
						htmlFor="showPassword"
						className="text-sm text-gray-700"
					>
						Show Password
					</label>
				</div>

				<button
					type="submit"
					disabled={loading}
					className={`w-full mt-6 py-2 rounded cursor-pointer text-white transition ${
						loading
							? "bg-green-400 cursor-not-allowed"
							: "bg-green-600 hover:bg-green-700"
					}`}
				>
					{loading
						? "Resetting..."
						: "Reset Password"}
				</button>
			</form>
		</div>
	);
};

export default ResetPassword;