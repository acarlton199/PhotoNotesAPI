var User = require("../models/users");
var jwt = require("jsonwebtoken");
var path = require("path");
var fs = require("fs");
var secretConfig = require("../../config/secret");

var superSecret = secretConfig.secret;

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

			var userDir = path.join(__dirname, "/../../public/uploads/" + req.body.username);
			fs.access(userDir, function (err) {
				if (err) { 
					fs.mkdir(userDir, function (err) {
						if (err) console.log(err);
					});
				}
			});

			res.json({
				message: "User created"
			});
		});
	});

	authRouter.post("/login", function (req, res) {
		User.findOne({
			username: req.body.username
		}, "username password", function (err, user) {
			if (err) console.log(err);

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