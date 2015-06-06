var React = require('react')
, Backbone = require('backbone')
, ProjectProfile = require('./project-profile.js')
, ProjectList = require('./project-list.js')
, Calendar = require('./calendar.js')

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
	if (window.location.href.indexOf('/map') > 0) {
		$.get('/projects/featured', function(projects) {
			React.render(<ProjectList projects={projects} />, 
				document.getElementById('projectList-container'));
		})
	}
	if (window.location.href.indexOf('/calendar') > 0) {
		// get proposals data
		var hearings = [
			{ 
				start_time: '6:00 pm'
				, end_time: '8:00 pm'
				, address: 'City Hall'
				, agenda {
					[{
						project_id: '5535ec352598c06798e2aafd'
						, type: 'continuance'
						, representative: {
							name: 'Joe Blow'
						}
						, description: ''
						, preliminary_recommendation: 'blah'
						, final_recommendation: 'lets build it'
					}]
				}
			}, 
			{ 
				start_time: '6:00 pm'
				, end_time: '8:00 pm'
				, address: 'City Hall'
				, agenda {
					[{
						project_id: '5535ec352598c06798e2aafd'
						, type: 'continuance'
						, representative: {
							name: 'Joe Blow'
						}
						, description: ''
						, preliminary_recommendation: 'blah'
						, final_recommendation: 'lets build it'
					}]
				}
			}
		]
		React.render(<Calendar hearings={hearings} />)
	}
})