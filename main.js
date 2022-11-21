export const mapContainer = document.getElementById("map-container");
const theBody = document.getElementById("theBody");
const form = document.createElement("form");
let query;
form.classList.add("search-form");
form.setAttribute("autocomplete", "off");
theBody.appendChild(form);
export let lat = 51.5072;
export let long = -0.1186;
export let view = 14;
let searchInput = "";
import { showPlaces } from "./main2";
//create Leaflet map container
export const map = L.map("map-container", {
  minZoom: 14,
}).setView([lat, long], view);
export const clickedLayerGroup = L.layerGroup().addTo(map);
export const currentMarkers = [];
export let clickedData = {};
import { theSearchInput } from "./main3";

// OSM basemap layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// const apiKey = "YOUR_API_KEY";
// import { vectorBasemapLayer } from "esri-leaflet-vector";
// vectorBasemapLayer("e16f851bdec647edba0498e186a5329c", {
//   apiKey: apiKey,
// }).addTo(map);

//Nominatim Results
query = "[51.5072, -0.1186]";
queryResults(query);
function queryResults(query) {
  fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=post+office+in+${query}`
  )
    .then((res) => res.json())
    .then((jResult) => {
      lat = jResult[0].lat;
      long = jResult[0].lon;
      showThePlaces(jResult);
    });
}

// SEARCH FIELD
function handleSearch() {
  searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Enter address, city or zip code");
  searchInput.setAttribute("id", "search");
  form.appendChild(searchInput);
  let button = document.createElement("button");
  button.setAttribute("id", "search-button");
  button.classList.add("btn", "btn-primary");
  button.innerHTML = "Search";
  form.appendChild(button);
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = searchInput.value;
    queryResults(input);
  });
  document
    .getElementById("search-button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const input = searchInput.value;
      queryResults(input);
    });
}
handleSearch();

function showThePlaces(jResult) {
  for (const marker of currentMarkers) {
    map.removeLayer(marker);
  }
  map.setView([lat, long], view);
  for (const result of jResult) {
    const position = new L.LatLng(result.lat, result.lon);
    currentMarkers.push(
      new L.marker(position).addTo(map).bindTooltip(() => {
        return L.Util.template(`<b>Name: </b>${result.display_name}<br/>`);
      })
    );
  }
}

if (searchInput == "") {
  theSearchInput.addTo(map);
}

// //handle getting results
if (!query) {
  const results = L.layerGroup().addTo(map);
  theSearchInput.on("results", (data) => {
    results.clearLayers();
    for (let i = data.results.length - 1; i >= 0; i--) {
      const lat = data.results[i].latlng.lat;
      const long = data.results[i].latlng.lng;
      map.setView(new L.LatLng(lat, long), view);
    }
    showPlaces();
  });
  showPlaces();
}
