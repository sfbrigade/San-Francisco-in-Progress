'use strict';

var app = require('../../../helpers/namespace');

var BaseCollection = require('../../../helpers/mvc/collection');
var PluginModel = require('../models/plugin');

var Collection = BaseCollection.extend({
  url: app.request('config').api.url + '_plugins',
  model: PluginModel,
  comparator: 'name'
});

module.exports = Collection;

