const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	console.log(err.name, err.message, err.stack);
	process.exit(1);
});

dotenv.config({ path: "./config.env" });
let db = process.env.DATABASE_URL.replace(
	"<NAME>",
	process.env.DATABASE_NAME
).replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
const app = require("./app");
mongoose
	.connect(db)
	.then(() => console.log("DB connection successful:--->"))
	.catch((err) => console.log("DB connection unsuccessful :--->" + err.message));

const server = app.listen(process.env.PORT, () => {
	console.log("server online listening on port " + process.env.PORT + " ...");
});
process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! 💥 Shutting down...");
	console.log(err.name, err.message, err);
	server.close(() => {
		process.exit(1);
	});
});
