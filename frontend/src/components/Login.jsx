import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);

		try {
			const res = await axios.post(`${apiurl}/auth/login`, formData);

			sessionStorage.setItem("user", JSON.stringify(res.data.user));

			sessionStorage.setItem("token", res.data.token);

			toast.success(res.data.message);

			const role = res.data.user.role;

			if (role === "farmer") {
				navigate("/farmer/dashboard");
			} else if (role === "buyer") {
				navigate("/buyer/dashboard");
			} else if (role === "admin") {
				navigate("/admin/dashboard");
			} else {
				navigate("/");
			}
		} catch (error) {
			const message = error.response?.data?.message || "Login failed.";

			if (message === "Please verify your email before logging in.") {
				sessionStorage.setItem("verificationEmail", formData.email);

				toast.warning(message);

				navigate("/verify-email");

				return;
			}

			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gray-300 min-h-screen flex items-center justify-center pt-[70px]">
			<form
				className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-lg"
				onSubmit={handleSubmit}
			>
				<h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
					Login to AgriLink
				</h2>

				<label className="mt-4 font-semibold">Email</label>
				<input
					className="w-full mb-4 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					type="email"
					name="email"
					placeholder="Enter your email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<label className="mt-4 font-semibold">Password</label>
				<input
					className="w-full mb-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					type={showPassword ? "text" : "password"}
					name="password"
					placeholder="Enter your password"
					value={formData.password}
					onChange={handleChange}
					required
				/>

				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center">
						<input
							type="checkbox"
							id="showPassword"
							className="mr-2"
							checked={showPassword}
							onChange={() => setShowPassword(!showPassword)}
						/>
						<label htmlFor="showPassword" className="text-sm text-gray-700">
							Show Password
						</label>
					</div>

					<Link
						to="/forgot-password"
						className="text-sm text-green-600 hover:text-green-700 hover:underline transition-colors"
					>
						Forgot Password?
					</Link>
				</div>

				<input
					type="submit"
					disabled={loading}
					value={loading ? "Logging in..." : "Login"}
					className={`w-full py-2 rounded text-white transition ${
						loading
							? "bg-green-400 cursor-not-allowed"
							: "bg-green-600 hover:bg-green-700 cursor-pointer"
					}`}
				/>

				<p className="text-center mt-4">
					Don't have an account?{" "}
					<Link to="/register" className="text-blue-600 hover:underline">
						Register here
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Login;
