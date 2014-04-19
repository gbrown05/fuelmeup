var carMake;
var carModelYear;
var gasType;
var destination;
var gasAmount;
var distance;

function fetchInputs()
{
    carMake = document.getElementById("carmake");
    carModelYear = document.getElementById("carmodelyear");
    gasType = document.getElementById("gasType");
    destination = document.getElementById("destination");
    gasAmount = document.getElementById("how much");
    distance = document.getElementById("howfar");

    setLocalStorage();
}

function setLocalStorage()
{
    localStorage["carMake"] = carMake;
    localStorage["carModelYear"] = carModel;
    localStorage["gasType"] = gasType;
    localStorage["destination"] = destination;
    localStorage["gasAmount"] = gasAmount;
    localStorage["distance"] = distance;
}
