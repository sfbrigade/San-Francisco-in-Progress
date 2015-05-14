'use strict';

var BaseRouter = require('./helpers/mvc/router');

var Router = BaseRouter.extend({
  routes: {
    ''                        : 'index',
    'signIn'                  : 'signIn',
    'signOut'                 : 'signOut',
    'plugin/:name'            : 'plugin',
    'plugin/:name/*subroute'  : 'plugin',
    '*defaults'               : 'index'
  },

  index: function () {
    // no dashboard for now
    this.navigate('plugin/appconfig', {trigger: true, replace: true});
  },

  plugin: function (name, subroute) {
    app.vent.trigger('app:plugins', name, subroute);
  },

  signOut: function () {
    app.vent.trigger('app:user:signout');
  },

});

module.exports = Router;

