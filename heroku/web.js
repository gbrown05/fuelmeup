//app.js -- by George Brown, Max Cohen, Siddhartha Prasad, Victor Chao

var express = require("express");
//var logfmt = require("logfmt");
//var routes = require("./routes/routes");
var http = require("http");
var path = require ("path");
var mongo = require("mongodb");
var bodyParser = require('body-parser');

var app = express();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
        "mongodb://localhost/fuelmeup";

var db = mongo.Db.connect(mongoUri, function (err, database) {
      db = database;
});

// environments
app.set("port", process.env.PORT || 3000);
//app.use(logfmt.requestLogger());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
//app.use(express.logger("dev"));
app.use(bodyParser());
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, "public")));
//app.use("/style.css", express.static(__dirname + '/style.css'));
//app.use("/index.html", express.static(__dirname + "/index.html"));

// development only
if ("development" == app.get("env")) {
  //app.use(express.errorHandler());
}

//root: Fuel Me Up homepage
app.get('/', function(req,res) {
  res.set("Content-Type", "text/html");
  var htmlToRender = '<!DOCTYPE HTML><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/></head><body><h1>Fuel Me Up</h1><br><h2>Play Game!</h2>';
  /*db.collection("makes", function(er, col) {
    if (!er) {
      col.find().sort({score:-1}).toArray(function(errr,goodthing){
        // Add all scores to the table, in descending order
        for (var i = 0; i < goodthing.length; i++) {
          htmlToRender += "<tr><td>";
          htmlToRender += goodthing[i].score;
          htmlToRender += "</td><td>";
          htmlToRender += goodthing[i].username;
          htmlToRender += "</td><td>";
          htmlToRender += goodthing[i].created_at;
          htmlToRender += "</td></tr>";
        }*/
        htmlToRender += "</body></html>"
        res.send(htmlToRender);
        //});
  //}
  //});
});



http.createServer(app).listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
