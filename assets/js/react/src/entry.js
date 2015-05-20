var React = require('react')
, Backbone = require('backbone')
, SidebarContainer = require('./sidebar-container.js')
, Router = require('react-router');

// React router components
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var Home = React.createClass({
  render: function () {
    return (
      <div>
           <header>
             <ul>
             </ul>
             Logged in as Jane
           </header>
      </div>
    );
  }
});

$(document).ready(function() {
// 	// React.render(<SidebarContainer />, document.getElementById('sidebar-container'))
// 	React.render(<App />, document.getElementById('app'));
var routes = (
  <Route handler={Home} path="/">
    <DefaultRoute handler={Home} />
    <Route name="projects" handler={Home} />
  </Route>
);
Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
})
