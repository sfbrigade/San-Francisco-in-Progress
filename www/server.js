// SETUP
// ================================================
var express = require('express')
, bodyParser = require('body-parser')
, mongoose = require('mongoose')
, path = require('path')
, request = require('request')
, geocoder = require('node-geocoder')('google','https', {apiKey:'AIzaSyBtoo72MlIo8Dwq0QPIAmAXIZWyrAAr9CQ'});

// create server
var app = express();

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// where to serve static content
app.use( express.static(path.join(__dirname, '/assets')));

// set our port
var port = process.env.PORT || 5000;

// DATABASE
// ================================================

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
	, latitude: Number
	, longitude: Number
	, coordinates: Array
});

// database model
var Project = mongoose.model('Project', projectSchema);


// ROUTES
// ================================================

// landing page
app.get('/', function(req,resp){
	resp.sendFile('./assets/index.html');
});

// interactive map page
app.get('/map', function(req,resp){
	resp.sendFile(path.join(__dirname, '/assets', '/map.html'));
});

// form for admins to add new projects to the database
app.get('/admin/form', function(req, resp) {
	resp.sendFile(path.join(__dirname, '/assets', 'adminForm.html'));
});

app.post('/admin/form', function(req, resp) {
	var saveProject = function(coords) {
		var project = new Project({
			address: req.body.address || ''
			, neighborhood: req.body.neighborhood || ''
			, description: req.body.description || ''
			, zoning: req.body.zoning || ''
			, units: req.body.units	|| null
			, status: req.body.status || ''
			, statusCategory: determineStatusCategory(req.body.status)
			, coordinates: [coords.latitude, coords.longitude]
		});

		project.save(function(err){
			if(err){
				resp.send(err);
			}
			resp.json({message:"Project posted"});
		});
	}

	geocode(req.body.address, function(latitude,longitude) {
		saveProject({"latitude": latitude, "longitude": longitude});
	}.bind(this));
})

// save a new project
app.post('/projects', function(req, resp) {
	var project = new Project({
		address: req.body.address || ''
		, neighborhood: req.body.neighborhood || ''
		, description: req.body.description || ''
		, zoning: req.body.zoning || ''
		, units: req.body.units	|| null
		, status: req.body.status || ''
		, statusCategory: req.body.statusCategory || ''
		, coordinates: req.body.coordinates
	});

	project.save(function(err){
		if(err){
			resp.send(err);
		}
		resp.json({message:"Project posted"});
	});

});

// return a list of all the projects
app.get('/projects', function(req, resp){
	return Project.find(function(err, projects){
		if (err){
			resp.send(err);
		}
		resp.json(projects);
	});
});

app.get('/projects/:project_id', function(req, resp){
	var projects = [];
	var id = mongoose.Types.ObjectId(req.params.project_id);

	return Project.findById(id, function(err, project){
		if(err){
			resp.send(err);
		}
		resp.json(project);
	});
});

// .put
// .delete

// START THE SERVER
// ================================================
app.listen(port);
console.log('SF in Progress is running. \n\n Open your browser and navigate to localhost:' + port + '/');


// UTILITY FUNCTIONS
// ================================================

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

var geocode = function geocode(address, callback) {
	geocoder.geocode(address, function(err, resp) {
		if (!err && resp.length) {
			callback(resp[0].longitude, resp[0].latitude)
		}
	});
}
