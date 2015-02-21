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
		        title: data[i].address,
		        description: data[i].description,
		        'marker-size': 'medium',
		        'marker-color': '#f44', // color code according to status?
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
		description: 'Expansion of SFMOMA to SE with 40,000-sf gallery wing at Natoma Street, acquisition and replacement of Heald College building on Howard Street with 62,000-sf new construction for back-of-house and admin functions, vacation of portion of Hunt Alley',
		address: '151 Third Street 94103',
		latitude: 37.785935700000003,
		longitude: -122.40076120000001
	},
	{	
		description: 'THC/Citizens Housing (MOH) proposal for 100% affordable housing project, 15-story, w/ 18 parking spaces and 3,640-gsf retail at ground level.',
		address: '1400 Mission St',
		latitude: 37.775286399999999, 
		longitude: -122.4159598
	},
	{
		description: 'Convert warehouse building to 9 residential units and 21 off-street parking spaces.',
		address: '1469 Pacific Av',
		latitude: 37.795060900000003, 
		longitude: -122.419425
	},
	{	
		description: 'The proposed project would include the temporary removal of the existing Golden Gateway Tennis and Swim Club facility and the new construction of two mixed use buildings and outdoor health club facilities. The new buildings would include 170 residential units.',
		address: '8 Washington Street',
		latitude: 37.795891599999997, 
		longitude: -122.4005452
	},
	{
		description: 'Construction of a new 4-story, 2-unit residential building.',
		address: '2626 Larkin St',
		latitude: 37.802238000000003, 
		longitude: -122.42105100000001
	}
];

$(document).ready(function() {
	window.map = initializeMap();
	placeMarkers();
});