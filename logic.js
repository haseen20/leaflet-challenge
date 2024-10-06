// Create the map object
var map = L.map('mapid').setView([37.09, -95.71], 5);

// Add a tile layer (the background map image) to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// URL for Earthquake Data (last 7 days)
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the GeoJSON data
fetch(queryUrl)
    .then(response => response.json())
    .then(data => {
        // Function to determine marker size based on magnitude
        function markerSize(magnitude) {
            return magnitude * 4;
        }

        // Function to determine marker color based on depth
        function markerColor(depth) {
            return depth > 90 ? '#ff3333' :
                   depth > 70 ? '#ff6633' :
                   depth > 50 ? '#ff9933' :
                   depth > 30 ? '#ffcc33' :
                   depth > 10 ? '#ffff33' : '#ccff33';
        }

        // Add GeoJSON data to the map with markers
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.geometry.coordinates[2]), // depth is the third coordinate
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            // Bind a popup to each marker with additional information
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            }
        }).addTo(map);
    })
    .catch(error => console.error("Error fetching earthquake data: ", error));
