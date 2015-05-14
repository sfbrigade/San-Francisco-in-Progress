module.exports = {
  jquery: {
    exports: '$'
  },
  lodash: {
    exports: '_'
  },
  underscore: {
    exports: '_'
  },
  backbone: {
    exports: 'Backbone',
    depends: {
      lodash: 'lodash',
      underscore: 'underscore',
      jquery: 'jQuery'
    }
  },
  'backbone.babysitter': {
    exports: 'Backbone.Babysitter',
    depends: {
      backbone: 'Backbone'
    }
  },
  'backbone.wreqr': {
    exports: 'Backbone.Wreqr',
    depends: {
      backbone: 'Backbone'
    }
  },
  'backbone.marionette': {
    exports: 'Marionette',
    depends: {
      jquery: '$',
      backbone: 'Backbone',
      underscore: '_'
    }
  },
  gridster: {
    exports: '$.fn.gridster',
    depends: {
      jquery: '$'
    }
  },
  // barf: {
  //   exports: 'Backbone.Router',
  //   depends: {
  //     backbone: 'Backbone'
  //   }
  // },
  'backbone.syphon': {
    exports: 'Backbone.Syphon',
    depends: {
      backbone: 'Backbone'
    }
  }
}
