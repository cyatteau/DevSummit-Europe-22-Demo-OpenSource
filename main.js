const resultList = document.getElementById("result-list");
const mapContainer = document.getElementById("map-container");
let lat = 51.5072;
let long = -0.1186;
let view = 13;
import { vectorBasemapLayer } from "esri-leaflet-vector";
import {
  geosearch,
  arcgisOnlineProvider,
  geocode,
} from "esri-leaflet-geocoder";

//create Leaflet map container
const map = L.map(mapContainer).setView([lat, long], view);

// OSM basemap layer
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// maxZoom: 13,
// attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);

// // CUSTOM basemap layer
const apiKey = "YOUR_API_KEY";
vectorBasemapLayer("e16f851bdec647edba0498e186a5329c", {
  apiKey: apiKey,
}).addTo(map);

// search field
// const searchInput = document.getElementById("search");
// document.querySelector("form").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const input = searchInput.value;
//   queryResults(input);
// });
// document.getElementById("search-button").addEventListener("click", (event) => {
//   event.preventDefault();
//   const input = searchInput.value;
//   queryResults(input);
// });

// search field

const searchInput = geosearch({
  position: "topright",
  placeholder: "Enter an address, city, or zip code",
  useMapBounds: false,
  providers: [
    arcgisOnlineProvider({
      apikey: apiKey,
    }),
  ],
}).addTo(map);

const clickedLayerGroup = L.layerGroup().addTo(map);
const currentMarkers = [];
let clickedData = {};

//create special icon
const clickedIcon = L.icon({
  iconUrl: "picked-color.png",
  iconSize: [50, 78],
  popupAnchor: [-5, -20],
});

//handle getting results with Nominatim
// let query = "[51.5072, -0.1186]";
// queryResults(query);
// function queryResults(query) {
//   fetch(
//     `https://nominatim.openstreetmap.org/search?format=json&q=post+office+in+${query}`
//   )
//     .then((res) => res.json())
//     .then((jResult) => {
//       lat = jResult[0].lat;
//       long = jResult[0].lon;
//       showPlaces(jResult);
//     });
// }
// function showPlaces(jResult) {
//   resultList.innerHTML = "";
//   for (const marker of currentMarkers) {
//     map.removeLayer(marker);
//   }
//   map.setView([lat, long], view);

//   //placing markers at locations
//   for (const result of jResult) {
//     const position = new L.LatLng(result.lat, result.lon);
//     currentMarkers.push(
//       new L.marker(position).addTo(map).bindTooltip(() => {
//         return L.Util.template(`<b>Name: </b>${result.display_name}<br/>`);
//       })
//     );

//     //handle list of places on left
//     const li = document.createElement("li");
//     li.classList.add("list-items");
//     li.classList.add("card", "col-4");
//     resultList.classList.add("row", "d-flex", "flex-row", "flex-nowrap");
//     console.log(result);
//     li.innerHTML = result.display_name;
//     const latiLongi = { lat: result.lat, lon: result.lon };
//     resultList.appendChild(li);

//     //handling map movement & special icon on location click from list
//     li.addEventListener("click", (event) => {
//       for (const child of resultList.children) {
//         child.classList.remove("active");
//       }
//       clickedLayerGroup.clearLayers();
//       event.target.classList.add("active");
//       map.setView(latiLongi, 13);

//       L.marker(position, { icon: clickedIcon })
//         .addTo(clickedLayerGroup)
//         .bindTooltip(() => {
//           return L.Util.template(`<b>Name: </b>${result.display_name}<br/>`);
//         });
//     });
//   }
// }

// //handle getting results
const results = L.layerGroup().addTo(map);
searchInput.on("results", (data) => {
  results.clearLayers();
  for (let i = data.results.length - 1; i >= 0; i--) {
    const lat = data.results[i].latlng.lat;
    const long = data.results[i].latlng.lng;
    map.setView(new L.LatLng(lat, long), view);
  }
  while (resultList.firstChild) {
    resultList.removeChild(resultList.firstChild);
  }
  showPlaces();
});

function showPlaces() {
  resultList.innerHTML = "";
  geocode({
    apikey: apiKey,
  })
    .category("Post Office")
    .nearby(map.getCenter(), 1)
    .run(function(err, response) {
      //placing markers at locations
      for (const result of response.results) {
        const position = new L.LatLng(result.latlng.lat, result.latlng.lng);
        currentMarkers.push(
          new L.marker(position).addTo(map).bindTooltip(() => {
            return L.Util.template(
              `<b>${result.properties.PlaceName}</b><br/>${result.properties.Place_addr}<br/>${result.properties.Phone}<br /> ${result.properties.URL}`
            );
          })
        );

        //handle list of places on left
        const li = document.createElement("li");
        li.classList.add("list-items");
        li.classList.add("card", "col-4");
        let stuff = document.createElement("div");
        stuff.classList.add("card-body");
        li.appendChild(stuff);
        let title = document.createElement("div");
        title.classList.add("class-title");
        title.innerHTML = `${result.properties.PlaceName}`;
        stuff.appendChild(title);
        let text = document.createElement("div");
        text.classList.add("card-text");
        text.innerHTML = `${result.properties.Place_addr}<br /> ${result.properties.Phone}`;
        stuff.appendChild(text);

        console.log(result.properties);
        const latiLongi = {
          lat: result.properties.Y,
          lon: result.properties.X,
        };
        resultList.classList.add("row", "d-flex", "flex-row", "flex-nowrap");

        resultList.appendChild(li);

        //create special icon
        const clickedIcon = L.icon({
          iconUrl: "picked-color.png",
          iconSize: [50, 78],
          popupAnchor: [-5, -20],
        });

        //handling map movement & special icon on location click from list
        li.addEventListener("click", (event) => {
          clickedLayerGroup.clearLayers();
          clickedData = latiLongi;
          const position = new L.LatLng(clickedData.lat, clickedData.lon);
          map.flyTo(position, view);

          L.marker(position, { icon: clickedIcon })
            .addTo(clickedLayerGroup)
            .bindTooltip(() => {
              return L.Util.template(
                `<b>${result.properties.PlaceName}</b><br/>${result.properties.Place_addr}<br/>${result.properties.Phone}<br /> ${result.properties.URL}`
              );
            });
        });
      }
    });
}
showPlaces();
