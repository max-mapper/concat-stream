module.exports = process.env.BUFFER_JOINER_COV
   ? require('./lib-cov/bufferjoiner')
   : require('./lib/bufferjoiner')