(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.BaseView = (function(_super) {

    __extends(BaseView, _super);

    function BaseView() {
      return BaseView.__super__.constructor.apply(this, arguments);
    }

    BaseView.prototype.helper = function() {
      return console.log("HELPDERP");
    };

    BaseView.prototype.serialize = function() {
      return this;
    };

    BaseView.prototype.beforeRender = function() {
      return this.appInfo = pocket.appInfo;
    };

    BaseView.prototype.afterRender = function() {
      return $('.timeago').timeago();
    };

    BaseView.prototype.makeURLHuman = function(string) {
      var result;
      this.string = string;
      result = this.string.replace(/-/g, ' ');
      return result = result.charAt(0).toUpperCase() + result.slice(1);
    };

    return BaseView;

  })(Backbone.Layout);

}).call(this);
