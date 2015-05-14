# HoodieAdmin.App
# ================

# provides several methods to load app wide stats
# 
class HoodieAdmin.App

  constructor : (@hoodie) ->

  # getAppInfo
  # --------------

  #
  getInfo : ->

    defer = @hoodie.defer()

    # dummy app info
    info =
      name: "appName here"

    window.setTimeout ->
      defer.resolve(info)

    return defer.promise()


  # getStats
  # --------------

  #
  getStats : (since) ->

    defer = @hoodie.defer()

    # dummy stats
    stats =
      signups: 12
      account_deletions: 3
      users_active: 1302
      users_total: 4211
      growth: 0.04
      active: -0.02
      since: since

    unless since
      for key of stats
        stats[key] = stats[key] * 17

    window.setTimeout -> defer.resolve(stats)

    return defer.promise()
