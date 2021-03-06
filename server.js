//=========================
// Setup packages
//=========================
var express      = require("express");
var app          = express();
var mongoose     = require("mongoose");
var morgan       = require("morgan");
var bodyParser   = require("body-parser");
var jwt          = require("jsonwebtoken");
var dbConfig     = require("./config/database");
var secretConfig = require("./config/secret");

//=========================
// Configure
//=========================
var superSecret = secretConfig.secret;

// Connect to mongoose database
mongoose.connect(dbConfig.url);

// Set up body parser
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Set up morgan to log requests to console
app.use(morgan("dev"));

//=========================
// Basic Routing
//=========================
app.get("/", function (req, res) {
	res.json({
		message: "Welcome to the API"
	});
});

//=========================
// Advanced Routing
//=========================
var authRoutes = require("./app/routes/auth")(app, express);
app.use("/api", authRoutes);

// Requires next routes to have authentication
app.use(function (req, res, next) {
	var token = req.body.token || req.headers["x-access-token"];

	if (token) {
		jwt.verify(token, superSecret, function (err, decoded) {
			if (err) {
				return res.status(403).send({
					success: false,
					message: "Failed to authenticate"
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).send({
			success: false,
			message: "No token!"
		});
	}
});

var userRoutes = require("./app/routes/user")(app, express);
app.use("/api", userRoutes);

var noteRoutes = require("./app/routes/notes")(app, express);
app.use("/api", noteRoutes);

//=========================
// Start Server
//=========================
app.listen(8080);
console.log("The server is running on port 8080");