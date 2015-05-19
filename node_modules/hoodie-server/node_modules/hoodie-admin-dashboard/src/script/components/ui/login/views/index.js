'use strict';

var Marionette = require('backbone.marionette');
var Syphon = require('backbone.syphon');
var _ = require('underscore');

var tmpl = require('../templates/index.hbs');

require('../../../../helpers/handlebars');
// var Validation = require('backbone.validation');

var View = Marionette.ItemView.extend({
  template: tmpl,
  tagName: 'form',
  className: 'form-horizontal',

  initialize: function () {
    // Validation.bind(this);
    _.bindAll(this, 'handleSignInSuccess', 'handleSignInError');
  },

  events: {
    'submit' : 'handleSubmit',
  },

  handleSubmit: function (event) {
    var admin, data;
    event.preventDefault();

    admin = app.request('admin');
    data = Syphon.serialize(this);

    this.$('input[name=password]').val('');

    admin.account.signIn(data.password)
    .done(this.handleSignInSuccess)
    .fail(this.handleSignInError);
  },

  handleSignInError: function () {
    alert('invalid password');
  },

  handleSignInSuccess: function () {
    Backbone.history.navigate('plugin/appconfig', {
      trigger: true
    });
  },

});

module.exports = View;

