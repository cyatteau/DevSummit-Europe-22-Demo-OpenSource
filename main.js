export const resultList = document.getElementById("result-list");
export const theResultList = document.getElementById("result-list");
resultList.innerHTML = "";
export const mapContainer = document.getElementById("map-container");
const theBody = document.getElementById("theBody");
const form = document.createElement("form");
let li, query;
form.classList.add("search-form");
form.setAttribute("autocomplete", "off");
theBody.appendChild(form);
export let lat = 51.5072;
export let long = -0.1186;
export let view = 13;
let searchInput = "";
//create special icon
export const clickedIcon = L.icon({
  iconUrl: "picked-color.png",
  iconSize: [50, 78],
  popupAnchor: [-5, -20],
});
import { showPlaces } from "./main3";
//create Leaflet map container
export const map = L.map(mapContainer).setView([lat, long], view);
export const clickedLayerGroup = L.layerGroup().addTo(map);
export const currentMarkers = [];
export let clickedData = {};
import { theSearchInput } from "./main2";

// OSM basemap layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 13,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// // CUSTOM basemap layer
// const apiKey ="YOUR_API_KEY"
// import { vectorBasemapLayer } from "esri-leaflet-vector";
// vectorBasemapLayer("OSM:Standard", {
//   apiKey: apiKey,
// }).addTo(map);

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

if (searchInput == "") {
  theSearchInput.addTo(map);
}

//handle getting results with Nominatim
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
function showThePlaces(jResult) {
  resultList.innerHTML = "";
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
    li = document.createElement("li");
    li.classList.add("list-items");
    li.classList.add("card", "col-4");
    resultList.classList.add("row", "d-flex", "flex-row", "flex-nowrap");
    console.log(result);
    li.innerHTML = result.display_name;
    const latiLongi = { lat: result.lat, lon: result.lon };
    resultList.appendChild(li);
    li.addEventListener("click", (event) => {
      for (const child of resultList.children) {
        child.classList.remove("active");
      }
      clickedLayerGroup.clearLayers();
      event.target.classList.add("active");
      map.setView(latiLongi, 13);
      L.marker(position, { icon: clickedIcon })
        .addTo(clickedLayerGroup)
        .bindTooltip(() => {
          return L.Util.template(`<b>Name: </b>${result.display_name}<br/>`);
        });
    });
  }
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
    while (theResultList.firstChild) {
      theResultList.removeChild(theResultList.firstChild);
    }
    showPlaces();
  });
  showPlaces();
}
