import Deal from "../models/Deal.model.js";
import Crop from "../models/Crop.model.js";
import User from "../models/User.model.js";

export const createDeal = async (req, res) => {
	try {
		const buyer = req.user.id;
		const { cropId, quantity, offerPrice, message } = req.body;
		if (!cropId || !quantity || !offerPrice) {
			return res.status(400).json({
				success: false,
				message: "All fields are required.",
			});
		}

		if (quantity <= 0 || offerPrice <= 0) {
			return res.status(400).json({
				success: false,
				message: "Invalid quantity or offer price.",
			});
		}

		const existingDeal = await Deal.findOne({
			crop: cropId,
			buyer,
			status: {
				$in: ["PENDING", "NEGOTIATING"],
			},
		});

		if (existingDeal) {
			return res.status(400).json({
				success: false,
				message: "You already have an active negotiation for this crop",
			});
		}

		const crop = await Crop.findById(cropId);
		if (!crop) {
			return res
				.status(404)
				.json({ success: false, message: "crop not found" });
		}

		const farmer = crop.farmer;

		if (farmer.toString() === buyer) {
			return res.status(400).json({
				success: false,
				message: "You cannot create a deal on your own crop.",
			});
		}

		const listedPrice = crop.price;

		const newDeal = new Deal({
			crop: crop._id,
			farmer,
			buyer,
			quantity,
			listedPrice,
			currentOffer: offerPrice,
			offers: [
				{
					offeredBy: buyer,
					price: offerPrice,
					message,
				},
			],
		});
		await newDeal.save();
		return res.status(201).json({
			success: true,
			message: "Deal created successfully",
			deal: newDeal,
		});
	} catch (error) {
		console.log("create Deal error", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const getBuyerDeals = async (req, res) => {
	try {
		const userId = req.user.id;
		const deals = await Deal.find({ buyer: userId })
			.populate("crop", "name imageUrl price quantity description")
			.populate("farmer", "name location");
		return res.status(200).json({
			success: true,
			message: "Deals Found Successfully",
			deals,
		});
	} catch (error) {
		console.error("Get Deals Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const getFarmerDeals = async (req, res) => {
	try {
		const userId = req.user.id;
		const deals = await Deal.find({ farmer: userId })
			.populate("crop", "name imageUrl price quantity description")
			.populate("buyer", "name location");
		return res.status(200).json({
			success: true,
			message: "Deals Found Successfully",
			deals,
		});
	} catch (error) {
		console.error("Get Deals Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const getDeal = async (req, res) => {
	try {
		const { id } = req.params;

		const deal = await Deal.findById(id)
			.populate("crop", "name imageUrl price quantity description")
			.populate("buyer", "name email mobile location")
			.populate("farmer", "name email mobile location")
			.populate("offers.offeredBy", "name");

		if (!deal) {
			return res.status(404).json({
				success: false,
				message: "Deal not found",
			});
		}
		
		const buyerId = deal.buyer._id.toString();
		const farmerId = deal.farmer._id.toString();

		if (buyerId !== req.user.id && farmerId !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized",
			});
		}

		// Secure contact sharing: only reveal email and mobile if deal is mutually accepted
		const isAccepted = ["ACCEPTED", "COMPLETION_PENDING", "COMPLETED"].includes(deal.status);
		const dealObj = deal.toObject();
		if (!isAccepted) {
			if (dealObj.buyer) {
				dealObj.buyer.email = undefined;
				dealObj.buyer.mobile = undefined;
			}
			if (dealObj.farmer) {
				dealObj.farmer.email = undefined;
				dealObj.farmer.mobile = undefined;
			}
		}

		return res.status(200).json({
			success: true,
			message: "Deal found successfully",
			deal: dealObj,
		});
	} catch (error) {
		console.error("Get Deal Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const responseDeal = async (req, res) => {
	try {
		const userId = req.user.id;
		const { id } = req.params;
		const { decision, price, message } = req.body;
		const deal = await Deal.findById(id);
		if (!deal) {
			return res
				.status(404)
				.json({ success: false, message: "Deal not found" });
		}

		if (deal.buyer.toString() !== userId && deal.farmer.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized",
			});
		}

		// Prevent negotiation responses if deal is accepted, rejected, completed, cancelled, or in completion request status
		const invalidstas = ["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED", "COMPLETION_PENDING"];
		if (invalidstas.includes(deal.status)) {
			return res
				.status(400)
				.json({ success: false, message: "This deal is already closed" });
		}

		const user = await User.findById(userId);
		const role = user.role;

		const validDecisions = ["COUNTER", "ACCEPT", "REJECT", "CANCEL"];

		if (!validDecisions.includes(decision)) {
			return res.status(400).json({
				success: false,
				message: "Invalid Decision",
			});
		}

		const lastOffer = deal.offers[deal.offers.length - 1];

		switch (decision) {
			case "COUNTER":
				if (lastOffer.offeredBy.toString() === userId) {
					return res.status(400).json({
						success: false,
						message: "Wait for the other party to respond.",
					});
				}
				if (!price || price <= 0) {
					return res.status(400).json({
						success: false,
						message: "Valid offer price is required.",
					});
				}
				deal.offers.push({
					offeredBy: userId,
					price,
					message,
				});
				deal.currentOffer = price;
				deal.status = "NEGOTIATING";
				await deal.save();
				break;

			case "ACCEPT":
				if (lastOffer.offeredBy.toString() === userId) {
					return res.status(400).json({
						success: false,
						message: "You cannot accept your own offer.",
					});
				}

				// Verify crop quantity is still available before accepting
				const cropObj = await Crop.findById(deal.crop);
				if (!cropObj) {
					return res.status(404).json({
						success: false,
						message: "Crop not found.",
					});
				}

				if (cropObj.quantity < deal.quantity) {
					return res.status(400).json({
						success: false,
						message: `Cannot accept deal. Only ${cropObj.quantity} kg available.`,
					});
				}

				// Deduct quantity
				cropObj.quantity -= deal.quantity;
				await cropObj.save();

				deal.agreedPrice = deal.currentOffer;
				deal.status = "ACCEPTED";
				await deal.save();
				break;

			case "REJECT":
				deal.status = "REJECTED";
				await deal.save();
				break;

			case "CANCEL":
				if (role !== "buyer") {
					return res.status(403).json({
						success: false,
						message: "Only buyer can cancel the deal.",
					});
				}
				deal.status = "CANCELLED";
				await deal.save();
				break;

			default:
				break;
		}

		return res.status(200).json({
			success: true,
			message: "Deal updated successfully",
			deal,
		});
	} catch (error) {
		console.error("Respond Deal Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const requestCompletion = async (req, res) => {
	try {
		const userId = req.user.id;
		const { id } = req.params;

		const deal = await Deal.findById(id);

		if (!deal) {
			return res.status(404).json({
				success: false,
				message: "Deal not found",
			});
		}

		if (deal.farmer.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "Only the farmer can request completion.",
			});
		}

		if (deal.status !== "ACCEPTED") {
			return res.status(400).json({
				success: false,
				message: "Only accepted deals can be completed.",
			});
		}

		deal.status = "COMPLETION_PENDING";
		deal.completionRequestedBy = userId;

		await deal.save();

		return res.status(200).json({
			success: true,
			message: "Completion request sent to buyer.",
			deal,
		});
	} catch (error) {
		console.error("Request Completion Error:", error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const confirmCompletion = async (req, res) => {
	try {
		const userId = req.user.id;
		const { id } = req.params;

		const deal = await Deal.findById(id);

		if (!deal) {
			return res.status(404).json({
				success: false,
				message: "Deal not found",
			});
		}

		if (deal.buyer.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "Only the buyer can confirm completion.",
			});
		}

		if (deal.status !== "COMPLETION_PENDING") {
			return res.status(400).json({
				success: false,
				message: "Completion has not been requested yet.",
			});
		}

		deal.status = "COMPLETED";
		deal.completedAt = new Date();

		await deal.save();

		return res.status(200).json({
			success: true,
			message: "Deal completed successfully.",
			deal,
		});
	} catch (error) {
		console.error("Confirm Completion Error:", error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const getAllDeals = async (req, res) => {
	try {
		const deals = await Deal.find()
			.populate("crop", "name imageUrl price quantity description")
			.populate("farmer", "name location email mobile")
			.populate("buyer", "name location email mobile");
		return res.status(200).json({
			success: true,
			message: "All Deals Fetched Successfully",
			deals,
		});
	} catch (error) {
		console.error("Get All Deals Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
