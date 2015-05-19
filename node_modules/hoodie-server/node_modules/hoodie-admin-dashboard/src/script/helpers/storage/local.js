'use strict';

module.exports = {

  setItem: function (name, item) {
    if (typeof item === 'object') {
      global.localStorage.setItem(name, global.JSON.stringify(item));
    } else {
      global.localStorage.setItem(name, item);
    }
  },

  getItem: function (name) {
    var item = global.localStorage.getItem(name);

    if (typeof item !== 'undefined') {
      try {
        item = global.JSON.parse(item);
      } catch (e) {}
    }

    return item;
  },

  removeItem: function (name) {
    global.localStorage.removeItem(name);
  },

  clear: function () {
    global.localStorage.clear();
  }

};
