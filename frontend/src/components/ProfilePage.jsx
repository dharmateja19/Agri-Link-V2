import React, { useEffect, useState } from "react";
import axios from "axios";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const ProfilePage = () => {
	const [user, setUser] = useState(null);
	const [crops, setCrops] = useState([]);
	const [deals, setDeals] = useState([]);
	const [contactRequests, setContactRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const token = sessionStorage.getItem("token");

	const fetchData = async () => {
		try {
			setLoading(true);
			// 1. Fetch User Profile
			const userRes = await axios.get(`${apiurl}/users/profile`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const currentUser = userRes.data.user;
			setUser(currentUser);

			if (currentUser && currentUser.role !== "admin") {
				// 2. Fetch Crops (if Farmer)
				if (currentUser.role === "farmer") {
					const cropsRes = await axios.get(`${apiurl}/crops/farmer`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					setCrops(cropsRes.data.crops || []);
				}

				// 3. Fetch Deals
				const dealsUrl =
					currentUser.role === "farmer"
						? `${apiurl}/deals/farmer`
						: `${apiurl}/deals/buyer`;
				const dealsRes = await axios.get(dealsUrl, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setDeals(dealsRes.data.deals || []);

				// 4. Fetch Contact Requests
				const contactUrl =
					currentUser.role === "farmer"
						? `${apiurl}/contact/farmer`
						: `${apiurl}/contact/buyer`;
				const contactRes = await axios.get(contactUrl, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setContactRequests(currentUser.role === "farmer" ? (contactRes.data.requests || []) : (contactRes.data.requests || []));
			}
		} catch (err) {
			console.error("Failed to fetch profile details", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 pt-24 flex justify-center items-center">
				<div className="flex flex-col items-center gap-3">
					<div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
					<p className="text-gray-500 font-medium">Loading profile information...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-100 pt-24 flex justify-center items-center">
				<p className="text-gray-600 font-semibold">User profile not found. Please log in again.</p>
			</div>
		);
	}

	const activeDealsCount = deals.filter((d) => ["PENDING", "NEGOTIATING"].includes(d.status)).length;
	const completedDealsCount = deals.filter((d) => d.status === "COMPLETED").length;

	// Farmer specific: Approved requests
	const approvedContactsCount = contactRequests.filter((r) => r.status === "approved").length;

	// Buyer specific: Total sent requests
	const sentContactsCount = contactRequests.length;

	return (
		<div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header & Role Badge */}
				<div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
						<p className="text-sm text-gray-500 mt-1">Manage and view your credentials and metrics.</p>
					</div>
					<span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200 capitalize">
						Role: {user.role}
					</span>
				</div>

				<div className="bg-white rounded-2xl shadow-sm border p-6">
					{user.role === "admin" ? (
						<div className="max-w-md mx-auto space-y-4 text-gray-700 text-lg">
							<h2 className="text-2xl font-bold text-green-700 border-b pb-3 mb-4 text-center">Admin Details</h2>
							<div className="space-y-4">
								<div>
									<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Full Name</label>
									<p className="text-base font-semibold text-gray-800 mt-0.5">{user.name}</p>
								</div>
								<div>
									<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Mobile Number</label>
									<p className="text-base font-semibold text-gray-800 mt-0.5">{user.mobile || "N/A"}</p>
								</div>
								<div>
									<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Email Address</label>
									<p className="text-base font-semibold text-gray-800 break-all mt-0.5">{user.email || "N/A"}</p>
								</div>
								<div>
									<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Location</label>
									<p className="text-base font-semibold text-gray-800 mt-0.5">{user.location || "N/A"}</p>
								</div>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Account Details Panel */}
							<div className="lg:col-span-1 border-r border-gray-150 pr-0 lg:pr-6 space-y-6 flex flex-col justify-between">
								<div>
									<h2 className="text-xl font-bold text-gray-800 border-b pb-3">User Details</h2>
									<div className="mt-4 space-y-4">
										<div>
											<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Full Name</label>
											<p className="text-base font-semibold text-gray-800 mt-0.5">{user.name}</p>
										</div>
										<div>
											<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Mobile Number</label>
											<p className="text-base font-semibold text-gray-800 mt-0.5">{user.mobile || "N/A"}</p>
										</div>
										<div>
											<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Email Address</label>
											<p className="text-base font-semibold text-gray-800 break-all mt-0.5">{user.email || "N/A"}</p>
										</div>
										<div>
											<label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Location</label>
											<p className="text-base font-semibold text-gray-800 mt-0.5">{user.location || "N/A"}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Metrics Panel */}
							<div className="lg:col-span-2">
								<h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Performance & Statistics</h2>

								{user.role === "farmer" ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="bg-green-50/50 border border-green-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-green-800">Crops Listed</p>
											<p className="text-3xl font-black text-green-900 mt-2">{crops.length}</p>
											<p className="text-xs text-gray-500 mt-1">Total crops currently listed on listings</p>
										</div>
										<div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-blue-800">Active Deals</p>
											<p className="text-3xl font-black text-blue-900 mt-2">{activeDealsCount}</p>
											<p className="text-xs text-gray-500 mt-1">Ongoing active crop negotiations</p>
										</div>
										<div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-emerald-800">Completed Deals</p>
											<p className="text-3xl font-black text-emerald-900 mt-2">{completedDealsCount}</p>
											<p className="text-xs text-gray-500 mt-1">Successfully finished transactions</p>
										</div>
										<div className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-purple-800">Contact Requests Approved</p>
											<p className="text-3xl font-black text-purple-900 mt-2">{approvedContactsCount}</p>
											<p className="text-xs text-gray-500 mt-1">Contact sharing requests approved</p>
										</div>
										<div className="bg-yellow-50/50 border border-yellow-100 p-5 rounded-2xl sm:col-span-2">
											<p className="text-sm font-semibold text-yellow-800">Average Rating</p>
											<p className="text-lg font-bold text-yellow-900 mt-2">Coming Soon</p>
											<p className="text-xs text-gray-500 mt-1">Rating summary calculated from ratings left by buyers</p>
										</div>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-blue-800">Deals Initiated</p>
											<p className="text-3xl font-black text-blue-900 mt-2">{deals.length}</p>
											<p className="text-xs text-gray-500 mt-1">Total deal offers sent to crop listings</p>
										</div>
										<div className="bg-yellow-50/50 border border-yellow-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-yellow-800">Active Deals</p>
											<p className="text-3xl font-black text-yellow-900 mt-2">{activeDealsCount}</p>
											<p className="text-xs text-gray-500 mt-1">Deals currently under negotiation</p>
										</div>
										<div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-emerald-800">Completed Deals</p>
											<p className="text-3xl font-black text-emerald-900 mt-2">{completedDealsCount}</p>
											<p className="text-xs text-gray-500 mt-1">Successfully completed purchases</p>
										</div>
										<div className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl">
											<p className="text-sm font-semibold text-purple-800">Contact Requests Sent</p>
											<p className="text-3xl font-black text-purple-900 mt-2">{sentContactsCount}</p>
											<p className="text-xs text-gray-500 mt-1">Number of contact requests made to farmers</p>
										</div>
										<div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl sm:col-span-2">
											<p className="text-sm font-semibold text-gray-700">Average Rating</p>
											<p className="text-lg font-bold text-gray-800 mt-2">Coming Soon</p>
											<p className="text-xs text-gray-500 mt-1">Rating summary calculated from ratings left by farmers</p>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
