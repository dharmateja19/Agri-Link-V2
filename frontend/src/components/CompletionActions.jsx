import ActionCard from "./ActionCard";

const CompletionActions = ({
	deal,
	isBuyer,
	isFarmer,
	requestCompletion,
	confirmCompletion,
}) => {
	if (
		!["ACCEPTED", "COMPLETION_PENDING", "COMPLETED"].includes(
			deal.status,
		)
	) {
		return null;
	}

	return (
		<ActionCard title="Completion">
			{deal.status === "ACCEPTED" && (
				<>
					{isFarmer ? (
						<div>
							<p className="text-gray-600 mb-3">
								Once the crop has been delivered, request the buyer to
								confirm completion.
							</p>

							<button
								onClick={requestCompletion}
								className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded"
							>
								Request Completion
							</button>
						</div>
					) : (
						<p className="text-gray-600">
							Waiting for the farmer to request completion.
						</p>
					)}
				</>
			)}

			{deal.status === "COMPLETION_PENDING" && (
				<>
					{isBuyer ? (
						<div>
							<p className="text-gray-600 mb-3">
								The farmer has requested completion of this deal.
							</p>

							<button
								onClick={confirmCompletion}
								className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
							>
								Confirm Completion
							</button>
						</div>
					) : (
						<p className="text-gray-600">
							Waiting for the buyer to confirm completion.
						</p>
					)}
				</>
			)}

			{deal.status === "COMPLETED" && (
				<div className="rounded-xl border border-green-200 bg-green-50 p-5">
					<h3 className="text-green-700 text-lg font-semibold">
						Deal Completed
					</h3>

					<p className="text-gray-600 mt-2">
						Both buyer and farmer have confirmed this transaction.
					</p>
				</div>
			)}
		</ActionCard>
	);
};

export default CompletionActions;