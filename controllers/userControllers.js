const User = require("../models/userModel");

exports.getAllUsers = async (req, res, next) => {
	const queryObj = { ...req?.query };
	const excludedFields = ["sort", "page", "limit", "fields"];
	excludedFields.forEach((el) => {
		delete queryObj[el];
	});
	const fields = req.query.select?.split(",").join(" ");
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 100;
	const skip = (page - 1) * limit;
	const user = await User.find(queryObj).select(fields).skip(skip).limit(limit);
	res.status(200).json({ status: "success", user });
};
exports.createUser = async (req, res, next) => {
	res.status(400).json({
		status: "fail",
		message: `please go to ${req.protocol}://${req.get(
			"host"
		)}/api/v1/users/signup
   `,
	});
	next();
};
exports.getUser = async (req, res, next) => {
	const user = await User.findById(req.params.id);
	res.status(200).json({
		status: "success",
		user,
	});
	next();
};
exports.deleteUser = async (req, res, next) => {
	await User.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status: "success",
	});
	next();
};
exports.deleteMe = async (req, res, next) => {
	const user = await User.findById(req.params.id);
	user.active = false;
	user.save();
	res.status(200).json({
		status: "success",
	});
	next();
};
