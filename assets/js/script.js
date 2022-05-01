$(document).ready(function () {
  var APIKey = "d6ab865b32d84e9ca4e3a42e1135f832";
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
  function showData(data) {
    locationId = data[0].result_object.location_id;
    let destination = data[0].result_object.location_string;
    console.log(locationId + " " + destination);
    $("#destination").html(destination);
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
      getPlacesData(placeName);
    }
  });
});
