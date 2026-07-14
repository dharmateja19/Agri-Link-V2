// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const apiurl = import.meta.env.VITE_BACKEND_BASE_URL
// const BuyerMarketplace = () => {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [orders, setOrders] = useState([]);
//   const [showOrders, setShowOrders] = useState(false);
//   const [requestStatuses, setRequestStatuses] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");

//   const token = sessionStorage.getItem("token");

//   // Fetch all crops
//   const fetchCrops = async () => {
//     try {
//       const res = await axios.get(`${apiurl}/crops`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProducts(res.data.crops || res.data);
//     } catch (err) {
//       console.error("Error fetching crops:", err);
//     }
//   };

//   // Fetch all orders placed by buyer
//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get(`${apiurl}/orders/buyer`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setOrders(res.data.orders || []);
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//     }
//   };

//   const requestContact = async (farmerId, cropId) => {
//     try {
//       await axios.post(
//         `${apiurl}/contact/request`,
//         { farmerId, cropId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setRequestStatuses((prev) => ({ ...prev, [cropId]: "pending" }));
//     } catch (err) {
//       alert("Contact request failed", err);
//     }
//   };

//   const fetchContactStatus = async (farmerId, cropId) => {
//     try {
//       const res = await axios.get(
//         `${apiurl}/contact/status/${farmerId}/${cropId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setRequestStatuses((prev) => ({
//         ...prev,
//         [cropId]: res.data?.status || "none",
//       }));
//     } catch (err) {
//       console.error("Error fetching contact status", err);
//     }
//   };

//   useEffect(() => {
//     fetchCrops();
//   }, []);

//   useEffect(() => {
//     products.forEach((p) => {
//       if (p.farmer?._id && p._id) {
//         fetchContactStatus(p.farmer._id, p._id);
//       }
//     });
//   }, [products]);

//   const handleQuantityChange = (cropId, value) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [cropId]: value,
//     }));
//   };

//   const handleBuy = async (cropId, availableQuantity) => {
//     const qty = Number(quantities[cropId]);
//     if (qty < 100 || qty > availableQuantity) {
//       alert(`Enter a quantity between 100 and ${availableQuantity}`);
//       return;
//     }

//     try {
//       await axios.post(
//         `${apiurl}/orders/addorder`,
//         { cropId, quantity: qty },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Order placed successfully!");
//       setQuantities((prev) => ({ ...prev, [cropId]: "" }));
//       fetchCrops();
//     } catch (err) {
//       console.error("Order failed:", err);
//       alert("Failed to place order.");
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value.toLowerCase());
//   };

//   const filteredProducts = products.filter((p) =>
//     p.name?.toLowerCase().includes(searchTerm)
//   );

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen pt-[70px]">
//       <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
//         <h2 className="text-2xl font-bold flex-shrink-0">
//           {showOrders ? "My Orders" : "Available Farm Products"}
//         </h2>

//         {!showOrders && (
//           <input
//             type="text"
//             placeholder="Search by product name..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="w-full md:w-1/3 p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         )}

//         <button
//           onClick={() => {
//             if (!showOrders) fetchOrders();
//             setShowOrders((prev) => !prev);
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
//         >
//           {showOrders ? "Back to Products" : "View My Orders"}
//         </button>
//       </div>

//       {/* Orders Section */}
//       {showOrders ? (
//         <div>
//           {orders.length === 0 ? (
//             <p>No orders yet.</p>
//           ) : (
//             <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {orders.map((order) => (
//                 <li
//                   key={order._id}
//                   className="bg-white p-4 rounded shadow border"
//                 >
//                   <p className="text-2xl font-semibold">#{order._id}</p>
//                   <img
//                     src={
//                       order.crop?.imageUrl ||
//                       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
//                     }
//                     alt={order.crop?.name}
//                     className="w-full h-40 object-cover rounded mb-4"
//                   />
//                   <p className="text-lg font-semibold">{order.crop?.name}</p>
//                   <p className="text-gray-700">Quantity: {order.quantity} kg</p>
//                   <p className="text-gray-700">
//                     Total Price: ₹{order.totalPrice}
//                   </p>
//                   <p className="text-gray-600">
//                     Status: <span className="capitalize">{order.status}</span>
//                   </p>
//                   <p className="text-gray-600">
//                     Farmer: {order.farmer?.name || "N/A"}
//                   </p>
//                   <p className="text-gray-600">
//                     Location: {order.farmer?.location || "N/A"}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       ) : (
//         <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {(filteredProducts.length === 0) ? "No Products found" :filteredProducts.map((p) => (
//             <li
//               key={p._id}
//               className="bg-white rounded-lg shadow p-4 border hover:shadow-lg transition"
//             >
//               <img
//                 src={
//                   p.imageUrl ||
//                   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
//                 }
//                 alt={p.name}
//                 className="w-full h-48 object-cover rounded mb-4"
//               />
//               <p className="text-lg font-semibold">{p.name}</p>
//               <p className="text-gray-700">Available: {p.quantity} kg</p>
//               <p className="text-gray-700">Price: ₹{p.price} /kg</p>
//               {p.description && <p className="text-gray-700">Description: {p.description}</p>}
//               <p className="text-gray-600 text-sm">
//                 Farmer: {p.farmer?.name || "Unknown"} | Location:{" "}
//                 {p.farmer?.location || "N/A"}
//               </p>

//               {/* Contact Request */}
//               <div className="mt-2">
//                 {requestStatuses[p._id] === "approved" ? (
//                   <p>Mobile: {p.farmer?.mobile || "Approved"}</p>
//                 ) : requestStatuses[p._id] === "pending" ? (
//                   <p>Request sent. Waiting for farmer’s approval.</p>
//                 ) : (
//                   <button
//                     className="mt-3 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
//                     onClick={() => requestContact(p.farmer?._id, p._id)}
//                   >
//                     Request Farmer's Mobile Number
//                   </button>
//                 )}
//               </div>

//               {/* Quantity Input */}
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Quantity (min 100kg):
//                 </label>
//                 <input
//                   type="number"
//                   value={quantities[p._id] || ""}
//                   onChange={(e) =>
//                     handleQuantityChange(p._id, e.target.value)
//                   }
//                   className="w-full border rounded p-2"
//                   min={100}
//                   max={p.quantity}
//                   placeholder="Enter quantity in kg"
//                 />
//               </div>

//               {/* Buy Button */}
//               <button
//                 onClick={() => handleBuy(p._id, p.quantity)}
//                 className="mt-3 bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition"
//               >
//                 Buy
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BuyerMarketplace;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OfferModal from "./OfferModal";
import StatusBadge from "./StatusBadge";

const apiurl = import.meta.env.VITE_BACKEND_BASE_URL;

const BuyerMarketplace = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [deals, setDeals] = useState([]);
	const [showDeals, setShowDeals] = useState(false);
	const [dealSubTab, setDealSubTab] = useState("all");
	const [contactStatuses, setContactStatuses] = useState({});

	const [searchTerm, setSearchTerm] = useState("");

	const [selectedCrop, setSelectedCrop] = useState(null);
	const [showOfferModal, setShowOfferModal] = useState(false);

	const token = sessionStorage.getItem("token");

	const fetchCrops = async () => {
		try {
			const res = await axios.get(`${apiurl}/crops`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setProducts(res.data.crops || res.data);
		} catch (err) {
			console.error("Error fetching crops:", err);
		}
	};

	const fetchDeals = async () => {
		try {
			const res = await axios.get(`${apiurl}/deals/buyer`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setDeals(res.data.deals || []);
			fetchStatusForDeals(res.data.deals || []);
		} catch (err) {
			console.error("Error fetching deals:", err);
		}
	};

	const fetchStatusForDeals = async (dealsList) => {
		const acceptedOrCompleted = dealsList.filter(d => 
			["ACCEPTED", "COMPLETION_PENDING", "COMPLETED"].includes(d.status)
		);
		const statuses = { ...contactStatuses };
		let changed = false;
		for (let deal of acceptedOrCompleted) {
			if (statuses[deal._id]) continue;
			try {
				const res = await axios.get(`${apiurl}/contact/status/deal/${deal._id}`, {
					headers: { Authorization: `Bearer ${token}` }
				});
				if (res.data.success) {
					statuses[deal._id] = res.data.status;
					changed = true;
				}
			} catch (err) {
				console.error("Error fetching status for deal:", deal._id, err);
			}
		}
		if (changed) {
			setContactStatuses(statuses);
		}
	};

	useEffect(() => {
		fetchCrops();
	}, []);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	const filteredProducts = products.filter((product) =>
		product.name?.toLowerCase().includes(searchTerm),
	);

	const activeNegotiations = deals.filter((d) => ["PENDING", "NEGOTIATING"].includes(d.status));
	const acceptedDeals = deals.filter((d) => d.status === "ACCEPTED");
	const completionPendingDeals = deals.filter((d) => d.status === "COMPLETION_PENDING");
	const completedDeals = deals.filter((d) => d.status === "COMPLETED");
	const pastDeals = deals.filter((d) => ["REJECTED", "CANCELLED"].includes(d.status));

	const getFilteredDeals = () => {
		switch (dealSubTab) {
			case "all":
				return deals;
			case "active":
				return activeNegotiations;
			case "accepted":
				return acceptedDeals;
			case "completion":
				return completionPendingDeals;
			case "completed":
				return completedDeals;
			case "past":
				return pastDeals;
			default:
				return [];
		}
	};
	const filteredDealsList = getFilteredDeals();

	return (
		<div className="p-6 bg-gray-100 min-h-screen pt-[70px]">
			<div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
				<h2 className="text-2xl font-bold flex-shrink-0">
					{showDeals ? "My Deals" : "Available Farm Products"}
				</h2>

				{!showDeals && (
					<input
						type="text"
						placeholder="Search by product name..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="w-full md:w-1/3 p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				)}

				<button
					onClick={() => {
						if (!showDeals) fetchDeals();
						setShowDeals((prev) => !prev);
					}}
					className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
				>
					{showDeals ? "Back to Products" : "View My Deals"}
				</button>
			</div>

			{showDeals ? (
				<div>
					<div className="flex gap-2 border-b pb-3 mb-6 overflow-x-auto whitespace-nowrap">
						<button
							onClick={() => setDealSubTab("all")}
							className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
								dealSubTab === "all"
									? "bg-green-75 text-green-800 border border-green-200"
									: "text-gray-600 hover:bg-gray-50 border border-transparent"
							}`}
						>
							All ({deals.length})
						</button>
						<button
							onClick={() => setDealSubTab("active")}
							className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
								dealSubTab === "active"
									? "bg-green-75 text-green-800 border border-green-200"
									: "text-gray-600 hover:bg-gray-50 border border-transparent"
							}`}
						>
							Active ({activeNegotiations.length})
						</button>
						<button
							onClick={() => setDealSubTab("accepted")}
							className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
								dealSubTab === "accepted"
									? "bg-green-75 text-green-800 border border-green-200"
									: "text-gray-600 hover:bg-gray-50 border border-transparent"
							}`}
						>
							Accepted ({acceptedDeals.length})
						</button>
						<button
							onClick={() => setDealSubTab("completion")}
							className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
								dealSubTab === "completion"
									? "bg-green-75 text-green-800 border border-green-200"
									: "text-gray-600 hover:bg-gray-50 border border-transparent"
							}`}
						>
							Completion Pending ({completionPendingDeals.length})
						</button>
						<button
							onClick={() => setDealSubTab("completed")}
							className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
								dealSubTab === "completed"
									? "bg-green-75 text-green-800 border border-green-200"
									: "text-gray-600 hover:bg-gray-50 border border-transparent"
							}`}
						>
							Completed ({completedDeals.length})
						</button>
						<button
							onClick={() => setDealSubTab("past")}
							className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
								dealSubTab === "past"
									? "bg-green-75 text-green-800 border border-green-200"
									: "text-gray-600 hover:bg-gray-50 border border-transparent"
							}`}
						>
							Past / History ({pastDeals.length})
						</button>
					</div>

					{filteredDealsList.length === 0 ? (
						<p className="text-center text-gray-600">No deals found in this category.</p>
					) : (
						<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredDealsList.map((deal) => (
								<li
									key={deal._id}
									className="bg-white rounded-lg shadow border p-5 flex flex-col justify-between"
								>
									<div>
										<img
											src={
												deal.crop?.imageUrl ||
												"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
											}
											alt={deal.crop?.name}
											className="w-full h-48 object-cover rounded mb-4"
										/>

										<h3 className="text-xl font-semibold mb-3">{deal.crop?.name}</h3>

										<div className="space-y-1 text-gray-600 text-sm">
											<p>Listed Price : <strong>₹{deal.listedPrice}/kg</strong></p>
											<p>Current Offer : <strong className="text-green-700">₹{deal.currentOffer}/kg</strong></p>
											{deal.agreedPrice && (
												<p>Agreed Price : <strong className="text-green-700">₹{deal.agreedPrice}/kg</strong></p>
											)}
											<p>Quantity : <strong>{deal.quantity} kg</strong></p>
											<div className="flex items-center pt-1">
												<span className="text-gray-600 mr-2">Status:</span>
												<StatusBadge status={deal.status} />
											</div>
											{["ACCEPTED", "COMPLETION_PENDING", "COMPLETED"].includes(deal.status) && (
												<div className="flex items-center pt-2">
													<span className="text-gray-600 mr-2">Contact Status:</span>
													<span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
														contactStatuses[deal._id] === "APPROVED"
															? "bg-green-50 text-green-700 border-green-200"
															: contactStatuses[deal._id] === "PENDING"
															? "bg-yellow-50 text-yellow-700 border-yellow-200"
															: contactStatuses[deal._id] === "REJECTED"
															? "bg-red-50 text-red-700 border-red-200"
															: "bg-gray-50 text-gray-700 border-gray-200"
													}`}>
														{contactStatuses[deal._id] ? contactStatuses[deal._id] : "Loading..."}
													</span>
												</div>
											)}
										</div>
									</div>

									<button
										onClick={() => navigate(`/deals/${deal._id}`)}
										className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium transition cursor-pointer"
									>
										View Details
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			) : (
				<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProducts.length === 0 ? (
						<p>No Products Found.</p>
					) : (
						filteredProducts.map((p) => (
							<li
								key={p._id}
								className="bg-white rounded-lg shadow p-4 border hover:shadow-lg transition"
							>
								<img
									src={
										p.imageUrl ||
										"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
									}
									alt={p.name}
									className="w-full h-48 object-cover rounded mb-4"
								/>

								<h3 className="text-lg font-semibold">{p.name}</h3>

								<p>
									Available :
									<span className="font-medium"> {p.quantity} kg</span>
								</p>

								<p>
									Listed Price :
									<span className="font-semibold text-green-700">
										{" "}
										₹{p.price}/kg
									</span>
								</p>

								<p className="text-sm italic mt-1 text-gray-500">
									{p.description ? p.description : "No description provided"}
								</p>

								<p className="text-gray-600 text-sm mt-1">
									Farmer : {p.farmer?.name}
								</p>

								<p className="text-gray-600 text-sm">
									Location : {p.farmer?.location}
								</p>

								<button
									className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium transition cursor-pointer"
									onClick={() => {
										setSelectedCrop(p);
										setShowOfferModal(true);
									}}
								>
									Make Offer
								</button>
							</li>
						))
					)}
				</ul>
			)}
			<OfferModal
				isOpen={showOfferModal}
				crop={selectedCrop}
				onClose={() => {
					setShowOfferModal(false);
					setSelectedCrop(null);
				}}
				onSuccess={() => {
					fetchDeals();
					fetchCrops();
				}}
			/>
		</div>
	);
};

export default BuyerMarketplace;
