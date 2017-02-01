var secret = require("./secret");
var jwt = require("jsonwebtoken");

module.exports = {
	"getUsernameFromToken": function (req) {
		var token = req.body.token || req.headers["x-access-token"];
		var decoded = jwt.verify(token, secret.secret);
		return decoded.username;
	}
};