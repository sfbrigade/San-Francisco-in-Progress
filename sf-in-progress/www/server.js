// SETUP
// ================================================
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

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
mongoose.connect( 'mongodb://localhost/sfinprogress' );

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
});

// database model
var Project = mongoose.model('Project', projectSchema);


// ROUTES
// ================================================

// map page
app.get('/', function(req,resp){
	resp.sendfile('index.html');
});

app.get('/map', function(req,resp){
	resp.sendfile('assets/map.html');
});

// save a new project
app.post('/projects', function(req, resp){
	var project = new Project({
		address: req.body.address
		, neighborhood: req.body.neighborhood
		, description: req.body.description
		, zoning: req.body.zoning
		, units: req.body.units	
		, status: req.body.status
		, statusCategory: req.body.statusCategory
		, coordinates: req.body.coordinates // []?
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

	return Project.findById(project_id, function(err, project){
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
console.log('Magic happening on port ' + port);



