var stream = require('stream')
var util = require('util')

function ConcatStream(cb) {
  stream.Stream.call(this)
  this.writable = true
  this.cb = cb
  this.body = []
  this.on('error', cb)
}

ConcatStream.prototype.write = function(chunk) {
  this.body.push(chunk)
}

ConcatStream.prototype.getBody = function () {
  if (this.body.length === 0) return
  if (typeof(this.body[0]) === "string") return this.body.join('')
  if (this.body[0].toString().match(/Array/)) {
    var first = false
    this.body.forEach(function(ary) {
      if (!first) return first = ary
      first.concat(ary)
    })
    return first
  }
  return this.body
}

ConcatStream.prototype.end = function() {
  this.cb(false, this.getBody())
}

util.inherits(ConcatStream, stream.Stream)

module.exports = function(cb) {
  return new ConcatStream(cb)
}

module.exports.ConcatStream = ConcatStream
