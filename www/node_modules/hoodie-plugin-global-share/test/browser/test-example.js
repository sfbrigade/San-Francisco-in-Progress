suite('Browser API', function () {

  setup(function (done) {
    // phantomjs seems to keep session data between runs,
    // so clear before running tests
    localStorage.clear();
    hoodie.account.signOut().done(function () {
      done();
    });
  });

  test('hoodie.global exists', function () {
    assert.ok(hoodie.global);
  });

  test('publish as testuser1, read as testuser2', function (done) {
    this.timeout(10000);
    var docid;
    var task = hoodie.account.signUp('testuser1', 'testing')
      .then(function () {
        return hoodie.store.add('test', {title: 'foo'}).publish()
          .then(function (x) {
            docid = x.id;
            return x;
          })
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        return hoodie.account.signUp('testuser2', 'testing');
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(false, err.message);
              done();
            })
            .done(function (doc) {
              assert.equal(doc.title, 'foo');
              done();
            })
        }, 2000);
      })
      .fail(function (err) {
        assert.ok(false, err.message);
        done();
      });
  });

  test('publish as testuser3, read as anonymous', function (done) {
    this.timeout(10000);
    var docid;
    var task = hoodie.account.signUp('testuser3', 'testing')
      .then(function () {
        return hoodie.store.add('test', {title: 'foo'}).publish()
          .then(function (x) {
            docid = x.id;
            return x;
          })
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(false, err.message);
              done();
            })
            .done(function (doc) {
              assert.equal(doc.title, 'foo');
              done();
            })
        }, 2000);
      })
      .fail(function (err) {
        assert.ok(false, err.message);
        done();
      });
  });

  test('testuser4 publish, read anonymous, unpublish, read anonymous', function (done) {
    this.timeout(10000);
    var docid;
    var task = hoodie.account.signUp('testuser4', 'testing')
      .then(function () {
        return hoodie.store.add('test', {title: 'foo'}).publish()
          .then(function (x) {
            docid = x.id;
            return x;
          })
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(false, err.message);
              done();
            })
            .done(function (doc) {
              assert.equal(doc.title, 'foo');
              done();
            })
        }, 2000);
      })
      .then(function () {
        return hoodie.account.signIn('testuser4', 'testing');
      })
      .then(function () {
        return hoodie.store.find('test', docid).unpublish();
      })
      .then(function () {
        return hoodie.account.signOut();
      })
      .then(function () {
        // wait a bit to make sure the data has synced from the server
        setTimeout(function () {
          hoodie.global.find('test', docid)
            .fail(function (err) {
              assert.ok(err);
              done();
            })
            .done(function (doc) {
              assert.ok(false, 'should not return doc');
              done();
            })
        }, 2000);
      })
      .fail(function (err) {
        assert.ok(false, err.message);
        done();
      });
  });

});
