var express = require("express");
var logfmt = require("logfmt");
var sanitizeInput = require("validator").sanitize;
//var routes = require("./routes");
var http = require("http");
var path = require ("path");
var mongo = require("mongodb");
var favicon = require("static-favicon");

var app = express();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
    "mongodb://localhost/testdb";

var db = mongo.Db.connect(mongoUri, function (err, database) {
    db = database;
});

app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, "frontend")));
app.use(favicon(path.join(__dirname,
                                "frontend/images/fmufavicon.ico")));

app.get('/', function(req, res) {
    res.sendfile(__dirname, 'frontend', path.basename("index.html"));
});

app.get('/about', function(req, res) {
    res.sendfile(__dirname, 'frontend', path.basename("about.html"));
});

/*Returns all the car makes in a JSON String, with repeats */
app.get('/carMakes.json', function(req, res) {
	//This is "cars1" on the herokuapp
	var collectionName = "makes";

        db.collection(collectionName, function(er, col) {
            if (!er) {
                col.find({},{make:1, _id:0}).toArray(function(err, makeList) {
                    res.send(makeList);
                });
            }
        });
});
/* Returns a JSON of the various miles-per-gallon values of a car of a given make and model */
app.get('/carMPG.json', function(req, res) {
	//Holds the car make
	var _make = req.query.make;
	var _model = req.query.model;
	
	//This is "cars1" on the herokuapp
	var collectionName = "makes";
	
	db.collection(collectionName, function(er,col) {
		if(!er) {
			col.find({"make":_make, "model":_model} , {UCity:1, UHighway:1, year:1, _id:0} ).toArray(function(err, makeList) {

				res.send(makeList);
			});
		} else {
			res.send('Error!');
		}
	})
});	


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

