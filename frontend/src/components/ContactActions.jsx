import React, { useEffect, useState } from "react";
import axios from "axios";
import ActionCard from "./ActionCard";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const ContactActions = ({ deal, isBuyer, isFarmer }) => {
	const token = sessionStorage.getItem("token");
	const isAccepted = ["ACCEPTED", "COMPLETION_PENDING", "COMPLETED"].includes(deal.status);
	const counterpart = isBuyer ? deal.farmer : deal.buyer;
	const roleLabel = isBuyer ? "Farmer" : "Buyer";

	const [status, setStatus] = useState("NONE"); // NONE, PENDING, APPROVED, REJECTED
	const [requestId, setRequestId] = useState(null);
	const [farmerMobile, setFarmerMobile] = useState(null);
	const [farmerEmail, setFarmerEmail] = useState(null);
	const [buyerMobile, setBuyerMobile] = useState(null);
	const [buyerEmail, setBuyerEmail] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchContactStatus = async () => {
		try {
			setLoading(true);
			const res = await axios.get(`${apiurl}/contact/status/deal/${deal._id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.data.success) {
				setStatus(res.data.status); // e.g. "APPROVED", "PENDING", "REJECTED", "NONE"
				setRequestId(res.data.requestId);
				setFarmerMobile(res.data.farmerMobile);
				setFarmerEmail(res.data.farmerEmail);
				setBuyerMobile(res.data.buyerMobile);
				setBuyerEmail(res.data.buyerEmail);
			}
		} catch (err) {
			console.error("Failed to fetch contact request status:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchContactStatus();
	}, [deal._id]);

	const handleRequestContact = async () => {
		try {
			setLoading(true);
			await axios.post(
				`${apiurl}/contact/request`,
				{
					dealId: deal._id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			await fetchContactStatus();
		} catch (err) {
			alert(err.response?.data?.message || "Failed to send contact request.");
		} finally {
			setLoading(false);
		}
	};

	const handleRespond = async (decision) => {
		try {
			setLoading(true);
			await axios.put(
				`${apiurl}/contact/respond/${requestId}`,
				{
					status: decision, // "approved" or "rejected"
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			await fetchContactStatus();
		} catch (err) {
			alert(err.response?.data?.message || "Failed to respond to contact request.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ActionCard title="Contact Information">
			{loading && status === "NONE" ? (
				<div className="flex justify-center items-center py-6 text-gray-500">
					<span className="animate-spin mr-2">🔄</span> Loading status...
				</div>
			) : (
				<div className="space-y-4">
					{/* Status Info Banners */}
					{status === "NONE" && (
						<div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
							{isBuyer ? (
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
									<div>
										<h4 className="font-semibold text-blue-800">Request Contact Information</h4>
										<p className="text-sm text-gray-600 mt-1">
											To coordinate crop hand-off and logistics, request the farmer's contact details.
										</p>
									</div>
									<button
										onClick={handleRequestContact}
										className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition cursor-pointer"
									>
										Request Contact
									</button>
								</div>
							) : (
								<div>
									<h4 className="font-semibold text-gray-700">Contact Details Locked</h4>
									<p className="text-sm text-gray-600 mt-1">
										Waiting for the buyer to request contact details.
									</p>
								</div>
							)}
						</div>
					)}

					{status === "PENDING" && (
						<div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-5">
							{isBuyer ? (
								<div>
									<h4 className="font-semibold text-yellow-800">Request Sent</h4>
									<p className="text-sm text-gray-600 mt-1">
										Waiting for the farmer to approve your contact details request.
									</p>
								</div>
							) : (
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
									<div>
										<h4 className="font-semibold text-yellow-800">Contact Request</h4>
										<p className="text-sm text-gray-600 mt-1">
											The buyer has requested access to your mobile number to complete the deal.
										</p>
									</div>
									<div className="flex gap-2 w-full sm:w-auto">
										<button
											onClick={() => handleRespond("approved")}
											className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer"
										>
											Approve
										</button>
										<button
											onClick={() => handleRespond("rejected")}
											className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer"
										>
											Reject
										</button>
									</div>
								</div>
							)}
						</div>
					)}

					{status === "REJECTED" && (
						<div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
							{isBuyer ? (
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
									<div>
										<h4 className="font-semibold text-red-800">Request Declined</h4>
										<p className="text-sm text-gray-600 mt-1">
											The farmer has declined to share contact details at this time. You can request again if needed.
										</p>
									</div>
									<button
										onClick={handleRequestContact}
										className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition cursor-pointer"
									>
										Request Contact
									</button>
								</div>
							) : (
								<div>
									<h4 className="font-semibold text-red-800">Declined sharing contacts</h4>
									<p className="text-sm text-gray-600 mt-1">
										You declined sharing your contact number with the buyer.
									</p>
								</div>
							)}
						</div>
					)}

					{/* Shared Contact Info Card */}
					<div className="rounded-xl border border-green-200 bg-green-50/45 p-5 space-y-4">
						<div className="flex items-center justify-between border-b border-green-200/60 pb-3">
							<div>
								<h4 className="font-bold text-green-900 text-lg">
									{counterpart?.name || "N/A"}
								</h4>
								<p className="text-sm text-green-700 font-medium capitalize">
									Role: {roleLabel}
								</p>
							</div>
							<span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${status === "APPROVED" || (!isBuyer && isAccepted) ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}>
								{status === "APPROVED" || (!isBuyer && isAccepted) ? "Contact Approved" : "Basic Profile"}
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-3">
								<div>
									<p className="text-xs text-gray-500 font-semibold mb-1">Mobile Number</p>
									{isBuyer ? (
										status === "APPROVED" ? (
											<p className="text-base font-semibold text-gray-800">
												{farmerMobile || "Not available"}
											</p>
										) : (
											<p className="text-sm font-semibold text-gray-400 italic">
												Locked (Approved Request Required)
											</p>
										)
									) : (
										isAccepted ? (
											<p className="text-base font-semibold text-gray-800">
												{deal.buyer?.mobile || "Not available"}
											</p>
										) : (
											<p className="text-sm font-semibold text-gray-400 italic">
												Locked (Accepted Offer Required)
											</p>
										)
									)}
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div>
									<p className="text-xs text-gray-500 font-semibold mb-1">Email Address</p>
									{isBuyer ? (
										status === "APPROVED" ? (
											<p className="text-base font-semibold text-gray-800 break-all">
												{farmerEmail || "Not available"}
											</p>
										) : (
											<p className="text-sm font-semibold text-gray-400 italic">
												Locked (Approved Request Required)
											</p>
										)
									) : (
										isAccepted ? (
											<p className="text-base font-semibold text-gray-800 break-all">
												{deal.buyer?.email || "Not available"}
											</p>
										) : (
											<p className="text-sm font-semibold text-gray-400 italic">
												Locked (Accepted Offer Required)
											</p>
										)
									)}
								</div>
							</div>

							<div className="flex items-center gap-3 md:col-span-2">
								<div>
									<p className="text-xs text-gray-500 font-semibold mb-1">Location</p>
									<p className="text-base font-semibold text-gray-800">
										{counterpart?.location || "Not available"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</ActionCard>
	);
};

export default ContactActions;