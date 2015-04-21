var eventBus = _.extend({}, Backbone.Events)

var tooltipTemplate = function tooltipTemplate(data){
	var template = _.template($("#tooltip").html());
	return template(data);
};

var bindEvents = function bindFilterEvents(){
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

	// set up slider for unit range -- Eric
	$("#min_units").on('change', function(e) {
		filterState.minimumUnits = e.target.value;
		filterMapboxMarkers();
	});

	$("#min_units").on('change input', function(e) {
		$("#min_units_display").html(e.target.value);
	});

	$( "#collapse" ).accordion({
      collapsible: true,
      active: false,
      heightStyle: 'content'
    });

	eventBus.on('select:project', function onShowProfile() {
		$('#sidebar .btn').addClass('invisible');
	})
    // when a project profile is dismissed, show all markers again
    eventBus.on('close:profile', function onCloseProfile() {
    	$('#sidebar .btn').removeClass('invisible');
    	showAllMarkers();
    });

    $('#sidebar .btn').click(function(e) {
    	if ($(this).hasClass('btn-info')) return;
    	$('#sidebar .btn').toggleClass('btn-info btn-link'); // change active button
    	$('#projectList-container').toggleClass('invisible'); // hide/show project list
    	$('#filter-container').toggleClass('invisible'); // hide/show filters
    });

};

var initializeMap = function initializeMap(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	// gray tiles: jmcelroy.lje09j35
	var map = L.mapbox.map('map-container', 'examples.map-i86nkdio', {
		zoomControl: false,
		legendControl: {
			position: 'bottomright'
		}
	}).setView([37.77, -122.47], 13);
	// putting zoom control in top-right corner
	new L.Control.Zoom({ position: 'topright' }).addTo(map);
	// get data and place markers when it returns
	fetchAllProjects(function(data) {
		cachedGeoJSON = createGeoJSON(data)
		placeMarkers(cachedGeoJSON)
	});
	return map;
};

var fetchAllProjects = function(callback) {
	$.get('/projects', function(data) {
		callback(data);
	});
};

var fetchOneProject = function(id, callback) {
	$.get('/projects/' + id, function(project) {
		callback(project);
	});
}

var createGeoJSON = function createGeoJSON(projects){
	var featureCollection = {
		type: "FeatureCollection",
		features: []
	};

	_.each(projects, function(project) {
		var markerType;
		switch (project.zoning) {
			case "Residential":
				markerType = "building";
				break;
			case "Mixed Use":
				markerType = "town";
				break;
			default:
				markerType = "building";
		}

		var markerColor;
		if (project.statusCategory === "construction") markerColor = "#04ff54"; //green
		else if (project.statusCategory == "planning") markerColor = "#307de1"; //blue
		else if (project.statusCategory == "building") markerColor = '#ff3b52'; //red

		var markerGeoJson = {
    		type: "Feature",
	        geometry: {
	        	"type": "Point", 
	        	"coordinates": project.coordinates
	        },
	        properties: {
	        	id: project._id,
		        address: project.address || 'Address not specified',
		        neighborhood: project.neighborhood || 'Neighborhood not specified',
		        description: project.description || 'No description',
		     	zoning: project.zoning || 'No zoning specified',
		        units: project.units || 'Units unknown',
		        status: project.status || 'No status specified',
		        statusCategory: project.statusCategory ||'No status specified',
		        picture: project.picture || '',
		        sponsorFirm: project.sponsorFirm || '',
		        'marker-size': 'medium',
		        'marker-color': markerColor || '#cccccc', 
		        'marker-symbol': markerType
    		}
		};
		featureCollection.features.push(
			markerGeoJson);

	});
	return featureCollection;
};


var setOneActiveMarker = function(marker) {
	window.map.markers.setGeoJSON(marker);
}

var placeMarkers = function(geoJSON){

	var markerLayer = L.mapbox.featureLayer(geoJSON)
		.setFilter(filterMapboxMarkers)
		.addTo(window.map)

	markerLayer.on('click', function(e) {
		// suppress Mapbox tooltip
		e.layer.closePopup();
		var project = e.layer.feature.properties
		var marker = e.layer.toGeoJSON();
		// clear all except the active marker
		setOneActiveMarker(marker)
		// trigger event w/ project so profile renders
		eventBus.trigger('select:project', project)
	})

	// so we can access it later
	window.map.markers = markerLayer
};

var showAllMarkers = function() {
	window.map.markers.setGeoJSON(cachedGeoJSON)
	window.map.markers.setFilter(filterMapboxMarkers)
}

var cachedGeoJSON 

var filterState = {
	projectSelected: null,
	neighborhood: {
		"Balboa Park": true,
		"Bayshore": true,
		"Bernal Heights": true,
		"Buena Vista": true,
		"BVHP Area A,B": true,
		"Candlestick": true,
		"Central": true,
		"Central Waterfront": true,
		"Downtown": true,
		"East SoMa": true,
		"Executive Park": true,
		"HP Shipyard": true,
		"India Basin": true,
		"Ingleside, Other": true,
		"Inner Sunset": true,
		"Japantown": true,
		"Marina": true,
		"Market Octavia": true,
		"Mission": true,
		"Mission Bay": true,
		"Northeast": true,
		"Outer Sunset": true,
		"Park Merced": true,
		"Richmond": true,
		"Rincon Hill": true,
		"Showpl/Potrero": true,
		"South Central, Other": true,
		"South of Market, Other": true,
		"TB Combo": true,
		"VisVal": true,
		"Western Addition": true,	
		"WSoMa": true
	},
	minimumUnits: 0,
	developmentType: {
		"Mixed Use": true,
		"Residential": true
	},
	projectStatus: {
		"construction": true,
		"planning": true,
		"building": true
	},
	setOne: function(property, newVal, filterToSet){
		// property is the filter name (e.g. Bayshore)
		// newVal is a boolean (show or not show)
		// filterToSet is the filter category (e.g. neighborhood)
		this[filterToSet][property] = newVal;
		window.map.markers.setFilter(filterMapboxMarkers)
	},
	setAllNeighborhoods: function(set){
		// set is a boolean: true to select all and false to clear all
		$("#sidebar input").prop("checked", set);
		_.each(this.neighborhood, function(val, key){
			filterState.neighborhood[key] = set;
		});
		window.map.markers.setFilter(filterMapboxMarkers)
	}
};

var filterMapboxMarkers = function filterMapboxMarkers(marker){
	// this function tells mapbox to filter markers 
	// to reflect the current filter state
	if (filterState.neighborhood[marker.properties.neighborhood] &&
		filterState.projectStatus[marker.properties.statusCategory] &&
		filterState.developmentType[marker.properties.zoning]) {
		if (parseInt(marker.properties.units) >= filterState.minimumUnits) {
			return true;
		}
		return false
	} 
	else {
		return false;
	}
	// TODO: Make a loading indicator appear because this is slow
};

$(document).ready(function() {
	bindEvents();
	window.map = initializeMap();
});
