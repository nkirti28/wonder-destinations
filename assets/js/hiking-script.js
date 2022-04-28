// var apiUrl = "https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat" + lat + "&"

// const options = {
//   method: "GET",
//   headers: {
//     "X-RapidAPI-Host": "trailapi-trailapi.p.rapidapi.com",
//     "X-RapidAPI-Key": "18d3b9654cmsha5ebf2c1065fd78p175daajsn36225a7c99f6",
//   },
// };

// fetch(
//   "https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=39.7392&lon=104.9903&radius-5",
//   options
// )
//   .then((response) => response.json())
//   .then((response) => console.log(response))
//   .catch((err) => console.error(err));

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "trailapi-trailapi.p.rapidapi.com",
    "X-RapidAPI-Key": "18d3b9654cmsha5ebf2c1065fd78p175daajsn36225a7c99f6",
  },
};
var cityName = "lawrence";

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
        console.log(trail.name);
      });
    });
  }
});
//   .catch((err) => console.error(err));
