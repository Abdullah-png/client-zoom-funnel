const emails = require("../public/js/emails");
const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const signToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET_ACCESS_TOKEN, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
const sendToken = function (user, statusCode, res) {
	const token = signToken(user._id);
	if (!token) res.send("no token ;(");
	const cookieOptions = {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
	res.cookie("jwt", token, cookieOptions);
	res
		.status(statusCode)
		.json({ status: "success", token: token, data: { user } });
};
exports.signup = async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		sendToken(user, 201, res);
	} catch (error) {
		console.log(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return next(new Error("please provide an email and password"));

		const user = await User.findOne({ email }).select("+password");

		if (!user || !(await user.comparePasswords(password)))
			return next(new Error("invalid email or password"));

		sendToken(user, 200, res);
		console.log(done);
	} catch (error) {
		console.log(error);
	}
};
exports.authenticate = async (req, res, next) => {
	try {
		let token;
		if (
			!req.headers.authorization ||
			!req.headers.authorization.startsWith("Bearer ")
		) {
			return next(new Error("you're unauthorised =>"));
		}
		// if (req.cookie.jwt) token = req.cookie.jwt;
		token = req.headers.authorization.split(" ")[1];
		if (!token) return next(new Error("token wasn't created =>"));
		const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
		if (!decodedToken) return next(new Error("no token"));

		const user = await User.findById(decodedToken.id);
		if (!user)
			return next(new Error("you're unauthorised cus that doesn't exist =>"));
		if (user.isChanged(decodedToken.iat))
			return next(
				new Error("you're unauthorised cus the password has been changed =>")
			);
		req.user = user;
		res.locals.user = user;

		next();
	} catch (error) {
		console.log(error);
	}
};
exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body;
	//
	const user = await User.findOne({ email });
	if (!user) return next(new Error("invalid Email =/"));
	try {
		//
		const resetToken = user.createResetToken();

		//

		user.save({ validateBeforeSave: false });
		const resetURL = `${req.protocol}://${req.get(
			"host"
		)}/api/v1/users/resetPassword/${resetToken}`;
		const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
		emails(user.email, "Password Reset", message);
		res.status(200).send("ok!");
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		user.save({ validateBeforeSave: false });
	}
};
exports.isLoggedIn = async (req, res, next) => {
	try {
		if (req.cookies.jwt) {
			jwt.verify(
				req.cookie.jwt,
				process.env.SECRET_ACCESS_TOKEN,
				async (err, decodedToken) => {
					const user = await User.findById(decodedToken.id);
					if (!user) return next();

					if (err) return next();

					if (user.isChanged(decodedToken.iat)) return next();

					res.locals.user = user;
					return next();
				}
			);
		}
	} catch (error) {}
	next();
};
exports.resetPassword = async (req, res, next) => {
	const { password, passwordConfirm } = req.body;
	const resetToken = req.params.tokenID;
	const verificationToken = crypto //checks if the token parameter and the  password reset Token are thesame
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	try {
		const user = User.findOne({
			passwordResetToken: verificationToken,
			passwordResetExpires: { $gt: Date.now() },
		});
		if (!user) return next(new Error("invalid reset Token =/"));
		user.passwordConfirm = passwordConfirm;
		user.passwordResetToken = undefined;
		user.password = password;
		user.passwordResetExpires = undefined;
		await user.save();
		sendToken(user, 200, res);
	} catch (error) {}
};
exports.logout = async (req, res, next) => {
	try {
		res.cookie("jwt", "logggedOut", {
			expires: new Date(Date.now() + 10 * 1000),
			httpOnly: true,
		});
		next();
	} catch (error) {}
};
exports.updatepassword = async (req, res, next) => {
	try {
		const { currentPassword, password, passwordConfirm } = req.body;
		const currentUser = await User.findById(req.user.id).select("+password");
		if (!currentUser || !(await currentUser.comparePasswords(currentPassword)))
			return next(new Error("it it what it is =(, incorrect password"));
		currentUser.password = password;
		currentUser.passwordConfirm = passwordConfirm;

		await currentUser.save();

		sendToken(currentUser, 200, res);
	} catch (error) {
		res.status(400).json({ status: "unsuccessful" });
	}
};
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(new Error("you're not allowed to be here =)"));
		next();
	};
};
