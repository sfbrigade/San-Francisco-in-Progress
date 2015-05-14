'use strict';

var Marionette = require('backbone.marionette');
var Controller = Marionette.Controller.extend({

  initialize: function (options) {
    this.options = options || {};

    // create layout object passing in a template string
    var Layout = Marionette.Layout.extend({
      template:  function () {
        return options.template;
      }
    });

    this.container = new Marionette.Region({
      el: '[data-component=sidebar]',
    });

    this.container.show(new Layout);
  }
});

module.exports = Controller;
