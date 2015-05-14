// barf - 1.0.1
// https://github.com/svnlto/barf.js
// Copyright 2012 - 2014 https://github.com/svnlto/
// Licensed Apache License 2.0

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.Backbone||(o.Backbone={})).Router=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var _ = _dereq_('underscore');
var Backbone = _dereq_('backbone');

_.extend(Backbone.Router.prototype, {

  /**
   * Override default route fn to call before/after filters
   *
   * @param {String} route
   * @param {String} name
   * @param {Function} [callback]
   * @return {*}
   */
  route: function (route, name, callback) {

    if (!_.isRegExp(route)) {
      route = this._routeToRegExp(route);
    }

    if (_.isFunction(name)) {
      callback = name;
      name = '';
    }

    if (!callback) {
      callback = this[name];
    }

    var router = this;

    // store all the before and after routes in a stack
    var beforeStack = [];
    var afterStack = [];

    _.each(router.before, function (value, key) {
      beforeStack.push({
        'filter': key,
        'filterFn': value
      });
    });

    _.each(router.after, function (value, key) {
      afterStack.push({
        'filter': key,
        'filterFn': value
      });
    });

    Backbone.history.route(route, function (fragment) {
      var args = router._extractParameters(route, fragment);

      var beforeStackClone = _.clone(beforeStack);
      var afterStackClone = _.clone(afterStack);

      function next(stack, runRoute) {
        var layer = stack.shift();

        if (layer) {
          var filter = _.isRegExp(layer.filter) ? layer.filter : router._routeToRegExp(layer.filter);

          if (filter.test(fragment)) {
            var fn = _.isFunction(layer.filterFn) ? layer.filterFn : router[layer.filterFn];

            fn.apply(router, [
                fragment,
                args,
                function () {
                  next(stack, runRoute);
                }
              ]);
          } else {
            next(stack, runRoute);
          }
        } else if (runRoute) {
          callback.apply(router, args);
        }
      }

      // start with top of the before stack
      next(beforeStackClone, true);

      router.trigger.apply(router, ['route:' + name].concat(args));
      router.trigger('route', name, args);

      Backbone.history.trigger('route', router, name, args);

      next(afterStackClone);

    });

    return this;
  }

});

module.exports = Backbone;

},{}]},{},[1])
(1)
});