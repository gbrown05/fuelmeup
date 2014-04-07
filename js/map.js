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
    zoom: 11,
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
    var toget = "http://devapi.mygasfeed.com/stations/radius/" + lat + "/" + longe + "/" + radius + "/" + type + "/price/rfej9napna.json?"; 
    request.open("GET", toget, true);

    // Execute the request
    request.send(null);

    // Handle the request
    request.onreadystatechange = callback;
}

// Handle the request
function callback() {
    if (request.readyState == 4 && request.status == 200) {
        parsed = JSON.parse(request.responseText); 
        renderMap();       
    } else if (errcount < 10) {
        errcount++;
        setTimeout(initialize, 300);
    } else {
        console.log("Unable to get current gas station information.");
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

function renderMap() {
    me = new google.maps.LatLng(lat, longe);
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
    map.panTo(me);

    marker = new google.maps.Marker({
        position: me,
        title: "You are here",
        icon: "http://maps.google.com/mapfiles/kml/shapes/arrow.png"
    });

    marker.setMap(map);

    infowindow.setContent("You are here");
    infowindow.open(map, marker);
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("You are here.");
        infowindow.open(map, marker);
    });
}