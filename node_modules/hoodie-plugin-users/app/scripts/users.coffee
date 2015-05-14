class window.Users extends Backbone.Events

  # this is the entry point of your application.
  constructor: ->
    window.users = this

    @setElement('html')
    @registerHandlebarsHelpers()
    @registerListeners()

    @router = new Users.Router
    @app    = new Users.ApplicationView

    Backbone.history.start()
    @app.render()

  #
  setElement: (selector) ->
    @$el = $ selector

  #
  handleConditionalFormElements: (el, speed = 250) ->
    conditions = $(el).data "conditions"
    conditions = conditions.split ','
    for condition in conditions
      requirement = condition.split(':')[0]
      target = condition.split(':')[1]
      requirementMet = false

      # checkboxes are extra special little bunnies
      if $(el).is('input[type=checkbox]')
        # is it supposed to be checked?
        if $(el).is(':checked') && requirement == "true"
          requirementMet = true
        # is it supposed to be unchecked?
        if !$(el).is(':checked') && requirement == "false"
          requirementMet = true

      # other non-checkbox inputs
      if $(el).val() is requirement
        requirementMet = true

      if requirementMet
        $(target).slideDown speed
      else
        $(target).slideUp speed

  #
  registerListeners: ->
    # generic handler for contitional form elements
    $("body").on "change", ".formCondition", (event) =>
      @handleConditionalFormElements(event.target)
    # generic toggleable fieldset
    $("body").on "click", ".toggler", (event) ->
      $(@).toggleClass('open')
      $(@).siblings('.togglee').slideToggle(150)

  #
  registerHandlebarsHelpers: ->
    Handlebars.registerHelper 'testHelper', (name, context) ->
      return "HANDLEBARS TESTHELPER"

    # We need ISO-formatted dates for timeago
    Handlebars.registerHelper 'convertTimestampToISO', (timestamp) ->
      return unless timestamp
      if timestamp.toString().length is 10
        timestamp += '000'
      # This won't work in IE7
      return JSON.parse(JSON.stringify(new Date(parseInt(timestamp))))

    Handlebars.registerHelper 'convertISOToTimestamp', (ISODate) ->
      return unless ISODate
      return new Date(ISODate).getTime()

    Handlebars.registerHelper 'convertISOToHuman', (ISODate) ->
      return "hey "+ISODate

    # Generates a generic default reply-to address for the app
    Handlebars.registerHelper 'defaultReplyMailAddress', () ->
      if !users.appInfo.name
        return "please-reply@your-app.com"
      if users.appInfo.name.indexOf(".") is -1
        return "please-reply@"+users.appInfo.name+".com"
      else
        return "please-reply@"+users.appInfo.name
      return users.appInfo.defaultReplyEmailAddress

    # Generates the Futon URL for a given username
    Handlebars.registerHelper 'linkToFutonUser', (userName) ->
      return window.location.origin + '/_api/_utils/document.html?_users/org.couchdb.user:' + userName

    Handlebars.registerHelper "debug", (optionalValue) ->
      console.log("\nCurrent Context");
      console.log("====================");
      console.log(this);

      if (optionalValue)
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);

    Handlebars.registerHelper 'inArray', (haystack, needle, options) ->
      if haystack.indexOf(needle) isnt -1
        return options.fn(this);
      else
        return options.inverse(this);

    # Style Helpers
    # These return class names depending on the value passed
    # Used for dashboard panel colors
    Handlebars.registerHelper 'positiveSuccessNegativeWarning', (value) ->
      if value > 0
        return 'success'
      else
        return 'warning'

    Handlebars.registerHelper 'positiveWarningNegativeSuccess', (value) ->
      if value > 0
        return 'warning'
      else
        return 'success'

    return null

  loadAppInfo: =>
    hoodieAdmin.app.getInfo().pipe(@setAppInfo)

  setAppInfo: (info) =>
    console.log 'info', info
    users.appInfo = info
