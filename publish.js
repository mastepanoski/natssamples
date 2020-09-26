'use strict'

const nats = require('nats')
const argv = require('minimist')(process.argv.slice(2))

const url = argv.s || 'localhost'
const creds = argv.creds || null
const subject = argv._[0]
const msg = argv._[1] || ''

if (!subject) {
  console.log('Usage: publish [-s server] [--creds=filepath] <subject> [msg]')
  process.exit()
}

// Connect to NATS server.
const nc = nats.connect(url, nats.creds(creds))
const inbox = nc.createInbox()
nc.publish(subject, msg, inbox)
nc.subscribe(inbox, msg => {
    console.log('Published [' + subject + '] : "' + msg)
    nc.flush(() => {
        nc.close()
        process.exit()
    })
})

nc.on('error', err => {
  console.log('Error [' + nc.currentServer + ']: ' + err)
  process.exit()
})