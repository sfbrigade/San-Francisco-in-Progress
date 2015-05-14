'use strict';

var BaseModel = require('../../../helpers/mvc/model');
var app = require('../../../helpers/namespace');

var config = app.request('config');

var Model = BaseModel.extend({

  initialize: function () {
    this.setIframeUrl();
  },

  setIframeUrl: function () {
    var url =  config.api.url + '_plugins/' + this.get('name') + '/admin-dashboard/index.html';
    this.set({
      'iframeUrl': url
    });
  },

  defaults: {
    name: '',
    description: '',
    title: '',
    version: '',
    pos: '',
    width: '',
    iframeUrl: ''
  },

  idAttribute: 'name'

});

module.exports = Model;
