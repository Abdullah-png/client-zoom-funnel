const express = require("express");
const app = express();
const { signup, authenticate } = require("./controllers/authControllers");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
// app.use(
// 	cors({
// 		origin: "http://127.0.0.1:3000", // Frontend origin
// 		credentials: true, // <- Required for cookies/sessions
// 	})
// );
const session = require("express-session");

const userRouter = require(`./routes/userRoutes`);
const appointmentRouter = require(`./routes/appointmentRoutes`);

const path = require("path");

//load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// app.use(express.static("public"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(
// 	session({
// 		secret: process.env.SESSION_ACCESS_TOKEN,
// 		resave: false,
// 		saveUninitialized: false,
// 		store: MongoStore.create({
// 			mongoUrl: process.env.DATABASE_URL,
// 			ttl: 24 * 60 * 60, // Session TTL (1 day)
// 			autoRemove: "native",
// 		}),
// 		cookie: {
// 			secure: process.env.NODE_ENV === "production",
// 			httpOnly: true,
// 			maxAge: 24 * 60 * 60 * 1000, // 1 day
// 		},
// 	})
// );
// view rendering TODO:refactor later
app.get("/", (req, res, next) => {
	res.status(200).render("landing");
});

app.get("/make-meeting", (req, res, next) => {
	res.status(200).render("make-meeting");
});
// app.use(cors());
// app.post("/", signup, authenticate);
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({ status: err.status || 500, msg: err.message });
});
app.use((req, res, next) => {
	console.log(
		`[${req.method}] ${req.originalUrl} | Session:`,
		req.session?.id || "no session"
	);
	next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/appointments", appointmentRouter);
module.exports = app;
