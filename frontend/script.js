// Instead of fetching from an API, load the data directly (simulate import)
const placesData = {
  "paris": [
    { name: "Eiffel Tower", address: "Champ de Mars, 5 Avenue Anatole, Paris", lat: 48.8584, lng: 2.2945, image:"/assets/images/eiffel.jpeg" },
    { name: "Louvre Museum", address: "Rue de Rivoli, Paris", lat: 48.8606, lng: 2.3376, image:"/assets/images/louvre.jpeg" },
    { name: "Notre-Dame Cathedral", address: "6 Parvis Notre-Dame, Paris", lat: 48.8530, lng: 2.3499, image: "/assets/images/notre-dame.jpg" }
  ],
  "new york": [
    { name: "Statue of Liberty", address: "Liberty Island, New York", lat: 40.6892, lng: -74.0445, image: "/assets/images/statueofliberty.jpg" },
    { name: "Central Park", address: "New York, NY", lat: 40.7851, lng: -73.9683, image: "/assets/images/central.jpeg" },
    { name: "Times Square", address: "Manhattan, NY 10036", lat: 40.7580, lng: -73.9855, image: "/assets/images/timessquare.jpg" }
  ],
  "london": [
    { name: "Big Ben", address: "Westminster, London SW1A 0AA, UK", lat: 51.5007, lng: -0.1246, image: "/assets/images/bigben.jpeg" },
    { name: "London Eye", address: "Riverside Building, County Hall, London", lat: 51.5033, lng: -0.1195, image: "/assets/images/londoneye.jpeg" },
    { name: "Tower of London", address: "St Katharine's & Wapping, London", lat: 51.5081, lng: -0.0759, image: "/assets/images/toweroflondon.jpeg" }
  ],
  "hyderabad": [
    { name: 'Charminar', address: 'Charminar Rd, Hyderabad', lat: 17.3616, lng: 78.4747, image:"/assets/images/charminar.jpeg" },
    { name: 'Golconda Fort', address: 'Ibrahim Bagh, Hyderabad', lat: 17.3833, lng: 78.4011, image:"/assets/images/golconda.jpeg" }
  ],
 "vizag": [
    { name: 'RK Beach', address: 'RK Beach Road, Visakhapatnam', lat: 17.7100, lng: 83.3160, image: "/assets/images/rkbeach.webp"},
    { name: 'Kailasagiri', address: 'Kailasagiri Hilltop Park, Vizag', lat: 17.7452, lng: 83.3422, image:"/assets/images/kailasagiri.jpeg" }
  ],
  "chennai": [
    { name: 'Marina Beach', address: 'Marina Beach Road, Chennai', lat: 13.0500, lng: 80.2824, image:"/assets/images/marina.jpeg"},
    { name: 'Fort St. George', address: 'Rajaji Salai, Chennai', lat: 13.0827, lng: 80.2875, image: "/assets/images/fortstgeorge.jpeg" }
  ],
  "mumbai": [
    { name: 'Gateway of India', address: 'Apollo Bandar, Colaba, Mumbai', lat: 18.9218, lng: 72.8347, image:"/assets/images/gateway.jpeg"},
    { name: 'Marine Drive', address: 'Netaji Subhash Chandra Bose Road, Mumbai', lat: 18.9430, lng: 72.8238, image:"/assets/images/marinedrive.jpeg"}
  ],
  "tirupati": [
    { name: 'Tirumala Temple', address: 'Sree Vari Temple Rd, Tirupati', lat: 13.6833, lng: 79.3500, image:"/assets/images/tirumala.jpeg"},
    { name: 'Sri Padmavathi Ammavari Temple', address: 'Tiruchanur, Tirupati', lat: 13.6111, lng: 79.4171, image:"/assets/images/padmavati.jpeg" }
  ],
  delhi: [
  { name: 'India Gate', address: 'Rajpath Marg, New Delhi', lat: 28.6129, lng: 77.2295, image:"/assets/images/india.avif"},
  { name: 'Red Fort', address: 'Netaji Subhash Marg, Chandni Chowk, New Delhi', lat: 28.6562, lng: 77.2410, image:"/assets/images/redfort.jpeg"},
  { name: 'Qutub Minar', address: 'Seth Sarai, Mehrauli, New Delhi', lat: 28.5244, lng: 77.1855, image:"/assets/images/qutubminar.webp" }
]

};

let leafletMap = null;

// Helper to calculate distance (in km) using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
}

document.getElementById('search-btn').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim().toLowerCase();
  if (!city) return alert('Enter a city name!');
  const places = placesData[city] || [];
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';
  if (places.length === 0) {
    placesList.innerHTML = '<p>No tourist places found.</p>';
    document.getElementById('map').innerHTML = '';
    return;
  }

  // Get user's location for distance calculation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => displayPlacesWithDistance(places, pos.coords.latitude, pos.coords.longitude),
      () => displayPlacesWithDistance(places, null, null)
    );
  } else {
    displayPlacesWithDistance(places, null, null);
  }
});

function displayPlacesWithDistance(places, userLat, userLng) {
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = places.map(p => {
    let distanceText = '';
    if (userLat !== null && userLng !== null) {
      const dist = getDistance(userLat, userLng, p.lat, p.lng);
      distanceText = `<br><span class="distance">Distance: ${dist} km</span>`;
    }
    return `
      <div class="place">
        <img src="${p.image}" alt="${p.name}" class="place-photo" onerror="this.style.display='none'">
        <strong>${p.name}</strong><br>
        ${p.address}
        ${distanceText}
      </div>
    `;
  }).join('');
  initMap(places);
}

function initMap(places) {
  const mapDiv = document.getElementById('map');
  if (!places || places.length === 0) return;

  if (typeof L === 'undefined') {
    mapDiv.innerHTML =
      '<div style="padding:12px;border:1px solid #ffe58f;background:#fffbe6;color:#614700;border-radius:8px;">' +
      '<strong>Map library did not load.</strong> Check your network or try again.' +
      '</div>';
    return;
  }

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  mapDiv.innerHTML = '';

  const center = [places[0].lat, places[0].lng];
  leafletMap = L.map(mapDiv).setView(center, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(leafletMap);

  const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
  places.forEach(p => {
    L.marker([p.lat, p.lng]).addTo(leafletMap).bindPopup(p.name);
  });
  leafletMap.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
}