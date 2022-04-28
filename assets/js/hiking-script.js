var FormEl = document.querySelector("#city-form");
var inputCityEl = document.querySelector("#city-name");
var cityBtn = document.querySelector("#city-button");
var stateInputEl = document.querySelector("#state");

// get name of destination city and state
var getCityName = function (event) {
  event.preventDefault();
  var cityName = inputCityEl.value;
  var stateName = stateInputEl.value;
  console.log(cityName, stateName);
  getTrailData(cityName, stateName);
};

// pass city and state name to api to get trail data
var getTrailData = function (cityName, stateName) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "trailapi-trailapi.p.rapidapi.com",
      "X-RapidAPI-Key": "18d3b9654cmsha5ebf2c1065fd78p175daajsn36225a7c99f6",
    },
  };

  var apiUrl =
    "https://trailapi-trailapi.p.rapidapi.com/activity/?lat=34.1&limit=25&lon=-105.2&q-city_cont=" +
    cityName +
    "&radius=25";

  fetch(apiUrl, options).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var trails = Object.values(data);
        console.log(trails);
        trails.forEach(function (trail) {
          if (trail.city === cityName && trail.state === stateName) {
            console.log(trail.name);
          }
        });
      });
    }
  });
  // .catch((err) => console.error(err));
};

cityBtn.addEventListener("click", getCityName);
