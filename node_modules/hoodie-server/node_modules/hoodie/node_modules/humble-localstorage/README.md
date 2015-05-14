# humble-localstorage

> wraps localStorage and adds .getObject(), .setObject(), .isPersistent

[![Build Status](https://travis-ci.org/gr2m/humble-localstorage.png?branch=master)](https://travis-ci.org/gr2m/humble-localstorage/)
[![Dependencies Status](https://david-dm.org/gr2m/humble-localstorage.svg)](https://david-dm.org/gr2m/humble-localstorage)
[![devDependency Status](https://david-dm.org/gr2m/humble-localstorage/dev-status.svg)](https://david-dm.org/gr2m/humble-localstorage#info=devDependencies)

`localStorage` is a simple key/value store API for browsers, perfectly
suited to store little amount of data like configurations.

`humbleLocalStorage` provides additional APIs to store / retrieve
JSON objects, and also handles several circumstances in which Browsers
do not support or persist localStorage (e.g. private modes,
Cookies disabled, etc).

In case data cannot be persisted in localStorage,  `humbleLocalStorage`
falls back to in-memory storage. To determine if data is being persisted,
use `humbleLocalStorage.isPersistent` property.


## Installation

- Download: https://github.com/gr2m/humble-localstorage/releases
- or: install via Bower: `bower install -S humble-localstorage`
- or: install via npm: `npm install -S humble-localstorage`


## Usage

```js
humbleLocalStorage.getItem('mykey') // string value or null
humbleLocalStorage.setItem('mykey', 123) // stored as '123'
humbleLocalStorage.removeItem('mykey')
humbleLocalStorage.clear() // removes all data
humbleLocalStorage.key(0) // name of key by numeric index, or null
humbleLocalStorage.length // number of stored keys

humbleLocalStorage.getObject('mykey') // JSON value or null
humbleLocalStorage.setObject('mykey', {foo: 'bar'}) // stored as '{"foo": "bar"}'
humbleLocalStorage.isPersistent // true if data persists page reload, false if not
```


## Run tests

```
# see all available tasks
npm run

# run unit & integration tests
# note: selenium must be running
npm test
```

## License

MIT
