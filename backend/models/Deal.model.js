import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
	{
		crop: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Crop",
			required: true,
		},
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		farmer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		listedPrice: {
			type: Number,
			min: 1,
			required: true,
		},
		agreedPrice: {
			type: Number,
			default: null,
		},
		status: {
			type: String,
			enum: [
				"PENDING",
				"NEGOTIATING",
				"ACCEPTED",
				"REJECTED",
				"COMPLETION_PENDING",
				"COMPLETED",
				"CANCELLED",
			],
			required: true,
			default: "PENDING",
		},
		currentOffer: {
			type: Number,
			required: true,
			min: 1,
		},
		offers: [
			{
				offeredBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},

				price: Number,

				message: {
					type: String,
					maxlength: 250,
				},

				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		completionRequestedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},

		completedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true },
);

const Deal = new mongoose.model("Deal", dealSchema);

export default Deal;
