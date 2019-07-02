var Concat = require('../')
var test = require('tape')

test('string -> buffer stream', function (t) {
  t.plan(2)
  var strings = new Concat({ encoding: 'buffer'}, function(out) {
    t.ok(Buffer.isBuffer(out))
    t.equal(out.toString('utf8'), 'nacho dogs')
  })
  strings.write('nacho ')
  strings.write('dogs')
  strings.end()
})

test('string stream', function (t) {
  t.plan(2)
  var strings = new Concat({ encoding: 'string' }, function(out) {
    t.equal(typeof out, 'string')
    t.equal(out, 'nacho dogs')
  })
  strings.write('nacho ')
  strings.write('dogs')
  strings.end()
})

test('end chunk', function (t) {
  t.plan(1)
  var endchunk = new Concat({ encoding: 'string' }, function(out) {
    t.equal(out, 'this is the end')
  })
  endchunk.write('this ')
  endchunk.write('is the ')
  endchunk.end('end')
})

test('string from mixed write encodings', function (t) {
  t.plan(2)
  var strings = new Concat({ encoding: 'string' }, function(out) {
    t.equal(typeof out, 'string')
    t.equal(out, 'nacho dogs')
  })
  strings.write('na')
  strings.write(Buffer.from('cho'))
  strings.write([ 32, 100 ])
  var u8 = new Uint8Array(3)
  u8[0] = 111; u8[1] = 103; u8[2] = 115
  strings.end(u8)
})

test('string from buffers with multibyte characters', function (t) {
  t.plan(2)
  var strings = new Concat({ encoding: 'string' }, function(out) {
    t.equal(typeof out, 'string')
    t.equal(out, '☃☃☃☃☃☃☃☃')
  })
  var snowman = Buffer.from('☃')
  for (var i = 0; i < 8; i++) {
    strings.write(snowman.slice(0, 1))
    strings.write(snowman.slice(1))
  }
  strings.end()
})

test('string infer encoding with empty string chunk', function (t) {
  t.plan(2)
  var strings = new Concat(function(out) {
    t.equal(typeof out, 'string')
    t.equal(out, 'nacho dogs')
  })
  strings.write('')
  strings.write('nacho ')
  strings.write('dogs')
  strings.end()
})

test('to string numbers', function (t) {
  var write = new Concat(function (str) {
    t.equal(str, 'a1000')
    t.end()
  })

  write.write('a')
  write.write(1000)
  write.end()
})
