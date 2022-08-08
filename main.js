const { makeInMemoryStore } = require('@adiwajshing/baileys')
const Pino = require('pino')
const { existsSync } = require('node:fs')
const { join } = require('node:path')
const WaConnect = require('./src/app')

const storeFile = join(__dirname, 'storage', 'baileys_store.json')
const store = makeInMemoryStore({ logger: Pino().child({ level: 'silent', stream: 'store' }) })

setInterval(() => {
  store.writeToFile(storeFile)
}, 30 * 60 * 1000); // 30 minutes

(async () => {
  if (existsSync(storeFile)) {
    store.readFromFile(storeFile)
  }

  await WaConnect(store)
})()