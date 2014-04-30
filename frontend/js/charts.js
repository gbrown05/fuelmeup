 $.ajax({
        type: "GET",
        url: "http://devapi.mygasfeed.com//locations/pricehistory/" + closestStation + "/" + apikey + ".json?callback=?",
        data: originToStation,
        dataType: "json",
        success: function(res) {console.log(res);}
    });
