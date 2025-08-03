// const { google } = require("googleapis");
// const express = require("express");
// const router = express.Router({ mergeParams: true });

// module.exports = router;

// //{ const oauth2Client = new google.auth.OAuth2(
// // 	process.env.CLIENT_ID,
// // 	process.env.CLIENT_SECRET,
// // 	process.env.REDIRECT
// // );
// // async function createEvent(auth) {
// // 	const calendar = google.calendar({ version: "v3", auth });

// // 	const event = {
// // 		summary: "Upcoming Appointment",
// // 		location: "Zoom (link here)",
// // 		description: "Discuss project updates",
// // 		start: {
// // 			dateTime: "2024-12-30T15:00:00-05:00", // ISO 8601 format with time zone
// // 		},
// // 		end: {
// // 			dateTime: "2024-12-30T16:00:00-05:00",
// // 		},
// // 		reminders: {
// // 			useDefault: false,
// // 			overrides: [
// // 				{ method: "email", minutes: 24 * 60 }, // 24 hours before
// // 				{ method: "popup", minutes: 10 }, // 10 minutes before
// // 			],
// // 		},
// // 	};

// // 	try {
// // 		const response = await calendar.events.insert({
// // 			calendarId: "primary",
// // 			resource: event,
// // 		});
// // 		console.log("Event created:", response.data.htmlLink);
// // 		return response;
// // 	} catch (error) {
// // 		console.error("Error creating event:", error);
// // 	}
// // }
// // router.get("/", (req, res, next) => {
// // 	const url = oauth2Client.generateAuthUrl({
// // 		access_type: "offline",
// // 		scope: "https://www.googleapis.com/auth/calendar.events",
// // 	});
// // 	res.redirect(url);
// // });
// // router.get("/redirect", async (req, res, next) => {
// // 	const code = req.query.code; //authentication code
// // 	oauth2Client.getToken(code, (err, tokens) => {
// // 		if (err) {
// // 			console.error("couldn't get token", err);
// // 			res.send("error");
// // 			return;
// // 		}
// // 		oauth2Client.setCredentials(tokens);
// // 		res.send("successfully logged in");
// // 	});
// // 	// const response = await createEvent(oauth2Client);
// // });
// // // router.get("/calendars", (req, res, next) => {
// // // 	const calendar = google.calendar({ version: "v3", auth: oauth2Client });
// // // 	calendar.calendarList.list({}, (err, response) => {
// // // 		if (err) {
// // // 			console.error("couldn't get calendar", err);
// // // 			res.end("error");
// // // 			return;
// // // 		}
// // // 		const calendars = response.data.items;
// // // 		res.json(calendars);
// // // 	});
// // // });

// // // Call this function after authenticating the user

// // // router.get("/events", async (req, res, next) => {
// // // 	try {
// // // 		const calendar = google.calendar({ version: "v3", auth: oauth2Client });
// // // 		const event = {
// // // 			summary: "Upcoming Appointment",
// // // 			location: "Zoom (link here)",
// // // 			description: "Discuss project updates",
// // // 			start: {
// // // 				dateTime: "2024-12-30T15:00:00-05:00", // ISO 8601 format with time zone
// // // 			},
// // // 			end: {
// // // 				dateTime: "2024-12-30T16:00:00-05:00",
// // // 			},
// // // 			reminders: {
// // // 				useDefault: false,
// // // 				overrides: [
// // // 					{ method: "email", minutes: 24 * 60 }, // 24 hours before
// // // 					{ method: "popup", minutes: 10 }, // 10 minutes before
// // // 				],
// // // 			},
// // // 		};
// // // 		const response = await calendar.events.insert({
// // // 			calendarId: "primary",
// // // 			resource: event,
// // // 		});
// // // 		console.log("Event created:", response.data.htmlLink);
// // // 		return response.data;
// // // 	} catch (err) {
// // // 		console.error("Error creating event:", err);
// // // 		throw err;
// // // 	}
// // // });}
// //}
