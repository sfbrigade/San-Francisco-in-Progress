/* global hasLocalStorage, describe, it, expect */
'use strict';

describe('hasLocalStorage()', function () {
  describe('in browser', function () {
    it('returns true', function () {
      expect(hasLocalStorage()).to.be(true);
    });
  });
});
