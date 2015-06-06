var React = require('react')
, Backbone = require('backbone')
, myscript = require('./myscript.js')

var ProjectImage = React.createClass({
	openProject: function onProject () {
		console.log('triggering select:profile...')
		window.eventBus.trigger('select:profile', this.props.project) // TODO: this is bad
		window.eventBus.trigger('select:project', this.props.project)
	}

	, render: function() {
		var imgStyle = {
			width: '100%'
			, margin: '15px 0'
		}

		var linkStyle = {
			cursor: 'pointer'
		}

		return (
			<div>
				<img style={imgStyle} src={this.props.project.picture} />
				<a style={linkStyle} href='#' onClick={this.openProject}>{this.props.project.address}</a>
			</div>
		)
	}
})

module.exports = React.createClass({
	getInitialState: function getInitialState () {
		return {
			projects: []
		}
	}

	, componentDidMount: function componentDidMount () {
		// fetch featured projects
		$.get('/projects/featured', function (projects) {
			console.log('featured:', projects)
			this.setState({projects: projects})
		}.bind(this))
	}

	, render: function() {
		var projectImages = this.state.projects.map(function(project) {
      return <ProjectImage project={project} />
    })
		return (
			<div>{projectImages}</div>
		)
	}
})
