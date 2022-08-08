const { default: makeWASocket } = require('@adiwajshing/baileys')
const { serialize } = require('../lib/whatsapp')

module.exports = MessageHandler = async (aruga = makeWASocket({})) => {
  aruga.ev.on('messages.upsert', (m) => {
    if (m.type === 'notify' && m.messages.length !== 0 && m.messages[0].message) {
      serialize(aruga, m.messages[0])
      const message = m.messages[0]
      console.log(message)
    }
  })
}