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

// SCHEMAS
// ================================================

// The SF Planning Commission holds a weekly meeting where they rule on various
// items concerning development projects.
//
// Example Data:
//   projectId: ...
//   location:
//     Commission Chambers
//     Room 400, City Hall
//     1 Dr. Carlton B. Goodlett Place
//   date: 12:00 PM, June 11, 2015
//   documents: ""
//   type: "regular"
//   id: "2013.1238CV"
//   packetUrl: "http://commissions.sfplanning.org/cpcpackets/2013.1238CV.pdf"
//   staffContact: {
//     name: "S. VELLVE"
//     phone: "(415) 558-6263"
//   }
//   description:
//     1238 SUTTER STREET - north side between Polk Street and Van Ness Avenue;
//     Lot 011 in Assessor’s block 0670 - Request for Conditional Use
//     Authorization...
//   preliminaryRecommendation:
//     Approve with Conditions
//   action:
//     Approve with Conditions as amended by staff, incorporating the desing
//     comments from Commissioners; with a minimum 13’ setback on Sutter Street

var projectHearingSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId
  , location: String
  , date: Date
  , documents: String
  , type: {
    type: String
    , enum: ['continuance', 'consent', 'regular', 'review']
  }
  , id: String
  , packetUrl: String
  , staffContact: {
    name: String
    , phone: String
  }
  , description: String
  , preliminaryRecommendation: String
  , action: String
})

var projectSchema = new mongoose.Schema({
  address: String
  , city: String
  , neighborhood: String
  , description: String
  , benefits: String
  , zoning: String
  , units: Number
  , status: String
  , supervisor: String
  , statusCategory: String
  , picture: String
  , coordinates: Array
  , featured: Boolean
  , sponsorFirm: String
  , hearings: [projectHearingSchema]
})

// models
var Project = mongoose.model('Project', projectSchema)
var ProjectHearing = mongoose.model('ProjectHearing', projectHearingSchema)

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
app.get('/projects/new', function (req, resp) {
	resp.sendFile(path.join(__dirname, '/assets', '/new-project-form.html'))
})

// form for everyone to add new hearings
app.get('/hearings/new/:project_id', function (req, resp) {
	resp.sendFile(path.join(__dirname, '/assets', '/new-hearing-form.html'))
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
app.post('/projects', function (req, resp) {
	var saveProject = function(coords) {
		var project = new Project({
			name: req.body.name || ''
			, address: req.body.address || ''
			, city: req.body.city
			, neighborhood: req.body.neighborhood || ''
			, description: req.body.description || ''
			, zoning: req.body.zoning || ''
			, units: req.body.units	|| null
			, status: req.body.status || ''
			, website: req.body.website || ''
			, picture: req.body.picture || ''
			, statusCategory: determineStatusCategory(req.body.status) || ''
			, coordinates: [(coords.latitude).toString(), (coords.longitude).toString()] || []
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
		saveProject({'latitude': (latitude).toString(), 'longitude': (longitude).toString()})
	}.bind(this))
})

app.get('/projects/featured', function (req, resp) {
	return Project.find({featured: true}, function (err, projects) {
		if (err) resp.send(err)
		resp.json(projects)
	})
})

// get a particular project
app.get('/projects/:project_id', function (req, resp){
	var id = mongoose.Types.ObjectId(req.params.project_id)

	return Project.findById(id, function (err, project){
		if(err) resp.send(err)
		resp.json(project)
	})
})

// update / replace a particular project
app.post('/projects/:project_id', function (req, resp) {
	var id = mongoose.Types.ObjectId(req.params.project_id)
	var newDoc = req.body
	var options = null

	Project.findOneAndUpdate({_id: id}, newDoc, options, function (err, project) {
		project.save()
		resp.json({message: "project updated", project: project})
	})
})

app.delete('/projects/:project_id', function (req, resp) {
	var id = mongoose.Types.ObjectId(req.params.project_id)

	Project.findOne({_id: id}, function (err, project) {
		project.remove()
		resp.sendStatus(200)
	})
})

// email subscribe to a project
app.post('/subscribe/:project_id', function (req, resp) {
	var projectId = mongoose.Types.ObjectId(req.params.project_id)

	Project.update(
		{_id: projectId}
		, { '$push' : {emails: req.body.email} }
		, function (err, numAffected) {
			resp.json({message: req.body.email + ' subscribed to project ' + projectId})
		}
	)

})

// project hearing form submission
app.post('/hearings/:project_id', function (req, resp) {
	var projectId = mongoose.Types.ObjectId(req.params.projectId)
  console.log(projectId)
	var hearing = new ProjectHearing({
		projectId: projectId
		, location: req.body.location
		, date: req.body.date // TODO: make sure this is getting saved as timestamp
		, packetUrl: req.body.packetUrl
		, documents: req.body.documents // any documents in addition to the pdf url
		, type: req.body.type // continuance, consent, regular, review
		, description: req.body.description
		, staffContact: {
			name: req.body.staffContactName
			, phone: req.body.staffContactPhone
		}
		// i think these last two pieces of info would be added after a hearing?
		// so they may not be necessary for the form
		// , preliminaryRecommendation: req.body.preliminaryRecommendation
  	// 	, action: req.body.action
	})
  var options = {};

	Project.update(
		{_id: projectId}
		, { $push : {hearings: hearing} }
    , options
		, function (err, numAffected) {
			resp.sendStatus(201)
      console.log(err);
      console.log(numAffected);
		}
	)

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
