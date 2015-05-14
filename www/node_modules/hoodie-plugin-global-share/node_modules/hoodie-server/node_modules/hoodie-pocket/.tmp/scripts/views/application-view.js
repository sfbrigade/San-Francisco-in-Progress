(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.ApplicationView = (function(_super) {

    __extends(ApplicationView, _super);

    function ApplicationView() {
      return ApplicationView.__super__.constructor.apply(this, arguments);
    }

    ApplicationView.prototype.events = {
      "click a": "handleLinks"
    };

    ApplicationView.prototype.views = {
      "body": new Pocket.MainView
    };

    ApplicationView.prototype.initialize = function() {
      ApplicationView.__super__.initialize.apply(this, arguments);
      this.setElement($('html'));
      return this.render();
    };

    ApplicationView.prototype.handleLinks = function(event) {
      var path;
      path = $(event.target).attr('href');
      if (/\.pdf$/.test(path)) {
        return true;
      }
      if (/^\/[^\/]/.test(path)) {
        pocket.router.navigate(path.substr(1), true);
        return false;
      }
    };

    ApplicationView.prototype.beforeRender = function() {
      if (pocket.isAuthenticated) {
        this.views.body.template = 'main';
      } else {
        this.views.body.template = 'signin';
      }
      console.log('@views.body.template', this.views.body.template);
      return ApplicationView.__super__.beforeRender.apply(this, arguments);
    };

    return ApplicationView;

  })(Pocket.BaseView);

}).call(this);
