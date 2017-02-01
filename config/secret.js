//=========================
// Secret key
//=========================
var jwt = require("jsonwebtoken");

module.exports = {
	"secret": "ThisIsMySuperSecretKeyValue",
	"getUsernameFromToken": function (req) {
		var token = req.body.token || req.headers["x-access-token"];
		var decoded = jwt.verify(token, this.secret);
		return decoded.username;
	}
};