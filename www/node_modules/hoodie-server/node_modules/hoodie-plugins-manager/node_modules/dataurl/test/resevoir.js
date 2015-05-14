const util = require('util');
const Stream = require('stream');

function Resevoir() {
  if (!(this instanceof Resevoir))
    return new Resevoir;
  this.writable = true;
  this.readable = true;
  this.contents = Buffer(0);
}
util.inherits(Resevoir, Stream);
Resevoir.prototype.write = function write(data) {
  this.contents = Buffer.concat([this.contents, Buffer(data)]);
  this.emit('data', data);
};
Resevoir.prototype.end = function end(data) {
  if (data)
    this.write(data);
  this.emit('end');
  this.emit('done', this.contents);
  this.writable = false;
  this.readable = false;
};
module.exports = Resevoir;
