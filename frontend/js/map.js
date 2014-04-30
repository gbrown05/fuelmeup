// map.js
// Fuel Me Up, Comp 20, April 2014

//gas parameters -- come from somewhere else

var stationsList;
var tankSize;
var MPG;
var carMake;
var carModelYear;
var gasType;
var destination;
var gasAmount;
var distance;
var radius = 10; //temporary, will come from user
var type = "reg";


var request;
var errcount = 0;
var lat = 0;
var longe = 0;
me = new google.maps.LatLng(lat, longe);
var mapOptions = {
    zoom: 12,
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var marker;
var infowindow = new google.maps.InfoWindow();


/* This function computes the actual price of gas given the following parameters:
d1 = distance from origin point to gas station
d2 = distance from gas station to destination point
tc = tank capacity of car being used.
f = fraction of fuel tank to fill
mpg = miles per gallon of user car
retail = price per gallon of gas at a specific gas station in dollars per gallon.
*/
function actualPrice (retail, d1, d2, tc, f, mpg) {
		
	d1 = d1.replace(" miles","");
	d1 = parseInt(d1);

	d2 = d2.replace(" miles","");
	d2 = parseInt(d2);

	var w = retail*((f*tc) + ((d1 + d2)/mpg));
	return w;
}


function getLocalStorage() {
    if (localStorage["carMake"] != undefined) {
        document.getElementById("make").value = localStorage["carMake"];
    }
    if (localStorage["carModelYear"] != undefined) {
        document.getElementById("modelyear").value = localStorage["carModelYear"];
    }
    if(localStorage["gasType"] != undefined) {
        document.getElementById("type").value = localStorage["gasType"];
    }
    if(localStorage["destination"] != undefined) {
        document.getElementById("dest").value = localStorage["destination"];
    }
    if(localStorage["gasAmount"] != undefined) {
        document.getElementById("amount").value = localStorage["gasAmount"];
    }
    if(localStorage["distance"] != undefined) {
        document.getElementById("dist").value = localStorage["distance"];
    }
}


function fetchInputs()
{
    carMake = escape(document.getElementById("make").value);
    carModelYear = escape(document.getElementById("modelyear").value);
    gasType = escape(document.getElementById("type").value);
    destination = escape(document.getElementById("dest").value);
    gasAmount = escape(document.getElementById("amount").value);
    distance = escape(document.getElementById("dist").value);

	var queryData = new Object();
	queryData["make"]= carMake;
	queryData["model"] = carModelYear;
        var originToStation = new Object();
        originToStation["origin"] = /* current location */
        originToStation["destination"] = /* gas station */
        originToStation["sensor"] = false;
        var stationToDest = new Object();
        stationToDest["origin"] = /* gas station */
        stationToDest["destination"] = destination;
        stationToDest["sensor"] = false;

    var gasBuddyURI = "http://devapi.mygasfeed.com/stations/radius/" + /* lat */ + "/" +
                     /* lng */ + "/" + distance + "/" + /* fuel type */ +
                     "/distance/rfej9napna.json";


    $.ajax({
        type: "GET",
	    url: "http://fuelmeup.herokuapp.com/carMPG.json",
        //url: "http://localhost:3000/carMPG.json",
        data: queryData,
        dataType: "json",
        success: function(tester) {
		MPG
		var results = document.getElementById("results");
		var resText = "<h3> Results </h3> <p>Your car is a " + carMake +" " + carModelYear + " with a city mileage of " + tester[0]["UCity"] + "MPG and a highway mileage of " + tester[0]["UHighway"] + "MPG </p>"; 
		results.innerHTML = resText;
		MPG = tester[0]["UHighway"];
		tankSize = tester[0]["barrels08"];
		addGasMarkers(stationsList);

	}
    });

/*
    $.ajax({
        type: "GET",
        url: "http://maps.googleapis.com/maps/api/directions/json",
        data: originToStation,
        dataType: "json",
        success: function(res) {console.log(res);}
    });

    $.ajax({
        type: "GET",
        url: "http://maps.googleapis.com/maps/api/directions/json",
        data: stationToDest,
        dataType: "json",
        success: function(res) {console.log(res);}
    });

    $.ajax({
        type: "GET",
        url: gasBuddyURI,
        data: {},
        dataType: "json",
        success: function(res) {concole.log(res);}
    });

*/
    setLocalStorage();
 
	
}

function setLocalStorage()
{
    localStorage["carMake"] = carMake;
    localStorage["carModelYear"] = carModelYear;
    localStorage["gasType"] = gasType;
    localStorage["destination"] = destination;
    localStorage["gasAmount"] = gasAmount;
    localStorage["distance"] = distance;
}




function initialize() {
    // Set up the request
    request = new XMLHttpRequest();

    //TODO: This is the DEV API KEY -- use production for real
    var toget = "http://devapi.mygasfeed.com/stations/radius/" + lat + "/" +
            longe + "/" + radius + "/" + type +
            "/price/rfej9napna.json? callback="; 
    request.open("GET", toget, true);

    // Execute the request
    request.send(null);

    // Handle the request
    request.onreadystatechange = callback;
}

// Handle the request
function callback() {
    if (request.readyState == 4 && request.status == 200) {
        var parsed = request.responseText;
        var newStr = parsed.replace('({', '{');
        parsed = JSON.parse(newStr); 
        renderMap(parsed);
    } else {
        //console.log("Unable to get current gas station information.");
    }
}

function getCurrentLocation() {
    // If navigator.geolocation object is supported by your browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            longe = position.coords.longitude;
            initialize();
        });
    } else {
        alert("Geolocation is not supported by your web browser.");
    }
}

function renderMap(parsed) {
    me = new google.maps.LatLng(lat, longe);
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
     
    $(window).resize(function () {
        var h = $(window).height(),
            offsetTop = 60; // Calculate the top offset

        $('#map-canvas').css('height', (h - offsetTop));
    }).resize();

    map.panTo(me);

    marker = new google.maps.Marker({
        position: me,
        title: "You are here",
//        icon: "http://maps.google.com/mapfiles/kml/shapes/arrow.png"
    });

    marker.setMap(map);

    infowindow.setContent("You are here");
    infowindow.open(map, marker);
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("You are here.");
        infowindow.open(map, marker);
    });
    //addGasMarkers(parsed);

	stationsList = parsed;
}

function addGasMarkers(parsed){
    if(parsed["status"].error == "Yes") {
        alert("Unable to locate gas stations.");
    }
	//Only display at most the cheapest 20 gas stations. It seems as if
	// distance does not play much of a role beyond this.
	var l = parsed.stations.length;
	if (l > 20) {
		l = 20;
	}
    for (var i = 0; i < l; i++) {
        createMarker(parsed.stations[i]);
    }
}

function createMarker(currStation){
    var stationLoc = new google.maps.LatLng(currStation.lat, currStation.lng);
    
    //will need to add more info about price, type, etc.
    // Add the marker
    var stationMarker = new google.maps.Marker({
        map: map,
        position: stationLoc,
	    icon: "images/gas_ico.png"
    });

    // Using the API, add information about close gas stations
    google.maps.event.addListener(stationMarker, 'click', function() {
        infowindow.close();


	//Calculating round-trip price
	price = actualPrice(currStation.price, currStation.distance, currStation.distance, tankSize, gasAmount, MPG);
	console.log(price);


	var content = "<div class=cont><p>"+currStation.station +'</p><p> Listed Price: $' + currStation.price + ' per gallon </p> <p>  Distance: ' + currStation.distance + '</p> <p> Fuel Me Up Price: $' + price + '</p> <p> Gas Buddy Price: $'+ (currStation.price * 15) + '</p></div>';
        infowindow.setContent(content); // This gets the information
        infowindow.open(map, this);
    });
}


