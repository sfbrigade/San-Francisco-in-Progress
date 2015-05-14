var plugins_manager = require('../lib/index'),
    nodemailer = require('nodemailer'),
    couchr = require('couchr'),
    utils = require('./lib/utils'),
    async = require('async'),
    url = require('url'),
    urlFormat = url.format,
    urlParse = url.parse,
    _ = require('underscore');

//require('long-stack-traces');


var COUCH = {
    user: 'admin',
    pass: 'password',
    url: 'http://localhost:8985',
    data_dir: __dirname + '/data'
};

var DEFAULT_OPTIONS = {
    couchdb: COUCH
};

exports.setUp = function (callback) {
    var that = this;
    utils.setupCouch(COUCH, function (err, couch) {
        if (err) {
            return callback(err);
        }
        that.couch = couch;

        var base = url.parse(COUCH.url);
        base.auth = COUCH.user + ':' + COUCH.pass;
        base = url.format(base);

        that.base_url = base;

        var appconfig = {
            config: {
                foo: 'bar',
                email_host: 'emailhost',
                email_port: 465,
                email_user: 'gmail.user@gmail.com',
                email_pass: 'userpass',
                email_secure: true,
                email_service: 'Gmail'
            }
        };
        async.series([
            async.apply(couchr.put, url.resolve(base, 'plugins')),
            async.apply(couchr.put, url.resolve(base, 'app')),
            async.apply(couchr.put, url.resolve(base, 'app/config'), appconfig)
        ],
        callback);
    });
};

exports.tearDown = function (callback) {
    utils.stopCouch(COUCH, this.couch, callback);
};

exports['changed docs passed to plugins can be modified'] = function (test) {
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var hoodie1 = manager.createAPI({name: 'myplugin1'});
        var hoodie2 = manager.createAPI({name: 'myplugin2'});

        hoodie1.account.on('change', function (doc) {
            test.ok(!doc.processed_by);
            doc.processed_by = 1;
        });
        hoodie2.account.on('change', function (doc) {
            test.ok(!doc.processed_by);
            doc.processed_by = 2;
        });
        hoodie1.task.on('change', function (db, doc) {
            test.ok(!doc.processed_by);
            doc.processed_by = 1;
        });
        hoodie2.task.on('change', function (db, doc) {
            test.ok(!doc.processed_by);
            doc.processed_by = 2;
        });

        hoodie1.database.add('foo', function (err) {
            if (err) {
                return test.done(err);
            }
            hoodie1.task.addSource('foo');
            var task_doc = {id: 'asdf', name: 'test'};
            var user_doc = {id: 'foo', password: 'secret'};
            var db = hoodie1.database('foo');
            async.series([
                async.apply(hoodie1.account.add, 'user', user_doc),
                async.apply(db.add, '$mytask', task_doc)
            ],
            function (err, results) {
                if (err) {
                    return test.done(err);
                }
                setTimeout(function () {
                    manager.stop(test.done);
                }, 200);
            });
        });
    });
};

exports['sendEmail function'] = function (test) {
    test.expect(5);
    var email = {
        to: 'to@hood.ie',
        from: 'from@hood.ie',
        subject: 'subject',
        text: 'blah blah'
    };
    var createTransport_calls = [];
    var sendMail_calls = [];
    var close_calls = [];

    var _createTransport = nodemailer.createTransport;
    nodemailer.createTransport = function (type, config) {
        test.equal(type, 'SMTP');
        createTransport_calls.push(config);
        return {
            close: function (callback) {
                close_calls.push(config);
                if (callback) {
                    callback();
                }
            },
            sendMail: function (opt, callback) {
                sendMail_calls.push(opt);
                callback();
            }
        };
    };
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var hoodie = manager.createAPI({name: 'myplugin'});
        hoodie.sendEmail(email, function (err) {
            var appcfg = {
                foo: 'bar',
                email_host: 'emailhost2',
                email_port: 123,
                email_secure: false,
                email_service: 'Gmail2'
            };
            var url = hoodie._resolve('app/config');
            couchr.get(url, function (err, doc) {
                if (err) {
                    return test.done(err);
                }
                doc.config = appcfg;
                couchr.put(url, doc, function (err) {
                    if (err) {
                        return test.done(err);
                    }
                    setTimeout(function () {
                        hoodie.sendEmail(email, function (err) {
                            test.same(createTransport_calls, [
                                {
                                    host: 'emailhost',
                                    port: 465,
                                    auth: {
                                        user: 'gmail.user@gmail.com',
                                        pass: 'userpass'
                                    },
                                    secureConnection: true,
                                    service: 'Gmail'
                                },
                                {
                                    host: 'emailhost2',
                                    port: 123,
                                    secureConnection: false,
                                    service: 'Gmail2'
                                }
                            ]);
                            test.same(close_calls, [
                                {
                                    host: 'emailhost',
                                    port: 465,
                                    auth: {
                                        user: 'gmail.user@gmail.com',
                                        pass: 'userpass'
                                    },
                                    secureConnection: true,
                                    service: 'Gmail'
                                }
                            ]);
                            test.same(sendMail_calls, [email, email]);
                            nodemailer.createTransport = _createTransport;
                            manager.stop(test.done);
                        });
                    }, 100);
                });
            });
        });
    });
};

exports['get config values from plugin manager'] = function (test) {
    var plugin_url = url.resolve(this.base_url, 'plugins/plugin%2Fmyplugin');
    var doc = {
        config: {asdf: 123}
    };
    couchr.put(plugin_url, doc, function (err) {
        if (err) {
            return test.done(err);
        }
        plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
            if (err) {
                return test.done(err);
            }
            var hoodie = manager.createAPI({name: 'myplugin'});
            test.equal(hoodie.config.get('foo'), 'bar');
            test.equal(hoodie.config.get('asdf'), 123);
            manager.stop(test.done);
        });
    });
};

exports['automatically update plugin config'] = function (test) {
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var hoodie = manager.createAPI({name: 'myplugin'});

        test.equal(hoodie.config.get('foo'), 'bar');

        var url = hoodie._resolve('plugins/plugin%2Fmyplugin');
        var doc = {config: {foo: 'wibble'}};
        setTimeout(function () {
            couchr.put(url, doc, function (err) {
                if (err) {
                    return test.done(err);
                }
                // test that couchdb change event causes config to update
                setTimeout(function () {
                    test.equal(hoodie.config.get('foo'), 'wibble');
                    manager.stop(test.done);
                }, 200);
            });
        }, 200);
    });
};

exports['automatically update app config'] = function (test) {
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var hoodie = manager.createAPI({name: 'myplugin'});

        test.equal(hoodie.config.get('foo'), 'bar');

        var url = hoodie._resolve('app/config');
        setTimeout(function () {
            couchr.get(url, function (err, doc) {
                if (err) {
                    return test.done(err);
                }
                doc.config.foo = 'wibble';
                couchr.put(url, doc, function (err) {
                    if (err) {
                        return test.done(err);
                    }
                    // test that couchdb change event causes config to update
                    setTimeout(function () {
                        test.equal(hoodie.config.get('foo'), 'wibble');
                        manager.stop(test.done);
                    }, 200);
                });
            });
        }, 200);
    });
};

exports['trigger account events in plugins'] = function (test) {
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var hoodie = manager.createAPI({name: 'myplugin'});

        var evs = [];
        function pushEv(name) {
            return function (doc) {
                if (doc._deleted) {
                    evs.push(name + ' deleted');
                }
                else {
                    evs.push(name + ' ' + doc.name);
                }
            };
        }
        function recEvent(name) {
            hoodie.account.on(name, pushEv(name));
        }
        recEvent('change');
        recEvent('user:change');
        recEvent('other:change');

        var doc = {id: 'foo', password: 'secret'};
        async.series([
            async.apply(hoodie.account.add, 'user', doc),
            async.apply(hoodie.account.update, 'user', 'foo', {asdf: 123}),
            async.apply(hoodie.account.remove, 'user', 'foo')
        ],
        function (err) {
            if (err) {
                return test.done(err);
            }
            setTimeout(function () {
                test.same(evs, [
                    'change user/foo',
                    'user:change user/foo',
                    'change user/foo',
                    'user:change user/foo',
                    'change deleted',
                    'user:change deleted'
                ]);
                manager.stop(test.done);
            }, 200);
        });
    });
};

exports['trigger task events in plugins'] = function (test) {
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var hoodie = manager.createAPI({name: 'myplugin'});

        var tasklist = [];
        function recEvent(name) {
            hoodie.task.on(name, function (db, doc) {
                if (doc._deleted) {
                    tasklist.push(name + ' deleted');
                }
                else {
                    tasklist.push(name + ' ' + doc.name);
                }
            });
        }
        recEvent('change');
        recEvent('mytask:change');
        recEvent('other:change');

        hoodie.database.add('user/foo', function (err) {
            if (err) {
                return test.done(err);
            }
            hoodie.task.addSource('user/foo');
            var doc = {id: 'asdf', name: 'test'};
            var db = hoodie.database('user/foo');
            async.series([
                async.apply(db.add, '$mytask', doc),
                async.apply(db.add, 'notatask', doc),
                async.apply(db.update, '$mytask', 'asdf', {foo: 'bar'}),
                async.apply(db.remove, '$mytask', 'asdf')
            ],
            function (err, results) {
                if (err) {
                    return test.done(err);
                }
                // give it time to return in _changes feed
                setTimeout(function () {
                    test.same(tasklist, [
                        'change test',
                        'mytask:change test',
                        'change test',
                        'mytask:change test',
                        'change deleted',
                        'mytask:change deleted'
                    ]);
                    // task events should no longer fire from this db
                    hoodie.task.removeSource('user/foo');
                    tasklist = [];
                    db.add('$othertask', doc, function () {
                        // give it time to return in _changes feed
                        setTimeout(function () {
                            test.same(tasklist, []);
                            manager.stop(test.done);
                        }, 200);
                    });
                }, 200);
            });
        });
    });
};

exports['task add events'] = function (test) {
    test.expect(8);
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var hoodie = manager.createAPI({name: 'myplugin'});
        hoodie.task.on('add', function (dbname, task) {
            test.equal(dbname, 'testdb');
            test.equal(task.type, '$email');
            test.equal(task.from, 'from');
            test.equal(task.to, 'to');
        });
        hoodie.task.on('email:add', function (dbname, task) {
            test.equal(dbname, 'testdb');
            test.equal(task.type, '$email');
            test.equal(task.from, 'from');
            test.equal(task.to, 'to');

            hoodie.task.success(dbname, task, function (err) {
                if (err) {
                    return test.done(err);
                }
                // give events from the finish call time to fire
                setTimeout(function () {
                    manager.stop(test.done);
                }, 200);
            });
        });
        hoodie.database.add('testdb', function (err, db) {
            if (err) {
                return test.done(err);
            }
            hoodie.task.addSource('testdb');
            db.add('$email', {to: 'to', from: 'from'}, function (err) {
                if (err) {
                    return test.done(err);
                }
            });
        });
    });
};

exports['#1 multiple addSource calls'] = function (test) {
    test.expect(9);
    plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
        if (err) {
            return test.done(err);
        }
        var add_calls = 0;
        var hoodie = manager.createAPI({name: 'myplugin'});
        hoodie.task.on('add', function (dbname, task) {
            add_calls++;
            test.equal(dbname, 'testdb');
            test.equal(task.type, '$email');
            test.equal(task.from, 'from');
            test.equal(task.to, 'to');
        });
        hoodie.task.on('email:add', function (dbname, task) {
            test.equal(dbname, 'testdb');
            test.equal(task.type, '$email');
            test.equal(task.from, 'from');
            test.equal(task.to, 'to');

            hoodie.task.success(dbname, task, function (err) {
                if (err) {
                    return test.done(err);
                }
                test.equal(add_calls, 1);
                // give events from the finish call time to fire
                setTimeout(function () {
                    manager.stop(test.done);
                }, 200);
            });
        });
        hoodie.database.add('testdb', function (err, db) {
            if (err) {
                return test.done(err);
            }
            async.series([
                async.apply(hoodie.task.addSource, 'testdb'),
                async.apply(hoodie.task.addSource, 'testdb'),
                async.apply(hoodie.task.addSource, 'testdb')
            ],
            function (err) {
                if (err) {
                    return test.done(err);
                }
                db.add('$email', {to: 'to', from: 'from'}, function (err) {
                    if (err) {
                        return test.done(err);
                    }
                });
            });
        });
    });
};

exports['unprocessed tasks should be handled on addSource'] = function (test) {
    var couchdb = DEFAULT_OPTIONS.couchdb;
    var dburl = urlParse(couchdb.url + '/testdb');
    dburl.auth = couchdb.user + ':' + couchdb.pass;
    dburl = urlFormat(dburl);

    couchr.put(dburl, {name: 'testdb'}, function (err) {
        if (err) {
            return test.done(err);
        }
        var names = ['foo', 'bar', 'baz'];
        async.map(names, function (name, cb) {
            var doc = {
                _id: '$example/' + name,
                type: '$example',
                name: name
            };
            couchr.post(dburl, doc, cb);
        },
        function (err) {
            if (err) {
                return test.done(err);
            }
            async.parallel([
                function (cb) {
                    // add a processed doc
                    couchr.post(dburl, {
                        _id: '$example/qux',
                        type: '$example',
                        name: 'qux',
                        $processedAt: 'now',
                        _deleted: true
                    }, cb);
                },
                function (cb) {
                    // add a processed doc
                    couchr.post(dburl, {
                        _id: '$example/quux',
                        type: '$example',
                        name: 'quux',
                        $error: 'stuff broke'
                    }, cb);
                }
            ],
            function (err) {
                if (err) {
                    return test.done(err);
                }
                plugins_manager.start(DEFAULT_OPTIONS, function (err, manager) {
                    if (err) {
                        test.done(err);
                    }
                    var hoodie = manager.createAPI({name: 'myplugin'});
                    hoodie.task.addSource('testdb');
                    var added_tasks = [];
                    var changed_tasks = [];
                    hoodie.task.on('example:add', function (db, task) {
                        added_tasks.push(task.name);
                    });
                    hoodie.task.on('example:change', function (db, task) {
                        changed_tasks.push(task.name);
                    });
                    setTimeout(function (err) {
                        test.same(added_tasks.sort(), ['bar', 'baz', 'foo']);
                        test.same(changed_tasks.sort(), [
                            'bar', 'baz', 'foo', 'quux', 'qux'
                        ]);
                        manager.stop(test.done);
                    }, 200);
                });
            });
        });
    });
};
