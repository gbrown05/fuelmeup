/* $.ajax({
        type: "GET",
        url: "http://devapi.mygasfeed.com//locations/pricehistory/" + closestStation + "/" + apikey + ".json?callback=?",
        data: originToStation,
        dataType: "json",
        success: function(res) {console.log(res);}
    });*/

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
		  	title: 'Company Performance',
		  	hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
		};

		var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
			chart.draw(data, options);
	}
});
