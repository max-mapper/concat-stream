var concat = require('../')
var test = require('tape')

test('string -> buffer stream', function (t) {
  t.plan(2)
  var strings = concat(function(out) {
    t.ok(Buffer.isBuffer(out))
    t.equal(out.toString('utf8'), 'nacho dogs')
  })
  strings.write("nacho ")
  strings.write("dogs")
  strings.end()
})

test('string stream', function (t) {
  t.plan(2)
  var strings = concat({ mode: 'string' }, function(out) {
    t.equal(typeof out, 'string')
    t.equal(out, 'nacho dogs')
  })
  strings.write("nacho ")
  strings.write("dogs")
  strings.end()
})
