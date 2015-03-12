var tooltipTemplate = function tooltipTemplate(data){
	var template = _.template($("#tooltip").html());
	return template(data);
};

var bindFilterEvents = function bindFilterEvents(){
	// Add event listeners to filter checkboxes
	$("#legend .filter-status input").on('click', function(e){
		var property = $(e.currentTarget).attr('name');
		var newVal = $(e.currentTarget).prop('checked');
		filterState.setOne(property, newVal, 'projectStatus');
	});
	$("#legend .filter-type input").on('click', function(e){
		var property = $(e.currentTarget).attr('name');
		var newVal = $(e.currentTarget).prop('checked');
		filterState.setOne(property, newVal, 'developmentType');
	});
	$("#sidebar input").on('click', function(e){
		var property = $(e.currentTarget).attr('name');
		var newVal = $(e.currentTarget).prop('checked');
		filterState.setOne(property, newVal, 'neighborhood');
	});
	$("#select-all").on('click', function(){
		filterState.setAllNeighborhoods(true);
	});
	$("#clear-all").on('click', function(){
		filterState.setAllNeighborhoods(false);
	});
	//make all checkboxes look selected
	$("#sidebar input").prop("checked", true);
	$("#legend input").prop("checked", true);

    (function() {
        var hidden = false;

        $("#filter_toggle").on('click', function(e) {
            hidden = !hidden;

            if(hidden) {
                $("#legend").addClass("minimized");
                $("#filter_toggle").html("Show");
            } else {
                $("#legend").removeClass("minimized");
                $("#filter_toggle").html("Hide");
            }
        });
    })();
};

var initializeMap = function initializeMap(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	var map = L.mapbox.map('map-container', 'jmcelroy.k6hc0kie', {
		zoomControl: false,
		legendControl: {
			position: 'bottomright'
		}
	}).setView([37.77, -122.42], 13);
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
				zoning = "Commercial";
				markerType = "commercial";
				break;
			case "Public":
				zoning = "Public";
				markerType = "town-hall";
				break;
			case "Residential" || "High Density Residential":
				zoning = "Residential";
				markerType = "building";
				break;
			case "Mixed Use":
				zoning = "Mixed Use";
				markerType = "town";
				break;
			case "Industrial":
				zoning = "Industrial";
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

var neighborhoods = [
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

var filterState = {
	neighborhood: {},
	developmentType: {
		"Commercial": true,
		"Industrial": true,
		"Mixed Use": true,
		"Public": true,
		"Residential": true
	},
	projectStatus: {
		"construction": true,
		"planning": true,
		"building": true
	},
	setOne: function(property, newVal, filterToSet){
		// newVal is a boolean 
		this[filterToSet][property] = newVal;
		filterMapboxMarkers();
	},
	setAllNeighborhoods: function(set){
		// set is a boolean: true to select all and false to clear all
		$("#sidebar input").prop("checked", set);
		_.each(this.neighborhood, function(val, key){
			filterState.neighborhood[key] = set;
		});
		filterMapboxMarkers();
	}
};

// populating intial neighborhood state because im too lazy 
// to re-type the list in object form 
_.each(neighborhoods, function(neighborhood){
	filterState.neighborhood[neighborhood] = true;
});

var filterMapboxMarkers = function filterMapboxMarkers(){
	// this function tells mapbox to filter markers 
	// to reflect the current filter state
	window.map.markers.setFilter(function(marker){
		if (filterState.neighborhood[marker.properties.neighborhood] &&
			filterState.projectStatus[marker.properties.statusCategory] &&
			filterState.developmentType[marker.properties.zoning]) {
			return true;
		} else return false;
	});
	// TODO: make a loading indicator appear bc this is slow
};

$(document).ready(function() {
	window.map = initializeMap();
	getDataFromSocrata({}, placeMarkers);
	bindFilterEvents();
});
