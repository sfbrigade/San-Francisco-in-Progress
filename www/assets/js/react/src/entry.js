var React = require('react')
, Backbone = require('backbone')
, ProjectProfile = require('./project-profile.js')

eventBus = _.extend({}, Backbone.Events);

eventBus.on('select:project', function showProfile(project) {
	// When a project is selected on the map:
	// hide the filters
	console.log("SHOWING PROJECT!!")
	$('#collapse').addClass('hidden');
	// show profile in the sidebar
	React.render(<ProjectProfile project={project} /> , 
		document.getElementById('projectProfile-container'));
})

eventBus.on('close:profile', function toggleSidebarView() {
	// show the filters again when a project profile is closed
	$('#collapse').removeClass('hidden');
})

