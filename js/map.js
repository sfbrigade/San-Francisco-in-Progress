var initializeMap = function(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	var map = L.mapbox.map('map-container', 'jmcelroy.k6hc0kie')
		.setView([37.78, -122.40], 12);
	return map;
};

var placeMarkers = function(){
	var geoJSON = getDummyData();
	L.mapbox.featureLayer(geoJSON).addTo(window.map);
};

var getDummyData = function(){

	// TODO: get json from api
	// massage into geojson format

	return { 
		"type": "FeatureCollection",
    	"features": [{ 
    		"type": "Feature",
	        "geometry": {
	        	"type": "Point", 
	        	"coordinates": [-122.4, 37.78]
	        }, // long/lat
	        "properties": {
	        	"prop0": "value0"
	    	}
	    }]
	};
};

$(document).ready(function() {
	window.map = initializeMap();
	placeMarkers();
});