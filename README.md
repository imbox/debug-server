# debug-server
Take memory heapdumps or profile CPU usage

## Usage
Include the following snippet in server program

```javascript
let DebugServer = require('debug-server')
let debugServer = new DebugServer()
debugServer.start()
```

Take a memory dump by using

```bash
$ curl localhost:1337/snapshot > dump.heapsnapshot
```

A CPU profile

```bash
$ curl localhost:1337/profile > profile.cpuprofile
```
