var request = require('request');
var mongoose = require('mongoose');

// connect to database
mongoose.connect( 'mongodb://jmcelroy:sfinprogress@ds061731.mongolab.com:61731/sf-in-progress');

// database schema
var projectSchema = new mongoose.Schema({
	address: String
	, neighborhood: String
	, description: String
	, zoning: String
	, units: Number	
	, status: String
	, statusCategory: String
	, coordinates: Array
	, sponsorFirm: String
});

// database model
var Project = mongoose.model('Project', projectSchema);

var socrataURL = 'https://data.sfgov.org/resource/ra2x-jzmk.json';

var determineZoning = function determineZoning (zoningGeneralized) {
	var zoning;

	switch (zoningGeneralized) {
		case "Residential" || "High Density Residential":
			zoning = "Residential";
			break;
		case "Mixed Use":
			zoning = "Mixed Use";
			break;
		default:
			zoning = "Other";
	}

	return zoning;
};

var determineStatusCategory = function determineStatusCategory(status) {
	var statusCategory;

	if (status === "Construction") {
		statusCategory = "construction";
	}
	else if (status.substring(0,2) === "PL" || status.substring(0,2) === "Pl") {
		statusCategory = "planning";
	}
	else if (status.substring(0,2) === "BP") {
		statusCategory = "building";
	}

	return statusCategory;
};

var readableAddress = function readableAddress(address) {
	address = address.split(",");
	address = address[0].substring(11).replace(/["']/g, "");
	return address;
};

// get data from socrata api and store it in db
request(socrataURL, function(error, response, body) {
	if (!error && response.statusCode == 200) {

		var projects = JSON.parse(body);

		projects.forEach(function(project) {
			if (project.zoning_generalized == 'Mixed Use' ||
				project.zoning_generalized == 'High Density Residential' ||
				project.zoning_generalized == 'Residential') {
				var newProject = new Project({
					address: readableAddress(project.location_1.human_address)
					, neighborhood: project.planning_neighborhood
					, description: project.planning_project_description || project.dbi_project_description
					, zoning: determineZoning(project.zoning_generalized)
					, units: project.units
					, status: project.beststat_group
					, statusCategory: determineStatusCategory(project.beststat_group.trim())
					, coordinates: [project.location_1.longitude, project.location_1.latitude]
					, sponsorFirm: project.sponsor_firm
				});

				newProject.save(function(err){
					if (err) console.log('ERR :(', err);
					else console.log(newProject.address, 'SAVED!');
				});
			}
		});
	}
});




