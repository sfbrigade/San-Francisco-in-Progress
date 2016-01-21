// globals for the map
var cachedGeoJSON;
var markerClusterGroup;
var markerLayer;
var map;

$(document).ready(function() {
	initializeMap();
	bindEvents();
});

// instantiate Backbone event listener
var eventBus = _.extend({}, Backbone.Events)

var initializeMap = function initializeMap(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	map = L.mapbox.map('map-container', 'mapbox.light', {
			zoomControl: false,
			legendControl: {
				position: 'bottomright'
			}
		}).setView([37.77, -122.47], 13),
		spinner = new Spinner().spin();

	// putting zoom control in top-right corner
	new L.Control.Zoom({ position: 'topright' }).addTo(map);

	// Show spinner on top of the map while data is loading
	$('#map-container').append(spinner.el);

	// get data and place markers when it returns
	fetchAllProjects(function(data) {
		spinner.stop();

		cachedGeoJSON = createGeoJSON(data);
		placeMarkers(cachedGeoJSON);
	});
	return map;
};

// fetch all projects from database (handled by server.js)
var fetchAllProjects = function(callback) {
	$.get('/projects', function(data) {
		callback(data);
	});
};

// given a list of projects, convert them to geoJSON objects
var createGeoJSON = function createGeoJSON(projects){
	var featureCollection = {
		type: "FeatureCollection",
		features: []
	};

	_.each(projects, function (project) {
		if (isNaN(project.coordinates[0])) return

        // TODO distinguish key projects
        var defaultColor = "#5BC9E3";
        var keyProjectsColor = "#1E658A";
        var markerColor = defaultColor;

        if(isNaN(project.coordinates[0])) {
			project.coordinates = [0, 0];
		}
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
		        units: project.units || 'Units unknown',
		        status: project.status || 'No status specified',
		        statusCategory: project.statusCategory ||'No status specified',
		        picture: project.picture || '',
                hearings: project.hearings || [],
		        sponsorFirm: project.sponsorFirm || '',
                zoning: project.zoning || 'Zoning not specified',
		        'marker-size': 'medium',
		        'marker-color': markerColor,
    		}
		};
		featureCollection.features.push(
			markerGeoJson);

	});
	return featureCollection;
};

// given an array of geoJSON objects, add them to the map as a markerLayer
var placeMarkers = function(geoJSON){
	console.log(geoJSON);

	markerClusterGroup = new L.MarkerClusterGroup();

    // add a layer for each geoJSON object
	markerLayer = L.mapbox.featureLayer(geoJSON)
		.setFilter(filterMapboxMarkers)
		.eachLayer(function(layer){
			markerClusterGroup.addLayer(layer);
		});

	map.addLayer(markerClusterGroup);

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
};

// object that keeps track of which filter boxes are selected/unselected
var FilterState = Backbone.NestedModel.extend({
  defaults: {
    'minimumUnits': 0,
    'projectSelected': null,
    'developmentType': {
      "Mixed Use": true,
      "Residential": true
	},
    'neighborhood': {
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
  'projectStatus': {
    "construction": true,
    "planning": true,
    "building": true
  }
  }
})

var filterState = new FilterState();

/* given a marker, check whether it should be shown based on
 * the current filter state
 */
var filterMapboxMarkers = function filterMapboxMarkers(marker){
	if (marker && filterState.get('neighborhood.'.concat(marker.properties.neighborhood)) &&
		filterState.get('projectStatus.'.concat(marker.properties.statusCategory)) &&
		filterState.get('developmentType.'.concat(marker.properties.zoning))) {
		if (parseInt(marker.properties.units) >= filterState.get('minimumUnits')) {
			return true;
		}
		return false
	}
    return false;
	// TODO: Make a loading indicator appear because this is slow
};

var setOneActiveMarker = function(marker) {
	map.markers.setGeoJSON(marker);
}

var tooltipTemplate = function tooltipTemplate(data){
	var template = _.template($("#tooltip").html());
	return template(data);
};

// Add event listeners to filter checkboxes so they update the filter state
var bindEvents = function bindFilterEvents(){
  // listener for projectStatus filter
  $("#legend .filter-status input").on('click', function(e){
    var property = $(e.currentTarget).attr('name');
    var newVal = $(e.currentTarget).prop('checked');
    filterState.set('projectStatus.'.concat(property), newVal);
  });
  // listener for developmentType filter
  $("#legend .filter-type input").on('click', function(e){
    var property = $(e.currentTarget).attr('name');
    var newVal = $(e.currentTarget).prop('checked');
    filterState.set('developmentType.'.concat(property), newVal);
  });
  // listener for neighborhood filter
  $("#sidebar input").on('click', function(e){
    var property = $(e.currentTarget).attr('name');
    var newVal = $(e.currentTarget).prop('checked');
    filterState.set('neighborhood.'.concat(property), newVal);
  });
  // listener for select all neighborhoods
  $("#select-all").on('click', function(){
    setAllNeighborhoods(true);
  });
  // listener for clear all neighborhoods
  $("#clear-all").on('click', function(){
    setAllNeighborhoods(false);
  });

  // make all checkboxes look selected
  $("#sidebar input").prop("checked", true);
  $("#legend input").prop("checked", true);

  // set up slider for unit range -- Eric
  $("#min_units").on('change', function(e) {
    filterState.set('minimumUnits', e.target.value);
  });

  $("#min_units").on('change input', function(e) {
    $("#min_units_display").html(e.target.value);
  });

  $( "#collapse" ).accordion({
    collapsible: true,
    active: false,
    heightStyle: 'content'
  });

  // when an individual marker is clicked, hide sidebar
  eventBus.on('select:project', function onShowProfile() {
    $('#sidebar .btn').addClass('hidden');
  })
  // when a project profile is dismissed, show all markers again
  eventBus.on('close:profile', function onCloseProfile() {
    $('#sidebar .btn').removeClass('hidden');
    showAllMarkers();
  });

  $('#sidebar .btn').click(function(e) {
    if ($(this).hasClass('btn-info')) return;
    $('#sidebar .btn').toggleClass('btn-info btn-link'); // change active button
    $('#projectProfile-container').toggleClass('hidden'); // hide/show project list
    $('#projectList-container').toggleClass('hidden'); // hide/show project list
    $('#filter-container').toggleClass('hidden'); // hide/show filters
  });

};

// when the filter state changes, refresh the markers
filterState.bind('change', function(model, newVal){
    console.log('filter state changed');
    markerClusterGroup.clearLayers();
    markerLayer.setFilter(filterMapboxMarkers)
               .eachLayer(function(layer){
                    markerClusterGroup.addLayer(layer)
               })

    console.log('filters applied');
})

// either show or hide all neighborhoods
var setAllNeighborhoods = function(newVal){
    // newVal is a boolean: true to select all and false to clear all
    $("#sidebar input").prop("checked", newVal);
    _.each(filterState.get('neighborhood'), function(val, key){
    	filterState.set('neighborhood.'.concat(key), newVal);
    });
}

var showAllMarkers = function() {
	markerLayer.setGeoJSON(cachedGeoJSON)
	markerLayer.setFilter(filterMapboxMarkers)
}
