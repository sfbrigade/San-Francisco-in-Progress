var React = require('react')
, Backbone = require('backbone')
, ProjectProfile = require('./project-profile.js')

Backbone.on('select:project', function showProfile() {
	// When a project is selected on the map:
	// hide the filters
	$('#collapse').addClass('hidden');
	// show profile in the sidebar
	React.render(<ProjectProfile />, document.getElementById('projectProfile-container'));
})

Backbone.on('close:profile', function toggleSidebarView() {
	console.log('close:profile was heard!!!');
	// show the filters again when a project profile is closed
	$('#collapse').removeClass('hidden');
})

$('#collapse').addClass('hidden');
React.render(<ProjectProfile />, document.getElementById('projectProfile-container'));
