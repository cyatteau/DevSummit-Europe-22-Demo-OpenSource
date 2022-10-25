import {
  map,
  currentMarkers,

} from "./main";
const apiKey = "YOUR_API_KEY";
import { geocode } from "esri-leaflet-geocoder";

export function showPlaces() {
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
      }
    });
}
