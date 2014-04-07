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

function initialize() {
    // Set up the request
    getCurrentLocation();
}

function getCurrentLocation() {
    // If navigator.geolocation object is supported by your browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            longe = position.coords.longitude;
            renderMap();
                console.log("hello");

        });
    }

    else {
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

