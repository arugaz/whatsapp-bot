const { jidDecode } = require('@adiwajshing/baileys')

const decodeJid = (jid) => {
  if (/:\d+@/gi.test(jid)) {
    const decode = jidDecode(jid) || {}
    return ((decode.user && decode.server && decode.user + '@' + decode.server) || jid).trim()
  } else return jid
}

const serialize = (aruga, m) => {
  m.isGroup = m.key.remoteJid.endsWith('g.us')
  m.message = m.message.ephemeralMessage ? m.message.ephemeralMessage.message : m.message.viewOnceMessage ? m.message.viewOnceMessage.message : m.message
  if (m.message.messageContextInfo) delete m.message.messageContextInfo

  m.id = m.key.id
  m.isBot = m.id.startsWith('BAE') && m.id.length === 16
  m.from = decodeJid(m.key.remoteJid)
  m.fromMe = m.key.fromMe
  m.type = Object.keys(m.message)[0] === 'senderKeyDistributionMessage' ? Object.keys(m.message)[1] : Object.keys(m.message)[0] || Object.keys(m.message)[0]
  m.sender = decodeJid(m.fromMe ? decodeJid(aruga.user.id) : (m.isGroup || m.from === 'status@broadcast') ? (m.key.participant || m.participant) : m.from); m.key.participant = (!m.key.participant || m.key.participant === 'status_me') ? m.sender : m.key.participant
  m.body = m.message.conversation && m.type === 'conversation' ? m.message.conversation : m.message.extendedTextMessage && m.type === 'extendedTextMessage' ? m.message.extendedTextMessage.text : m.message.imageMessage && m.type === 'imageMessage' ? m.message.imageMessage.caption : m.message.videoMessage && m.type === 'videoMessage' ? m.message.videoMessage.caption : m.message.documentMessage && m.type === 'documentMessage' ? (m.message.documentMessage.caption ? m.message.documentMessage.caption : '') : m.message.buttonsResponseMessage && m.type === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId : m.message.listResponseMessage && m.type === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.message.templateButtonReplyMessage && m.type === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId : '' || ''
  m.ephemeralMessage = !!m.message.ephemeralMessage
  m.viewOnceMessage = !!m.message[m.type]?.viewOnce
  m.mentioned = m.message[m.type]?.contextInfo?.mentionedJid || []

  m.quoted = m?.message[m.type]?.contextInfo?.quotedMessage ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessage ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessage.message : m.message[m.type].contextInfo.quotedMessage.ephemeralMessage ? m.message[m.type].contextInfo.quotedMessage.ephemeralMessage.message : m.message[m.type].contextInfo.quotedMessage : null || null
  if (m.quoted) {
    m.quoted.id = m.message[m.type].contextInfo.stanzaId
    m.quoted.isBot = m.quoted.id.startsWith('BAE') && m.quoted.id.length === 16
    m.quoted.from = decodeJid(m?.message[m.type]?.contextInfo?.remoteJid || m.from || m.sender)
    m.quoted.fromMe = decodeJid(aruga.user.id) === decodeJid(m.message[m.type]?.contextInfo?.participant) || false
    m.quoted.type = Object.keys(m.quoted)[0]
    m.quoted.sender = decodeJid(m.message[m.type]?.contextInfo?.participant)
    m.quoted.body = m.quoted.conversation && m.quoted.type === 'conversation' ? m.quoted.conversation : m.quoted.extendedTextMessage && m.quoted.type === 'extendedTextMessage' ? m.quoted.extendedTextMessage.text : m.quoted.imageMessage && m.quoted.type === 'imageMessage' ? m.quoted.imageMessage.caption : m.quoted.videoMessage && m.quoted.type === 'videoMessage' ? m.quoted.videoMessage.caption : m.quoted.documentMessage && m.quoted.type === 'documentMessage' ? (m.quoted.documentMessage.caption ? m.quoted.documentMessage.caption : '') : m.quoted.buttonsResponseMessage && m.quoted.type === 'buttonsResponseMessage' ? m.quoted.buttonsResponseMessage.selectedButtonId : m.quoted.listResponseMessage && m.quoted.type === 'listResponseMessage' ? m.quoted.listResponseMessage.singleSelectReply.selectedRowId : m.quoted.templateButtonReplyMessage && m.quoted.type === 'templateButtonReplyMessage' ? m.quoted.templateButtonReplyMessage.selectedId : '' || ''
    m.quoted.ephemeralMessage = !!m.message[m.type].contextInfo.quotedMessage.ephemeralMessage
    m.quoted.viewOnceMessage = !!m.quoted[m.quoted.type]?.viewOnce
    m.quoted.mentiond = m.quoted[m.quoted.type]?.contextInfo?.mentionedJid || []
  };
  m.pushname = m.pushName; delete m.pushName
}

module.exports = {
  serialize
}