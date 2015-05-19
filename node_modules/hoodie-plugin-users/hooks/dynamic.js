/*
  Hooks allow you to alter the behaviour of hoodie-server,
  Hoodie’s core backend module.

  This is possible:
  - get a notification when something in hoodie-server happens
  - extend core features of hoodie-server from a plugin

  A hook is defined as a function that takes a number of arguments
  and possibly a return value. Each hook has its own conventions,
  based on where in hoodie-server it hooks into.

  There are fundamentally two types of hooks:
  - static hooks (see static.js)
  - dynamic hooks (this file)

  The core difference is that static hooks work standalone and just
  receive a number of arguments and maybe return a value. Dynamic
  hooks get initialised with a live instance of the hoodie object,
  that is also available in worker.js, with access to the database,
  and other convenience libraries.
*/
module.exports = function (/* hoodie */) {

  return {
    /*
      group: server.api.*
      description: The server.api group allows you to extend the
        /_api endpoint from hoodie-server.
    */
    /*
      name: server.api.plugin-request
      description: This hook handles any request to
        `/_api/_plugins/{pluginname}/_api`. It gets the regular
         hapi request and reply objects as parameters.
         See https://github.com/spumko/hapi/blob/master/docs/Reference.md#request-object
         and https://github.com/spumko/hapi/blob/master/docs/Reference.md#reply-interface
         for details.

      parameters:
      - request: the hapi request object
      - reply: the hapi reply object

      return value: boolen
        false determines that the hook didn’t run successfully and causes Hoodie to
        return a 500 error.
    */
    // 'server.api.plugin-request': function (/* request, reply */) {
    //   console.log('server.api.plugin-request hook called');

    //   Use `hoodie` like you would in worker.js to access the
    //   main data store

    //   return true
    // }
  };
};
