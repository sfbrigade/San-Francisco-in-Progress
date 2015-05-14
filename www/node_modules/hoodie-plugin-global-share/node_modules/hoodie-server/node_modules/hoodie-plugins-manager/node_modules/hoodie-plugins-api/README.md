# Hoodie Plugin API

## File and directory structure

```
/hoodie-plugin-plugin_name
    /pocket
    hoodie.plugin_name.js
    index.js
    package.json
```

* __/pocket__ - Extends the Pocket admin interface (contains a HTML fragment with code and styles)
* __hoodie.plugin_name.js__ - Extends the hoodie.js front-end API
* __index.js__ - Node.js worker for handling tasks and other events (this is just the default location, you have more options here, see below)
* __package.json__ - The plugin's metadata and dependencies (since the plugin should function as an npm module)

The server-side component of the plugin can be left in an index.js for simplicity, but Hoodie will prefer the following, if present:
* Whatever you reference under `main` in the plugin's `package.json`
* Whatever you get when you `require()` the plugin root directory

## Writing workers

```javascript
// Initializing a worker
module.exports = function (hoodie, callback) {
    // hoodie object is client to hoodie backend, documented below.
    // call callback when setup complete (with optional error if worker failed to initialize).
    // ...
};


// make HTTP requests directly to CouchDB (ideally, you would never need to use this)
hoodie.request(method, path, options, callback)

// get / set plugin configuration
hoodie.config.get(key)
hoodie.config.set(key, value)

// list all databases
hoodie.database.findAll(callback)

// create a new database
hoodie.database.add(name, callback)

// remove a database
hoodie.database.remove(name, callback)

// get a database object to make calls against
hoodie.database(name) => db

// add a document to db
db.add(type, attrs, callback)

// update a document in db
db.update(type, id, changed_attrs, callback)

// get a document from db
db.find(type, id, callback)

// get all documents from db
db.findAll(callback)

// get all documents of a single type in db
db.findAll(type, callback)

// remove a document from db
db.remove(type, id, callback)

// remove all documents of type in db
db.removeAll(type, callback)

// grant read access to everyone on db by updating CouchDB security
db.grantPublicReadAccess(callback)

// grant write access to everyone on db
db.grantPublicWriteAccess(callback)

// grant read access to specific user on db by updating CouchDB security
db.grantReadAccess(account_type, account_id, callback)

// grant write access to specific user on db by adding role (checked by design doc in db)
db.grantWriteAccess(account_type, account_id, callback)

// update db security so it's no longer publicly readable
db.revokePublicReadAccess(callback)

// update db security so it's no longer publicly writable
db.revokePublicWriteAccess(callback)

// remove user from couchdb readers for db
db.revokeReadAccess(account_type, account_id, callback)

// remove role from user so they cannot write to db (checked by design doc)
db.revokeWriteAccess(account_type, account_id, callback)


// Index / Query API is not yet implemented, see:
// https://github.com/hoodiehq/hoodie-plugins-api/issues/3

// creates new design doc with CouchDB view on db
db.addIndex(name, {map: .., reduce: ..}, callback)

// removes design doc for couchdb view on db
db.removeIndex(name, callback)

// query a couchdb view on db
db.query(index, options, callback)


//
// hoodie.account API
//
hoodie.account.add(type, attrs, callback)
hoodie.account.update(type, id, changed_attrs, callback)
hoodie.account.find(type, id, callback)
hoodie.account.findAll(callback)
hoodie.account.findAll(type, callback)
hoodie.account.remove(type, id, callback)
hoodie.account.removeAll(type, callback)

// hoodie.account events
hoodie.account.on('change', handler)
hoodie.account.on('change:type', handler)

// use case: 
// handle password resets
hoodie.account.on('change:$passwordReset', function(object) {
  // set new password in user doc & send it via email
})


//
// listen to task document events
//
hoodie.task.on('change', function (db, doc) { ... })
hoodie.task.on('change:type', function (db, doc) { ... })

// add / remove sources (database) to listen for new tasks
hoodie.task.addSource( databaseName )
hoodie.task.removeSource( databaseName )

// mark task as complete
hoodie.task.success( databaseName, taskDoc, [callback] )

// mark task as errored
hoodie.task.error( databaseName, taskDoc, error, [callback] )

// send emails
hoodie.sendEmail({
    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address
    to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}, callback)

// sending emails uses nodemailer API:
// https://github.com/andris9/Nodemailer

// you can also pass attachments as dataURIs:
hoodie.sendEmail({
  to: 'test@example.com',
  from: 'hoodie@example.com',
  subject: 'test',
  text: 'blah blah',
  attachments: [
    {dataURI: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D', ...}
  ]
}, callback);

// please note, the 'filePath' property usable on attachments in nodemail
// will be stripped in hoodie to prevent accidentally emailing out files
// from the server
```
