var spawn = require('child_process').spawn
var concat = require('./')

var cmd = spawn('ls')
cmd.stdout.pipe(
  concat(function(err, out) {
    console.log(err, out.toString())
  })
)
