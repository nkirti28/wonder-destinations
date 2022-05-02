$(document).ready(function () {
  var APIKey = "d6ab865b32d84e9ca4e3a42e1135f832";
  var weatherAPIKey = "a518a026feaedaffc332be5dc7ca9090";

  var locationId = "";
  function getPlacesData(placeName) {
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://travel-advisor.p.rapidapi.com/locations/search?query=${placeName}&limit=1&offset=0&units=mi&location_id=1&currency=USD&sort=relevance&lang=en_US`,
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        "X-RapidAPI-Key": "3c69a6e2femshc47d60619dc07a6p155110jsn3a3631249438",
      },
    };

    $.ajax(settings)
      .done(function (response) {
        console.log(response);
        showData(response);
      })
      .fail(function (response) {
        console.log("Error to get data:" + response["responseText"]);
      });
  }
  function getCurrentWeatherData(placeName) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&units=imperial&appid=${weatherAPIKey}`;

    $.ajax({
      url: queryURL,
      method: "GET",
      datatype: "jsonp",
    }).then(function (response) {
      console.log(response);
      let widget = show(response);
      const lon = response.coord.lon;
      const lat = response.coord.lat;
      $("#current-weather").html(widget);
    });
  }
  function showData(response) {
    locationId = response.data[0].result_object.location_id;
    let country = response.data[0].result_object.ancestors[1].name;
    let destinationStr = response.data[0].result_object.location_string;
    let destinationGeoInfo = response.data[0].result_object.geo_description;
    //console.log(locationId + "-" + destinationStr);
    //console.log(destinationGeoInfo);
    $("#country").html(country);
    $("#destination").html(destinationStr);
    $("#destinationInfo").html(destinationGeoInfo);
  }
  function show(data) {
    // Offset UTC timezone - using moment.js
    let currentTimeUTC = data.dt;
    let currentTimeZoneOffset = data.timezone;
    let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
    let currentMoment = moment
      .unix(currentTimeUTC)
      .utc()
      .utcOffset(currentTimeZoneOffsetHours);

    return `<div id='summary' class='content box has-background-primary'>
      <p class='subtitle'> Today's weather (${currentMoment.format(
        "MM/DD/YYYY"
      )})</p>
      <p class='title'><img class='image' src=https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }.png> ${Math.floor(data.main.temp)}&deg;F </p>
      <p><strong>Weather</strong>: ${data.weather[0].main}</p>
      <p><strong>Min. Temp</strong>: ${Math.floor(
        data.main.temp_min
      )}&deg;F</p><p><strong>Max. Temp</strong>: ${Math.floor(data.main.temp_max)}&deg;F</p>
      <p><strong>Wind Speed</strong>: ${Math.floor(
        data.wind.speed
      )} MPH</p><p><strong>Humidity</strong>: ${data.main.humidity}%</p>
     </div>`;
  }

  // event handlers
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  $("#searchBtn").click(function (e) {
    var placeName = $("#search").val().toLowerCase();

    if (placeName.trim() != "") {
      console.log(placeName);
      //getPlacesData(placeName);
      getCurrentWeatherData(placeName);
    }
  });
});
