var tooltipTemplate = function(data){
	var template = _.template($("#tooltip").html());
	return template(data);
};

var addLegend = function(){
	var template = _.template($("#legend").html());
	var html = template();
	window.map.legendControl.addLegend(html);

	// Add event listeners to project status filters
	$(".map-legend > .filter > input").on('change', setStatusFilter);
};

var setStatusFilter = function(){
	var checkedBoxes = $(".filter input:checked");
	var filters = [];
	_.each(checkedBoxes, function(input){
		filters.push($(input).attr('name'));
	});
	window.map.markers.setFilter(function(marker){
		return _.contains(filters, marker.properties.statusCategory);
	});
};

var initializeMap = function(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	var map = L.mapbox.map('map-container', 'jmcelroy.k6hc0kie')
		.setView([37.78, -122.40], 12);
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

	//add legend
	addLegend();
};

var getData = function(cb){
	$.get('https://data.sfgov.org/resource/n5ik-nmm3.json', function(data){
		cb(data);
	});
};

var createGeoJson = function(projects){

	var featureCollection = {
		type: "FeatureCollection",
		features: []
	};

	var markerType;
	for (var i = 0; i < projects.length; i++) {

		switch (projects[i].zoning_generalized) {
			case "Commercial" || "Neighborhood Commercial":
				markerType = "commercial";
				break;
			case "Public":
				markerType = "town-hall";
				break;
			case "Residential" || "High Density Residential":
				markerType = "building";
				break;
			case "Mixed Use":
				markerType = "town";
				break;
			case "Industrial":
				markerType = "warehouse";
				break;
			default:
				markerType = "building";
		}

		var markerColor;
		var status;
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
		     	zoning: projects[i].zoning_generalized,
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

$(document).ready(function() {
	window.map = initializeMap();
	getData(placeMarkers);
});