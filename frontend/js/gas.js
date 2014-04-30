var carMake;
var carModelYear;
var gasType;
var destination;
var gasAmount;
var distance;

/* This function computes the actual price of gas given the following parameters:
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


    $.ajax({
        type: "GET",
	//http://fuelmeup.herokuapp.com/carMakes.json
        url: "http://localhost:3000/carMPG.json",
        data: queryData,
        dataType: "json",
        success: function(tester) {
		var results = document.getElementById("results");
		var resText = "<h3> Results </h3> <p>Your car is a " + carMake +" " + carModelYear + " with a city mileage of " + tester[0]["UCity"] + "MPG and a highway mileage of " + tester[0]["UHighway"] + "MPG </p>"; 
		results.innerHTML = resText;
		console.log(tester);

	}
    });

	
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

