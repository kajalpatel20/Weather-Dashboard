var cityName = []

$(document).ready(function () {


      var searchBox = $("<div>").addClass("card text-center mb-4")
      var apiKey = "05ec9aa2523ccea7033d8fff74205311";

      var theCity = $("<p>").addClass("theCity");
      $("#cityCurrent").append(theCity);

      var theDate = $("<p>").addClass("theDate")
      $("#cityCurrent").append(theDate);

      var icon = $("<img>").addClass("theIcon");
      $("#cityCurrent").append(icon);

      var forecastHeading = $("<p>").addClass("h3 text-center mt-4 forecastHeading");
      $("#Heading").append(forecastHeading);

      var uviIndex = $("<p>").addClass("uvI");
      var uviIndicator = $("<span>").addClass("uviIndicator");
      $("#cityCurrent").append(uviIndex);
      $("#cityCurrent").append(uviIndicator);


      //onclick methof for search btn
      $("#searchButton").on("click", function () {
            var searchInput = $("#cityNameInput").val();
            //pass searchInput as an argument
            getCurrentWeather(searchInput);
      });
      //must declare an argument that is being passed
      function getCurrentWeather(cityName) {

            //make ajax call
            $.ajax({
                  type: "GET",
                  url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial",
                  dataType: "json",
                  success: function (data) {
                        //console.log("successful call", data)
                        //render data to html
                        var card = $("<div>").addClass("card");
                        var temperature = $("<p>").addClass("theTemperature").text("Temperature: " + data.main.temp + " F");
                        var humidity = $("<p>").addClass("theHumidity").text("Humidity: " + data.main.humidity + "%");
                        var windSpeed = $("<p>").addClass("theWindSpeed").text("Wind Speed " + data.wind.speed + " MPH");
                        var title = $("<h2>").addClass("currentTitle").text(data.name);
                        // console.log("https://openweathermap.org/img/w/" + data.weather[0].icon )
                        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

                        //append to card, append card to html 
                        title.append(img)
                        card.append(title, temperature, humidity, windSpeed);
                        $("#cityCurrent").append(card);

                        //call function for 5 day
                        getFiveDay(cityName);

                        //call function for UvIndex

                        var lat = data.coord.lat
                        var lon = data.coord.lon

                        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?" + "lat=" + lat + "&lon=" + lon + "&units=imperial+&appid=05ec9aa2523ccea7033d8fff74205311"
                        $.ajax({
                              url: queryURL,
                              type: "GET",
                              dataType: "json",
                              success: function (data) {
                                    //console.log(data)
                                    $("#uvi").text("UV Index: " + data.current.uvi);
                                    //console.log(data.current.uvi)

                                    //0-2 low, 3-7 moderate to warning, 8+ very high to extreme
                                    if (data.current.uvi <= 2) {
                                          $("#uvi").addClass("low")
                                          $(".uviIndicator").text("Low risk")
                                    } else if (data.current.uvi > 2 == data.current.uvi < 8) {
                                          $("#uvi").addClass("moderate")
                                          $("uviIndicator").text("Moderate risk")
                                    } else {
                                          $("#uvi").addClass("High")
                                          $("uviIndicator").text("High risk")
                                    }
                                    $("#uvi").append(uviIndex);
                              }
                        });
                  }
            });
      }

      function getFiveDay(city) {
            $.ajax({
                  type: "GET",
                  url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial",
                  dataType: "json",
                  success: function (data) {

                        //loop over over list
                        for (let i = 0; i < data.list.length; i++) {

                              if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {

                                    var colDiv = $("<div>").addClass("col-md-2");
                                    var card = $("<div>").addClass("forecastCard")
                                    var day = $("<h4>").text(new Date(data.list[i].dt_txt).toLocaleDateString())
                                    var maxT = $("<p>").text("Temperature: " + data.list[i].main.temp_max + "F");
                                    var humid = $("<p>").text("Humidity: " + data.list[i].main.humidity + "%")

                                    card.append(day, maxT, humid);
                                    colDiv.append(card);
                                    $(".forecast").append(colDiv);
                              }
                        }
                  }
            });
      }
});
//searchButton.addEventListener('click', cityName)

function savedSearch(theCity) {
      if (theCity !== "") {
            if (cityName.indexOf(theCity) == -1) {
                  cityName.unshift(theCity);
                  if (cityName.length > 5) {
                        cityName.pop();
                  }
                  localStorage["cityName"] = JSON.stringify(cityName);
            }
      }
}

if (localStorage["cityName"]) {
      $("#savedList").empty()
      cityName = JSON.parse(localStorage.getItem("cityName"))

      for (i = 0; i < cityName.length; i++) {
            var searchCities = $("<a>").addClass("list-group-item");
            searchCities.text(cityName[i]);

            searchCities.click(function (event) {
                  event.preventDefault()
                  $(".forecast").empty()
                  $(".uviIndicator").removeClass("low moderate High")
                  var theCity = event.target.text
                  getWeather(theCity);
            })
            $("#savedList").append(searchCities);
      }

}


