const apiKey = "YOUR_API_KEY";

import {
  geosearch,
  arcgisOnlineProvider,
} from "esri-leaflet-geocoder";

export const theSearchInput = geosearch({
  position: "topright",
  placeholder: "Enter an address, city, or zip code",
  useMapBounds: false,
  providers: [
    arcgisOnlineProvider({
      apikey: apiKey,
    }),
  ],
});
