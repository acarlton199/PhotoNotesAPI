var fs           = require("fs");
var path         = require("path");
var User         = require("../models/users");
var Note         = require("../models/photonotes");
var jwt          = require("jsonwebtoken");
var secretConfig = require("../../config/secret");
var shared       = require("../../config/shared");
var formidable   = require("formidable");

var superSecret = secretConfig.secret;

module.exports = function (app, express) {
	var notesRouter = express.Router();

	notesRouter.route("/notes")
		.post(function (req, res) {
			var note = new Note();

			var username = shared.getUsernameFromToken(req);
			var userDir = path.join(__dirname, "/../../public/uploads/" + username);
			var newFileName = "";

			var form = new formidable.IncomingForm();
			form.multiples = false;
			form.uploadDir = userDir;
			
			form.on("file", function (field, file) {
				newFileName = createNameForStorage(file.name, username);
				fs.rename(file.path, path.join(form.uploadDir, newFileName), function (err) {
					if (err) console.log(err);
				});
			});

			form.on("error", function (err) {
				if (err) console.log(err);
			});

			form.on("end", function () {
				res.json({ message: "Note Created" });
			});		

			form.parse(req, function (err, fields, files) {
				if (err) console.log(err);

				note.image = path.join(form.uploadDir, newFileName);
				note.title = fields.title;
				note.summary = fields.summary;
				// note.notes = fields.notes;
				// note.gear = fields.gear;
				// note.time = Date.now();
				// note.location = fields.location;
				note.owner = username;
	
				note.save(function (err) {
					if (err) console.log(err);
				});
			});

		})
		.get(function (req, res) {
			var username = shared.getUsernameFromToken(req);
			Note.find({ owner: username }, function (err, notes) {
				if (err) console.log(err);
				res.json(notes);
			});
		});

	notesRouter.route("/notes/:id")
		.get(function (req, res) {
			Note.findById(req.params.id, function(err, note) {
				if (err) console.log(err);
				res.json(note);
			});
		})
		.put(function (req, res) {
			Note.findById(req.params.id, function (err, note) {
				if (err) console.log(err);

				if (req.body.title) note.title = req.body.title;
				if (req.body.summary) note.summary = req.body.summary;
				// if (req.body.notes) note.notes = req.body.notes;
				// if (req.body.gear) note.gear = req.body.gear;
				// if (req.body.time) note.time = req.body.time;
				// if (req.body.location) note.location = req.body.location;

				note.save(function (err) {
					if (err) console.log(err);
					res.json({ message: "Note Updated" });
				});
			});
		})
		.delete(function (req, res) {
			Note.remove({ _id: req.params.id }, function (err, note) {
				if (err) console.log(err);
				res.json({ message: "Note deleted" });
			});
		});

	var createNameForStorage = function(file, user) {
		var arr = file.split(".");
		return user + "_" + Date.now() + "." + arr[arr.length-1];
	};

	return notesRouter;
};