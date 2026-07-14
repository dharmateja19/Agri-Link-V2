import React, { useEffect, useState } from "react";
import axios from "axios";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const OfferModal = ({ isOpen, onClose, crop, onSuccess }) => {
	const [offerPrice, setOfferPrice] = useState("");
	const [quantity, setQuantity] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const token = sessionStorage.getItem("token");

	useEffect(() => {
		if (isOpen) {
			setOfferPrice("");
			setQuantity("");
			setMessage("");
		}
	}, [isOpen]);

	if (!isOpen || !crop) return null;

	const handleSubmit = async () => {
		if (!offerPrice || !quantity) {
			alert("Offer price and quantity are required.");
			return;
		}

		if (Number(quantity) < 100) {
			alert("Minimum quantity is 100 kg.");
			return;
		}

		if (Number(quantity) > crop.quantity) {
			alert(`Maximum available quantity is ${crop.quantity} kg.`);
			return;
		}

		if (Number(offerPrice) <= 0) {
			alert("Enter a valid offer price.");
			return;
		}

		if (Number(offerPrice) > crop.price) {
			alert("Offer price cannot exceed listed price.");
			return;
		}

		try {
			setLoading(true);

			await axios.post(
				`${apiurl}/deals`,
				{
					cropId: crop._id,
					quantity: Number(quantity),
					offerPrice: Number(offerPrice),
					message,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			alert("Deal request created successfully!");

			onSuccess && onSuccess();

			onClose();
		} catch (err) {
			console.error(err);

			alert(err.response?.data?.message || "Failed to create deal.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
				<h2 className="text-2xl font-bold mb-5">Make Offer</h2>

				<div className="space-y-4">
					<div>
						<p className="font-semibold">Crop</p>
						<p>{crop.name}</p>
					</div>

					<div>
						<p className="font-semibold">Listed Price</p>
						<p>₹{crop.price}/kg</p>
					</div>

					<div>
						<p className="font-semibold">Available Quantity</p>
						<p>{crop.quantity} kg</p>
					</div>

					<div>
						<label className="block mb-1">Your Offer (₹/kg)</label>

						<input
							type="number"
							value={offerPrice}
							onChange={(e) => setOfferPrice(e.target.value)}
							className="w-full border rounded p-2"
							placeholder="Enter your offer"
						/>
					</div>

					<div>
						<label className="block mb-1">Quantity (kg)</label>

						<input
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							className="w-full border rounded p-2"
							placeholder="Enter quantity"
						/>
					</div>

					<div>
						<label className="block mb-1">Message (Optional)</label>

						<textarea
							rows={3}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full border rounded p-2"
							placeholder="Add a message..."
						/>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<button
						onClick={onClose}
						disabled={loading}
						className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit}
						disabled={loading}
						className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
					>
						{loading ? "Submitting..." : "Submit Offer"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default OfferModal;
