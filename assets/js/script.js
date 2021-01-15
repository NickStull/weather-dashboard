var APIKey= "cec140ec03629e6d4712ae98d3d7fe30"
var currentCity = "Hastings";
var pastSearches = [];
$("#citySearch").popover('disable')


$("#currentDate").text(moment().format('MMMM Do YYYY'));

// pastSearches.unshift($("#citySearch").val()) //change to output name
//     localStorage.setItem("search", JSON.stringify(pastSearches));
//     

//     for (i = 0; i < 5; i++) {
//         $("#search" + i).text(pastSearches[i]);
//     }



function getWeather(){

    
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
        error: function(){$("#citySearch").popover('enable'); $("#citySearch").popover('show')}
    }).then(function(response) {

        if (pastSearches.includes(response.name)) {
            pastSearches.splice(pastSearches.indexOf(response.name), 1);
            pastSearches.unshift(response.name);
            localStorage.setItem("search", JSON.stringify(pastSearches))
        }
        else {
            pastSearches.unshift(response.name);
            localStorage.setItem("search", JSON.stringify(pastSearches))
        }

        for (i = 0; i < 5; i++) {
                    $("#search" + i).text(pastSearches[i]);
                }

        var icon = response.weather[0].icon
        var fTemp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        var humidity = response.main.humidity;
        var wind = Math.round(response.wind.speed);
        var lat = response.coord.lat
        var lon = response.coord.lon
        $("#currentCity").text(response.name);

        $("#todayIcon").attr("src", `https://openweathermap.org/img/wn/${icon}@4x.png`)
        $("#todayTemp").text("Temp: " + fTemp + "°");
        $("#todayHumid").text("Humidity: " + humidity + "%");
        $("#todayWind").text("Wind: " + wind + "mph");

        var secondURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}`
        
        $.ajax({
            url: secondURL,
            method: "GET"
        }).then(function(response) {
            $("#citySearch").popover('hide')
            $("#citySearch").popover('disable')
            for (i = 0; i < 5; i++) {
                $("#td" + i).attr("style", "opacity: .4");
            }

            if (response.current.uvi < 3) {
                $("#td0").attr("style", "opacity: 1")
            }
            else if (response.current.uvi >= 3 && response.current.uvi < 6) {
                $("#td1").attr("style", "opacity: 1")
            }
            else if (response.current.uvi >= 6 && response.current.uvi < 8) {
                $("#td2").attr("style", "opacity: 1")
            }
            else if (response.current.uvi >= 8 && response.current.uvi < 11) {
                $("#td3").attr("style", "opacity: 1")
            }
            else if (response.current.uvi >= 11) {
                $("#td4").attr("style", "opacity: 1")
            }

            for (i = 0; i < 5; i++) {
                var icon = response.daily[i].weather[0].icon
                var temp = Math.round((response.daily[i].temp.day - 273.25) * 1.80 + 32);
                var hum = response.daily[i].humidity;
                $("#i" + i).attr("src", `https://openweathermap.org/img/wn/${icon}.png`)
                $("#d" + i).text(moment().add(i + 1, 'days').format("MM/DD"));
                $("#t" + i).text("Temp: " + temp + "°");
                $("#h" + i).text("Hmd: " + hum + "%");
            }

        })

    });
}

window.onload = function(){
    if (JSON.parse(localStorage.getItem("search")) === null) {
        pastSearches.unshift("Minneapolis")
        localStorage.setItem("search", JSON.stringify(pastSearches));
        pastSearches = JSON.parse(localStorage.getItem("search"));
        currentCity = pastSearches[0]
        getWeather();
    }
    else {
        pastSearches = JSON.parse(localStorage.getItem("search"));
        currentCity = pastSearches[0]
        for (i = 0; i < 5; i++) {
            $("#search" + i).text(pastSearches[i]);
        }
        getWeather();
    }
};

$("#searchBtn").on("click", function(){
    currentCity = $("#citySearch").val()
    getWeather();
})

$("#dropdownMenuButton").on("click", function(){
    $('.dropdown-toggle').dropdown()
})

$(".dropdown-item").on("click", function(){
    currentCity = $(this).text();
    getWeather();
})

$("#citySearch").on("click", function(){
    $("#citySearch").val("")
})

