var initializeMap = function(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	var map = L.mapbox.map('map-container', 'jmcelroy.k6hc0kie')
		.setView([37.78, -122.40], 12);
	return map;
};

var placeMarkers = function(){
	var geoJSON = createGeoJson(dummyData);
	L.mapbox.featureLayer(geoJSON).addTo(window.map);
};


var createGeoJson = function(data){

	var featureCollection = {
		type: "FeatureCollection",
		features: []
	};

	for (var i = 0; i < data.length; i++) {
		featureCollection.features.push({
    		type: "Feature",
	        geometry: {
	        	"type": "Point", 
	        	"coordinates": [data[i].longitude, data[i].latitude]
	        },
	        properties: {
		        title: 'Development Name',
		        description: 'Project description',
		        'marker-size': 'medium',
		        'marker-color': '#f44',
		        'marker-symbol': 'commercial'
    		}
		});
	}

	return featureCollection;
};

// e.g. of JSON from Seattle in Progress:
// {"address": "2201 8TH AVE", "
// latitude": 47.617259979248, 
// "id": "3018580", 
// "longitude": -122.339668273926, 
// "status": "in_review"}

// TODO: get actual json from api
var dummyData = [
	{
		latitude: 37.785935700000003,
		longitude: -122.40076120000001
	},
	{
		latitude: 37.775286399999999, 
		longitude: -122.4159598
	},
		{
		latitude: 37.795060900000003, 
		longitude: -122.419425
	},
	{
		latitude: 37.795891599999997, 
		longitude: -122.4005452
	},
	{
		latitude: 37.802238000000003, 
		longitude: -122.42105100000001
	}
]

$(document).ready(function() {
	window.map = initializeMap();
	placeMarkers();
});