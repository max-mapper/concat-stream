var Concat = require('../')
var test = require('tape')

test('typed array stream', function (t) {
  t.plan(2)
  var a = new Uint8Array(5)
  a[0] = 97; a[1] = 98; a[2] = 99; a[3] = 100; a[4] = 101
  var b = new Uint8Array(3)
  b[0] = 32; b[1] = 102; b[2] = 103
  var c = new Uint8Array(4)
  c[0] = 32; c[1] = 120; c[2] = 121; c[3] = 122

  var arrays = new Concat({ encoding: 'Uint8Array' }, function(out) {
    t.equal(typeof out.subarray, 'function')
    t.deepEqual(Buffer.from(out).toString('utf8'), 'abcde fg xyz')
  })
  arrays.write(a)
  arrays.write(b)
  arrays.end(c)
})

test('typed array from strings, buffers, and arrays', function (t) {
  t.plan(2)
  var arrays = new Concat({ encoding: 'Uint8Array' }, function(out) {
    t.equal(typeof out.subarray, 'function')
    t.deepEqual(Buffer.from(out).toString('utf8'), 'abcde fg xyz')
  })
  arrays.write('abcde')
  arrays.write(Buffer.from(' fg '))
  arrays.end([ 120, 121, 122 ])
})
