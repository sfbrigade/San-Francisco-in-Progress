var React = require('react')
, Backbone = require('backbone')
, ProjectProfile = require('./project-profile.js')
, ProjectList = require('./project-list.js')

eventBus = _.extend({}, Backbone.Events);

eventBus.on('select:project', function showProfile(project) {
	// When a project is selected on the map:
	// hide the sidebar filters and project list
	$('#collapse').addClass('hidden');
	$('#projectList-container').addClass('hidden');
	// show profile in the sidebar
	React.render(<ProjectProfile project={project} /> , 
		document.getElementById('projectProfile-container'));
})

eventBus.on('close:profile', function toggleSidebarView() {
	// unhide sidebar content when a project profile is closed
	$('#collapse').removeClass('hidden');
	$('#projectList-container').removeClass('hidden');
})

// show the list of featured projects on page load
$(document).ready(function() {
	$.get('/projects/featured', function(projects) {
		React.render(<ProjectList projects={projects} />, 
			document.getElementById('projectList-container'));
	})
})