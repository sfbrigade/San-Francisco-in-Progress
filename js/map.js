
var initializeMap = function(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	var map = L.mapbox.map('map-container', 'jmcelroy.k6hc0kie')
		.setView([37.78, -122.40], 12);
	return map;
};

var createGeoJson = function(){

}

var getDummyData = function(){
	return {
		"address": "2201 8TH AVE", 
		"latitude": 47.617259979248, 
		"id": "3018580", 
		"longitude": -122.339668273926, 
		"status": "in_review"
	};
};

$(document).ready(function() {
	initializeMap();
});