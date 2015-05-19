/* global describe, it, beforeEach, afterEach */

var sinon = require('sinon');
require('chai').should();

describe('lib/api.js', function () {

  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
    this.api = require('../../lib/api.js');
    this.sandbox.stub(this.api, 'hasLocalStorage');
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('api.create()', function() {
    describe('when localStorage is not persistent', function() {
      beforeEach(function() {
        this.api.hasLocalStorage.returns(false);
      });

      it('api.create().isPersistent is false', function() {
        this.api.create().isPersistent.should.equal(false);
      });
    });
    describe('when localStorage is persistent', function() {
      beforeEach(function() {
        this.api.hasLocalStorage.returns(true);
        global.localStorage = {
          getItem: function() {},
          setItem: function() {},
          removeItem: function() {},
          key: function() {},
          clear: function() {}
        };
      });

      it('api.create().isPersistent is true', function() {
        this.api.create().isPersistent.should.equal(true);
      });
    });
  });
});
