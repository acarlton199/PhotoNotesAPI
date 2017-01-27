//=========================
// Mongo User Setup
//=========================
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-node");

var userSchema = mongoose.Schema( {
	email:     { type: String, required: true, index:  { unique: true }},
	username:  { type: String, required: true, index:  { unique: true }},
	password:  { type: String, required: true, select: false },
	firstName: String,
	lastName:  String
});

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model("User", userSchema);