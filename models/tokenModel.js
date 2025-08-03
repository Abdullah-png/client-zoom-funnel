const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
	{
		accessToken: { type: String, required: true },
		refreshToken: String,
	},
	{ timeStamps: true }
); //cr
// Create model from schema
const Token = mongoose.model("Token", tokenSchema);

// Export the model
module.exports = Token;
