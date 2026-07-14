const ActionCard = ({ title, children }) => {
	return (
		<div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
			{title && (
				<h3 className="text-lg font-semibold text-gray-800 mb-4">
					{title}
				</h3>
			)}

			{children}
		</div>
	);
};

export default ActionCard;