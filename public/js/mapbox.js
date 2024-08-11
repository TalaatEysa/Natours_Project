import { token } from "./mapAccessToken";
export const displayMap = (locations) => {
  mapboxgl.accessToken = token;
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/talaateysa/clzn50wb6007401qx88a6ch41',
    scrollZoom: false,
    //   projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    //   zoom: 10,
    // center: [-118.113491, 34.111745],
    // interactive: false
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}

