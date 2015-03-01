var TOOLTIP = _.template($("#tooltip").html());

var initializeMap = function(){
	L.mapbox.accessToken = 'pk.eyJ1Ijoiam1jZWxyb3kiLCJhIjoiVVg5eHZldyJ9.FFzKtamuKHb_8_b_6fAOFg';
	var map = L.mapbox.map('map-container', 'jmcelroy.k6hc0kie')
		.setView([37.78, -122.40], 12);
	return map;
};

var placeMarkers = function(data){

	var geoJSON = createGeoJson(data);

	var markerLayer = L.mapbox.featureLayer();

	// define custom HTML for popups
	markerLayer.on('layeradd', function(e){
		var marker = e.layer;
		var markerProps = marker.feature.properties;

		var popupContent = TOOLTIP({
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

var getData = function(){
	$.get('https://data.sfgov.org/resource/n5ik-nmm3.json', function(data){
		placeMarkers(data);
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

		var status = projects[i].beststat_group.trim();

		if (status === "Construction") {
			markerColor = "#04ff54";
		}
		else if (status.substring(0,2) === "PL" || status.substring(0,2) === "Pl") {
			markerColor = '#f44';
		}
		else if (status.substring(0,2) === "BP") {
			markerColor = "#307de1";
		}

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
		        'marker-size': 'medium',
		        'marker-color': markerColor, // color code according to status?
		        'marker-symbol': markerType
    		}
		});
	}

	return featureCollection;
};

$(document).ready(function() {
	window.map = initializeMap();
	getData();
});