var express = require("express");
var logfmt = require("logfmt");
var sanitizeInput = require("validator").sanitize;
//var routes = require("./routes");
var http = require("http");
var path = require ("path");
var mongo = require("mongodb");

var app = express();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
        "mongodb://localhost/fuelmeup";

var db = mongo.Db.connect(mongoUri, function (err, database) {
      db = database;
});

app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, "frontend")));

app.get('/', function(req, res) {
        res.sendfile(__dirname, 'frontend', path.basename("index.html"));
});

//app.get('/cars1.json', function(req, res) {
//        var carMake = req.query.make;


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
