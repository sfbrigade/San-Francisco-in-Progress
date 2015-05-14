Hoodie Admin
============

wip. Currently implements

```js
// initialize
var hoodieAdmin = new HoodieAdmin( /* base Url */ );

// sign in to admin account (username is hardcoded to admin)
hoodieAdmin.account.signIn(password);
// sign out
hoodieAdmin.account.signOut();
// events
hoodieAdmin.on('account:signin');
hoodieAdmin.on('account:signout');

// plugins API
hoodieAdmin.plugins.findAll();
```