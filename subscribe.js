'use strict'

const nats = require('nats')
const argv = require('minimist')(process.argv.slice(2))

const url = argv.s || 'localhost'
const creds = argv.creds || null
const queue = argv.queue  || null
const subject = argv._[0]
const response = argv._[1] || null

if (!subject) {
  console.log('Usage: subscribe [-s server] [--creds=filepath] [--queue=qname] <subject> [response]')
  process.exit()
}

// Connect to NATS server.
const nc = nats.connect(url, nats.creds(creds))

nc.on('connect', () => {
  const opts = {}
  if (queue) {
    opts.queue = queue
  }

  let count = 0
  nc.subscribe(subject, opts, (msg, reply) => {
    console.log('Received "' + msg + '"')

    if (msg === 'shutdown') {
      nc.flush(() => {
        console.log('Shutting down...')
        nc.close()
        console.log('Closed.')
      })
    } else if (reply) {
      const d = response || msg
      nc.publish(reply, d)
      console.log('Sent [' + count++ + '] reply "' + d + '"')
      return
    }
  })
  if (queue) {
    console.log('Queue [' + queue + '] listening on [' + subject + ']')
  } else {
    console.log('Listening on [' + subject + ']')
  }
})

nc.on('error', err => {
  console.log('Error [' + nc.currentServer + ']: ' + err)
  process.exit()
})

nc.on('close', () => {
  console.log('CLOSED')
  process.exit()
})