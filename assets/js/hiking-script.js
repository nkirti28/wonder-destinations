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

  var cityName = capitalizeFirstLetter(inputCityEl.value);

  var stateName = stateInputEl.value;
  getTrailData(cityName, stateName);

  // clear input elements
  inputCityEl.value = "";
  stateInputEl.value = "";
};

// pass city and state name to api to get trail data
var getTrailData = function (cityName, stateName) {
  trailDiv.innerHTML = "";

  if (stateName === "") {
    modalAlert();
    return;
  }

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
          var name = trail.name;
          var activities = trail.activities;
          var dir = trail.directions;
          if (trail.name) {
            displayTrailinfo(name, activities, dir);
          }
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
  searchDiv.classList.add("has-background-grey-light");
  searchDiv.classList.add("box");

  var searchHeader = document.createElement("h3");
  searchHeader.textContent = "Recent Searches:";
  searchHeader.classList = "title has-text-warning";
  searchDiv.appendChild(searchHeader);

  var cityDiv = document.createElement("div");
  cityDiv.classList = "columns is-flex-wrap-wrap is-centered";
  searchDiv.appendChild(cityDiv);

  searchedCities.forEach(function ({ city, state }) {
    var btnDiv = document.createElement("div");
    btnDiv.classList = "column is-one-fifth";
    // console.log(city, state);

    var historyBtn = document.createElement("button");
    historyBtn.textContent = city + " " + state;
    historyBtn.classList = "button is-dark is-fullwidth";

    cityDiv.appendChild(btnDiv);
    btnDiv.appendChild(historyBtn);
    // var cityState = historyBtn.textContent;

    historyBtn.addEventListener("click", getBtnValue);
  });
  var clearDiv = document.createElement("div");
  clearDiv.classList = "column is-full is-flex is-justify-content-center";
  var clearBtn = document.createElement("button");
  clearBtn.classList = "button is-dark";
  clearBtn.textContent = "Clear History";

  cityDiv.appendChild(clearDiv);
  clearDiv.appendChild(clearBtn);
  clearBtn.addEventListener("click", clearHistory);
};

var clearHistory = function () {
  searchDiv.innerHTML = "";
  searchedCities = [];
  cities = [];
  searchDiv.classList.remove("has-background-grey-light", "box");
  localStorage.clear();
};

// get button value to return to input
var getBtnValue = function (event) {
  console.log(event.target.textContent);
  var [city, state] = event.target.textContent.split(" ");

  getTrailData(city, state);
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
  trailDir.innerHTML = dir;

  trailDiv.appendChild(trailCard);
  trailCard.append(trailHeader, dirHeader, trailDir);

  var hiking = activities.hiking;

  if (hiking) {
    var hikingHeader = document.createElement("h5");
    hikingHeader.textContent = "Hiking:";
    hikingHeader.classList = "title is-6 mb-2";

    var hikingInfo = document.createElement("p");
    hikingInfo.innerHTML = "Trail Descripton: " + hiking.description;
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
    bikingInfo.innerHTML = "Trail Descripton:" + biking.description;
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

$(".navbar-burger").click(function () {
  // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
  $(".navbar-burger").toggleClass("is-active");
  $(".navbar-menu").toggleClass("is-active");
});

loadStorage();

cityBtn.addEventListener("click", getCityName);
modalEl.addEventListener("click", closeModal);
