const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { Schema } = mongoose;
const userSchema = new Schema({
	name: {
		type: String,
		required: [true, "please provide your name "],
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	phoneNumber: {
		type: String,
		required: [true, "please Provide a valid phone number"],
		validate: [validator.isMobilePhone, "{VALUE} is not a valid phone number "],
	},
	password: {
		type: String,
		minlength: 8,
		required: [true, "please provide a valid password"],
	},
	passwordConfirm: {
		type: String,
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: "oops =/, passwords don't match",
		},
		requied: [true, "please provide a confirmation"],
	},
	role: {
		type: String,
		enum: {
			values: ["user", "admin", "agent"],
			message: "{VALUE} is not a supported role",
		},
		default: "user",
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});
userSchema.pre("save", async function (next) {
	if (this.isModified(this.password)) {
		this.password = await bcrypt.hash(this.password, 12);
		this.passwordConfirm = undefined;
		return next();
	}
	next();
});
//always have to add next as the parameter and call it
userSchema.pre("save", async function (next) {
	if (this.isModified(this.password) || this.isNew) {
		this.passwordChangedAt = Date.now() - 1000;
		return next();
	}
	next();
});
userSchema.methods.comparePasswords = async function (
	password1,
	hashedPassword = this.password
) {
	return await bcrypt.compare(password1, hashedPassword);
	//comparing the first password with an already hashed 2nd one 😊
};
userSchema.methods.createResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordResetExpires = Date.now() * 1000 * 10 * 60;

	return resetToken;
};
userSchema.methods.isChanged = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	// False means NOT changed
	return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
