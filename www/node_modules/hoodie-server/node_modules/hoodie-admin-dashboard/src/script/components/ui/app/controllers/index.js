'use strict';

var Marionette = require('backbone.marionette');
var AppView = require('../views/index');

var AppController = Marionette.Controller.extend({

  initialize: function (options) {

    this.options = options || {};
    this.view = new AppView({el: 'html'});
  }
});

module.exports = AppController;
