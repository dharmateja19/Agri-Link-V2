import React from "react";
import ActionCard from "./ActionCard";

const NegotiationActions = ({
	deal,
	isMyTurn,
	isBuyer,
	loading,
	updateDeal,
	setShowCounterModal,
}) => {
	if (
		deal.status !== "PENDING" &&
		deal.status !== "NEGOTIATING"
	) {
		return null;
	}

	return (
		<ActionCard title="Negotiation">
			{isMyTurn ? (
				<div className="flex gap-3 flex-wrap items-center">
					<button
						onClick={() => setShowCounterModal(true)}
						className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded font-medium transition cursor-pointer"
					>
						Counter Offer
					</button>

					<button
						disabled={loading}
						onClick={() => updateDeal("ACCEPT")}
						className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium disabled:opacity-50 transition cursor-pointer"
					>
						Accept
					</button>

					<button
						disabled={loading}
						onClick={() => updateDeal("REJECT")}
						className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-medium disabled:opacity-50 transition cursor-pointer"
					>
						Reject
					</button>

					{isBuyer && (
						<button
							disabled={loading}
							onClick={() => {
								if (window.confirm("Are you sure you want to cancel this deal negotiation?")) {
									updateDeal("CANCEL");
								}
							}}
							className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium disabled:opacity-50 transition cursor-pointer"
						>
							Cancel Deal
						</button>
					)}
				</div>
			) : (
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<p className="text-gray-500 italic">
						Waiting for the other party to respond...
					</p>

					{isBuyer && (
						<button
							disabled={loading}
							onClick={() => {
								if (window.confirm("Are you sure you want to cancel this deal negotiation?")) {
									updateDeal("CANCEL");
								}
							}}
							className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded font-medium disabled:opacity-50 transition cursor-pointer"
						>
							Cancel Deal
						</button>
					)}
				</div>
			)}
		</ActionCard>
	);
};

export default NegotiationActions;