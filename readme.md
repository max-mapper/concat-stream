# concat-stream

    npm install concat-stream

then

    var concat = require('concat-stream')
    var fs = require('fs')
    
    var read = fs.createReadStream('readme.md')
    var write = concat(function(err, data) {})
    
    read.pipe(write)
    
MIT LICENSE
