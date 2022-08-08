const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@adiwajshing/baileys')
const { Boom } = require('@hapi/boom')
const { rm } = require('node:fs/promises')
const { join } = require('node:path')
const MessageHandler = require('./handler/message')

const rmDir = async () => await rm(join(__dirname, '..', 'auth'), {
  recursive: true,
  force: true
})

module.exports = Connect = async (store = makeInMemoryStore({})) => {
  const { state, saveCreds } = await useMultiFileAuthState('auth')

  const aruga = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['whatsapp-bot', 'Safari', '17.10.06'] // gatau, tgl lahir sya :D
  })

  store.bind(aruga.ev)

  MessageHandler(aruga)

  aruga.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
      if (reason === DisconnectReason.badSession) {
        await rmDir()
        console.error('Bad Session File, Please Scan Again')
        await aruga.logout()
        // await Connect() => if you want to rescan quickly
      } else if (reason === DisconnectReason.connectionClosed) {
        console.warn('Connection closed, reconnecting....')
        await Connect()
      } else if (reason === DisconnectReason.connectionLost) {
        console.warn('Connection Lost from Server, reconnecting...')
        await Connect()
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.error('Connection Replaced, Another New Session Opened, Please Close Current Session First')
        await aruga.logout()
      } else if (reason === DisconnectReason.loggedOut) {
        await rmDir()
        console.error('Device Logged Out, Please Scan Again.')
        await aruga.logout()
        // await Connect() => if you want to rescan quickly
      } else if (reason === DisconnectReason.restartRequired) {
        console.warn('Restart Required, Restarting...')
        await Connect()
      } else if (reason === DisconnectReason.timedOut) {
        console.warn('Connection TimedOut, Reconnecting...')
        await Connect()
      } else {
        aruga.end(Error(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`))
      }
    } else if (connection === 'connecting') {
      console.log('Connecting...')
    } else if (connection === 'open') {
      console.log('Connected!')
    };
  })

  aruga.ev.on('creds.update', saveCreds)
}