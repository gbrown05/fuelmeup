var express = require("express");
var logfmt = require("logfmt");
var sanitizeInput = require("validator").sanitize;
//var routes = require("./routes");
var http = require("http");
var path = require ("path");
var mongo = require("mongodb");
var favicon = require("static-favicon");

var app = express();
//var colName;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
    "mongodb://localhost/testdb";

<<<<<<< HEAD
=======


>>>>>>> 442beb13e04a320d4dc75852e7528046c59fc7ea
var db = mongo.Db.connect(mongoUri, function (err, database) {
    db = database;
});

app.set("port", process.env.PORT || 3000);
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
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
<<<<<<< HEAD
		db.open();
        db.collection("cars1", function(er, col) {
=======

        db.collection("makes", function(er, col) {
>>>>>>> 442beb13e04a320d4dc75852e7528046c59fc7ea
            if (!er) {
                col.find({},{make:1, _id:0}).toArray(function(err, makeList) {
                    res.send(makeList);
                });
            }
        });
});
/* Returns a JSON of the various miles-per-gallon values of a car of a given make and model */
app.get('/carMPG.json', function(req, res) {

	//Allow CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

	//Holds the car make
	var _make = escape(req.query.make);
	var _model = escape(req.query.model);
<<<<<<< HEAD
	db.open();
	db.collection("cars1", function(er,col) {
=======
	
	db.collection("makes", function(er,col) {
>>>>>>> 442beb13e04a320d4dc75852e7528046c59fc7ea
		if(!er) {
			col.find({"make":_make, "model":_model} , {UCity:1, UHighway:1, year:1, barrels08:1,  _id:0} ).toArray(function(err, makeList) {
				res.send(makeList);
			});
		}
		 else {
			res.send('Error!');
		}
	});
});	


http.createServer(app).listen(app.get("port"), function() {
    console.log("Listening on " + app.get("port"));
});

