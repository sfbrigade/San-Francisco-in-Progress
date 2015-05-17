var React = require('react')
, Backbone = require('backbone')
, ProjectProfile = require('./project-profile.js')
, ProjectList = require('./project-list.js')
, filters = require('./filter-groups.js')
, Neighborhoods = filters.neighborhoods
, ProjectStatus = filters.projectStatus
, NumUnits = filters.numUnits

var SidebarContainer = React.createClass({
	getInitialState: function getInitialState () {
		return {
			currentView: 'list'
		}
	}

	, componentDidMount: function() {
		window.eventBus.on('select:project', function showProfile(project) {
			console.log('select:project heard')
			this.setState({currentView: 'profile'})
			// show profile in the sidebar
			React.render(<ProjectProfile project={project} /> , 
				document.getElementById('projectProfile-container'));
		})
	}

	, render: function() {
		return (
		<div id="sidebar">
			<div id="sidebar-nav" className={this.props.project ? 'hidden' : null} >
				<button className="sidebar-btn-support btn btn-info">Projects to Support</button>
	      <button className="sidebar-btn-explore btn btn-link">Explore All Projects</button>
	    </div>
      <div id="projectProfile-container"></div>
      <ProjectList className={this.state.currentView === 'list' ? null : 'hidden'} />
      <div id="filter-container" className={this.props.project ? 'hidden' : null} >
				<div id="collapse">
					<h4> Neighborhoods </h4>
					<Neighborhoods />
		      <h4> Project Status </h4>
		      <ProjectStatus />
		      <NumUnits />
		    </div>
		  </div>
	  </div>
		)
	}
})

module.exports = SidebarContainer