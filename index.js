'use strict'
let restify = require('restify')
let profiler = require('v8-profiler')

module.exports = DebugServer

function DebugServer () {
  if (!new.target) return new DebugServer()

  let server = this.server = restify.createServer()
  server.get('/snapshot', function (req, res, next) {
    console.log('Take snapshot')
    let snapshot = profiler.takeSnapshot()
    snapshot.export().pipe(res).on('finish', () => {
      snapshot.delete()
      next()
    })
  })

  server.get('/profile', function (req, res, next) {
    console.log('Start profiling')
    profiler.startProfiling('')
    setTimeout(() => {
      let profile = profiler.stopProfiling('')
      console.log(profile.getHeader())
      profile.export().pipe(res).on('finish', () => {
        profile.delete()
        next()
      })
    }, 1000)
  })
}

DebugServer.prototype.start = function () {
  let server = this.server
  server.listen(1337, () => {
    console.log(`DebugServer listening on ${server.url}`)
  })
}

DebugServer.prototype.stop = function () {
  this.server.destroy()
}
