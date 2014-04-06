// map.js
// Fuel Me Up, Comp 20, April 2014

var request;

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
var places;
var parsed;

function initialize() {
    // Set up the request
    request = new XMLHttpRequest();
    request.open("GET", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true);

    // Execute the request
    request.send(null);

    // Handle the request
    request.onreadystatechange = callback;
}

// Handle the request
function callback() {
    if (request.readyState == 4 && request.status == 200) {
        parsed = JSON.parse(request.responseText);        
        if (parsed.line) {
            getCurrentLocation();
        }
    
    } else if (request.status == 500 && request.readyState == 4) {
        var errorElem = document.getElementById("map");
        errorElem.innerHTML = "<h1>Error: Could not load Map</h>";
        errorElem.innerHTML += "<p>Reloading. . .</p>";
        // Now, try again
        setTimeout(initialize, 300);
    }
}

function getCurrentLocation() {

    // If navigator.geolocation object is supported by your browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            longe = position.coords.longitude;
            renderMap();
        });
    }

    else {
        alert("Geolocation is not supported by your web browser.");
    }
}

function renderMap() {
    me = new google.maps.LatLng(lat, longe);
    map = new google.maps.Map(document.getElementById("mbtamap"), mapOptions);
 
    addStationMarkers();

    map.panTo(me);

    marker = new google.maps.Marker({
        position: me,
        title: "You are here",
        icon: "http://maps.google.com/mapfiles/kml/shapes/arrow.png"
    });

    marker.setMap(map);

    infowindow.setContent("You are here, which is " + (Math.round((0.621371 * closest.distance) * 100) / 100) + 
    " miles from the closest " + parsed.line + " line station, " + closest.name + ".");
    infowindow.open(map, marker);
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("You are here. You are " + (Math.round((0.621371 * closest.distance) * 100) / 100) + 
            " miles from the closest " + parsed.line + " line station, which is " + closest.name);
        infowindow.open(map, marker);
    });
}

