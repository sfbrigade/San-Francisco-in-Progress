[![Build Status](https://travis-ci.org/hoodiehq/hoodie-plugin-users.svg)](https://travis-ci.org/hoodiehq/hoodie-plugin-users)
[![Dependency Status](https://david-dm.org/hoodiehq/hoodie-plugin-users.svg)](https://david-dm.org/hoodiehq/hoodie-plugin-users)
[![devDependency Status](https://david-dm.org/hoodiehq/hoodie-plugin-users/dev-status.svg)](https://david-dm.org/hoodiehq/hoodie-plugin-users#info=devDependencies)


# Hoodie Plugin Template

This is a template layout for a Hoodie plugin. It contains a Gruntfile with
appropriate tasks for running jshint, unit tests and browser tests against
a Hoodie server.

You'll need to have phantomjs and grunt installed:

```
npm install -g phantomjs grunt-cli
```

## To run tests / linting

Install dev dependencies:

```
npm install
```

Then run the 'test' task

```
grunt test
```

You can also run `test:unit` or `test:browser` individually.

If your plugin depends on other plugins being present (usually it will at
least depend on the hoodie users plugin), then make sure they're included
in your devDependencies in package.json and listed in the hoodie.plugins
property. This way, they'll also get started when the browser tests are
run.

NOTE: When running the browser tests, the grunt tasks will remove the local
Hoodie 'data' directory completely so you get a clean database to test
against. Be careful you don't use this path for any data you may want to
keep!
