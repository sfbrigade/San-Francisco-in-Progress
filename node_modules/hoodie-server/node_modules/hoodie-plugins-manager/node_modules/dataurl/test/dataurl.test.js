const test = require('tap').test;
const dataurl = require('../');
const fs = require('fs');
const resevoir = require('./resevoir');

const TEST_FILE = fs.readFileSync(__dirname + '/reddot.png');
const TEST_DATAURL = 'data:image/png;base64,'+TEST_FILE.toString('base64');

function createTestStream(options) {
  return fs.createReadStream(__dirname + '/reddot.png', options);
}

test('dataurl.parse', function (t) {
  const file = dataurl.parse(TEST_DATAURL);
  t.ok(file, 'should not have an error');
  t.same(file.data, TEST_FILE, 'should be the expected file');
  t.same(file.mimetype, 'image/png', 'should be a png');
  t.notOk(file.charset, 'should not exist')
  t.end();
});

test('dataurl.parse: html, unencoded', function (t) {
  const type = 'text/html';
  const data = '<h1>hi</h1>';
  const dataurlstring = 'data:'+type+',' + data;
  const file = dataurl.parse(dataurlstring);
  t.ok(file, 'should not have an error');
  t.same(file.data.toString(), data, 'should have the same data');
  t.same(file.mimetype, 'text/html');
  t.end();
});

test('dataurl.parse: plain, encoded, utf8', function (t) {
  const string = '我々は空間に浮遊している紳士淑女';
  const data = Buffer(string).toString('base64');
  const dataurlstring = 'data:;charset=utf8;base64,' + data;
  const file = dataurl.parse(dataurlstring);
  t.ok(file, 'should not have an error');
  t.same(file.data.toString(file.charset), string, 'data should represent the right string');
  t.same(file.mimetype, 'text/plain');
  t.end();
});

test('dataurl.convert, sync', function (t) {
  const result = dataurl.convert({
    data: TEST_FILE,
    mimetype: 'image/png'
  });
  const expect = TEST_DATAURL;
  t.same(result, expect, 'should be the right data url');
  t.end();
});

test('dataurl.convert, stream', function (t) {
  const inputStream = createTestStream();
  const ds = dataurl.stream({mimetype:'image/png'});
  const bucket = resevoir();
  ds.pipe(bucket);
  inputStream.pipe(ds)
  bucket.on('done', function (contents) {
    t.same(contents.toString(), TEST_DATAURL, 'should have correct contents');
    t.end();
  });
});

test('dataurl.convert, slow stream', function (t) {
  const inputStream = createTestStream({ bufferSize: 1 });
  const ds = dataurl.stream({mimetype:'image/png'});
  inputStream.pipe(ds).pipe(resevoir()).on('done', function (contents) {
    t.same(contents.toString(), TEST_DATAURL, 'should have correct contents');
    t.end();
  });
});


