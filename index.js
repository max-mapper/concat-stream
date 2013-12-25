var Writable = require('stream').Writable
var inherits = require('inherits')

function ConcatStream(opts, cb) {
  if (!(this instanceof ConcatStream)) return new ConcatStream(opts, cb)
  
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {}
  
  var encoding = opts.encoding || 'buffer'
  if (!opts.objectMode && (encoding === 'buffer' || encoding === 'string')) {
    Writable.call(this, { encoding: encoding })
  }
  else {
    Writable.call(this, { objectMode: true })
  }
  this.encoding = encoding
  
  if (cb) this.on('finish', function () { cb(this.getBody()) })
  this.body = []
}

module.exports = ConcatStream
inherits(ConcatStream, Writable)

ConcatStream.prototype._write = function(chunk, enc, next) {
  if (this.encoding !== 'buffer') {
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
  if (this.encoding === 'array') return arrayConcat(this.body)
  if (this.encoding === 'string') return this.body.join('')
  if (this.encoding === 'buffer') return Buffer.concat(this.body)
  return this.body
}

var isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

function isArrayish (arr) {
  return /Array\]$/.test(Object.prototype.toString.call(arr))
}

function arrayConcat (parts) {
  var res = []
  for (var i = 0; i < parts.length; i++) {
    res.push.apply(res, parts[i])
  }
  return res
}
