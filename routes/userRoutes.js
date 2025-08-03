const express = require("express");
const {
	signup,
	login,
	logout,
	resetPassword,
	forgotPassword,
	authenticate,
	restrictTo,
} = require("../controllers/authControllers");
const authControllers = require("../controllers/authControllers");
const {
	getAllUsers,
	createUser,
	getUser,
	deleteUser,
} = require("../controllers/userControllers");
const router = express.Router();
// console.log(authControllers);
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:tokenID", resetPassword);
router.post("/logout", logout);

router.use(authControllers.authenticate);

router
	.route("/")
	.get(restrictTo("admin", "agent"), getAllUsers)
	.post(createUser);
router.route("/:id").get(getUser).delete(restrictTo("admin"), deleteUser);

module.exports = router;
