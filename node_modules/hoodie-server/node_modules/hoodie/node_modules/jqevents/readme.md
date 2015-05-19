# jQuery Events

  jqevents is an event emitter based on jquery events system

## Installation

    $ npm install jqevents

## Features

  - bind, emit and release multiple events at a time
  - Is a global emitter by default and will operate through the process
  - Additional emitters can be created using `jqevents.create();`
  - Uses jquery type namespaces for unbinding and emitting

## methods

  - `create` creates an non-global event emitter

## Events

  - No new events outside of the internal EventEmitter

## Usage

Initiate vitals and add processes

```js
var globalEmitter = require('jqevents')();
var nonGlobalemitter = require('jqevents').create();
```

Adding events

```js
emitter.on('one', handler);
emitter.on('one.namespace', handler);
emitter.on('one two', handler);
emitter.on('one.namespace two.namespace', handler);
emitter.on(['one', 'two'], handler);
emitter.on(['one.namespace', 'two.namespace'], handler);
emitter.on({
   one: handler,
   two: handlerTwo
});
emitter.on({
   "one.namespace": handler,
   "two.namespace": handlerTwo
});
```

Removing events

```js
emitter.off('one', handler); //removes handler
emitter.off('one'); //removes all events on one
emitter.off('one.ns'); //removes all events on one with namespace ns
emitter.off('.na'); //removes all events with ns namespace
emitter.off('one.ns two.ns2'); //multiple via space
emitter.off(['one.ns', 'two.ns2']); //multiple via array
emitter.off({
   one: handler,
   two: handlerTwo
});
emitter.off({
   "one.namespace": handler,
   "two.namespace": handlerTwo
});
```

Triggering events

```js
emitter.emit('event'); //calls all handlers
emitter.emit('event.ns'); //calls only the handlers with ns as a namespace
emitter.emit('event.ns.another'); //call multiple namespaces under an event
```

## Examples

Getting the event & namespaces that emitted the event

```js
emitter.on('fired.byme.orme', function() {
    console.log(emitter.emitting);
});

emitter.emit('fired fired.byme fired.orme');
```

Working with Namespaces

```js
//will trigger on emit('fired');
emitter.on('fired', function() {
    console.log('yes');
});

//will trigger on emit('fired') and emit('fired.one');
emitter.on('fired.one', function() {
    console.log('yes');
});

//will trigger on emit('fired'), emit('fired.one') and emit('fired.two')
emitter.on('fired.one.two', function() {
    console.log('yes');
});
```

## Running tests

```
$ npm install
$ npm test
```

## License

(The MIT License)

