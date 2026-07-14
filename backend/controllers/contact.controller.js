import Deal from "../models/Deal.model.js";
import ContactRequest from "../models/ContactRequest.model.js";

export const getDealContactStatus = async (req, res) => {
	try {
		const { dealId } = req.params;

		const deal = await Deal.findById(dealId);

		if (!deal) {
			return res.status(404).json({
				success: false,
				message: "Deal not found",
			});
		}

		const request = await ContactRequest.findOne({
			deal: dealId
		}).populate("farmer", "mobile email").populate("buyer", "mobile email");

		if (!request) {
			return res.status(200).json({
				success: true,
				status: "NONE",
			});
		}

		return res.status(200).json({
			success: true,
			status: request.status.toUpperCase(),
			requestId: request._id,
			farmerMobile: request.status === "approved" ? request.farmer?.mobile : null,
			farmerEmail: request.status === "approved" ? request.farmer?.email : null,
			buyerMobile: request.status === "approved" ? request.buyer?.mobile : null,
			buyerEmail: request.status === "approved" ? request.buyer?.email : null,
		});
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const requestContact = async (req, res) => {
	const { dealId } = req.body;
	const buyerId = req.user.id;
	try {
		const deal = await Deal.findById(dealId);
		if (!deal) {
			return res.status(404).json({ message: "Deal not found." });
		}

		let existing = await ContactRequest.findOne({
			deal: dealId,
		});
		if (existing) {
			if (existing.status === "pending") {
				return res.status(400).json({ message: "Already requested." });
			}
			existing.status = "pending";
			await existing.save();
			return res.status(200).json({ message: "Request sent successfully", request: existing });
		}

		const request = new ContactRequest({
			deal: dealId,
			farmer: deal.farmer,
			buyer: deal.buyer,
			crop: deal.crop,
		});
		await request.save();
		res.status(201).json({ message: "Request sent successfully", request });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "error while sending request" });
	}
};

export const respondContact = async (req, res) => {
	const { status } = req.body; // "approved" or "rejected"
	const user = req.user.id;
	const id = req.params.id;
	const request = await ContactRequest.findById(id);
	if (!request) {
		return res.status(404).json({ message: "Request not found" });
	}
	const farmer = request.farmer.toString();
	if (user != farmer) {
		return res.status(403).json({ message: "unauthorized" });
	}
	try {
		const updated = await ContactRequest.findByIdAndUpdate(
			id,
			{ status },
			{ new: true },
		);
		res.json(updated);
	} catch (err) {
		res.status(500).json({ error: "Update failed" });
	}
};

export const getFarmerRequests = async (req, res) => {
	const farmerId = req.user.id;
	try {
		const requests = await ContactRequest.find({ farmer: farmerId })
			.populate("buyer", "name")
			.populate("crop", "name imageUrl");
		res.status(200).json({ message: "Requests found successfully", requests });
	} catch (error) {
		res.status(500).json({ error: "Update failed" });
	}
};

export const getContactStatus = async (req, res) => {
	const buyerId = req.user.id;
	const { farmerId, cropId } = req.params;
	try {
		const request = await ContactRequest.findOne({
			buyer: buyerId,
			crop: cropId,
		});
		if (!request) return res.json({ status: "none" });
		res.json({ status: request.status });
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch status" });
	}
};

export const getBuyerRequests = async (req, res) => {
	const buyerId = req.user.id;
	try {
		const requests = await ContactRequest.find({ buyer: buyerId });
		res.status(200).json({ message: "Requests found successfully", requests });
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch buyer requests" });
	}
};

export const getAllContactRequests = async (req, res) => {
	try {
		const requests = await ContactRequest.find();
		res.status(200).json({ message: "Requests found successfully", requests });
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch contact requests" });
	}
};
