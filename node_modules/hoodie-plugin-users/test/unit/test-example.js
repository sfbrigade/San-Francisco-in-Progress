var assert = require('chai').assert;

suite('example', function () {

  test('test one', function (done) {
      assert.ok(true, 'everything is OK!');
      done();
  });

  test('test two', function (done) {
      assert.ok(true, 'everything is still OK!');
      done();
  });

});
