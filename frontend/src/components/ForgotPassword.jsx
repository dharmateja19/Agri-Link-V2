import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            return toast.error("Email is required.");
        }

        if (!validateEmail(email)) {
            return toast.error("Please enter a valid email.");
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${apiurl}/auth/forgot-password`,
                {
                    email,
                }
            );

            sessionStorage.setItem("resetEmail", email);

            toast.success(response.data.message);

            navigate("/verify-reset-otp");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="bg-gray-300 min-h-screen flex justify-center items-center pt-[70px]">

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-xl w-full max-w-md p-8"
            >

                <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                    Forgot Password
                </h2>

                <p className="text-gray-600 text-center mb-6">
                    Enter your registered email address.
                    We'll send you a password reset OTP.
                </p>

                <label className="font-semibold">
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    className="w-full mt-2 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-6 py-3 rounded-xl text-white cursor-pointer font-semibold transition
                        ${
                            loading
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {loading
                        ? "Sending OTP..."
                        : "Send OTP"}
                </button>

                <p className="text-center mt-6">

                    Remember your password?{" "}

                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </form>

        </div>
    );
};

export default ForgotPassword;