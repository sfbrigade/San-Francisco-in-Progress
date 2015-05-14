# HoodieAdmin.Config
# ================

#
class HoodieAdmin.Config

  # 
  constructor: (@hoodie) ->
    @config = {}

  reload: ->
    @hoodie.request('GET', '/app/config')
    .done (response) =>
      @config = response


  get: (key) ->
    @config[key]

  set: (key, value) ->
    @config[key] = value
    @hoodie.request('PUT', '/app/config', @config)