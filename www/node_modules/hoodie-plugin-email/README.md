Hoodie E-Mail Plugin
======================

Allow your users to send multipart emails, right from
the browser.

Frontend API:

```js
hoodie.email.send({
  to: 'joe@example.com',
  subject: 'Hey ho!',
  text: 'This is the text version',
  html: 'I can do <b>HTML</b>, <i>too</i>!'
})
```

Before sending email can be used, you need to configure
an email service in the Admin Dashboard.