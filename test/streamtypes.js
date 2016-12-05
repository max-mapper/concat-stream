var concat = require('../')
var test = require('tape')
var stream = require('readable-stream')

test('writable', function(t){
    t.plan(3)
    var writable = concat(function (data) {
        t.equal(data.toString('utf8'), 'foobar')
    })
    t.ok(writable instanceof stream.Writable)
    t.ok(writable.isConcatStream)
    var readable = new stream.Readable
    readable.push('foo')
    readable.push('bar')
    readable.push(null)
    readable.pipe(writable)
});

test('readable', function(t){
    t.plan(3)
    var readable = concat(['foo', 'bar'])
    t.ok(readable instanceof stream.Readable)
    t.ok(readable.isConcatStream)
    readable.once('data', function(data){
        t.equal(data.toString('utf8'), 'foobar')
    })
});

test('duplex', function (t) {
    t.plan(3)
    var duplex = concat()
    t.ok(duplex instanceof stream.Duplex)
    t.ok(duplex.isConcatStream)
    var readable = new stream.Readable
    readable.push('foo')
    readable.push('bar')
    readable.push(null)
    readable.pipe(duplex)
    duplex.once('data', function (data) {
        t.equal(data.toString('utf8'), 'foobar')
    })
})

var dummy_transform = function (source) {return source.toString('utf8').replace(/^upstream$/, 'downstream')}

test('duplex /w transform', function (t) {
    t.plan(1)
    var duplex = concat({transform: dummy_transform})
    var readable = new stream.Readable
    readable.push('up')
    readable.push('stream')
    readable.push(null)
    readable.pipe(duplex)
    duplex.once('data', function (data) {
        t.equal(data.toString('utf8'), 'downstream')
    })
})

test('writable /w transform', function (t) {
    t.plan(1)
    var writable = concat({transform: dummy_transform}, function (data) {
        t.equal(data.toString('utf8'), 'downstream')
    })
    var readable = new stream.Readable
    readable.push('up')
    readable.push('stream')
    readable.push(null)
    readable.pipe(writable)
})

test('readable /w transform', function (t) {
    t.plan(1)
    var readable = concat({transform: dummy_transform}, ['up', 'stream'])
    readable.once('data', function (data) {
        t.equal(data.toString('utf8'), 'downstream')
    })
})