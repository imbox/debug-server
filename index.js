'use strict'
let restify = require('restify')
let profiler = require('v8-profiler-node8')

module.exports = DebugServer

function DebugServer () {
  if (!new.target) return new DebugServer()

  let server = (this.server = restify.createServer())
  server.use(restify.plugins.queryParser())

  server.get('/snapshot', function (req, res, next) {
    console.log('Take snapshot')
    let snapshot = profiler.takeSnapshot()
    snapshot.export().pipe(res).on('finish', () => {
      snapshot.delete()
      next()
    })
  })

  server.get('/profile', function (req, res, next) {
    let duration = req.query.duration || 1000

    console.log('Start profiling')
    profiler.startProfiling('')
    setTimeout(() => {
      let profile = profiler.stopProfiling('')
      console.log(profile.getHeader())
      profile.export().pipe(res).on('finish', () => {
        profile.delete()
        next()
      })
    }, duration)
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
