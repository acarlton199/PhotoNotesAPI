var User = require("../models/users");
var jwt = require("jsonwebtoken");
var config = require("../../config/secret");

var superSecret = config.secret;

module.exports = function (app, express) {
	var authRouter = express.Router();

	authRouter.post("/register", function (req, res) {
		var user = new User();

		user.email = req.body.email;
		user.username = req.body.username;
		user.password = user.generateHash(req.body.password);
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;

		user.save(function (err) {
			if (err) {
				if (err.code == 11000) {
					return res.json({
						success: false,
						message: "Username already exists"
					});
				} else {
					return res.send(err);
				}
			}

			res.json({
				message: "User created"
			});
		});
	});

	authRouter.post("/login", function (req, res) {
		User.findOne({
			username: req.body.username
		}, "username password", function (err, user) {
			if (err) throw err;

			if (!user) {
				res.json({
					success: false,
					message: "Auth failed. User not found"
				});
			} else if (user) {
				var validPassword = user.validPassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: "Auth Failed. Wrong password"
					});
				} else {
					var token = jwt.sign({
						username: req.body.username
					}, superSecret, {
						expiresIn: "1440m"
					});

					res.json({
						success: true,
						message: "Here is a token",
						token: token
					});
				}
			}
		});
	});

	return authRouter;
};