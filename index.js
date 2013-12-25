var Writable = require('stream').Writable
var inherits = require('inherits')
var TA = require('typedarray')
var U8 = typeof Uint8Array !== 'undefined' ? Uint8Array : TA.Uint8Array

function ConcatStream(opts, cb) {
  if (!(this instanceof ConcatStream)) return new ConcatStream(opts, cb)
  
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {}
  
  var encoding = String(opts.encoding || 'buffer').toLowerCase()
  
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
  if (this.encoding === 'uint8array') return u8Concat(this.body)
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

function u8Concat (parts) {
  var len = 0
  for (var i = 0; i < parts.length; i++) {
    if (typeof parts[i] === 'string') {
      parts[i] = Buffer(parts[i])
    }
    len += parts[i].length
  }
  var u8 = new U8(len)
  for (var i = 0, offset = 0; i < parts.length; i++) {
    var part = parts[i]
    for (var j = 0; j < part.length; j++) {
      u8[offset++] = part[j]
    }
  }
  return u8
}
