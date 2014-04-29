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
//$.ajax



function actualPrice (retail, d1, d2, tc, f, mpg) {
	var w = retail((f*tc) + ((d1 + d2)/mpg));
	return w;
}


function fetchInputs()
{
    carMake = document.getElementById("carmake");
    carModelYear = document.getElementById("carmodelyear");
    gasType = document.getElementById("gasType");
    destination = document.getElementById("destination");
    gasAmount = document.getElementById("howmuch");
    distance = document.getElementById("howfar");

    var tester = new Object();
    $.ajax({
        type: "GET",
        url: "http://fuelmeup.herokuapp.com/carMakes.json",
        data: {},
        dataType: "json",
        success: function() {console.log("Success!");}
    });

    console.log(tester);

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

