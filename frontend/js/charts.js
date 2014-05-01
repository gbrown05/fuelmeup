/* $.ajax({
        type: "GET",
        url: "http://devapi.mygasfeed.com//locations/pricehistory/" + closestStation + "/" + apikey + ".json?callback=?",
        data: originToStation,
        dataType: "json",
        success: function(res) {console.log(res);}
    });*/

function initialize() {
	// Set up the request
    request = new XMLHttpRequest();

    //TODO: This is the DEV API KEY -- use production for real
    var toget = "http://api.mygasfeed.com/stations/radius/" + lat + "/" +
            longe + "/" + radiuss + "/" + type +
            "/price/pmwiy9rbr2.json?callback="; 
    request.open("GET", toget, true);

    // Execute the request
    request.send(null);

    // Handle the request
    request.onreadystatechange = callback;
}

var queryData = new Object();
	queryData["make"]= carMake;
	queryData["model"] = carModelYear;

console.log(parsed);

	google.load("visualization", "1", {packages:["corechart"]});
	google.setOnLoadCallback(drawChart);

	function drawChart() {

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
	}
