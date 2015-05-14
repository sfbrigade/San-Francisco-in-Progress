'use strict';

var app = require('../../../helpers/namespace');
var HoodieAdmin = require('hoodie.admin');
var admin = new HoodieAdmin();

global.hoodieAdmin = admin;

app.reqres.setHandler('admin', function () {
  return admin;
});

module.exports = app;
