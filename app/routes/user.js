var User = require("../models/users");
var config = require("../../config/shared");

module.exports = function (app, express) {
	var userRouter = express.Router();

	userRouter.route("/me")
		.get(function (req, res) {
			User.findOne({ 
				username: config.getUsernameFromToken(req) 
			}, function (err, user) {
				if (err) console.log(err);
				res.json(user);
			});
		})
		.put(function (req, res) {
			User.findOne({ 
				username: config.getUsernameFromToken(req)
			}, function (err, user) {
				if (err) console.log(err);

				if (req.body.password) user.password = req.body.password;
				if (req.body.firstName) user.firstName = req.body.firstName;
				if (req.body.lastName) user.lastName = req.body.lastName;

				user.save(function (err) {
					if (err) console.log(err);
					res.json({ message: "User updated" });
				});
			});
		});

	return userRouter;
};