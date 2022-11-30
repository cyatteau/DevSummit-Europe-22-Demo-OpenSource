# Esri European Developer Summit 2022: Demo for Open Source

## Description
This is a demostration of a post office asset locator. The application starts out using Leaflet with the OpenStreetMap basemap layer along with Nominatim API for the search function. A few switches are made to improve the application by using ArcGIS location services and a custom basemap layer. 

## Live Demo Clip
![Demo1_Live_Clip](https://user-images.githubusercontent.com/112517097/200379813-1748ef5a-6b39-46f3-a45f-113597cfcceb.gif)

## Live Demos
- [Demo](https://post-office-locator-leaflet-nominatim.netlify.app/) with Leaflet + Nominatim
- [Demo](https://esri-leaflet-postoffice-asset-locator.netlify.app/) with Esri Leaflet + ArcGIS Location Services

## Deploy the App to your Netlify
This button allows you to create a copy of the application to your Github account and a deployed version to your Netlify account. Be sure to add the environment variable API_SECRET with the value set as your API Key. <br/><br/>
<a target="_blank" href="https://app.netlify.com/start/deploy?repository=https://github.com/cyatteau/Deployed_Demo1_Euro22_DevSummit"><img src="https://www.netlify.com/img/deploy/button.svg"></img></a>

## Required Dependencies <a name="dep"></a>

- `npm install leaflet --save`. Find API Reference info [here]().
- `npm install esri-leaflet-vector --save`. Find API Reference info [here]().
- `npm install esri-leaflet-geocoder --save`. Find API Reference info [here]().

## Other Requirements <a name="req"></a>

- Sign up for an [ArcGIS Developer Account](https://developers.arcgis.com/sign-up/)
- Get an API Key. Find video instructions [here](https://www.youtube.com/watch?v=StVncn6DLzc.).
