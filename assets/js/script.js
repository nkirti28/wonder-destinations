$(document).ready(function () {
  // var APIKey = "d6ab865b32d84e9ca4e3a42e1135f832";
  var weatherAPIKey = "a518a026feaedaffc332be5dc7ca9090";

  function getPlacesData(placeName) {
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://travel-advisor.p.rapidapi.com/locations/search?query=${placeName}&limit=5&offset=0&units=mi&location_id=1&currency=USD&sort=relevance&lang=en_US`,
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        "X-RapidAPI-Key": "3c69a6e2femshc47d60619dc07a6p155110jsn3a3631249438",
      },
    };

    $.ajax(settings)
      .done(function (response) {
        showData(response);
        showCarouselData(response);
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
      let widget = show(response);
      let lon = response.coord.lon;
      let lat = response.coord.lat;
      $("#current-weather").html(widget);
    });
  }
  function showData(response) {
    locationId = response.data[0].result_object.location_id;
    let country = response.data[0].result_object.ancestors[1].name;
    let destinationStr = response.data[0].result_object.location_string;
    let destinationGeoInfo = response.data[0].result_object.geo_description;
    let log = response.data[0].result_object.latitude;
    let lat = response.data[0].result_object.longitude;
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

  function showCarouselData(response) {
    $("#Slide1").attr(
      "src",
      response.data[0].result_object.photo.images.large.url
    );
    $("#Slide2").attr(
      "src",
      response.data[1].result_object.photo.images.large.url
    );
    $("#Slide3").attr(
      "src",
      response.data[2].result_object.photo.images.large.url
    );
    $("#Slide4").attr(
      "src",
      response.data[3].result_object.photo.images.large.url
    );
    $("#Slide5").attr(
      "src",
      response.data[4].result_object.photo.images.large.url
    );
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
      // console.log(placeName);
      getPlacesData(placeName);
      getCurrentWeatherData(placeName);
    }
  });
});

// Initialize all div with carousel class
var carousels = bulmaCarousel.attach(".carousel", {
  initialSlide: 0,
  slidesToShow: 1,
  navigation: true,
  navigationKeys: true,
});

// Loop on each carousel initialized
for (var i = 0; i < carousels.length; i++) {
  // Add listener to  event
  carousels[i].on("before:show", (state) => {
    console.log(state);
  });
}

// Access to bulmaCarousel instance of an element
var element = $("#my-element");
if (element && element.bulmaCarousel) {
  // bulmaCarousel instance is available as element.bulmaCarousel
  element.bulmaCarousel.on("before-show", function (state) {
    console.log(state);
  });
}
