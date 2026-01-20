maptilersdk.config.apiKey = maptilerApiKey;

const newDiveSpotConfig = { coordinates: [0, 0], zoom: -0.1, newDiveSpot: true };

const mapConfig = typeof diveSpot !== "undefined"
  ? { coordinates: diveSpot.geometry.coordinates, zoom: 13, newDiveSpot: false }
  : newDiveSpotConfig;

// initialize marker
let marker = new maptilersdk.Marker();

let longitude = document.getElementById("longitude");
let latitude = document.getElementById("latitude");
let clearButton = document.getElementById("clear-button");
let resetButton = document.getElementById("reset-button");

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.BRIGHT,
  center: mapConfig.coordinates, // starting position [lng, lat]
  zoom: mapConfig.zoom // starting zoom
});

// add on-click handler
map.on("click", (e) => {
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
if (!mapConfig.newDiveSpot) {
  // add it to the map
  marker = new maptilersdk.Marker().setLngLat(mapConfig.coordinates);
  marker.addTo(map);

  // update the form
  longitude.value = mapConfig.coordinates[0];
  latitude.value = mapConfig.coordinates[1];
}

// functions for clearing the map
function clearMap() {
  marker.remove();
  longitude.value = null;
  latitude.vlue = null;
};

function resetMap() {
  if (mapConfig.newDiveSpot) {
    clearMap();
  } else {
    marker.remove();
    marker = new maptilersdk.Marker().setLngLat(mapConfig.coordinates);
    marker.addTo(map);
    longitude.value = mapConfig.coordinates[0];
    latitude.value = mapConfig.coordinates[1];
  }
};

// add the onclick handlers
clearButton.onclick = clearMap;
resetButton.onclick = resetMap;