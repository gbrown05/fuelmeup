// map.js
// Fuel Me Up, Comp 20, April 2014

//gas parameters -- come from somewhere else
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
    /*} else if (errcount < 10) {
    errcount++;
    setTimeout(initialize, 300);*/
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
    addGasMarkers(parsed);
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
	var content = "<div class=cont><p>"+currStation.station +'</p><p> Price: $' + currStation.price + ' per gallon </p> <p>  Distance: ' + currStation.distance + '</p> </div>';
        infowindow.setContent(content); // This gets the information
        infowindow.open(map, this);
    });
}

/*
This function computes the actual price of gas given the following parameters:
d1 = distance from origin point to gas station
d2 = distance from gas station to destination point
tc = tank capacity of car being used.
f = fraction of fuel tank to fill
mpg = miles per gallon of user car
retail = price per gallon of gas at a specific gas station in dollars per gallon.
*/
function actualPrice (retail, d1, d2, tc, f, mpg) {
	var w = retail((f*tc) + ((d1 + d2)/mpg));
	return w;
}



