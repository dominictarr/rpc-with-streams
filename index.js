var MuxDemux = require('mux-demux')
var RPC      = require('rpc-stream')

module.exports = function (api, client) {
  var rpc = RPC(api)
  var mx = MuxDemux()
  //connect the api stream from the client side...
  //there is a better way... but i'll do that later.
  //this hack will work for now.
  if(client || 'node' !== process.title) {
    mx.on('pipe', function () {
      rpc.pipe(mx.createStream('RPC')).pipe(rpc)
    })
  }

  mx.on('connection', function (stream) {
    if(stream.meta === 'RPC') {
      return rpc.pipe(stream).pipe(rpc)
    }
    if(Array.isArray(stream.meta)) {
      var args = stream.meta.slice()
      var name = args.shift()
      var s = api[name].apply(api, args)
      if(s.writable) stream.pipe(s)
      if(s.readable) s.pipe(stream)
    }
  })

  function streamCreator (name) {
    return function () {
      var args = [].slice.call(arguments)
      args.unshift(name)
      return mx.createStream(args)
    }
  }

  mx.wrap = function (simple, streams) {
    var wrapped = rpc.wrap(simple)
    streams.forEach(function (name) {
      console.log('wrap', name)
      wrapped[name] = streamCreator(name)
    })
    return wrapped
  }

  return mx
}
