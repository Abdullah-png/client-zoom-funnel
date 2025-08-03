const axios = require("axios");
const Appointment = require("../models/appointmentModel");
const emails = require("../public/js/emails");
const Token = require("../models/tokenModel");
// const redis = require("redis");
// const client = redis.createClient();
// const { google } = require("googleapis");
// const auth2Client = new google.auth.OAuth2(
// 	process.env.CLIENT_ID,
// 	process.env.CLIENT_SECRET_ID,
// 	process.env.GOOGLE_REDIRECT_URL
// );

exports.getZoomAccessCode = async (req, res, next) => {
	const authCode = req.query.code;
	console.log("\x1b[36m[Zoom Callback] Received auth code:\x1b[0m", authCode);

	if (!authCode) {
		console.error("\x1b[31m[Zoom ERROR] No auth code received\x1b[0m");
		return res.status(500).send("Error getting authcode");
	}

	try {
		const response = await axios.post("https://zoom.us/oauth/token", null, {
			params: {
				grant_type: "authorization_code",
				code: authCode,
				redirect_uri: process.env.ZOOM_REDIRECT_URL,
			},
			auth: {
				username: process.env.ZOOM_CLIENT_ID,
				password: process.env.ZOOM_CLIENT_SECRET,
			},
		});

		const accessToken = response.data.access_token;
		const refreshToken = response.data.refresh_token;
		process.env.TEMP_ZOOM_ACCESS_TOKEN = accessToken;
		process.env.TEMP_ZOOM_REFRESH_TOKEN = refreshToken;
		const token = await Token.create({
			accessToken: accessToken,
			refreshToken: refreshToken,
		});

		console.log("\x1b[32m[Zoom Token] Access:\x1b[0m", accessToken);
		console.log("\x1b[32m[Zoom Token] Refresh:\x1b[0m", refreshToken);

		// Save session before redirecting
		// req.save((err) => {
		// 	if (err) {
		// 		console.error("\x1b[31m[Session Save ERROR]\x1b[0m", err);
		// 		return res.status(500).send("Error saving session");
		// 	}
		// 	console.log("\x1b[36m[Zoom Token] Session saved successfully\x1b[0m");

		// });
		res.redirect(`/make-meeting?token=${token._id}`);
	} catch (error) {
		console.error(
			"\x1b[31m[Zoom Token ERROR]\x1b[0m",
			error.response?.data || error.message
		);
		res.status(500).send("Error getting tokens 2");
	}
};

// exports.getGoogleAccessCode = async (req, res, next) => {
// 	const authCode = req.query.code;
// 	console.log("\x1b[36m[Google Callback] Received code:\x1b[0m", authCode);

// 	try {
// 		const { tokens } = await auth2Client.getToken(authCode);
// 		console.log("\x1b[32m[Google Token] Access:\x1b[0m", tokens.access_token);

// 		await auth2Client.setCredentials(tokens);
// 		req.googleAccessTokens = tokens;
// 		console.log("\x1b[32m[Google Token] Saved to session:\x1b[0m", {
// 			hasAccessToken: !!tokens.access_token,
// 			tokenExpiry: tokens.expiry_date,
// 			scope: tokens.scope,
// 		});

// 		// Save session before redirecting
// 		req.save((err) => {
// 			if (err) {
// 				console.error("\x1b[31m[Session Save ERROR]\x1b[0m", err);
// 				return res.status(500).send("Error saving session");
// 			}
// 			console.log("\x1b[36m[Google Token] Session saved successfully\x1b[0m");
// 			res.redirect("/make-meeting");
// 		});
// 	} catch (error) {
// 		console.error("\x1b[31m[Google Token ERROR]\x1b[0m", error);
// 		res.status(500).send("Error authenticating with Google");
// 	}
// };

exports.createAppointment = async (req, res, next) => {
	const id = req.query._id; // {id}

	const appointment = await Appointment.create(req.body);
	if (!appointment) {
		console.error(
			"\x1b[31m[Appointment ERROR] Failed to create appointment\x1b[0m"
		);
		return res.status(500).send("unable to create appointment");
	}
	req.appointment = appointment;
	console.log(req.query, "creat appt");

	// console.log("\x1b[32m[Appointment] Created:\x1b[0m", appointment);
	// console.log("\x1b[36m[Appointment] Session snapshot:\x1b[0m", req);
	next();
};

const refreshAccessToken = async (refreshToken) => {
	try {
		console.log(
			"\x1b[36m[Zoom Refresh] Using token:\x1b[0m",
			refreshToken.slice(0, 10),
			"..."
		);
		const response = await axios.post("https://zoom.us/oauth/token", null, {
			params: {
				grant_type: "refresh_token",
				refresh_token: refreshToken,
			},
			auth: {
				username: process.env.ZOOM_CLIENT_ID,
				password: process.env.ZOOM_CLIENT_SECRET,
			},
		});
		console.log(
			"\x1b[32m[Zoom Refresh] New Access Token:\x1b[0m",
			response.data.access_token
		);
		return response.data;
	} catch (err) {
		console.error(
			"\x1b[31m[Zoom Refresh ERROR]\x1b[0m",
			err.response?.data || err.message
		);
		throw err;
	}
};

exports.createMeeting = async (req, res, next) => {
	// Check if session exists
	// console.log("\x1b[36m[Debug] Session content:\x1b[0m", {
	// 	hasSession: !!req,
	// 	sessionID: req ? req.id : null,
	// 	zoomAccessToken: req ? !!req.zoomAccessToken : null,
	// 	zoomRefreshToken: req ? !!req.zoomRefreshToken : null,
	// });
	// Check if session is properly initialized
	// if (!req.id) {
	// 	console.error("\x1b[31m[Session ERROR] No session ID\x1b[0m");
	// 	return res.status(500).send("Session not properly initialized");
	// }

	// Log session state for debugging
	// console.log("\x1b[36m[Session State] Current session:\x1b[0m", {
	// 	id: req.id,
	// 	isNew: req.isNew,
	// 	cookie: req.cookie,
	// });

	// Ensure session is saved
	// req.save((err) => {
	// 	if (err) {
	// 		console.error("\x1b[31m[Session Save ERROR]\x1b[0m", err);
	// 		return res.status(500).send("Error saving session");
	// 	}
	// 	console.log("\x1b[32m[Session] Successfully persisted\x1b[0m");
	// });
	// if (!req) {
	// 	console.error("\x1b[31m[Meeting ERROR] No session found\x1b[0m");
	// 	return res.status(500).send("Session not available");
	// }
	console.log(req.query, "create meeting");

	const zoomAccessToken = process.env.TEMP_ZOOM_ACCESS_TOKEN || req.query.code1;
	const zoomRefreshToken =
		process.env.TEMP_ZOOM_REFRESH_TOKEN || req.query.code2;
	const id = req.query._id;
	// Check if tokens exist
	if (!zoomAccessToken || !zoomRefreshToken) {
		console.error("\x1b[31m[Meeting ERROR] Missing Zoom tokens\x1b[0m", {
			hasAccessToken: !!zoomAccessToken,
			hasRefreshToken: !!zoomRefreshToken,
		});
		return res.status(401).send("Zoom authentication required");
	}

	const meetingData = {
		topic: req.appointment.title,
		type: 2,
		start_time: req.appointment.startTime,
		duration: req.appointment.duration,
		agenda: req.appointment.description,
		settings: {
			join_before_host: true,
			mute_upon_entry: true,
			approval_type: 0,
		},
	};

	// Check Google tokens before setting credentials
	// if (!req.googleAccessTokens) {
	// 	console.error("\x1b[31m[Meeting ERROR] Missing Google tokens\x1b[0m");
	// 	return res.status(401).send("Google authentication required");
	// }

	// auth2Client.setCredentials(req.googleAccessTokens);

	try {
		console.log(
			"\x1b[36m[Zoom Meeting] Creating with token:\x1b[0m",
			zoomAccessToken.slice(0, 10),
			"..."
		);
		console.log("\x1b[36m[Meeting Data]\x1b[0m", meetingData);

		const response = await axios.post(
			"https://api.zoom.us/v2/users/me/meetings",
			meetingData,
			{
				headers: {
					Authorization: `Bearer ${zoomAccessToken}`,
					"Content-Type": "application/json",
				},
			}
		);

		console.log("\x1b[32m[Zoom Meeting] Created:\x1b[0m", response.data.join_url);

		const appointment = await Appointment.findById(req.appointment.id);
		appointment.zoomLink = response.data.join_url;
		await appointment.save();

		// const calendar = google.calendar({ version: "v3", auth: auth2Client });
		// const event = {
		// 	summary: "Zoom Meeting: Test Meeting",
		// 	description: `Join Zoom Meeting: ${response.data.join_url}`,
		// 	start: {
		// 		dateTime: response.data.start_time,
		// 		timeZone: "UTC",
		// 	},
		// 	end: {
		// 		dateTime: new Date(
		// 			new Date(response.data.start_time).getTime() +
		// 				response.data.duration * 60000
		// 		).toISOString(),
		// 		timeZone: "UTC",
		// 	},
		// 	reminders: {
		// 		useDefault: false,
		// 		overrides: [
		// 			{ method: "email", minutes: 30 },
		// 			{ method: "popup", minutes: 10 },
		// 		],
		// 	},
		// };

		// const calendarEvent = await calendar.events.insert({
		// 	calendarId: "primary",
		// 	resource: event,
		// });

		// console.log(
		// 	"\x1b[32m[Google Calendar] Event created:\x1b[0m",
		// 	calendarEvent.data.htmlLink
		// );

		emails(
			req.appointment.email,
			"Upcoming Zoom Meeting Reminder",
			`
   <p> hello =),</p>
   <p>Your meeting has been scheduled:</p>
   <p><strong>Title:</strong> ${appointment.title}</p>
   <p><strong>Date & Time:</strong> ${new Date(
				appointment.startTime
			).toLocaleString()}</p>
   <p><strong>Zoom Link:</strong> <a href="${appointment.zoomLink}">${
				appointment.zoomLink
			}</a></p>
		`
		);

		console.log("\x1b[32m[Email Sent]\x1b[0m To:", req.appointment.email);
		console.log(
			"\x1b[1m\x1b[32m[✅ SUCCESS] Zoom + Google meeting created.\x1b[0m"
		);

		res.json({
			data: {
				zoom: response.data,
				htmlLink: response.data.htmlLink,
			},
			message: "appointment created",
		});

		res.redirect("/");
	} catch (error) {
		console.error(
			"\x1b[31m[Zoom Meeting ERROR]\x1b[0m",
			error.response?.data || error.message
		);

		// Only try to refresh if we have a refresh token
		if (zoomRefreshToken) {
			try {
				const newTokens = await refreshAccessToken(zoomRefreshToken);
				req.zoomAccessToken = newTokens.access_token;
				req.zoomRefreshToken = newTokens.refresh_token;

				// Save the session with new tokens
				req.save((err) => {
					if (err) {
						console.error("\x1b[31m[Session Refresh ERROR]\x1b[0m", err);
					} else {
						console.log(
							"\x1b[32m[Zoom Tokens] Refreshed and saved to session\x1b[0m"
						);
					}
					res.status(500).send("Error creating Zoom meeting. Please try again.");
				});
			} catch (refreshError) {
				console.error("\x1b[31m[Token Refresh ERROR]\x1b[0m", refreshError);
				res
					.status(500)
					.send("Failed to refresh authentication. Please log in again.");
			}
		} else {
			res.status(401).send("Zoom authentication required");
		}
	}
};

// took out google token
//tried to use query in search
