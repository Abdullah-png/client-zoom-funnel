const mongoose = require("mongoose");
const validator = require("validator");
const appointmentSchema = new mongoose.Schema({
	title: { type: String, default: "Protecting Your Future:" },
	description: {
		type: String,
		default:
			" A Life Insurance Workshop. Join us online to learn how life insurance can safeguard your family's financial security and provide peace of mind. We'll discuss different policy types, coverage options, and answer your questions.",
	},
	name: String,
	startTime: {
		type: String,
		required: true,
		// validate: {
		// 	validator: function (value) {
		// 		return value >= new Date(); // Only allow now or future dates
		// 	},
		// 	message: "startTime must be in the future",
		// },
	}, // input type = datetime-local,
	phone: String,
	email: {
		type: String,
		validate: [validator.isEmail, "{VALUE} is not a valid email"],
		required: true,
	},
	duration: { type: Number, default: 30 },
	hostEmail: {
		type: String,
		default: "ftpelitegroup@gmail.com",
		required: true,
	},
	zoomLink: { type: String },
});
// appointmentSchema.pre("save", async function (next) {
// 	this.startTime = new Date().toISOString(this.startTime);
// 	next();
// });
appointmentSchema.pre("save", function (next) {
	if (typeof this.startTime === "string") {
		this.startTime = new Date(this.startTime);
	}
	next();
});

// appointmentSchema.pre("save", async function (next) {
// 	const reschedule = await this.find({ startTime: this.startTime }); // checks if there is already an appointment for that day
// 	if (reschedule)
// 		return next(
// 			new Error(
// 				"this appointment time has already been taken thry scheduling an hour ahead "
// 			)
// 		);
// 	next();
// });
appointmentSchema.index({ startTime: 1 });
appointmentSchema.pre("save", async function (next) {
	const Appointment = this.constructor;
	const appointmentStart = new Date(this.startTime);
	const appointmentEnd = new Date(
		appointmentStart.getTime() + this.duration * 60000
	);

	const existingAppointments = await Appointment.find({
		_id: { $ne: this._id }, // Exclude current document when updating
		$or: [
			// Check if new appointment starts during an existing appointment
			{
				startTime: {
					$lt: appointmentEnd,
					$gte: appointmentStart,
				},
			},
			// Check if new appointment ends during an existing appointment
			{
				startTime: {
					$lt: new Date(appointmentStart.getTime() + this.duration * 60000),
					$gte: appointmentStart,
				},
			},
		],
	});

	if (existingAppointments.length > 0) {
		return next(
			new Error(
				"This time slot overlaps with an existing appointment. Please choose another time."
			)
		);
	}

	next();
});
appointmentSchema.pre("save", function (next) {
	if (!(this.startTime instanceof Date)) {
		this.startTime = new Date(this.startTime);
	}
	next();
});
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
