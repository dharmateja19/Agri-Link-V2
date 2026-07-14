import React, { useState } from "react";
import axios from "axios";
import CounterOfferModal from "./CounterOfferModal";
import StatusBadge from "./StatusBadge";
import ContactActions from "./ContactActions";
import NegotiationActions from "./NegotiationActions";
import CompletionActions from "./CompletionActions";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const DealActions = ({ deal, refreshDeal }) => {
	const token = sessionStorage.getItem("token");
	const user = JSON.parse(sessionStorage.getItem("user"));
	const userId = user?.id;

	const [showCounterModal, setShowCounterModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const isBuyer = deal.buyer?._id === userId;
	const isFarmer = deal.farmer?._id === userId;

	const lastOffer = deal.offers[deal.offers.length - 1];

	const isMyTurn = lastOffer?.offeredBy?._id !== userId;

	const updateDeal = async (decision) => {
		try {
			setLoading(true);

			await axios.patch(
				`${apiurl}/deals/${deal._id}/respond`,
				{
					decision,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			refreshDeal();
		} catch (err) {
			alert(err.response?.data?.message || "Failed to update deal.");
		} finally {
			setLoading(false);
		}
	};

	const requestCompletion = async () => {
		try {
			await axios.patch(
				`${apiurl}/deals/${deal._id}/request-completion`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			refreshDeal();
		} catch (err) {
			alert(err.response?.data?.message || "Failed to request completion.");
		}
	};

	const confirmCompletion = async () => {
		try {
			await axios.patch(
				`${apiurl}/deals/${deal._id}/confirm-completion`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			refreshDeal();
		} catch (err) {
			alert(err.response?.data?.message || "Failed to confirm completion.");
		}
	};

	return (
		<>
			<div className="bg-white rounded-xl shadow-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold">Deal Actions</h2>

					<StatusBadge status={deal.status} />
				</div>

				<NegotiationActions
					deal={deal}
					isMyTurn={isMyTurn}
					isBuyer={isBuyer}
					loading={loading}
					updateDeal={updateDeal}
					setShowCounterModal={setShowCounterModal}
				/>

				<CompletionActions
					deal={deal}
					isBuyer={isBuyer}
					isFarmer={isFarmer}
					requestCompletion={requestCompletion}
					confirmCompletion={confirmCompletion}
				/>

				<ContactActions
					deal={deal}
					isBuyer={isBuyer}
					isFarmer={isFarmer}
				/>
			</div>

			<CounterOfferModal
				isOpen={showCounterModal}
				onClose={() => setShowCounterModal(false)}
				deal={deal}
				refreshDeal={refreshDeal}
			/>
		</>
	);
};

export default DealActions;
