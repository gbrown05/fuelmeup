var radius = 10;
var type = "reg";
var lat = localStorage["latitude"];
var longe = localStorage["longitude"];
var parsed;

var queryData = new Object();
//need to error check here if we ever finish...
queryData["make"]= localStorage["carMake"];
queryData["model"] = localStorage["carModelYear"];



function makeCharts() {
	// Set up the request
    request = new XMLHttpRequest();

    //TODO: This is the DEV API KEY -- use production for real prod
    var toget = "http://devapi.mygasfeed.com/stations/radius/" + lat + "/" +
            longe + "/" + radius + "/" + type +
            "/distance/rfej9napna.json?callback="; 
    request.open("GET", toget, true);

    // Execute the request
    request.send(null);

    // Handle the request
    request.onreadystatechange = callback;
}

function callback() {
    if (request.readyState == 4 && request.status == 200) {
        parsed = request.responseText;
        var newStr = parsed.substring(1);
        parsed = JSON.parse(newStr); 

        var id = new Array();
        var date = new Array();
        var distance = new Array();
        var price = new Array();

        var j = 0;
        for (var i = 0; i < 20; i++) {
        	if (!isNaN(parsed.stations[i].price)) { 
		        id[j] = parsed.stations[i].id;
				date[j] = parsed.stations[i].date;
				distance[j] = parseDist(parsed.stations[i].distance);
				price[j] = parsed.stations[i].price;
				j++;
			}
		}

        var ctx = document.getElementById("chart_div").getContext("2d");

        var data = {
			labels : ["Price Per Gallon","Distance To Station"],
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					data : [price[0], distance[0]]
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					data : [price[1], distance[1]]
				},
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					data : [price[2], distance[2]]
				}
			]
		}
		var myNewChart = new Chart(ctx).Bar(data);

		chart_exp = document.getElementById("chart_exp");
		chart_exp.innerHTML = "<p>This chart shows the distance to the 3 closest gas stations in miles and the associated price at those stations. The price from the first bar is from " + date[0] + ". The price from the second bar is from " + date[1] + ". The price from the third bar is from " + date[2] + ".</p>";
    }
}

function parseDist(dist) {
	dist = dist.replace(" miles","");
	dist = parseFloat(dist);
	return dist;
}


