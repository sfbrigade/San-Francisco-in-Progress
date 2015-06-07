var React = require('react')
, Backbone = require('backbone')
, ProjectProfile = require('./project-profile.js')
, ProjectList = require('./project-list.js')

eventBus = _.extend({}, Backbone.Events);

eventBus.on('select:project', function showProfile(project) {
	// When a project is selected on the map:
	// hide the sidebar and show project profile
	$('#collapse').addClass('hidden');
	$('#projectList-container').addClass('hidden');
	$( "#sidebar" ).animate({
    width: "90%",
  }, 250);
	// show profile in the sidebar
	React.render(<ProjectProfile project={project} /> , 
		document.getElementById('projectProfile-container'));
})

eventBus.on('close:profile', function toggleSidebarView() {
	// unhide sidebar content when a project profile is closed
	$('#collapse').removeClass('hidden');
	$('#projectList-container').removeClass('hidden');
	$( "#sidebar" ).animate({
    width: "350px",
  }, 250);
})

// show the list of featured projects on page load
$(document).ready(function() {
	if (window.location.href.indexOf('/map') > 0) {
		$.get('/projects/featured', function (projects) {
			React.render(<ProjectList projects={projects} />, 
				document.getElementById('projectList-container'));
		})
	}
	if (window.location.href.indexOf('/calendar') > 0) {
		// get proposals data
		var hearings = []
		React.render(<Calendar hearings={hearings} />)
	}
})