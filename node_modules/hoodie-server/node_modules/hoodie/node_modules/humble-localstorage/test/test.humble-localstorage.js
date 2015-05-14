/* global describe, beforeEach, it, expect */
'use strict';

var humbleLocalStorage = require('../lib');

describe('humbleLocalStorage', function () {

  // clear data before each test
  beforeEach(function() {
    humbleLocalStorage.clear();
  });

  describe('object API', function () {
    describe('"foo" set to {bar: "baz"}', function () {
      beforeEach(function() {
        humbleLocalStorage.setObject('foo', {bar: 'baz'});
      });
      it('getObject("foo") returns {bar: baz}', function () {
        expect(humbleLocalStorage.getObject('foo').bar).to.equal('baz');
      });
    });
    describe('"foo" not set before', function () {
      it('getObject("foo") returns null', function () {
        expect(humbleLocalStorage.getObject('foo')).to.equal(null);
      });
    });
  });
});
