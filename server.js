// SETUP
// ================================================
var express = require('express')
, bodyParser = require('body-parser')
, mongoose = require('mongoose')
, path = require('path')
, request = require('request')
, geocoder = require('node-geocoder')('google','https', {apiKey:'AIzaSyBtoo72MlIo8Dwq0QPIAmAXIZWyrAAr9CQ'})

// create server
var app = express()

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// where to serve static content
app.use( express.static('assets') )

// set our port
var port = process.env.PORT || 5000

// DATABASE
// ================================================

// connect to database
mongoose.connect('mongodb://jmcelroy:sfinprogress@ds061731.mongolab.com:61731/sf-in-progress')

// database schema
var projectSchema = new mongoose.Schema({
  address: String
  , city: String
  , neighborhood: String
  , description: String
  , zoning: String
  , units: Number 
  , status: String
  , statusCategory: String
  , picture: String
  , coordinates: Array
  , featured: Boolean
  , sponsorFirm: String
})

var projectHearingSchema = new mongoose.Schema({
  project_id: mongoose.Schema.Types.ObjectId
  , type: String  // continuance, consent, regular, review
  , id: String
  , representative: {
    name: String
    , phone: String
  }
  , description: String
  , preliminary_recommendation: String
  , final_recommendation: String
})

var commissionHearingSchema = new mongoose.Schema({
  start_time: Date
  , end_time: Date
  , address: String
  , agenda: [projectHearingSchema]
})

// database model
var Project = mongoose.model('Project', projectSchema)
var ProjectHearing = mongoose.model('ProjectHearing', projectHearingSchema)
var CommissionHearing = mongoose.model('ComissionHearing', commissionHearingSchema)


// ROUTES
// ================================================

// landing page
app.get('/', function (req,resp){
	resp.sendFile(path.join(__dirname, '/assets', '/index.html'))
})

// interactive map page
app.get('/map', function (req,resp){
	resp.sendFile(path.join(__dirname, '/assets', '/map.html'))
})

// form for admins to add new projects 
app.get('/admin/projects/', function (req, resp) {
	resp.sendFile(path.join(__dirname, '/assets', '/admin-form.html'))
})

// form for admins to update a project
app.get('/admin/projects/:project_id', function (req, resp) {
	resp.sendFile(path.join(__dirname, '/assets', '/admin-form.html'))
})

// return a list of all the projects
app.get('/projects', function (req, resp){
	return Project.find(function (err, projects){
		if (err){
			resp.send(err)
		}
		resp.json(projects)
	})
})

// save a new project
app.post('/projects', function(req, resp) {
	var saveProject = function(coords) {
		var project = new Project({
			address: req.body.address || ''
			, city: req.body.city
			, neighborhood: req.body.neighborhood || ''
			, description: req.body.description || ''
			, zoning: req.body.zoning || ''
			, units: req.body.units	|| null
			, status: req.body.status || ''
			, picture: req.body.picture || ''
			, statusCategory: determineStatusCategory(req.body.status) || ''
			, coordinates: [coords.latitude, coords.longitude] || []
			, featured: req.body.featured || false
			, sponsorFirm: req.body.sponsorFirm || ''
		})

		project.save(function(err){
			if(err){
				resp.send(err)
			}
			resp.json({message: project.address + ' saved'})
		})
	}

	var address = req.body.address + ' ' + req.body.city
	geocode(address, function(latitude,longitude) {
		saveProject({'latitude': latitude, 'longitude': longitude})
	}.bind(this))
})

app.get('/projects/featured', function(req, resp) {
	return Project.find({featured: true}, function(err, projects) {
		if (err) resp.send(err)
		resp.json(projects)
	})
})

// get a particular project
app.get('/projects/:project_id', function(req, resp){
	var id = mongoose.Types.ObjectId(req.params.project_id)

	return Project.findById(id, function(err, project){
		if(err) resp.send(err)
		resp.json(project)
	})
})

// update / replace a particular project
app.post('/projects/:project_id', function(req, resp) {
	var id = mongoose.Types.ObjectId(req.params.project_id)
	var newDoc = req.body
	var options = null
	
	Project.findOneAndUpdate({_id: id}, newDoc, options, function(err, project) {
		project.save()
		resp.sendFile(path.join(__dirname, '/assets', '/project-submitted.html'))
	})
})

app.delete('/projects/:project_id', function(req, resp) {
	var id = mongoose.Types.ObjectId(req.params.project_id)

	Project.findOne({_id: id}, function(err, project) {
		project.remove()
		resp.sendStatus(200)
	})
})

app.all('*', function(req, res){
  res.sendStatus(404);
})

// START THE SERVER
// ================================================
app.listen(port)
console.log('SF in Progress is running. \n Open your browser and navigate to localhost:' + port + '/map')


// UTILITY FUNCTIONS
// ================================================

var determineStatusCategory = function determineStatusCategory(status) {
	var statusCategory

	if (status === "Construction") {
		statusCategory = "construction"
	}
	else if (status.substring(0,2) === "PL" || status.substring(0,2) === "Pl") {
		statusCategory = "planning"
	}
	else if (status.substring(0,2) === "BP") {
		statusCategory = "building"
	}

	return statusCategory
}

var geocode = function geocode(address, callback) {
	geocoder.geocode(address, function(err, resp) {
		if (!err && resp.length) {
			callback(resp[0].longitude, resp[0].latitude)
		}
	})
}
