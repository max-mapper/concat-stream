var Writable = require('stream').Writable
var inherits = require('inherits')

function ConcatStream(cb, opts) {
  if (!(this instanceof ConcatStream)) return new ConcatStream(cb, opts)
  Writable.call(this, { objectMode: true })
  if (!opts) opts = {}
  if (cb) this.on('finish', function () { cb(this.getBody()) })
  this.mode = opts.mode || 'buffer'
  this.body = []
}

module.exports = ConcatStream
inherits(ConcatStream, Writable)

ConcatStream.prototype._write = function(chunk, enc, next) {
  if (this.mode !== 'buffer') {
    this.body.push(chunk)
  }
  else if (Buffer.isBuffer(chunk)) {
    this.body.push(chunk)
  }
  else if (typeof chunk === 'string' || isArrayish(chunk)) {
    this.body.push(Buffer(chunk))
  }
  else {
    this.body.push(Buffer(String(chunk)))
  }
  next()
}

ConcatStream.prototype.getBody = function () {
  if (this.mode === 'array') return this.body
  if (this.mode === 'string') return this.body.join('')
  if (this.mode === 'buffer') return Buffer.concat(this.body)
  return this.body
}

var isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

function isArrayish (arr) {
  return /Array\]$/.test(Object.prototype.toString.call(arr))
}
