import {
  theResultList,
  mapContainer,
  lat,
  long,
  view,
  map,
  clickedLayerGroup,
  currentMarkers,
  clickedData,
  clickedIcon,
} from "./main";
const apiKey ="YOUR_API_KEY"

import { geocode } from "esri-leaflet-geocoder";

export function showPlaces() {
  theResultList.innerHTML = "";
  geocode({
    apikey: apiKey,
  })
    .category("Post Office")
    .nearby(map.getCenter(), 1)
    .run(function(err, response) {
      for (const result of response.results) {
        const position = new L.LatLng(result.latlng.lat, result.latlng.lng);
        currentMarkers.push(
          new L.marker(position).addTo(map).bindTooltip(() => {
            return L.Util.template(
              `<b>${result.properties.PlaceName}</b><br/>${result.properties.Place_addr}<br/>${result.properties.Phone}<br /> ${result.properties.URL}`
            );
          })
        );
          
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
        theResultList.classList.add("row", "d-flex", "flex-row", "flex-nowrap");
        theResultList.appendChild(li);
        const clickedIcon = L.icon({
          iconUrl: "picked-color.png",
          iconSize: [50, 78],
          popupAnchor: [-5, -20],
        });
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
