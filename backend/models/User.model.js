import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 2,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/\S+@\S+\.\S+/, "Please enter a valid email."],
		},

		password: {
			type: String,
			required: true,
			minlength: 6,
		},

		mobile: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},

		role: {
			type: String,
			enum: ["farmer", "buyer", "admin"],
			required: true,
		},

		location: {
			type: String,
			required: true,
			minlength: 2,
			trim: true,
		},

		isVerified: {
			type: Boolean,
			default: false,
		},

		emailVerificationOTP: {
			type: String,
			default: null,
		},

		emailVerificationExpires: {
			type: Date,
			default: null,
		},

		emailVerificationAttempts: {
			type: Number,
			default: 0,
		},

		lastOTPSentAt: {
			type: Date,
			default: null,
		},

		accountStatus: {
			type: String,
			enum: ["active", "inactive", "blocked"],
			default: "active",
		},

		lastLogin: {
			type: Date,
			default: null,
		},

		passwordResetOTP: {
			type: String,
			default: null,
		},

		passwordResetExpires: {
			type: Date,
			default: null,
		},

		passwordResetAttempts: {
			type: Number,
			default: 0,
		},

		lastPasswordResetOTPSentAt: {
			type: Date,
			default: null,
		},

		passwordResetVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model("User", UserSchema);

export default User;
