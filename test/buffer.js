var concat = require('../')
var test = require('tape')

test('buffer stream', function (t) {
  t.plan(2)
  var buffers = concat(function(out) {
    t.ok(Buffer.isBuffer(out))
    t.equal(out.toString('utf8'), 'pizza Array is not a stringy cat')
  })
  buffers.write(new Buffer('pizza Array is not a ', 'utf8'))
  buffers.write(new Buffer('stringy cat'))
  buffers.end()
})
