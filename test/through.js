var concat = require('../')
var test = require('tape')

function anAsyncFunction(blob, cb) {
  cb(null, String(blob).toUpperCase())
}

test('duplex transform through concatenated stream', function (t) {
  t.plan(1)

  var through = concat({through:anAsyncFunction})
  
  through.pipe(concat(function (val) {
    t.equal('ABCD', val)
  }))

  through.write('a')
  through.write('b')
  through.write('c')
  through.write('d')
  through.end()
})