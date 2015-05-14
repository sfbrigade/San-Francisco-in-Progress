pocket
======

The hoodie admin panel


run locally
-----------

```js
$ npm install
$ npm start
```

**Note**: Pocket is using yeoman to serve its assets. Its hoodie tries
to connect to `http://api.pocket.dev` if its served by yeoman.
So in order to test it with a real app, make sure to have the
[pocket-app]() installed and running.

If you want pocket to use a different baseUrl, set it temporarely in
[app/scripts/main.coffee:4](https://github.com/hoodiehq/pocket/blob/master/app/scripts/main.coffee#L4)


building and deployment
-----------------------

Build pocket into the www directory and push back to master, future Hoodie instances will pull from there:
`$ rm www & grunt & cp -r dist www`
