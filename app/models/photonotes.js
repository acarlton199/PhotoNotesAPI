//=========================
// Mongo Photonotes Setup
//=========================
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-node");

var photoNoteSchema = mongoose.Schema( {
	image: String,
	title: String,
	summary: String,
	notes: String,
	gear: [String],
	time: String,
	location: String,
	owner: String
});

module.exports = mongoose.model("PhotoNotes", photoNoteSchema);