var FormEl = document.querySelector("#city-form");
var inputCityEl = document.querySelector("#city-name");
var cityBtn = document.querySelector("#city-button");
var stateInputEl = document.querySelector("#state");
var trailDiv = document.querySelector("#trail-div");

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
            console.log(trail.city, trail.state);
            var name = trail.name;
            var activities = trail.activities;

            displayTrailinfo(name, activities);
          }
        });
      });
    }
    // .catch((err) => console.error(err));
  });
};

// Function to display results on screen
var displayTrailinfo = function (trail, activities) {
  var trailHeader = document.createElement("h4");
  trailHeader.textContent = trail + ":";

  var hiking = activities.hiking;
  var biking = activities["mountain biking"];
  var camping = activities.camping;
  console.log(trail, hiking, biking, camping);
  trailDiv.appendChild(trailHeader);
};

cityBtn.addEventListener("click", getCityName);
