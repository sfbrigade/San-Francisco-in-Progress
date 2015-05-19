(function() {
  var whereTheMagicHappens;

  if (location.hostname === 'localhost' && location.port === "9000") {
    whereTheMagicHappens = "http://pocket.dev/_api";
    whereTheMagicHappens = "http://127.0.0.1:6022/_api";
    whereTheMagicHappens = "http://127.0.0.1:6014/_api";
  } else {
    whereTheMagicHappens = void 0;
  }

  window.hoodieAdmin = new HoodieAdmin(whereTheMagicHappens);

  Backbone.Layout.configure({
    manage: true,
    fetch: function(path) {
      return JST[path];
    }
  });

  jQuery(document).ready(function() {
    return new Pocket;
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Pocket = (function(_super) {

    __extends(Pocket, _super);

    function Pocket() {
      this.setAppInfo = __bind(this.setAppInfo, this);

      this.loadAppConfig = __bind(this.loadAppConfig, this);

      this.loadAppInfo = __bind(this.loadAppInfo, this);

      this.onSignOutSuccess = __bind(this.onSignOutSuccess, this);

      this.onSignOutFail = __bind(this.onSignOutFail, this);

      this.handleAuthenticateError = __bind(this.handleAuthenticateError, this);

      this.handleAuthenticateSuccess = __bind(this.handleAuthenticateSuccess, this);

      this.authenticate = __bind(this.authenticate, this);

      var _this = this;
      window.pocket = this;
      this.setElement('html');
      this.registerHandlebarsHelpers();
      this.registerListeners();
      this.handleSignInAndSignOut();
      $.when(this.loadAppInfo(), this.authenticate()).then(function() {
        _this.router = new Pocket.Router;
        _this.app = new Pocket.ApplicationView;
        return Backbone.history.start();
      });
    }

    Pocket.prototype.setElement = function(selector) {
      return this.$el = $(selector);
    };

    Pocket.prototype.authenticate = function() {
      return hoodieAdmin.authenticate().then(this.handleAuthenticateSuccess, this.handleAuthenticateError);
    };

    Pocket.prototype.handleAuthenticateSuccess = function() {
      var _this = this;
      this.isAuthenticated = true;
      this.$el.addClass('authenticated');
      return $.when(this.loadAppConfig()).then(function() {
        return hoodieAdmin.resolveWith(_this.isAuthenticated);
      });
    };

    Pocket.prototype.handleAuthenticateError = function() {
      this.isAuthenticated = false;
      return hoodieAdmin.resolveWith(this.isAuthenticated);
    };

    Pocket.prototype.handleConditionalFormElements = function(el, speed) {
      var condition, conditions, requirement, requirementMet, target, _i, _len, _results;
      if (speed == null) {
        speed = 250;
      }
      conditions = $(el).data("conditions");
      conditions = conditions.split(',');
      _results = [];
      for (_i = 0, _len = conditions.length; _i < _len; _i++) {
        condition = conditions[_i];
        requirement = condition.split(':')[0];
        target = condition.split(':')[1];
        requirementMet = false;
        if ($(el).is('input[type=checkbox]')) {
          if ($(el).is(':checked') && requirement === "true") {
            requirementMet = true;
          }
          if (!$(el).is(':checked') && requirement === "false") {
            requirementMet = true;
          }
        }
        if ($(el).val() === requirement) {
          requirementMet = true;
        }
        if (requirementMet) {
          _results.push($(target).slideDown(speed));
        } else {
          _results.push($(target).slideUp(speed));
        }
      }
      return _results;
    };

    Pocket.prototype.registerListeners = function() {
      var _this = this;
      $("body").on("change", ".formCondition", function(event) {
        return _this.handleConditionalFormElements(event.target);
      });
      $("body").on("click", "a.signOut", function(event) {
        event.preventDefault();
        return hoodieAdmin.signOut().done(_this.onSignOutSuccess).fail(_this.onSignOutFail);
      });
      return $("body").on("click", ".toggler", function(event) {
        $(this).toggleClass('open');
        return $(this).siblings('.togglee').slideToggle(150);
      });
    };

    Pocket.prototype.registerHandlebarsHelpers = function() {
      Handlebars.registerHelper('testHelper', function(name, context) {
        return "HANDLEBARS TESTHELPER";
      });
      Handlebars.registerHelper('convertTimestampToISO', function(timestamp) {
        if (!timestamp) {
          return;
        }
        if (timestamp.toString().length === 10) {
          timestamp += '000';
        }
        return JSON.parse(JSON.stringify(new Date(parseInt(timestamp))));
      });
      Handlebars.registerHelper('convertISOToTimestamp', function(ISODate) {
        if (!ISODate) {
          return;
        }
        return new Date(ISODate).getTime();
      });
      Handlebars.registerHelper('convertISOToHuman', function(ISODate) {
        return "hey " + ISODate;
      });
      Handlebars.registerHelper('defaultReplyMailAddress', function() {
        if (!pocket.appInfo.name) {
          return "please-reply@your-app.com";
        }
        if (pocket.appInfo.name.indexOf(".") === -1) {
          return "please-reply@" + pocket.appInfo.name + ".com";
        } else {
          return "please-reply@" + pocket.appInfo.name;
        }
        return pocket.appInfo.defaultReplyEmailAddress;
      });
      Handlebars.registerHelper('linkToFutonUser', function(userName) {
        var couchUrl;
        couchUrl = hoodieAdmin.baseUrl.replace('http://', 'http://couch.').replace('_api', '_utils');
        return couchUrl + '/document.html?_users/org.couchdb.user:' + userName;
      });
      Handlebars.registerHelper("debug", function(optionalValue) {
        console.log("\nCurrent Context");
        console.log("====================");
        console.log(this);
        if (arguments.length > 1) {
          console.log("Value");
          console.log("====================");
          return console.log(optionalValue);
        }
      });
      Handlebars.registerHelper('positiveSuccessNegativeWarning', function(value) {
        if (value > 0) {
          return 'success';
        } else {
          return 'warning';
        }
      });
      Handlebars.registerHelper('positiveWarningNegativeSuccess', function(value) {
        if (value > 0) {
          return 'warning';
        } else {
          return 'success';
        }
      });
      return null;
    };

    Pocket.prototype.onSignOutFail = function() {
      return console.log("Could not sign you out.");
    };

    Pocket.prototype.onSignOutSuccess = function() {
      return window.location.reload();
    };

    Pocket.prototype.handleSignInAndSignOut = function() {
      var _this = this;
      hoodieAdmin.account.on('signin', function() {
        _this.isAuthenticated = true;
        return _this.app.render();
      });
      return hoodieAdmin.account.on('signout', function() {
        _this.isAuthenticated = false;
        return _this.app.render();
      });
    };

    Pocket.prototype.loadAppInfo = function() {
      return hoodieAdmin.app.getInfo().pipe(this.setAppInfo);
    };

    Pocket.prototype.loadAppConfig = function() {
      return hoodieAdmin.config.reload();
    };

    Pocket.prototype.setAppInfo = function(info) {
      console.log('info', info);
      return pocket.appInfo = info;
    };

    return Pocket;

  })(Backbone.Events);

}).call(this);

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

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.SidebarView = (function(_super) {

    __extends(SidebarView, _super);

    function SidebarView() {
      this.renderPlugins = __bind(this.renderPlugins, this);

      this.updateUserCount = __bind(this.updateUserCount, this);

      this.renderAppName = __bind(this.renderAppName, this);
      return SidebarView.__super__.constructor.apply(this, arguments);
    }

    SidebarView.prototype.template = 'sidebar';

    SidebarView.prototype.handleNavigationStates = function(route) {
      var $el;
      route = route.replace('route:', '');
      $el = $('nav a[href="/#' + route + '"]').parent();
      if (!$el.hasClass("active")) {
        $("nav li.active").removeClass("active");
        return $el.addClass("active");
      }
    };

    SidebarView.prototype.afterRender = function() {
      var _this = this;
      this.loadAppName();
      Backbone.history.bind("all", function(route) {
        return _this.handleNavigationStates(Backbone.history.fragment);
      });
      this.loadPlugins();
      return SidebarView.__super__.afterRender.apply(this, arguments);
    };

    SidebarView.prototype.loadAppName = function() {
      return hoodieAdmin.app.getInfo().then(this.renderAppName);
    };

    SidebarView.prototype.renderAppName = function(appInfo) {
      this.appInfo = appInfo;
      this.$el.find('header .appName a').text(this.appInfo.name);
      return $('.sidebar header .appName').bigtext({
        maxfontsize: 20
      });
    };

    SidebarView.prototype.getUserPluginLabel = function(totalUsers) {
      this.totalUsers = totalUsers;
      switch (this.totalUsers) {
        case 0:
          return this.label = "No users";
        case 1:
          return this.label = "One user";
        default:
          return this.label = "" + this.totalUsers + " users";
      }
    };

    SidebarView.prototype.updateUserCount = function(eventName, userObject) {
      var _this = this;
      return $.when(hoodieAdmin.users.getTotal()).then(function(totalUsers) {
        _this.totalUsers = totalUsers;
        return $('.sidebar .plugins .users .name').text(_this.getUserPluginLabel(_this.totalUsers));
      });
    };

    SidebarView.prototype.loadPlugins = function() {
      var debouncedUserCount;
      debouncedUserCount = _.debounce(this.updateUserCount, 300);
      hoodieAdmin.users.on("change", function(eventName, userObject) {
        return debouncedUserCount(eventName, userObject);
      });
      hoodieAdmin.users.connect();
      return $.when(hoodieAdmin.plugins.findAll(), hoodieAdmin.users.getTotal()).then(this.renderPlugins);
    };

    SidebarView.prototype.renderPlugins = function(plugins, totalUsers) {
      var key, plugin, _ref;
      this.plugins = plugins;
      this.totalUsers = totalUsers;
      _ref = this.plugins;
      for (key in _ref) {
        plugin = _ref[key];
        plugin.url = plugin.name;
        plugin.cleanName = plugin.title;
        if (plugin.cleanName === "Users") {
          plugin.cleanName = this.getUserPluginLabel(this.totalUsers);
        }
        plugin.badgeStatus = 'badge-' + plugin.status;
        if (plugin.messages) {
          plugin.messageAmount = plugin.messages.length;
        } else {
          plugin.messageAmount = '';
        }
      }
      return this.$el.find('nav ul.plugins').html(JST['sidebar-plugins'](this));
    };

    return SidebarView;

  })(Pocket.BaseView);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.DashboardView = (function(_super) {

    __extends(DashboardView, _super);

    function DashboardView() {
      return DashboardView.__super__.constructor.apply(this, arguments);
    }

    DashboardView.prototype.template = 'dashboard';

    DashboardView.prototype.emailTransportNotConfigured = function() {
      var isConfigured, _ref, _ref1;
      isConfigured = ((_ref = this.appConfig) != null ? (_ref1 = _ref.email) != null ? _ref1.transport : void 0 : void 0) != null;
      return !isConfigured;
    };

    return DashboardView;

  })(Pocket.BaseView);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.UsersView = (function(_super) {

    __extends(UsersView, _super);

    function UsersView() {
      return UsersView.__super__.constructor.apply(this, arguments);
    }

    UsersView.prototype.template = 'users';

    return UsersView;

  })(Pocket.BaseView);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.PluginsView = (function(_super) {

    __extends(PluginsView, _super);

    function PluginsView() {
      this.beforeRender = __bind(this.beforeRender, this);
      return PluginsView.__super__.constructor.apply(this, arguments);
    }

    PluginsView.prototype.template = 'plugin';

    PluginsView.prototype.beforeRender = function() {
      this.plugin.url = this.plugin.name.replace('worker-', '');
      this.plugin.cleanName = this.makeURLHuman(this.plugin.url);
      this.appInfo = pocket.appInfo;
      this.baseUrl = hoodieAdmin.baseUrl;
      if (this.getView(".plugin-content")) {
        return this.removeView(".plugin-content");
      }
    };

    PluginsView.prototype._cachedViews = {};

    PluginsView.prototype.getPluginView = function(name) {
      if (!this._cachedViews[name]) {
        this._cachedViews[name] = new Pocket.PluginsView["plugin-" + this.plugin.name];
      }
      return this._cachedViews[name];
    };

    return PluginsView;

  })(Pocket.BaseView);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.MainView = (function(_super) {

    __extends(MainView, _super);

    function MainView() {
      this.onSignInSuccess = __bind(this.onSignInSuccess, this);

      this.onSignInFail = __bind(this.onSignInFail, this);
      return MainView.__super__.constructor.apply(this, arguments);
    }

    MainView.prototype.views = {
      ".sidebar": new Pocket.SidebarView,
      ".main": new Pocket.DashboardView
    };

    MainView.prototype.events = {
      "submit form.signIn": "signIn"
    };

    MainView.prototype.signIn = function(event) {
      var password;
      this.$el.find('#signIn').attr('disabled', 'disabled');
      event.preventDefault();
      password = this.$el.find('#signInPassword').val();
      return hoodieAdmin.signIn(password).done(this.onSignInSuccess).fail(this.onSignInFail);
    };

    MainView.prototype.onSignInFail = function() {
      $('form.signIn .error').text('Wrong password, please try again');
      return $('#signIn').attr('disabled', null);
    };

    MainView.prototype.onSignInSuccess = function() {
      return window.location.reload();
    };

    return MainView;

  })(Pocket.BaseView);

}).call(this);

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

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Pocket.Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "": "dashboard",
      "plugins/:pluginName": "plugins",
      "plugins/:pluginName/*subroute": "plugins"
    };

    Router.prototype.dashboard = function() {
      var view;
      console.log("dashboard: ");
      view = new Pocket.DashboardView;
      pocket.app.views.body.setView(".main", view);
      return $.when(hoodieAdmin.app.getStats(1358610679), hoodieAdmin.config.get()).then(function(stats, appConfig) {
        view.stats = stats;
        view.appConfig = appConfig;
        return view.render();
      });
    };

    Router.prototype.plugins = function(pluginName, subroute) {
      var _this = this;
      console.log("plugins: ", pluginName, subroute);
      if (!Pocket.Routers) {
        Pocket.Routers = {};
      }
      return hoodieAdmin.plugins.getConfig(pluginName).then(function(config) {
        var pluginViewName, view;
        pluginViewName = _this.capitaliseFirstLetter(pluginName) + "View";
        view = new Pocket.PluginsView;
        pocket.app.views.body.setView(".main", view);
        view.plugin = {
          name: pluginName,
          config: config
        };
        return view.render();
      });
    };

    Router.prototype.capitaliseFirstLetter = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return Router;

  })(Backbone.Router);

}).call(this);

this["JST"] = this["JST"] || {};

this["JST"]["dashboard"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  
  return "\n  <div class=\"alert alert-error\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n    <ul>\n      <li>\n        <a href=\"/plugins/appconfig\"><strong>Appconfig:</strong><br>\n        Emails cannot be sent, please configure email transport.</a>\n      </li>\n    </ul>\n  </div>\n  ";
  }

  buffer += "<div class=\"content centered\">\n  <h2 class=\"top\">New events for "
    + escapeExpression(((stack1 = ((stack1 = depth0.appInfo),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " since your last visit <span class=\"timeago\" title=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.convertTimestampToISO || depth0.convertTimestampToISO),stack1 ? stack1.call(depth0, ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.since), options) : helperMissing.call(depth0, "convertTimestampToISO", ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.since), options)))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.since)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span></h2>\n\n  ";
  stack2 = helpers['if'].call(depth0, depth0.emailTransportNotConfigured, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <div class=\"alert alert-info\">\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>\n    <ul>\n      <li>Plugin Signup confirmation reports: New user confirmed! (about 6 hours ago)</li>\n    </ul>\n  </div>\n\n  <div class=\"row-fluid statistics\">\n    <div class=\"panel span4 ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.positiveSuccessNegativeWarning || depth0.positiveSuccessNegativeWarning),stack1 ? stack1.call(depth0, ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.signups), options) : helperMissing.call(depth0, "positiveSuccessNegativeWarning", ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.signups), options)))
    + "\">\n      <span>New signups/past 30 days</span>\n      <h1>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.signups)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n    </div>\n    <div class=\"panel span4 ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.positiveWarningNegativeSuccess || depth0.positiveWarningNegativeSuccess),stack1 ? stack1.call(depth0, ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.account_deletions), options) : helperMissing.call(depth0, "positiveWarningNegativeSuccess", ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.account_deletions), options)))
    + "\">\n      <span>Account deletions/past 30 days</span>\n      <h1>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.account_deletions)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n    </div>\n    <div class=\"panel span4 ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.positiveSuccessNegativeWarning || depth0.positiveSuccessNegativeWarning),stack1 ? stack1.call(depth0, ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.growth), options) : helperMissing.call(depth0, "positiveSuccessNegativeWarning", ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.growth), options)))
    + "\">\n      <span>Growth/past 30 days</span>\n      <h1>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.growth)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "%</h1>\n    </div>\n  </div>\n  <div class=\"row-fluid statistics\">\n    <div class=\"panel info span4\">\n      <span>Total Users</span>\n      <h1>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.users_total)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n    </div>\n    <div class=\"panel info span4\">\n      <span>Active Users / past 30 days</span>\n      <h1>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.users_active)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n    </div>\n    <div class=\"panel span4 ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.positiveSuccessNegativeWarning || depth0.positiveSuccessNegativeWarning),stack1 ? stack1.call(depth0, ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.active), options) : helperMissing.call(depth0, "positiveSuccessNegativeWarning", ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.active), options)))
    + "\">\n      <span>Activity / past 30 days</span>\n      <h1>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.active)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "%</h1>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });

this["JST"]["layouts/application"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"topbar\">\n  <a href=\"#\" class=\"signOut\">Sign out</a>\n</div>\n<div class=\"sidebar\">\n  sidebar\n</div>\n<div class=\"main\">\n  main\n</div>";
  });

this["JST"]["main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a href=\"#\" class=\"signOut\">Sign out</a>\n\n<div class=\"sidebar\">\n\n</div>\n<div class=\"main\">\n\n</div>";
  });

this["JST"]["plugin"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"content centered\">\n  <div class=\"plugin-content\">\n    <iframe name=\"plugin\" src=\"";
  if (stack1 = helpers.baseUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.baseUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/_plugins/"
    + escapeExpression(((stack1 = ((stack1 = depth0.plugin),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/pocket/index.html";
  if (stack2 = helpers.urlParams) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.urlParams; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\"></iframe>\n  </div>\n</div>\n";
  return buffer;
  });

this["JST"]["sidebar-plugins"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<li>\n  <a href=\"/#plugins/";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" title=\"";
  if (stack1 = helpers.cleanName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.cleanName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"";
  if (stack1 = helpers.cleanName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.cleanName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <span class=\"name\">";
  if (stack1 = helpers.cleanName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.cleanName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <span class=\"badge ";
  if (stack1 = helpers.badgeStatus) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.badgeStatus; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.messageAmount) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.messageAmount; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n  </a>\n</li>\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.plugins, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

this["JST"]["sidebar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header>\n  <div class=\"logo ir\">Hoodie Pocket</div>\n  <div class=\"appName\"><div><a href=\"/#\"></a></div></div>\n</header>\n<nav>\n  <ul class=\"plugins\"></ul>\n</nav>\n";
  });

this["JST"]["signin"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"signInContainer\">\n  <div class=\"logo ir\">Hoodie Pocket</div>\n  <h2 class=\"top\">";
  if (stack1 = helpers['a']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['a']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " Welcome to "
    + escapeExpression(((stack1 = ((stack1 = depth0.appInfo),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'s Pocket</h2>\n  <form class=\"signIn form-horizontal\">\n    <section class=\"noBorder\">\n      <span class=\"error\"></span>\n      <div class=\"control-group\">\n        <label>Admin password</label>\n        <div class=\"controls\">\n          <input id=\"signInPassword\" type=\"password\" autofocus>\n        </div>\n      </div>\n      <div class=\"control-group\">\n        <label></label>\n        <div class=\"controls\">\n          <button id=\"signIn\" type=\"submit\" class=\"btn\">Sign in!</button>\n        </div>\n      </div>\n    </section>\n  </form>\n</div>\n";
  return buffer;
  });

this["JST"]["users"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <tr>\n        <td>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td>";
  if (stack1 = helpers.lastLogin) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lastLogin; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td class=\"timeago\" title=\"";
  if (stack1 = helpers.signedUpAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.signedUpAt; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.signedUpAt) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.signedUpAt; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td>";
  if (stack1 = helpers.state) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.state; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td>resend / new</td>\n        <td>edit / delete</td>\n      </tr>\n      ";
  return buffer;
  }

  buffer += "<div class=\"content centered\">\n  <h2 class=\"top\">Users</h2>\n  <div class=\"userSearch\">\n    <form class=\"form-search\">\n      <div class=\"input-append\">\n        <input type=\"text\" class=\"span2 search-query\">\n        <button type=\"submit\" class=\"btn\">Search</button>\n      </div>\n    </form>\n  </div>\n  <div class=\"tableStatus\" >\n    <p class=\"currentSearchTerm muted\">Currently displaying all users</p>\n    <p class=\"currentSearchMetrics muted\">Showing 50 of 4211 users</p>\n  </div>\n  <table class=\"table\">\n    <thead>\n      <tr>\n        <th>Username</th>\n        <th>Last seen</th>\n        <th>Signup date</th>\n        <th>State</th>\n        <th>Password</th>\n        <th></th>\n      </tr>\n    </thead>\n    <tbody>\n      ";
  stack1 = helpers.each.call(depth0, depth0.users, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </tbody>\n  </table>\n  <div class=\"tableStatus\">\n    <p class=\"currentSearchTerm muted\">Currently displaying all users</p>\n    <p class=\"currentSearchMetrics muted\">Showing 50 of 4211 users</p>\n  </div>\n</div>\n";
  return buffer;
  });