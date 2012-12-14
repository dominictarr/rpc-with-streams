# stream-rpc

[rpc-stream](https://github.com/dominictarr/rpc-stream) but with streams

[![server-tests](https://travis-ci.org/dominictarr/stream-rpc)
](https://secure.travis-ci.org/dominictarr/stream-rpc.png?branch=master)

[![browser-support](https://ci.testling.com/dominictarr/stream-rpc.png)
](https://ci.testling.com/dominictarr/stream-rpc)

``` js
//server
var RPC = require('rpc-with-streams')
var net = require('net')
var fs = require('fs')

var rpc = RPC(fs)
net.createStream(function (stream) {
  stream.pipe(rpc).pipe(stream)
}).listen(PORT)
```

``` js
//client
var RPC = require('rpc-with-streams')
var net = require('net')
var rpc = RPC(fs)
var stream = net.connect(PORT)

stream.pipe(rpc).pipe(stream)
//create a partial wrapper of the fs module.
var fs = rpc.wrap(
  ['readFile', 'writeFile', 'unlinkFile', 'stat'],
  ['createReadStream', 'createWriteStream']
)
```

Note, stuff that depends on properties that get set on streams
(like the `.path` property on fs streams will not work)

## License

MIT
