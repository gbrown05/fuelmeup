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

function callback() {
    if (request.readyState == 4 && request.status == 200) {
        parsed = request.responseText;
        var newStr = parsed.substring(1);
        parsed = JSON.parse(newStr); 
        console.log(parsed);

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
		console.log(distance);

        var ctx = document.getElementById("chart_div").getContext("2d");

        var data = {
			labels : [/*"Time",*/"Price Per Gallon","Distance To Station"],
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					data : [/*date[0],*/ price[0], distance[0]]
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					data : [/*date[1],*/ price[1], distance[1]]
				},
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					data : [/*date[2], */price[2], distance[2]]
				}
			]
		}

		var myNewChart = new Chart(ctx).Bar(data);
    }
}

function parseDist(dist) {
	dist = dist.replace(" miles","");
	dist = parseInt(dist);
	return dist
}

function start() {
	var toget = "http://api.mygasfeed.com/stations/radius/" + lat + "/" +
	            longe + "/" + radius + "/" + type +
	            "/price/pmwiy9rbr2.json?callback="; 

	$.ajax({
	        type: "GET",
		    //url: "http://fuelmeup.herokuapp.com/carMPG.json",
	        url: toget,
	        dataType: "json",
	        success: function() {
	        		google.load("visualization", "1", {packages:["corechart"]});
					google.setOnLoadCallback(drawChart);
			}
	});
}
/*
function drawChart() {
	console.log("in draw chart");
	console.log(parsed);
	var id = parsed.stations[0].id;
	var date = parsed.stations[0].date;
	var distance = parsed.stations[0].distance;
	var price = parsed.stations[0].price;

	var data = google.visualization.arrayToDataTable(
		[
		  ['Time', 'Price', 'Distance'],
		  [date, price, distance]
	    ]);

	var options = {
	  	title: 'Car Statistics',
	  	hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
		chart.draw(data, options);
}*/
/*
 google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ]);

        var options = {
          title: 'Company Performance',
          hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
      */