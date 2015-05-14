/* global localStorageMemory, beforeEach, describe, it, expect */
'use strict';

describe('localStorageMemory()', function () {
  beforeEach(function() {
    localStorageMemory.clear();
  });
  describe('localStorageMemory.getItem("foo")', function () {
    describe('"foo" has been set before', function () {
      beforeEach(function() {
        localStorageMemory.setItem('foo', 'bar');
      });

      it('returns true', function () {
        expect(localStorageMemory.getItem('foo')).to.be('bar');
      });
    });
    describe('foo has not been set before', function () {
      it('returns null', function () {
        expect(localStorageMemory.getItem('foo')).to.be(null);
      });
    });
  });
  describe('localStorageMemory.setItem(123, 456)', function () {
    it('stores key & value as string', function () {
      localStorageMemory.setItem(123, null);
      expect(localStorageMemory.getItem('123')).to.be('null');
    });
  });
  describe('localStorageMemory.removeItem(123)', function () {
    it('removes item "123"', function() {
      localStorageMemory.setItem('123', 'foo');
      localStorageMemory.removeItem(123);
      expect(localStorageMemory.getItem(123)).to.be(null);
    });
  });
  describe('localStorageMemory.key(0)', function () {
    describe('"foo" has been set before as only item', function () {
      beforeEach(function() {
        localStorageMemory.setItem('foo', 'bar');
      });

      it('returns foo', function () {
        expect(localStorageMemory.key(0)).to.be('foo');
      });
    });
    describe('no item has been set', function () {
      it('returns null', function () {
        expect(localStorageMemory.key(0)).to.be(null);
      });
    });
  });
  describe('localStorageMemory.clear()', function () {
    it('removes all items', function() {
      localStorageMemory.setItem('123', 'foo');
      localStorageMemory.setItem(456, 'bar');
      localStorageMemory.clear();
      expect(localStorageMemory.length).to.be(0);
      expect(localStorageMemory.getItem(123)).to.be(null);
      expect(localStorageMemory.getItem(456)).to.be(null);
    });
  });
});
