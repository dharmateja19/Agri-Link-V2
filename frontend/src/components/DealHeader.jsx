import React from "react";

const DealHeader = ({ deal }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-100 text-yellow-700";

			case "NEGOTIATING":
				return "bg-blue-100 text-blue-700";

			case "ACCEPTED":
				return "bg-green-100 text-green-700";

			case "COMPLETION_PENDING":
				return "bg-purple-100 text-purple-700";

			case "COMPLETED":
				return "bg-emerald-100 text-emerald-700";

			case "REJECTED":
				return "bg-red-100 text-red-700";

			case "CANCELLED":
				return "bg-gray-200 text-gray-700";

			default:
				return "bg-gray-100";
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-lg p-6">
			<div className="flex flex-col md:flex-row gap-6">
				{/* Crop Image */}

				<div className="md:w-1/3">
					<img
						src={
							deal.crop?.imageUrl ||
							"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
						}
						alt={deal.crop?.name}
						className="w-full h-64 object-cover rounded-lg"
					/>
				</div>

				{/* Details */}

				<div className="flex-1">
					<div className="flex justify-between items-start">
						<h2 className="text-3xl font-bold">{deal.crop?.name}</h2>

						<span
							className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
								deal.status,
							)}`}
						>
							{deal.status.replace("_", " ")}
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
						<div>
							<p className="text-gray-500">Listed Price</p>

							<p className="text-xl font-semibold text-green-700">
								₹{deal.listedPrice}/kg
							</p>
						</div>

						<div>
							<p className="text-gray-500">Current Offer</p>

							<p className="text-xl font-semibold text-blue-700">
								₹{deal.currentOffer}/kg
							</p>
						</div>

						<div>
							<p className="text-gray-500">Quantity</p>

							<p className="text-lg">{deal.quantity} kg</p>
						</div>

						<div>
							<p className="text-gray-500">Agreed Price</p>

							<p className="text-xl font-semibold text-green-600">
								{deal.agreedPrice ? `₹${deal.agreedPrice}/kg` : "--"}
							</p>
						</div>

						<div>
							<p className="text-gray-500">Buyer</p>

							<p className="font-medium">{deal.buyer?.name}</p>
						</div>

						<div>
							<p className="text-gray-500">Farmer</p>

							<p className="font-medium">{deal.farmer?.name}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DealHeader;
