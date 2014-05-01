// map.js
// Fuel Me Up, Comp 20, April 2014

//gas parameters -- come from somewhere else

var stationsList;
var tankSize;
var MPG;
var carMake;
var carModelYear;
var destination;
var gasAmount;
var radius = 10; //temporary, will come from user
var type = "reg";


var weightedList = new Object();

var request;
var errcount = 0;
var lat = 0;
var longe = 0;
var parsed = {};
me = new google.maps.LatLng(lat, longe);
var mapOptions = {
    zoom: 12,
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var marker;
var infowindow = new google.maps.InfoWindow();

var fromDirectionsService = new google.maps.DirectionsService();
var fromDirectionsDisplay = new google.maps.DirectionsRenderer();
var toDirectionsService = new google.maps.DirectionsService();
var toDirectionsDisplay = new google.maps.DirectionsRenderer();

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

function calcRoute(stationLoc) {
  var fromDirections = {
    origin: me,
    destination: stationLoc,
    travelMode: google.maps.TravelMode.DRIVING
  };

  var toDirections = {
    origin: stationLoc,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING
  };
  
  fromDirectionsService.route(fromDirections, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      fromDirectionsDisplay.setDirections(result);
    }
  });

  toDirectionsService.route(toDirections, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      toDirectionsDisplay.setDirections(result);
    }
  });
}

function getLocalStorage() {
    if (localStorage["carMake"] != undefined) {
        document.getElementById("make").value = localStorage["carMake"];
    }
    if (localStorage["carModelYear"] != undefined) {
        document.getElementById("modelyear").value = localStorage["carModelYear"];
    }
    if(localStorage["destination"] != undefined) {
        document.getElementById("dest").value = localStorage["destination"];
    }
    if(localStorage["gasAmount"] != undefined) {
        document.getElementById("amount").value = localStorage["gasAmount"];
    }
}


function fetchInputs()
{
    carMake = escape(document.getElementById("make").value);
    carModelYear = escape(document.getElementById("modelyear").value);
    destination = escape(document.getElementById("dest").value);
    gasAmount = escape(document.getElementById("amount").value);

	var queryData = new Object();
	queryData["make"]= carMake;
	queryData["model"] = carModelYear;

    $.ajax({
        type: "GET",
	    url: "http://fuelmeup.herokuapp.com/carMPG.json",
        //url: "http://localhost:3000/carMPG.json",
        data: queryData,
        dataType: "json",
        success: function(tester) {
		//var results = document.getElementById("results");
		//var resText = "<h3> Results </h3> <p>Your car is a " + carMake +" " + carModelYear + " with a city mileage of " + tester[0]["UCity"] + "MPG and a highway mileage of " + tester[0]["UHighway"] + "MPG </p>"; 
		//results.innerHTML = resText;
		

		if (tester[0] != undefined) {		
		MPG = tester[0]["UHighway"];
		tankSize = tester[0]["barrels08"];
		addGasMarkers(stationsList);
		} else {
			alert("This car model is not supported!");
			
		}

	}
    });

    setLocalStorage();
}

function setLocalStorage()
{
    localStorage["carMake"] = carMake;
    localStorage["carModelYear"] = carModelYear;
    localStorage["destination"] = destination;
    localStorage["gasAmount"] = gasAmount;
    localStorage["latitude"] = lat;
    localStorage["longitude"] = longe;

}


function initialize() {
    // Set up the request
    request = new XMLHttpRequest();

    //TODO: This is the DEV API KEY -- use production for real
    var toget = "http://api.mygasfeed.com/stations/radius/" + lat + "/" +
            longe + "/" + radius + "/" + type +
            "/price/pmwiy9rbr2.json?callback="; 
    request.open("GET", toget, true);

    // Execute the request
    request.send(null);

    // Handle the request
    request.onreadystatechange = callback;
}

// Handle the request
function callback() {
    if (request.readyState == 4 && request.status == 200) {
        parsed = request.responseText;
        var newStr = parsed.substring(1);
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
            getLocalStorage();
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
    fromDirectionsDisplay.setMap(map);
    toDirectionsDisplay.setMap(map);

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
        createMarker(parsed.stations[i], i);
    }
	var ctr = 0;

	var tempArr = new Object();
	
	for(var i = 0; i <l; i++) {
		if((!isNaN(weightedList[i].FMUprice) ) && (weightedList[i].station != undefined) ) {		
			tempArr[ctr] = weightedList[i];
			ctr++;
		}
	}

	weightedList = tempArr;
	l = ctr-1;
	
	/* Yuck, selection sort */
	for(var i = 0; i < l-1; i++) {
		var mindex = i;
		for (var j = i+1; j < l; j++) {
			if(weightedList[j].FMUprice < weightedList[i].FMUprice) {
				mindex = j;
			}
		}
			var temp = weightedList[mindex];
			weightedList[mindex] = weightedList[i];
			weightedList[i] = temp; 
	}

	var table = "<h3> Cheapest stations, in order </h3><table><tr><th>Name</th><th>Real Price:</th><th>Address</th><th>Distance</th></tr>";
	for (var j = 0; j < l; j++) {
		table = table + "<tr><td>" + weightedList[j].station + "</td><td>" + weightedList[j].FMUprice
+ "</td><td>" + weightedList[j].address + "</td><td>" + weightedList[j].distance + "</td></tr>";
	}
	table = table + "</table>";
	//document.getElementById("results").innerHTML = table;
    $.fancybox({
        margin: 0,
        padding: 5,
        autoSize: true, // shouldn't be true ?
        fitToView: false,
        maxWidth: 940,
        overlayShow: false,
        transitionIn: "elastic",
        transitionOut: "elastic",
        overlayColor: "#000",
        overlayOpacity: 0.8,
        content: table
      })
}

function createMarker(currStation, ctr){
    var stationLoc = new google.maps.LatLng(currStation.lat, currStation.lng);
    
    //will need to add more info about price, type, etc.
    // Add the marker
    var stationMarker = new google.maps.Marker({
        map: map,
        position: stationLoc,
	    icon: "images/gas_ico.png"
    });


	//Calculating round-trip price
	var price = actualPrice(currStation.price, currStation.distance, currStation.distance, tankSize, gasAmount, MPG);

	var content = "<div class=cont><p>"+currStation.station +'</p><p> Listed Price: $' + currStation.price + ' per gallon </p> <p>  Distance: ' + currStation.distance + '</p> <p> Fuel Me Up Price: $' + (Math.round(price*100) / 100) + '</p> <p> Gas Buddy Price: $'+ (Math.round((currStation.price * tankSize) * 100) / 100) + '</p></div>';


		weightedList[ctr] = currStation;
		weightedList[ctr].FMUprice = price;

    // Using the API, add information about close gas stations
    google.maps.event.addListener(stationMarker, 'click', function() {
        infowindow.close();


        infowindow.setContent(content); // This gets the information
        infowindow.open(map, this);
        calcRoute(stationLoc);


    });
}

/*
var service = new google.maps.DistanceMatrixService();   
  service.getDistanceMatrix(
      {
        origins: [me, stationLoc],
        destinations: [stationLoc, destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL 
      }, parseDistance);

function parseDistance(response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK) {
        var from = response.rows[0].elements[0];
        fromDistance = from.distance.text;
	fromDistance = fromDistance + "les";
        console.log(fromDistance);
        var to = response.rows[1].elements[1];
        toDistance = to.distance.text;
	toDistance = toDistance + "les";
        console.log(toDistance);
    }
}
*/
