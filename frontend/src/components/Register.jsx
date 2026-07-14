import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;
const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		mobile: "",
		role: "",
		location: "",
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const handleData = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: "" });
	};

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const validateForm = () => {
		const newErrors = {};
		const { name, email, password, mobile, role, location } = formData;

		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
		const mobileRegex = /^[6-9]\d{9}$/;

		if (!name.trim()) newErrors.name = "Name is required";
		if (!email.trim()) newErrors.email = "Email is required";
		else if (!validateEmail(email)) newErrors.email = "Invalid email format";

		if (!password) {
			newErrors.password = "Password is required";
		} else if (!passwordRegex.test(password)) {
			newErrors.password =
				"Password must be at least 6 characters and include uppercase, lowercase, number, and special character";
		}

		if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
		else if (mobile.length < 10 || !mobileRegex.test(mobile))
			newErrors.mobile = "Mobile number must be a valid 10-digit number";

		if (!role) newErrors.role = "Please select a role";
		if (!location.trim()) newErrors.location = "Location is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		try {
			const response = await axios.post(`${apiurl}/auth/register`, formData);

			sessionStorage.setItem("verificationEmail", response.data.email);

			toast.success(response.data.message);

			navigate("/verify-email");
		} catch (error) {
			console.error(error);

			toast.error(error.response?.data?.message || "Registration failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gray-300 min-h-screen flex items-center justify-center pt-[70px]">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl bg-gray-100 p-8 rounded-lg shadow-lg"
			>
				<h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
					Register to AgriLink
				</h2>
				<label className="mt-2 font-semibold">Name</label>
				<input
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					type="text"
					name="name"
					value={formData.name}
					placeholder="Enter your name"
					onChange={handleData}
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-red-600">{errors.name}</p>
				)}
				<label className="mt-4 mb-1 font-semibold">Email</label>
				<input
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					type="email"
					name="email"
					value={formData.email}
					placeholder="Enter your email"
					onChange={handleData}
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-600">{errors.email}</p>
				)}
				<label className="mt-4 mb-1 font-semibold">Password</label>
				<input
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					type={showPassword ? "text" : "password"}
					name="password"
					value={formData.password}
					placeholder="Enter a strong password"
					onChange={handleData}
				/>
				{errors.password && (
					<p className="mt-1 text-sm text-red-600">{errors.password}</p>
				)}
				<label className="mt-4 mb-1 font-semibold">Mobile</label>
				<input
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					type="number"
					name="mobile"
					value={formData.mobile}
					placeholder="Enter your mobile number"
					onChange={handleData}
				/>
				{errors.mobile && (
					<p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
				)}
				<label className="mt-4 mb-1 font-semibold">Role</label>
				<select
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					name="role"
					value={formData.role}
					onChange={handleData}
				>
					<option value="">Select Role</option>
					<option value="farmer">Farmer</option>
					<option value="buyer">Buyer</option>
				</select>
				{errors.role && (
					<p className="mt-1 text-sm text-red-600">{errors.role}</p>
				)}
				<label className="mt-4 mb-1 font-semibold">Location</label>
				<input
					className="w-full mt-2 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					type="text"
					name="location"
					value={formData.location}
					placeholder="Enter your location"
					onChange={handleData}
				/>
				{errors.location && (
					<p className="mt-1 text-sm text-red-600">{errors.location}</p>
				)}
				<div className="mt-4 flex items-center">
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
				<input
					type="submit"
					value={loading ? "Registering..." : "Register"}
					disabled={loading}
					className={`w-full py-2 mt-3 rounded text-white transition ${
						loading
							? "bg-green-400 cursor-not-allowed"
							: "bg-green-600 hover:bg-green-700 cursor-pointer"
					}`}
				/>
				<p className="text-center mt-4">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-600 hover:underline">
						Login here
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Register;
