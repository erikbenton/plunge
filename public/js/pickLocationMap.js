maptilersdk.config.apiKey = maptilerApiKey;

let mapConfig = typeof diveSpot !== "undefined"
  ? { coordinates: diveSpot.geometry.coordinates, zoom: 13 }
  : { coordinates: [0, 0], zoom: -0.1 };

// initialize marker
let marker = new maptilersdk.Marker();

let longitude = document.getElementById("longitude");
let latitude = document.getElementById("latitude");

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.BRIGHT,
  center: mapConfig.coordinates, // starting position [lng, lat]
  zoom: mapConfig.zoom // starting zoom
});

// add on-click handler
map.on('click', (e) => {
  // remove the original marker
  marker.remove();

  // Create a new marker at the clicked location
  marker = new maptilersdk.Marker().setLngLat(e.lngLat);
  marker.addTo(map);

  // update DiveSpot Lat/Long fields
  longitude.value = e.lngLat.lng;
  latitude.value = e.lngLat.lat;
});

// If a spot has already been chosen
if (typeof diveSpot !== "undefined") {
  // add it to the map
  marker = new maptilersdk.Marker().setLngLat(mapConfig.coordinates);
  marker.addTo(map);

  // update the form
  longitude.value = mapConfig.coordinates[0];
  latitude.value = mapConfig.coordinates[1];
}