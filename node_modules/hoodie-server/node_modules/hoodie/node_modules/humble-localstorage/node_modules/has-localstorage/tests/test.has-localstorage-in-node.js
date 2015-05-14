/* global hasLocalStorage, describe, it, expect */
'use strict';

describe('hasLocalStorage()', function () {
  describe('in node', function () {
    it('returns false', function () {
      expect(hasLocalStorage()).to.be(false);
    });
  });
});
