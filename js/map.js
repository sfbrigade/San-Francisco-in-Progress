var tooltipTemplate = function tooltipTemplate(data){
	var template = _.template($("#tooltip").html());
	return template(data);
};

var bindFilterEvents = function bindFilterEvents(){
	// Add event listeners to filter checkboxes
	$(".map-legend > .filter-status > input").on('change', setStatusFilter);
	$(".map-legend > .filter-type > input").on('change', setTypeFilter);
	$("#sidebar input").on('change', setNeighborhoodFilter);
	$("#select-all").on('click', selectAllNeighborhoods);
	$("#clear-all").on('click', clearAllNeighborhoods);

	// //make all neighborhoods look selected
	$("#sidebar input").prop("checked", true);
};

var selectAllNeighborhoods = function selectallNeighborhoods(){
	$("#sidebar input").prop("checked", true);
	filterMapboxMarkers(NEIGHBORHOODS, 'neighborhood');
};

var clearAllNeighborhoods = function clearAllNeighborhoods(){
	$("#sidebar input").prop("checked", false);
	filterMapboxMarkers([], 'neighborhood');
};

var setNeighborhoodFilter = function setNeighborhoodFilter(){
	// make new api request or use mapbox to filter markers?
	// the mapbox filtering way:
	var checkedHoods = $("#sidebar input:checked");
	// TODO: make this an object w/ all the neighborhoods instead 
	var include = [];
	_.each(checkedHoods, function(input){
		//TODO: instead, mark as true in the object
		include.push($(input).attr('name'));
	});
	filterMapboxMarkers(include, 'neighborhood');
};

var setStatusFilter = function setStatusFilter(){
	var checkedBoxes = $(".filter-status input:checked");
	var include = {};
	_.each(checkedBoxes, function(input){
		include.push($(input).attr('name'));
	});
	filterMapboxMarkers(include, 'statusCategory');
};

var setTypeFilter = function setTypeFilter(){
	console.log("type filter called!");
	var checkedBoxes = $(".filter-type input:checked");
	var include = {};
	_.each(checkedBoxes, function(input){
		include.push($(input).attr('name'));
	});
	filterMapboxMarkers(include, 'zoning');
};


var filterMapboxMarkers = function filterMapboxMarkers(include, prop){
	// include is an array of the categories to keep
	// prop is the property we're filtering by
	window.map.markers.setFilter(function(marker){
		//TODO: need to make this way more efficient
		// instead, just return whether that property is marked as true in the passed object
		// (object lookup time way faster than the implicit for-loop in _.contains)
		return _.contains(include, marker.properties[prop]);
	});
};

var initializeMap = function initializeMap(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	var map = L.mapbox.map('map-container', 'jmcelroy.k6hc0kie', {
		zoomControl: false,
		legendControl: {
			position: 'bottomright'
		}
	}).setView([37.77, -122.44], 13);
	// putting zoom control in top-right corner
	new L.Control.Zoom({ position: 'topright' }).addTo(map);
	return map;
};

var placeMarkers = function(data){

	var geoJSON = createGeoJson(data);
	var markerLayer = L.mapbox.featureLayer();
	// so we can access markers from other components
	window.map.markers = markerLayer;

	// define custom HTML for popups
	markerLayer.on('layeradd', function(e){
		var marker = e.layer;
		var markerProps = marker.feature.properties;
		var popupContent = tooltipTemplate({
			address: markerProps.address,
			neighborhood: markerProps.neighborhood,
			description: markerProps.description,
			zoning: markerProps.zoning,
			units: markerProps.units,
			status: markerProps.status
		});
		marker.bindPopup(popupContent);
	});

	// Add them all to the map 
	markerLayer.setGeoJSON(geoJSON);
	markerLayer.addTo(window.map);

	//add filter control panel
	bindFilterEvents();
};

var getDataFromSocrata = function getDataFromSocrata(options, cb){
	var url = 'https://data.sfgov.org/resource/n5ik-nmm3.json?$select=';
	var token = '$$app_token=883SzTf4cdhMIegNNLYOLM0YR'
	var fields = FIELDS;
	for (var i = 0; i < fields.length; i++){
		if (i === 0) url += fields[i];
		else url += ',' + fields[i];
	}
	// url += token;
	$.get(url, function(data){
		cb(data);
	});
};

var createGeoJson = function createGeoJson(projects){

	var featureCollection = {
		type: "FeatureCollection",
		features: []
	};

	var markerType;
	for (var i = 0; i < projects.length; i++) {

		switch (projects[i].zoning_generalized) {
			case "Commercial" || "Neighborhood Commercial":
				zoning = "commercial";
				markerType = "commercial";
				break;
			case "Public":
				zoning = "public";
				markerType = "town-hall";
				break;
			case "Residential" || "High Density Residential":
				zoning = "residential";
				markerType = "building";
				break;
			case "Mixed Use":
				zoning = "mixeduse";
				markerType = "town";
				break;
			case "Industrial":
				zoning = "industrial";
				markerType = "industrial";
				break;
			default:
				markerType = "building";
		}

		var markerColor;
		var status = projects[i].beststat_group.trim();

		if (status === "Construction") {
			statusCategory = "construction";
			markerColor = "#04ff54"; //green
		}
		else if (status.substring(0,2) === "PL" || status.substring(0,2) === "Pl") {
			statusCategory = "planning";
			markerColor = "#307de1"; //blue
		}
		else if (status.substring(0,2) === "BP") {
			statusCategory = "building";
			markerColor = '#ff3b52'; //red
		}

		// parse address string
		var address = projects[i].location_1.human_address.split(",");
		address = address[0].substring(11).replace(/["']/g, "");

		featureCollection.features.push({
    		type: "Feature",
	        geometry: {
	        	"type": "Point", 
	        	"coordinates": [projects[i].location_1.longitude, projects[i].location_1.latitude]
	        },
	        properties: {
		        address: address,
		        neighborhood: projects[i].planning_neighborhood,
		        description: projects[i].planning_project_description || projects[i].dbi_project_description,
		     	zoning: zoning,
		        units: projects[i].units,
		        status: projects[i].beststat_group,
		        statusCategory: statusCategory,
		        'marker-size': 'medium',
		        'marker-color': markerColor, 
		        'marker-symbol': markerType
    		}
		});
	}

	return featureCollection;
};

// Variable names from dataset

var FIELDS = [
	'location_1', 
	'planning_neighborhood', 
	'planning_project_description', 
	'dbi_project_description',
	'zoning_generalized',
	'units',
	'beststat_group'
];

var NEIGHBORHOODS = [
	"Balboa Park",
	"Bayshore",
	"Bernal Heights",
	"Buena Vista",
	"BVHP Area A,B", 
	"Candlestick",
	"Central",
	"Central Waterfront",
	"Downtown",
	"East SoMa",
	"Executive Park",
	"HP Shipyard",
	"India Basin",
	"Ingleside, Other",
	"Inner Sunset",
	"Japantown",
	"Marina",
	"Market Octavia",
	"Mission",
	"Mission Bay",
	"Northeast",
	"Outer Sunset",
	"Park Merced",
	"Richmond",
	"Rincon Hill",
	"Showpl/Potrero",
	"South Central, Other",
	"South of Market, Other",
	"TB Combo",
	"VisVal",
	"Western Addition",		
	"WSoMa"
];

$(document).ready(function() {
	window.map = initializeMap();
	getDataFromSocrata({}, placeMarkers);
});