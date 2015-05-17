var React = require('react')
, Backbone = require('backbone')
, SidebarContainer = require('./sidebar-container.js')

$(document).ready(function() {
	// React.render(<SidebarContainer />, document.getElementById('sidebar-container'))
	React.render(<App />, document.getElementById('app'));
})