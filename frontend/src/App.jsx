import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import VerifyResetOTP from "./components/VerifyResetOtp";
import ResetPassword from "./components/ResetPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FarmerDashboard from "./components/FarmerDashboard";
import BuyerMarketplace from "./components/BuyerMarketPlace";
import AdminPanel from "./components/AdminPanel";
import Copyright from "./components/Copyright";
import ProfilePage from "./components/ProfilePage";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DealDetails from "./components/DealDetails";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/farmer/dashboard" element={<FarmerDashboard />} />
					<Route path="/buyer/dashboard" element={<BuyerMarketplace />} />
					<Route path="/admin/dashboard" element={<AdminPanel />} />
					<Route path="/user/profile" element={<ProfilePage />} />
					<Route path="/deals/:id" element={<DealDetails />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				theme="light"
				toastClassName="border border-gray-200 shadow-lg"
				bodyClassName="text-gray-800"
			/>
			<Copyright />
		</Router>
	);
}

export default App;
