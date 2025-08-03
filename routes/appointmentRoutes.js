const express = require("express");
const {
	createMeeting,
	createAppointment,
	getZoomAccessCode,
	getGoogleAccessCode,
} = require("../controllers/appointmentControllers");
const { authenticate } = require("../controllers/authControllers");
// const { google } = require("googleapis");
// const auth2Client = new google.auth.OAuth2(
// 	process.env.CLIENT_ID,
// 	process.env.CLIENT_SECRET_ID,
// 	process.env.GOOGLE_REDIRECT_URL
// );

const router = express.Router();
//Authorization
router.get("/zoom-auth", (req, res) => {
	// the first link to hit on the notify page
	const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${process.env.ZOOM_REDIRECT_URL}&prompt=consent&access_type=offline`;
	console.log(authUrl);

	return res.redirect(authUrl);
});
router.get("/callback", getZoomAccessCode);
// router.get("/google-auth", (req, res) => {
// 	const authUrl = auth2Client.generateAuthUrl({
// 		access_type: "offline",
// 		scope: ["https://www.googleapis.com/auth/calendar.events"],
// 		state: "random_string_or_token",
// 	});
// 	console.log(authUrl);

// 	return res.redirect(authUrl);
// });
// router.get("/google/callback", getGoogleAccessCode);
//actual meeting with actual appointment form
// router.get("/make-meeting", (req, res, next) => res.send("recieved!"));
//TODO:make a pug template GET
router.post("/make-meeting", createAppointment, createMeeting); // axios post request on the get /make-meeting rendered pug page
module.exports = router;
