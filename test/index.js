var streamer = require('..')
var from     = require('from')

require('tape')('test', function (t) {

  var server = streamer({
    f: function () {
      return from(function (i) {
        if(i < 10) this.emit('data', i)
        else       this.emit('end')
        return true
      })
    },
    hello: function (name, cb) {
      process.nextTick(function () {
        cb(null, 'hello '+name)

      })
    }
  })

  var client = streamer(null, true)

  client.pipe(server).pipe(client)

  var w = client.wrap(['hello'], ['f'])

  var i = 0
  w.f().on('data', function (d) {
    i++
  }).on('end', function () {
    t.equal(i, 10)
  })
  w.hello('jim', function (err, message) {
    t.equal(message, 'hello jim')
    t.end()
  })

})
