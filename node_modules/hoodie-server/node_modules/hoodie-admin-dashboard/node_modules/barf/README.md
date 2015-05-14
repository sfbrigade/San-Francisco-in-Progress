# Barf - Backbone Async Route Filter

Backbone Async Route Filter - Express style async route filters.

## Installation

```js
  npm install barf
```

or if you're into bower

```js
  bower install --save barf
```

## Usage

```js

module.exports = Backbone.Router.extend({

  routes: {
    'users': 'usersList',
    'users/:id': 'userShow'
  },

  before: {
    // Using instance methods
    'users(/:id)': 'checkAuth',
    
    // Using inline filter definition
    '*any': function (fragment, args, next) {
      console.log('Attempting to load ' + fragment + ' with arguments: ', args);
      next();
    }
  },

  after: {
    // Google analytics tracking
    '*any': function (fragment, args, next) {
      goog._trackPageview(fragment);
      next();
    }
  },

  checkAuth: function (fragment, args, next) {

    // make ajax to check authorisation here.
    $.ajax({
      data: somedata,
      success: function () {
        // if logged in execute next() to move ahead.
        next();
      },
      error: function () {
        //redirect to signIn page.
        Backbone.history.navigate('', {
          trigger: true 
        });
      }
    });
  }
});
```

## LICENSE

MIT
