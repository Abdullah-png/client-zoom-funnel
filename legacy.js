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

// Check Google tokens before setting credentials
// if (!req.googleAccessTokens) {
// 	console.error("\x1b[31m[Meeting ERROR] Missing Google tokens\x1b[0m");
// 	return res.status(401).send("Google authentication required");
// }

// auth2Client.setCredentials(req.googleAccessTokens);
