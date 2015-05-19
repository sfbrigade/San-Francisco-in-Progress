# Admin Dashboard
[![Build Status](https://travis-ci.org/hoodiehq/hoodie-admin-dashboard.svg?branch=snug)](https://travis-ci.org/hoodiehq/hoodie-admin-dashboard)

Static HTML for now. Currently includes a fluid version of gridster.js (check out https://github.com/espy/gridster.js/blob/master/README.md to see how that works).

# Setting up the dev environment

This will enable you to work on Admin Dashboard, UIKit and plugins.

## Working on Admin Dashboard

This has improved considerably thanks to @svnlto. All you do is

````
$ git clone git@github.com:hoodiehq/hoodie-admin-dashboard.git
$ npm install
$ bower install
$ grunt browserify
````

You'll also need to `$ grunt browserify` each time you add libraries to be compiled into `libs.js`.

Then `$ grunt serve`. This will lauch Hoodie as well as the Grunt server and also connect the two, so there is no further config needed. Admin Dashboard will be running at http://0.0.0.0:9000, not at the Hoodie URLs.

You can then `$ hoodie install pluginName` as usual.

## Working on admin-dashboard-UIKit

Clone `git@github.com:hoodiehq/hoodie-admin-dashboard-UIKit.git` and do `$ npm link` in its directory. This will make a global npm package named `hoodie-admin-dashboard-UIKit` available on your system.

Now go to `yourHoodieApp/node_modules/hoodie-server/node_modules` and do `$ npm link hoodie-admin-dashboard-UIKit`.

You can now work in your UIKit-folder and see the changes in your admin-dashboard's plugins. Don't forget to `$ grunt build` the UIKit first.

## Working on a plugin

Clone the plugin and do `$ npm link` in its directory. This will make a global npm package named `hoodie-plugin-pluginName` available on your system.

If the plugin exists in npm already, you can install it now via `$ hoodie install pluginName`.

Now go to `yourHoodieApp/node_modules` and do `$ npm link hoodie-plugin-pluginName`.

If the plugin is new and not installable through `$hoodie install`, you will have to add it to the package.json manually.
