var concat = require('../')

// string stream
var strings = concat(function(out) {
  console.log('strings', out)
})
strings.write("nacho ")
strings.write("dogs")
strings.end()

// reemit
var emitter = concat()
var receiver = concat(function (out) {
  console.log('strings', out)
})
emitter.pipe(receiver)
emitter.write('pizza')
emitter.write(' is dope')
emitter.end()

// chunk passed to end
var endchunk = concat(function(out) {
  console.log('strings', out)
})
endchunk.write("this ")
endchunk.write("is the ")
endchunk.end("end")
