var recommendedEventsEl = document.getElementById("recommended-events");
var searchResultsEl = document.getElementById("search-results");
var eventsNearMeEl = document.getElementById("near-me");
var eventsForm = document.getElementById("events-form");

var apiID = "MjY3Mzk1NjZ8MTY1MTAxNzc0NS41MDA4MjU2";
var geoApiKey = "6beb1000c454436794b7f17b1bcae1f5";
var geoApiUrl = "https://api.opencagedata.com/geocode/v1/json";

function createElement(elementType, args) {
  var newElement = document.createElement(elementType);
  if (args.elementClass) newElement.className = args.elementClass;
  if (args.elementText) newElement.textContent = args.elementText;
  if (args.elementAttributes) {
    args.elementAttributes.forEach(function (attribute) {
      newElement.setAttribute(attribute.type, attribute.value);
    });
  }
  if (args.elementParent) args.elementParent.append(newElement);
  return newElement;
}

// Display recommended event cards
var renderNearbyEvents = function (events) {
  var cardsParentEl = createElement("article", {
    elementClass: "columns is-desktop",
  });
  events.forEach(function (event) {
    console.log(event);
    var eventDate = new Date(event.datetime_local);
    var cardContainer = createElement("section", {
      elementClass: "box p-5 column my-3",
      elementParent: cardsParentEl,
    });
    createElement("h2", {
      elementClass: "title is-size-5 is-size-6-desktop",
      elementText: event.short_title,
      elementParent: cardContainer,
    });
    var flexContainer = createElement("div", {
      elementClass: "columns",
      elementParent: cardContainer,
    });
    var textContainer = createElement("div", {
      elementClass: "column is-6-mobile",
      elementParent: flexContainer,
    });
    var imageContainer = createElement("div", {
      elementClass: "column is-6-mobile",
      elementParent: flexContainer,
    });
    createElement("p", {
      elementClass: "is-size-6-desktop",
      elementText: `City: ${event.venue.display_location}`,
      elementParent: textContainer,
    });
    createElement("p", {
      elementClass: "is-size-6-desktop",
      elementText: `Venue: ${event.venue.name}`,
      elementParent: textContainer,
    });
    createElement("p", {
      elementClass: "is-size-6-desktop my-3",
      elementText: `Event Date: ${
        eventDate.getMonth() + 1
      }/${eventDate.getDate()}/${eventDate.getFullYear()}`,
      elementParent: textContainer,
    });
    createElement("img", {
      elementAttributes: [
        { type: "src", value: event.performers[0].image },
        { type: "alt", value: event.performers[0].short_name },
      ],
      elementParent: imageContainer,
    });
    createElement("a", {
      elementText: "Buy Tickets",
      elementAttributes: [
        { type: "href", value: event.url },
        { type: "target", value: "_blank" },
      ],
      elementParent: cardContainer,
    });
  });
  recommendedEventsEl.append(cardsParentEl);
};

// Get recommended events on page load
$("document").ready(function () {
  fetch("https://api.seatgeek.com/2/events?geoip=true&client_id=" + apiID).then(
    function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          // Send three recommendations to be rendered into cards
          renderNearbyEvents(data.events.slice(0, 3));
        });
      } else {
        console.log("something went wrong");
      }
    }
  );
});
// renderRecommendedEventsCards(["test", "test2", "test3"]);

// Render events based on city specified by the user
var renderEventsByCity = function (city, events) {
  searchResultsEl.innerHTML = "";
  var cardsParentEl = document.createElement("section");
  var sectionTitle = document.createElement("p");
  sectionTitle.className = "title is-size-4";
  sectionTitle.textContent = "Results For: " + city;
  cardsParentEl.className = "is-flex is-flex-direction-column";
  events.forEach(function (event) {
    var eventDate = new Date(event.datetime_local);
    var container = document.createElement("section");
    var textContainer = document.createElement("section");
    textContainer.className = "ml-4";
    container.className = "is-flex box mb-3";
    var eventImage = document.createElement("img");
    eventImage.setAttribute("src", event.performers[0].image);
    eventImage.setAttribute("alt", event.performers[0].type);
    var title = document.createElement("h2");
    var locationCityState = document.createElement("p");
    var locationVenue = document.createElement("p");
    var dateEl = document.createElement("p");
    title.className = "title is-size-5";

    title.textContent = event.short_title;
    locationCityState = event.venue.display_location;
    locationVenue.textContent = event.venue.name;

    dateEl.textContent = `Happening On: ${
      eventDate.getMonth() + 1
    }/${eventDate.getDate()}/${eventDate.getFullYear()}`;

    textContainer.append(title, locationVenue, locationCityState, dateEl);
    container.append(eventImage, textContainer);
    cardsParentEl.append(container);
  });
  searchResultsEl.append(sectionTitle, cardsParentEl);
};

// Fetch event data on city specified by the user
var getEventsByCity = function (city, lat, lon) {
  fetch(
    "https://api.seatgeek.com/2/events?lat=" +
      lat +
      "&lon=" +
      lon +
      "&client_id=" +
      apiID
  ).then(function (res) {
    if (res.ok) {
      res.json().then(function (data) {
        renderEventsByCity(city, data.events);
      });
    }
  });
};

// Listen for submit event on form element
eventsForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var cityName = document.getElementById("city-input").value;
  if (!cityName) {
    return;
  }
  var geoRequestUrl =
    geoApiUrl + "?q=" + cityName + "&key=" + geoApiKey + "&pretty=1";
  recommendedEventsEl.classList.add("is-hidden");
  searchResultsEl.classList.remove("is-hidden");
  fetch(geoRequestUrl).then(function (res) {
    if (res.ok) {
      res.json().then(function (data) {
        getEventsByCity(
          data.results[0].formatted,
          data.results[0].geometry.lat,
          data.results[0].geometry.lng
        );
      });
    }
  });
});

$(".navbar-burger").click(function () {
  // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
  $(".navbar-burger").toggleClass("is-active");
  $(".navbar-menu").toggleClass("is-active");
});
