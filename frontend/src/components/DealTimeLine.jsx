import React from "react";

const DealTimeline = ({ deal }) => {
	if (!deal?.offers || deal.offers.length === 0) {
		return (
			<div className="bg-white rounded-xl shadow-md p-6 border">
				<p className="text-gray-500 text-center">
					No negotiation history available.
				</p>
			</div>
		);
	}

	const formatDate = (date) =>
		new Date(date).toLocaleString("en-IN", {
			dateStyle: "medium",
			timeStyle: "short",
		});

	// Construct all events
	const events = deal.offers.map((offer) => {
		const offeredById = offer.offeredBy?._id
			? offer.offeredBy._id.toString()
			: offer.offeredBy?.toString();
		const buyerId = deal.buyer?._id
			? deal.buyer._id.toString()
			: deal.buyer?.toString();
		const isBuyer = offeredById === buyerId;

		return {
			type: "OFFER",
			createdAt: offer.createdAt,
			isBuyer,
			senderName: isBuyer ? deal.buyer?.name : deal.farmer?.name,
			price: offer.price,
			message: offer.message,
		};
	});

	// Add status events
	const isAccepted = ["ACCEPTED", "COMPLETION_PENDING", "COMPLETED"].includes(deal.status);
	if (isAccepted) {
		events.push({
			type: "STATUS",
			statusType: "ACCEPTED",
			createdAt: deal.offers[deal.offers.length - 1]?.createdAt || deal.updatedAt,
			title: "Deal Accepted",
			description: `Price agreed at ₹${deal.agreedPrice || deal.currentOffer}/kg for ${deal.quantity} kg.`,
			bgClass: "bg-green-50 text-green-800 border-green-200",
			dotColor: "bg-green-600"
		});
	}

	const isCompletionPending = ["COMPLETION_PENDING", "COMPLETED"].includes(deal.status);
	if (isCompletionPending) {
		events.push({
			type: "STATUS",
			statusType: "COMPLETION_PENDING",
			createdAt: deal.completedAt || deal.updatedAt,
			title: "Completion Requested",
			description: "The farmer has requested transaction completion.",
			bgClass: "bg-purple-50 text-purple-800 border-purple-200",
			dotColor: "bg-purple-600"
		});
	}

	if (deal.status === "COMPLETED") {
		events.push({
			type: "STATUS",
			statusType: "COMPLETED",
			createdAt: deal.completedAt || deal.updatedAt,
			title: "Deal Completed",
			description: "Offline transaction completed and verified successfully.",
			bgClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
			dotColor: "bg-emerald-600"
		});
	}

	if (deal.status === "REJECTED") {
		events.push({
			type: "STATUS",
			statusType: "REJECTED",
			createdAt: deal.updatedAt,
			title: "Deal Rejected",
			description: "Negotiation rejected by counterpart.",
			bgClass: "bg-red-50 text-red-800 border-red-200",
			dotColor: "bg-red-600"
		});
	}

	if (deal.status === "CANCELLED") {
		events.push({
			type: "STATUS",
			statusType: "CANCELLED",
			createdAt: deal.updatedAt,
			title: "Deal Cancelled",
			description: "Negotiation cancelled by buyer.",
			bgClass: "bg-gray-50 text-gray-800 border-gray-200",
			dotColor: "bg-gray-600"
		});
	}

	// Sort events chronologically by date
	events.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border">
			<h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
				Negotiation & Deal Timeline
			</h2>

			<div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8">
				{events.map((event, idx) => {
					if (event.type === "STATUS") {
						return (
							<div key={idx} className="relative">
								{/* Timeline node icon */}
								<div className="absolute -left-[33px] md:-left-[41px] top-1 bg-white rounded-full p-1 border-2 border-gray-300">
									<div className={`w-3.5 h-3.5 rounded-full ${event.dotColor || "bg-blue-600"}`}></div>
								</div>

								{/* Status milestone badge */}
								<div className={`inline-block rounded-xl border p-4 shadow-sm max-w-lg ${event.bgClass}`}>
									<h4 className="font-bold text-base flex items-center gap-2">
										{event.title}
									</h4>
									<p className="text-sm mt-1 opacity-95">{event.description}</p>
									<span className="block text-xs mt-2 opacity-75">
										{formatDate(event.createdAt)}
									</span>
								</div>
							</div>
						);
					}

					// Otherwise, it's an offer card
					return (
						<div key={idx} className="relative">
							{/* Timeline node icon */}
							<div className="absolute -left-[33px] md:-left-[41px] top-1 bg-white rounded-full p-1 border-2 border-gray-300">
								<div className={`w-3.5 h-3.5 rounded-full ${event.isBuyer ? "bg-green-600" : "bg-yellow-500"}`}></div>
							</div>

							{/* Offer content block */}
							<div className="max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow transition p-4">
								<div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
									<span className="font-semibold text-gray-700 flex items-center gap-1.5">
										{event.senderName}
										<span className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded-full ml-1 uppercase tracking-wide ${event.isBuyer ? "bg-green-600" : "bg-yellow-600"}`}>
											{event.isBuyer ? "buyer" : "farmer"}
										</span>
									</span>
									<span className="text-xs text-gray-400">
										{formatDate(event.createdAt)}
									</span>
								</div>

								<div className="mt-2 flex items-baseline justify-between gap-4">
									<div>
										<p className="text-2xl font-bold text-green-700">
											₹{event.price}/kg
										</p>
										{event.message && (
											<p className="mt-2 text-sm text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 italic">
												"{event.message}"
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default DealTimeline;
