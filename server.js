var express    = require("express");
var app        = express();
var mongoose   = require("mongoose");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var config = require("./config");

mongoose.connect(config.dbConnection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
	next();
});

app.get("/", function (req, res) {
	res.send("Hello!");
});

app.listen(8080);
console.log("The server is running on port 8080");