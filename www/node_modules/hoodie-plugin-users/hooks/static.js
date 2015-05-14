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
  - static hooks (this file)
  - dynamic hooks (see dynamic.js)

  The core difference is that static hooks work standalone and just
  receive a number of arguments and maybe return a value. Dynamic
  hooks get initialised with a live instance of the hoodie object,
  that is also available in worker.js, with access to the database,
  and other convenience libraries.
*/
module.exports = {
  /*
    group: server.pack.*
    description: The webserver that powers Hoodie is pwoered by
      the hapi framework (http://hapijs.com). It has the concept
      of a `pack` that defines a set of web server internals.
      Hoodie creates a pack with all the internal things it needs.
      With server.pack.* hooks, you can extend the Hoodie pack.
      See the individual hooks for details on what you can do
      with them.
  */
  /*
    name: server.pack.pre
    description: The pre-hook gets passed the pack passed as a
      parameter. At this point, the pack is freshly instantiated
      and no Hoodie-specifc setup has been done.

      You can use this to add new parts to the Hoodie server pack.
      See the hapi documentation for details:
      https://github.com/spumko/hapi/blob/master/docs/Reference.md#hapipack

    parameters:
    - `pack`: the hoodie hapi pack

    return value: undefined (no return value is expected)
  */

  // 'server.pack.pre': function (/* pack */) {
  //    console.log('hook: server.pack.pre called');
  // },

  /*
    name: server.pack.post
    description: The post-hook gets passed the pack passed as
      a parameter. At this point, the pack is fully initialised
      and all Hoodie-specific setup has been done.

      You can use this to add new parts to the Hoodie server pack
      See the hapi documentation for details:
      https://github.com/spumko/hapi/blob/master/docs/Reference.md#hapipack

    parameters:
    - `pack`: the hoodie hapi pack

    return value: undefined (no return value is expected)
  */

  // 'server.pack.post': function (/* pack */) {
  //   console.log('hook: server.pack.post called');
  // }
};
