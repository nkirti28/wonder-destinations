var FormEl = document.querySelector("#city-form");
var inputCityEl = document.querySelector("#city-name");
var cityBtn = document.querySelector("#city-button");
var stateInputEl = document.querySelector("#state");
var trailDiv = document.querySelector("#trail-div");
var modalEl = document.querySelector("#alert-modal");
var searchDiv = document.querySelector("#search-div");
var searchedCities = [];
var cities = [];

// get name of destination city and state
var getCityName = function (event) {
  event.preventDefault();

  // make sure 1st letter of city is uppercase
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  cityName = capitalizeFirstLetter(inputCityEl.value);

  var stateName = stateInputEl.value;
  getTrailData(cityName, stateName);

  // clear input elements
  inputCityEl.value = "";
  stateInputEl.value = "";
  trailDiv.innerHTML = "";
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
    "&q-state_cont=" +
    stateName +
    "&radius=25";

  fetch(apiUrl, options).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var trails = Object.values(data);
        console.log(trails);

        trails.forEach(function (trail) {
          // if (trail.city === cityName && trail.state === stateName) {
          //   console.log(trail.city, trail.state);
          var name = trail.name;
          var activities = trail.activities;
          var dir = trail.directions;

          displayTrailinfo(name, activities, dir);
          // }
          // } else {
          //   console.log("one");
          //   // modalAlert();
          //   return;
          // }
        });

        // check to see if cityName is already in localstorage
        searchedCities.forEach(function (search) {
          cities.push(search.city);
        });

        if (cities.includes(cityName)) {
          return;
        }

        // create object to store search data
        var search = {
          city: cityName,
          state: stateName,
        };

        searchedCities.push(search);
        console.log(searchedCities);
        saveSearch(searchedCities);
        createBtns(searchedCities);
      });
    } else {
      modalAlert();
      console.log("two");
      return;
    }
  });
};

// create button with searched destinations
var createBtns = function (searchedCities) {
  searchDiv.innerHTML = "";

  var searchHeader = document.createElement("h3");
  searchHeader.textContent = "Recent Searches:";
  searchHeader.classList = "title has-text-warning";
  searchDiv.appendChild(searchHeader);

  var cityDiv = document.createElement("div");
  cityDiv.classList = "columns";
  searchDiv.appendChild(cityDiv);

  searchedCities.forEach(function (search) {
    var city = search.city;
    var state = search.state;
    var btnDiv = document.createElement("div");
    btnDiv.classList = "column is-one-fifth";
    console.log(city, state);

    var citybtn = document.createElement("button");
    citybtn.textContent = city + " " + state;
    citybtn.classList = "button is-dark is-fullwidth";

    cityDiv.appendChild(btnDiv);
    btnDiv.appendChild(citybtn);
  });
};

// Function to display results on screen
var displayTrailinfo = function (trail, activities, dir) {
  var trailCard = document.createElement("div");
  trailCard.classList =
    "trail-card box has-background-grey-light has-text-white";
  var trailHeader = document.createElement("h4");
  trailHeader.classList = "title is-4 has-text-warning";
  trailHeader.textContent = trail + ":";

  var dirHeader = document.createElement("h5");
  dirHeader.textContent = "Directions:";
  dirHeader.classList = "title is-6 mb-2";
  var trailDir = document.createElement("p");
  trailDir.classList = "mb-4";
  trailDir.textContent = dir;

  trailDiv.appendChild(trailCard);
  trailCard.append(trailHeader, dirHeader, trailDir);

  var hiking = activities.hiking;

  if (hiking) {
    var hikingHeader = document.createElement("h5");
    hikingHeader.textContent = "Hiking:";
    hikingHeader.classList = "title is-6 mb-2";

    var hikingInfo = document.createElement("p");
    hikingInfo.textContent = "Trail Descripton: " + hiking.description;
    hikingInfo.classList = "mb-3";
    trailCard.append(hikingHeader, hikingInfo);
  } else {
    var noHiking = document.createElement("h5");
    noHiking.textContent = "No Hiking Available Here";
    noHiking.classList = "title is-6 mb-3";
    trailCard.appendChild(noHiking);
  }

  var biking = activities["mountain biking"];
  if (biking) {
    var bikingHeader = document.createElement("h5");
    bikingHeader.textContent = "Mountain Biking:";
    bikingHeader.classList = "title is-6 mb-2";

    var bikingInfo = document.createElement("p");
    bikingInfo.textContent = "Trail Descripton:" + biking.description;
    bikingInfo.classList = "mb-3";
    var bikingUrl = document.createElement("a");
    bikingUrl.textContent = "Click Here For More Info";
    bikingUrl.setAttribute("href", biking.url);
    bikingUrl.setAttribute("target", "_blank");
    bikingUrl.classList = "mb-3";

    trailCard.append(bikingHeader, bikingInfo, bikingUrl);
  } else {
    var noBiking = document.createElement("h5");
    noBiking.textContent = "No Mountain Biking Available Here";
    noBiking.classList = "title is-6 mb-3";
    trailCard.appendChild(noBiking);
  }

  var camping = activities.camping;
  if (camping) {
    var campingHeader = document.createElement("h5");
    campingHeader.textContent = "Camping:";
    campingHeader.classList = "title is-6 mb-2";

    var campingInfo = document.createElement("p");
    campingInfo.textContent = camping.description;

    trailCard.append(campingHeader, campingInfo);
  }

  // console.log(trail, hiking, biking, camping);
};

var modalAlert = function () {
  modalEl.classList.add("is-active");
};

var closeModal = function (event) {
  modalEl.classList.remove("is-active");
};

var saveSearch = function (searchedCities) {
  localStorage.setItem("search", JSON.stringify(searchedCities));
};

var loadStorage = function () {
  searchedCities = JSON.parse(localStorage.getItem("search"));

  if (!searchedCities) {
    searchedCities = [];
    console.log("none");
    return;
  }

  createBtns(searchedCities);
  console.log(searchedCities);
};

loadStorage();

cityBtn.addEventListener("click", getCityName);
modalEl.addEventListener("click", closeModal);
