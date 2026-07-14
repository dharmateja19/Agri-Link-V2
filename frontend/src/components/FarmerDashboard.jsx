import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const FarmerDashboard = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [deals, setDeals] = useState([]);
	const [activeTab, setActiveTab] = useState("crops");
	const [dealSubTab, setDealSubTab] = useState("all");
	const [contactRequests, setContactRequests] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [selectedCrop, setSelectedCrop] = useState(null);
	const [cropForm, setCropForm] = useState({
		name: "",
		quantity: "",
		price: "",
		imageUrl: "",
		description: "",
	});

	const token = sessionStorage.getItem("token");

	useEffect(() => {
		if (activeTab === "crops") fetchCrops();
		else if (activeTab === "deals") {
			fetchDeals();
			fetchContactRequests();
		}
	}, [activeTab]);

	const fetchCrops = async () => {
		try {
			const res = await axios.get(`${apiurl}/crops/farmer`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setProducts(res.data.crops || []);
		} catch (err) {
			console.error("Error fetching crops:", err);
		}
	};

	const fetchDeals = async () => {
		try {
			const res = await axios.get(`${apiurl}/deals/farmer`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setDeals(res.data.deals || []);
		} catch (err) {
			console.error("Error fetching deals:", err);
		}
	};

	const fetchContactRequests = async () => {
		try {
			const res = await axios.get(`${apiurl}/contact/farmer`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setContactRequests(res.data.requests || []);
		} catch (err) {
			console.error("Error fetching contact requests:", err);
		}
	};

	const handleRespondContact = async (requestId, decision) => {
		try {
			await axios.put(
				`${apiurl}/contact/respond/${requestId}`,
				{
					status: decision,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			fetchContactRequests();
		} catch (err) {
			console.error("Error responding to contact request:", err);
			alert("Failed to respond to contact request.");
		}
	};

	const handleAddCrop = async () => {
		const { name, quantity, price } = cropForm;
		if (!name || !quantity || !price) {
			alert("All fields are required.");
			return;
		}
		try {
			await axios.post(`${apiurl}/crops/addcrop`, cropForm, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setShowAddModal(false);
			fetchCrops();
			setCropForm({ name: "", quantity: "", price: "", imageUrl: "", description: "" });
		} catch (err) {
			console.error("Error adding crop:", err);
			alert(err.response?.data?.message || "Failed to add crop.");
		}
	};

	const handleUpdateCrop = async () => {
		try {
			await axios.put(
				`${apiurl}/crops/updatecrop/${selectedCrop._id}`,
				cropForm,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setShowUpdateModal(false);
			fetchCrops();
		} catch (err) {
			console.error("Error updating crop:", err);
			alert(err.response?.data?.message || "Failed to update crop.");
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this crop listing?")) return;
		try {
			await axios.delete(`${apiurl}/crops/deletecrop/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			fetchCrops();
		} catch (err) {
			console.error("Error deleting crop:", err);
		}
	};

	const openUpdateModal = (crop) => {
		setSelectedCrop(crop);
		setCropForm({
			name: crop.name,
			quantity: crop.quantity,
			price: crop.price,
			imageUrl: crop.imageUrl,
			description: crop.description || "",
		});
		setShowUpdateModal(true);
	};

	const getStatusBadgeClass = (status) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "NEGOTIATING":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "ACCEPTED":
				return "bg-green-100 text-green-800 border-green-200";
			case "COMPLETION_PENDING":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "COMPLETED":
				return "bg-emerald-100 text-emerald-800 border-emerald-200";
			case "REJECTED":
				return "bg-red-100 text-red-800 border-red-200";
			case "CANCELLED":
				return "bg-gray-100 text-gray-800 border-gray-200";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const activeNegotiations = deals.filter((d) => ["PENDING", "NEGOTIATING"].includes(d.status));
	const acceptedDeals = deals.filter((d) => d.status === "ACCEPTED");
	const pendingContactReqs = contactRequests.filter((r) => r.status === "pending");
	const completionPendingDeals = deals.filter((d) => d.status === "COMPLETION_PENDING");
	const completedDeals = deals.filter((d) => d.status === "COMPLETED");
	const pastDeals = deals.filter((d) => ["REJECTED", "CANCELLED"].includes(d.status));

	const getFilteredDeals = () => {
		switch (dealSubTab) {
			case "all":
				return deals;
			case "active":
				return activeNegotiations;
			case "accepted":
				return acceptedDeals;
			case "completion":
				return completionPendingDeals;
			case "completed":
				return completedDeals;
			case "past":
				return pastDeals;
			default:
				return [];
		}
	};
	const filteredDealsList = getFilteredDeals();

	return (
		<div className="p-6 bg-gray-100 min-h-screen pt-[80px]">
			<div className="max-w-7xl mx-auto">
				{/* Top Actions */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
						<button
							onClick={() => setActiveTab("crops")}
							className={`px-5 py-2 rounded-md font-medium transition-all duration-200 ${
								activeTab === "crops"
									? "bg-green-700 text-white shadow-sm"
									: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							}`}
						>
							My Crop Listings
						</button>
						<button
							onClick={() => setActiveTab("deals")}
							className={`px-5 py-2 rounded-md font-medium transition-all duration-200 ${
								activeTab === "deals"
									? "bg-green-700 text-white shadow-sm"
									: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							}`}
						>
							My Deals
						</button>
					</div>

					<button
						onClick={() => setShowAddModal(true)}
						className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
					>
						+ Add Crop Listing
					</button>
				</div>

				{/* CROPS VIEW */}
				{activeTab === "crops" && (
					<>
						{products.length === 0 ? (
							<div className="text-center bg-white p-10 rounded-xl border shadow-sm">
								<p className="text-gray-500 text-lg">You haven't listed any crops yet.</p>
								<button
									onClick={() => setShowAddModal(true)}
									className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
								>
									Add Your First Crop
								</button>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								{products.map((p) => (
									<div
										key={p._id}
										className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition duration-200"
									>
										<img
											src={
												p.imageUrl ||
												"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
											}
											className="w-full h-48 object-cover"
											alt={p.name}
										/>
										<div className="p-5">
											<h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
											<div className="mt-1 space-y-1 text-gray-600">
												<p>Available Quantity: <span className="font-semibold">{p.quantity} kg</span></p>
												<p>Price: <span className="font-semibold text-green-700">₹{p.price}/kg</span></p>
												<p className="text-sm italic mt-1 text-gray-500">
													{p.description ? p.description : "No description provided"}
												</p>
											</div>
											<div className="mt-3 flex gap-2 pt-0">
												<button
													onClick={() => openUpdateModal(p)}
													className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition"
												>
													Update
												</button>
												<button
													onClick={() => handleDelete(p._id)}
													className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}

				{/* DEALS VIEW */}
				{activeTab === "deals" && (
					<>
						<div className="flex gap-2 border-b pb-3 mb-6 overflow-x-auto whitespace-nowrap">
							<button
								onClick={() => setDealSubTab("all")}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
									dealSubTab === "all"
										? "bg-green-75 text-green-800 border border-green-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent"
								}`}
							>
								All ({deals.length})
							</button>
							<button
								onClick={() => setDealSubTab("active")}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
									dealSubTab === "active"
										? "bg-green-75 text-green-800 border border-green-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent"
								}`}
							>
								Active ({activeNegotiations.length})
							</button>
							<button
								onClick={() => setDealSubTab("accepted")}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
									dealSubTab === "accepted"
										? "bg-green-75 text-green-800 border border-green-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent"
								}`}
							>
								Accepted ({acceptedDeals.length})
							</button>
							<button
								onClick={() => setDealSubTab("contactRequests")}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
									dealSubTab === "contactRequests"
										? "bg-green-75 text-green-800 border border-green-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent"
								}`}
							>
								Contact Requests ({pendingContactReqs.length})
							</button>
							<button
								onClick={() => setDealSubTab("completion")}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
									dealSubTab === "completion"
										? "bg-green-75 text-green-800 border border-green-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent"
								}`}
							>
								Completion Pending ({completionPendingDeals.length})
							</button>
							<button
								onClick={() => setDealSubTab("completed")}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
									dealSubTab === "completed"
										? "bg-green-75 text-green-800 border border-green-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent"
								}`}
							>
								Completed ({completedDeals.length})
							</button>
							<button
								onClick={() => setDealSubTab("past")}
								className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
									dealSubTab === "past"
										? "bg-green-75 text-green-800 border border-green-200"
										: "text-gray-600 hover:bg-gray-50 border border-transparent"
								}`}
							>
								Past Deals ({pastDeals.length})
							</button>
						</div>

						{dealSubTab === "contactRequests" ? (
							pendingContactReqs.length === 0 ? (
								<div className="text-center bg-white p-10 rounded-xl border shadow-sm">
									<p className="text-gray-500 text-lg">No pending contact requests.</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{pendingContactReqs.map((req) => (
										<div
											key={req._id}
											className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition duration-200 p-5 flex flex-col justify-between"
										>
											<div>
												<img
													src={
														req.crop?.imageUrl ||
														"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
													}
													alt={req.crop?.name}
													className="w-full h-48 object-cover rounded-lg mb-4"
												/>
												<div className="flex justify-between items-start mb-2">
													<h3 className="text-xl font-bold text-gray-800">
														{req.crop?.name || "Crop Request"}
													</h3>
													<span className="px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-100 text-yellow-800 border-yellow-200">
														Pending Approval
													</span>
												</div>
												<div className="space-y-1 text-gray-600 mb-4">
													<p>Buyer: <span className="font-semibold">{req.buyer?.name}</span></p>
													<p>Location: <span className="font-semibold">{req.buyer?.location}</span></p>
												</div>
											</div>
											<div className="flex gap-2 border-t pt-4">
												<button
													onClick={() => handleRespondContact(req._id, "approved")}
													className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition text-sm cursor-pointer"
												>
													Approve
												</button>
												<button
													onClick={() => handleRespondContact(req._id, "rejected")}
													className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition text-sm cursor-pointer"
												>
													Reject
												</button>
											</div>
										</div>
									))}
								</div>
							)
						) : filteredDealsList.length === 0 ? (
							<div className="text-center bg-white p-10 rounded-xl border shadow-sm">
								<p className="text-gray-500 text-lg">No deals found in this category.</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredDealsList.map((deal) => (
									<div
										key={deal._id}
										className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition duration-200 flex flex-col justify-between"
									>
										<div>
											<img
												src={
													deal.crop?.imageUrl ||
													"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
												}
												alt={deal.crop?.name}
												className="w-full h-48 object-cover"
											/>

											<div className="p-5 space-y-3">
												<div className="flex justify-between items-start">
													<h3 className="text-xl font-bold text-gray-800">{deal.crop?.name}</h3>
													<span
														className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
															deal.status
														)}`}
													>
														{deal.status.replace("_", " ")}
													</span>
												</div>

												<div className="space-y-1 text-gray-600">
													<p>Buyer: <span className="font-semibold">{deal.buyer?.name}</span></p>
													<p>Location: <span className="text-sm font-semibold">{deal.buyer?.location}</span></p>
													<p>Listed Price: <span className="font-semibold text-green-700">₹{deal.listedPrice}/kg</span></p>
													<p>Current Offer: <span className="font-semibold text-blue-700">₹{deal.currentOffer}/kg</span></p>
													<p>Quantity Requested: <span className="font-semibold">{deal.quantity} kg</span></p>
													{deal.agreedPrice && (
														<p className="text-green-600 font-bold mt-2">Agreed Price: ₹{deal.agreedPrice}/kg</p>
													)}
												</div>
											</div>
										</div>

										<div className="p-5 border-t bg-gray-50">
											<button
												onClick={() => navigate(`/deals/${deal._id}`)}
												className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
											>
												View Negotiation
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>

			{/* ADD CROP MODAL */}
			{showAddModal && (
				<div className="fixed backdrop-blur-sm bg-black/30 inset-0 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border">
						<h3 className="text-xl font-bold text-gray-800 mb-4">Add New Crop Listing</h3>
						<CropForm
							form={cropForm}
							setForm={setCropForm}
							onCancel={() => {
								setShowAddModal(false);
								setCropForm({
									name: "",
									quantity: "",
									price: "",
									imageUrl: "",
									description: "",
								});
							}}
							onSubmit={handleAddCrop}
						/>
					</div>
				</div>
			)}

			{/* UPDATE CROP MODAL */}
			{showUpdateModal && (
				<div className="fixed backdrop-blur-sm bg-black/30 inset-0 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border">
						<h3 className="text-xl font-bold text-gray-800 mb-4">Update Crop Listing</h3>
						<CropForm
							form={cropForm}
							setForm={setCropForm}
							onCancel={() => {
								setShowUpdateModal(false);
								setCropForm({
									name: "",
									quantity: "",
									price: "",
									imageUrl: "",
									description: "",
								});
							}}
							onSubmit={handleUpdateCrop}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

const CropForm = ({ form, setForm, onCancel, onSubmit }) => (
	<div className="space-y-4">
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
			<input
				type="text"
				placeholder="e.g. Basmati Rice, Wheat"
				className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
				required
			/>
		</div>
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
			<input
				type="number"
				placeholder="e.g. 500"
				className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
				value={form.quantity}
				onChange={(e) => setForm({ ...form, quantity: e.target.value })}
				required
			/>
		</div>
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">Price (₹ per kg)</label>
			<input
				type="number"
				placeholder="e.g. 45"
				className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
				value={form.price}
				onChange={(e) => setForm({ ...form, price: e.target.value })}
				required
			/>
		</div>
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
			<input
				type="text"
				placeholder="Link to crop photo"
				className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
				value={form.imageUrl}
				onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
			/>
		</div>
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
			<textarea
				rows={3}
				placeholder="Additional details about crop quality, harvest date, packaging..."
				className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
				value={form.description}
				onChange={(e) => setForm({ ...form, description: e.target.value })}
			/>
		</div>
		<div className="flex justify-end space-x-3 pt-4 border-t">
			<button
				onClick={onCancel}
				className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition"
			>
				Cancel
			</button>
			<button
				onClick={onSubmit}
				className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
			>
				Submit
			</button>
		</div>
	</div>
);

export default FarmerDashboard;
