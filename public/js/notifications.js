console.log("✅ notifications.js loaded");
// const axios = require("axios");
const name = document.querySelector("#name");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");
const date = document.querySelector("#date");
const form = document.querySelector("form");
console.log("form");

form.addEventListener("submit", async function (e) {
	console.log("bob");

	e.preventDefault();
	const formData = {
		name: name.value,
		phone: phone.value,
		email: email.value,
		startTime: date.value,
	};
	try {
		const response = await axios.post(
			"api/v1/appointments/make-meeting",
			formData
			// { withCredentials: true }
		);
		console.log("Response:", response.data);
		alert("Appointment booked successfully!");
	} catch (error) {
		console.log("error sending data");
	}
});
