import React, { useEffect, useState } from "react";
import axios from "axios";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const CounterOfferModal = ({ isOpen, onClose, deal, refreshDeal }) => {
	const token = sessionStorage.getItem("token");

	const [price, setPrice] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen && deal) {
			setPrice(deal.currentOffer);
			setMessage("");
		}
	}, [isOpen, deal]);

	if (!isOpen || !deal) return null;

	const handleSubmit = async () => {
		if (!price || Number(price) <= 0) {
			alert("Enter a valid offer price.");
			return;
		}

		try {
			setLoading(true);

			await axios.patch(
				`${apiurl}/deals/${deal._id}/respond`,
				{
					decision: "COUNTER",
					price: Number(price),
					message,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			alert("Counter offer sent successfully.");

			refreshDeal();

			onClose();
		} catch (err) {
			console.error(err);

			alert(err.response?.data?.message || "Failed to send counter offer.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
				<h2 className="text-2xl font-bold mb-5">Counter Offer</h2>

				<div className="space-y-4">
					<div>
						<p className="text-gray-500">Crop</p>

						<p className="font-semibold">{deal.crop?.name}</p>
					</div>

					<div>
						<p className="text-gray-500">Listed Price</p>

						<p className="font-semibold text-green-700">
							₹{deal.listedPrice}/kg
						</p>
					</div>

					<div>
						<p className="text-gray-500">Current Offer</p>

						<p className="font-semibold text-blue-700">
							₹{deal.currentOffer}/kg
						</p>
					</div>

					<div>
						<label className="block mb-1 font-medium">Your Counter Price</label>

						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className="w-full border rounded-lg p-2"
						/>
					</div>

					<div>
						<label className="block mb-1 font-medium">Message</label>

						<textarea
							rows={3}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full border rounded-lg p-2"
							placeholder="Explain your counter offer..."
						/>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<button
						onClick={onClose}
						disabled={loading}
						className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit}
						disabled={loading}
						className="px-5 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700"
					>
						{loading ? "Sending..." : "Send Counter Offer"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CounterOfferModal;
