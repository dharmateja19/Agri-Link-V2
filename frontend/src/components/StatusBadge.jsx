const StatusBadge = ({ status }) => {
	const styles = {
		PENDING: "bg-gray-100 text-gray-700",
		NEGOTIATING: "bg-orange-100 text-orange-700",
		ACCEPTED: "bg-blue-100 text-blue-700",
		COMPLETION_PENDING: "bg-yellow-100 text-yellow-700",
		COMPLETED: "bg-green-100 text-green-700",
		REJECTED: "bg-red-100 text-red-700",
		CANCELLED: "bg-red-100 text-red-700",
	};

	return (
		<span
			className={`px-4 py-1 rounded-full text-sm font-semibold ${
				styles[status] || "bg-gray-100 text-gray-700"
			}`}
		>
			{status
				.replaceAll("_", " ")
				.toLowerCase()
				.replace(/\b\w/g, (c) => c.toUpperCase())}
		</span>
	);
};

export default StatusBadge;