[![Build Status](https://travis-ci.org/hoodiehq/hoodie-plugin-global-share.png?branch=master)](https://travis-ci.org/hoodiehq/hoodie-plugin-global-share)

# Hoodie Global Share Plugin

> Make selected objects publically accessible via hoodie.global store methods.

## Installation

```bash
hoodie install global-share
```

## Usage

The Global Share Plugin extends all promises returned by `hoodie.store` methods
with two additional functions: `publish` and `unpublish`.

```js
// publish all my todos
hoodie.store.findAll('task').publish()

// unpublish specific note
hoodie.store.find('note', 'abc1234').unpublish()
```

All objects marked as public are accessible (read-only) via the 
`hoodie.global` API

```js
// list all public tasks
hoodie.global.findAll('task').then(showAllPublicTasks)

// update list of tasks on change
hoodie.global.on('task:change', handleTaskChange)
```

## Full Frontend API

add / remove own objects from the public global store

```js
// publish / unpublish can be called on all promises
// return by any hoodie.store method.
promise = hoodie.store.add(type, attributes).publish()
promise = hoodie.store.find(type, id).publish()
promise = hoodie.store.findOrAdd(type, id, attributes).publish()
promise = hoodie.store.findAll(/* type */).publish()
promise = hoodie.store.update(type, id, changedAttributes).publish()
promise = hoodie.store.updateAll(/* type, */ changedAttributes).publish()
promise = hoodie.store.remove(type, id).publish()
promise = hoodie.store.removeAll(/* type */).publish()

// it works the same on scoped stores
promise = hoodie.store(type).find(id).unpublish()
promise = hoodie.store(type, id).update(changedAttributes).publish()

// publish / unpublish return own promises that only resolve
// if the objects were published successfully on the server
promise.then(handlePublishSuccess, handleStoreOrPublishError);
```

access objects from / listen to changes in the public global store

```js
// hoodie.global has all read-only methods from hoodie.store,
// with the same footprint
promise = hoodie.global.find(type, id)
promise = hoodie.global.findAll(/* type */)

// you can listen on changes as well
hoodie.global.on('add', handleNewObject)
hoodie.global.on('task:change', handleChangedTask)
hoodie.global.on('task:123:remove', handleTask123Removed)
```

## How it works internally

The [plugin's worker](https://github.com/hoodiehq/hoodie-plugin-global-share/blob/master/worker.js)
creates a new database `hoodie-plugin-global-share` that all objects from all
user databases that are marked as public are replicated to. 

Calling `.publish()` on a store method in the frontend adds a `$public: true`
flag to the respecitve objects, that is used by the filtered replications from
user databases → `hoodie-plugin-global-share` database.

Calling `.unpublish()` uses the `hoodie.task` API internally to start `globalshareunpublish`
task with object types/IDs to be unpublished.  The task gets picked up by the worker
which then removes all objects with the passed types/IDs from the `hoodie-plugin-global-share` 
database.


## Contributing

We love contributors <3 If you need any help getting started, please
don't hesitate to get in touch at any time.

For Questions/Bug reports specific to the Global Share Plugin:  
https://github.com/hoodiehq/hoodie-plugin-global-share/issues/new

For more generic questions to Hoodie Architecture etc.
https://github.com/hoodiehq/discussion/issues/new

If you want to send pull requests, please make sure to add according tests.
Run tests with

```bash
grunt
```

## License & Copyright

Copyright 2012-2014 https://github.com/hoodiehq/ and other contributors  
Licensed under the Apache License 2.0.
