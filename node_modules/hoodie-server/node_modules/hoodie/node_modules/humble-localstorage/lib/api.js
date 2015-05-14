var exports = module.exports = {};
var localStorageMemory = require('localstorage-memory');
exports.hasLocalStorage = require('has-localstorage');

/**
 * returns localStorage-compatible API, either backed by window.localStorage
 * or memory if it's not available or not persistent.
 *
 * It also adds an object API (`.getObject(key)`,
 * `.setObject(key, properties)`) and a `isPresistent` property
 *
 * @returns {Object}
 */
exports.create = function () {
  var api;

  if (!exports.hasLocalStorage()) {
    api = localStorageMemory;
    api.isPersistent = false;
  } else {
    api = global.localStorage;
    api = {
      get length() { return global.localStorage.length; },
      getItem: global.localStorage.getItem.bind(global.localStorage),
      setItem: global.localStorage.setItem.bind(global.localStorage),
      removeItem: global.localStorage.removeItem.bind(global.localStorage),
      key: global.localStorage.key.bind(global.localStorage),
      clear: global.localStorage.clear.bind(global.localStorage),
    };

    api.isPersistent = true;
  }

  api.getObject = exports.getObject.bind(null, api);
  api.setObject = exports.setObject.bind(null, api);

  return api;
};

/**
 * sets key to passed Object.
 *
 * @returns undefined
 */
exports.setObject = function (store, key, object) {
  if (typeof object !== 'object') {
    return store.setItem(key, object);
  }

  return store.setItem(key, JSON.stringify(object));
};

/**
 * returns Object for key, or null
 *
 * @returns {Object|null}
 */
exports.getObject = function (store, key) {
  var item = store.getItem(key);

  if (!item) {
    return null;
  }

  try {
    return JSON.parse(item);
  } catch (e) {
    return item;
  }
};
