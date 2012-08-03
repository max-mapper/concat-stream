/**
 * Setup BufferJoiner.
 *
 * @api public
 */

var BufferJoiner = module.exports = function BufferJoiner() {
  if (!(this instanceof BufferJoiner)) {
    return new BufferJoiner()
  }

  Object.defineProperty(this, '_buffersList', {
    value: [],
    writable: true,
    enumerable: false,
    configurable: false
  })
  Object.defineProperty(this, '_length', {
    value: 0,
    writable: true,
    enumerable: false,
    configurable: false
  })
}

/**
 * Return `this._length`
 *
 * @api public
 */

BufferJoiner.prototype.__defineGetter__('length', function length() {
  return this._length
})

/**
 * Add buffer into the buffers list.
 *
 * @param {Buffer} buffer
 * @api public
 */

BufferJoiner.prototype.add = function add(buffer) {
  this._buffersList.push(buffer)
  this._length += buffer.length
  return this
}

/**
 * Return a joined version of the buffers list
 * add reset status. If `reAdd` return value
 * will be readded to the buffers list.
 *
 * @param {Boolean} reAdd
 * @api public
 */

BufferJoiner.prototype.join = function join(reAdd) {
  var result = new Buffer(this._length)
  var lastFreeIndex = 0
  var buffer

  while (buffer = this._buffersList.shift()) {
    buffer.copy(result, lastFreeIndex)
    lastFreeIndex += buffer.length
  }

  this._length = 0
  reAdd && this.add(result)

  return result
}