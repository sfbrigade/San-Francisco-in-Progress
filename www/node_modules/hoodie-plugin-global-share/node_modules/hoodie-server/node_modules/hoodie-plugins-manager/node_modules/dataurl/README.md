# dataurl [![Build Status](https://travis-ci.org/brianloveswords/dataurl.png?branch=master)](https://travis-ci.org/brianloveswords/dataurl)

# Install
```bash
$ npm install dataurl
```

# Usage

## dataurl.parse(string)
Parses a dataurl string. Returns an object with three properties:

* `data` <Buffer>: unencoded data
* `mimetype` <String>: mimetype of the data, something like `'image/png'`
* `charset` <String>:  charset of the data, if specified

If the input string isn't a valid dataURL, returns `false`.

## dataurl.stream(options)
Creates a Read/Write Stream for encoding data as a DataURL.

Options expects up to three properties:

* `mimetype` <String>: Required
* `charset` <String>: Optional
* `encoded` <Boolean>: Optional

Resulting stream will emit a data event for the header, then emit 'data'
events for each chunk (base64 encoded, if necessary) as they pass
through.

Example:

```js
fs.createReadStream(pathToSomeImage).pipe(
  dataurl.stream({ mimetype: 'image/png'})
).pipe(process.stderr, {end: false});
```

## dataurl.format(options)<br>dataurl.convert(options)
Converts some data to a dataurl string. Options expects up to four properties

* `data` <Buffer>: Required
* `mimetype` <String>: Required
* `charset` <String>: Optional
* `encoded` <Boolean>: Optional, whether to base64 encode the data. Defaults to `true`

# License

MIT

```
Copyright (c) 2013 Brian J. Brennan

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
