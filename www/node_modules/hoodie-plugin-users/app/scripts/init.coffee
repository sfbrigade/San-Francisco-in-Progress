window.hoodieAdmin = top.hoodieAdmin
# Nasty hacks and mocks
hoodieAdmin.id = -> 'id'
hoodieAdmin.uuid = -> Math.random().toString().substr(2)

# configure Backbone Layoutmanager
Backbone.Layout.configure

  # augment Backbone Views
  manage: true

  # get precompiled Handlebars template
  fetch: (path) ->
    JST[path]

# init when page loaded
jQuery(document).ready ->
  new Users
