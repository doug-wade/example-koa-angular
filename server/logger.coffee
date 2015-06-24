bunyan = require "bunyan"

bunyanOptions =
  name: "example-koa-angular"
  streams: [{
      level: "info"
      stream: process.stdout
    }, {
      level: "debug"
      type: "rotating-file"
      path: "build/logger.out"
      period: "1d"
      count: 3
    }
  ]
  serializers: bunyan.stdSerializers
  src: true

separator = " "

logger = bunyan.createLogger bunyanOptions

module.exports = logger
