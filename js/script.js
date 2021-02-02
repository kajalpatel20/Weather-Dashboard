$(document).ready(function () {
      var apiKey = "05ec9aa2523ccea7033d8fff74205311";

      var theCity = $("<p>").addClass("theCity myh1");
      $("#cityCurrent").append(theCity);

      var theDate = $("<p>").addClass("theDate")
      $("#cityCurrent").append(theDate);

      var icon = $("<img>").addClass("theIcon");
      $("#cityCurrent").append(icon);

      var uiIndex = $("<p>").addClass("uI");
      var uiIndicator = $("<span>").addClass("uiIndicator");
      $("#cityCurrent").append(uvIndex);
      $("#cityCurrent").append(uvIndicator);

      var forecastHeading = $("<p>").addClass("h3 myH1 text-center mt-4 forecastHeading");
      $("#Heading").append(forecastHeading);

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
                  url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial",
                  dataType: "json",
                  success: function (data) {
                        console.log("successful call", data)
                        //render data to html
                        var card = $("<div>").addClass("card");
                        var temperature = $("<p>").addClass("theTemperature").text("Temperature: " + data.main.temp + " F")
                        var humidity = $("<p>").addClass("theHumidity").text("Humidity: " + data.main.humidity + "%");
                        var windSpeed = $("<p>").addClass("theWindSpeed").text("Wind Speed " + data.wind.speed + " MPH");
                        var title = $("<h2>").addClass("currentTitle").text(data.name);
                        // console.log("http://openweathermap.org/img/w/" + data.weather[0].icon )
                        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

                        //append to card, append card to html 
                        title.append(img)
                        card.append(title, temperature, humidity, windSpeed);
                        $("#cityCurrent").append(card);
                        //call function for 5 day
                        getFiveDay(cityName);
                        //call function for UI
                  }
            })

      }

      function getFiveDay(city) {
            $.ajax({
                  type: "GET",
                  url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial",
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
            })
      }






})

