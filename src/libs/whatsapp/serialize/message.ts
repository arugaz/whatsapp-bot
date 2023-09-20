import { WAMessage } from "baileys"
import WAClient, { database } from "../../../libs/whatsapp"
import type { MessageSerialize } from "../../../types/serialize"

export const message = async (aruga: WAClient, msg: WAMessage): Promise<MessageSerialize> => {
  const m = <MessageSerialize>{}
  m.message = msg.message?.viewOnceMessage
    ? msg.message.viewOnceMessage?.message
    : msg.message?.ephemeralMessage
    ? msg.message.ephemeralMessage?.message
    : msg.message?.documentWithCaptionMessage
    ? msg.message.documentWithCaptionMessage?.message
    : msg.message?.viewOnceMessageV2
    ? msg.message.viewOnceMessageV2?.message
    : msg.message?.editedMessage
    ? msg.message.editedMessage?.message
    : msg.message?.viewOnceMessageV2Extension
    ? msg.message.viewOnceMessageV2Extension?.message
    : msg.message
  if (m.message) {
    m.key = msg.key
    m.id = m.key.id
    m.isBotMsg = (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("3EB0") && m.key.id.length === 12) || (m.id.startsWith("ARUGAZ") && m.id.length === 20)
    m.isGroupMsg = m.key.remoteJid.endsWith("g.us")
    m.from = aruga.decodeJid(m.key.remoteJid)
    m.fromMe = m.key.fromMe
    m.type = Object.keys(m.message).find((type) => type !== "senderKeyDistributionMessage" && type !== "messageContextInfo")
    m.sender = aruga.decodeJid(m.fromMe ? aruga.user.id : m.isGroupMsg || m.from === "status@broadcast" ? m.key.participant || msg.participant : m.from)
    m.key.participant = !m.key.participant || m.key.participant === "status_me" ? m.sender : m.key.participant
    m.body = m.message.conversation
      ? m.message.conversation
      : m.message.extendedTextMessage
      ? m.message.extendedTextMessage.text
      : m.message.imageMessage
      ? m.message.imageMessage.caption
      : m.message.videoMessage
      ? m.message.videoMessage.caption
      : m.message.documentMessage
      ? m.message.documentMessage.caption
      : m.message.buttonsResponseMessage
      ? m.message.buttonsResponseMessage.selectedButtonId
      : m.message.listResponseMessage
      ? m.message.listResponseMessage.singleSelectReply.selectedRowId
      : m.message.templateButtonReplyMessage
      ? m.message.templateButtonReplyMessage.selectedId
      : m.message.reactionMessage
      ? m.message.reactionMessage.text
      : m.message.locationMessage
      ? m.message.locationMessage.comment
      : ""
    m.mentions = m.message[m.type]?.contextInfo?.mentionedJid || []
    m.viewOnce = !!msg.message?.viewOnceMessage || !!msg.message?.viewOnceMessageV2 || !!msg.message?.viewOnceMessageV2Extension
    function reply(text: string, quoted = false) {
      return aruga.sendMessage(
        m.from,
        { text, ...(m.isGroupMsg ? { mentions: [m.sender] } : {}) },
        {
          ...(quoted ? { quoted: m } : {}),
          ephemeralExpiration: m.expiration
        }
      )
    }
    m.reply = reply
  }

  m.timestamps = (typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : msg.messageTimestamp.low ? msg.messageTimestamp.low : msg.messageTimestamp.high) * 1000 || Date.now()
  m.expiration = m.message[m.type]?.contextInfo?.expiration || 0
  m.pushname = msg.pushName || "anonymous"
  m.status = msg.status || 0
  m.groupMetadata = m.isGroupMsg && ((await database.getGroupMetadata(m.from)) ?? (await database.createGroupMetadata(m.from, (await aruga.groupMetadata(m.from)) as unknown)))

  m.quoted = <MessageSerialize>{}
  m.quoted.message = m.message[m.type]?.contextInfo?.quotedMessage
    ? m.message[m.type].contextInfo.quotedMessage?.viewOnceMessage
      ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.ephemeralMessage
      ? m.message[m.type].contextInfo.quotedMessage.ephemeralMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.documentWithCaptionMessage
      ? m.message[m.type].contextInfo.quotedMessage.documentWithCaptionMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2
      ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessageV2?.message
      : m.message[m.type].contextInfo.quotedMessage?.editedMessage
      ? m.message[m.type].contextInfo.quotedMessage.editedMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2Extension
      ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessageV2Extension?.message
      : m.message[m.type].contextInfo.quotedMessage
    : null
  if (m.quoted.message) {
    m.quoted.key = {
      participant: aruga.decodeJid(m.message[m.type]?.contextInfo?.participant),
      remoteJid: m?.message[m.type]?.contextInfo?.remoteJid || m.from || m.sender,
      fromMe: aruga.decodeJid(m.message[m.type].contextInfo.participant) === aruga.decodeJid(aruga.user.id),
      id: m.message[m.type].contextInfo.stanzaId
    }
    m.quoted.id = m.quoted.key.id
    m.quoted.isBotMsg = (m.quoted.id.startsWith("BAE5") && m.quoted.id.length === 16) || (m.id.startsWith("3EB0") && m.key.id.length === 12) || (m.quoted.id.startsWith("ARUGAZ") && m.quoted.id.length === 20)
    m.quoted.isGroupMsg = m.quoted.key.remoteJid.endsWith("g.us")
    m.quoted.from = aruga.decodeJid(m.quoted.key.remoteJid)
    m.quoted.fromMe = m.quoted.key.fromMe
    m.quoted.type = Object.keys(m.quoted.message).find((type) => type !== "senderKeyDistributionMessage" && type !== "messageContextInfo")
    m.quoted.sender = m.quoted.key.participant
    m.quoted.key.participant = !m.quoted.key.participant ? m.sender : m.quoted.key.participant
    m.quoted.body = m.quoted.message.conversation
      ? m.quoted.message.conversation
      : m.quoted.message.extendedTextMessage
      ? m.quoted.message.extendedTextMessage.text
      : m.quoted.message.imageMessage
      ? m.quoted.message.imageMessage.caption
      : m.quoted.message.videoMessage
      ? m.quoted.message.videoMessage.caption
      : m.quoted.message.documentMessage
      ? m.quoted.message.documentMessage.caption
      : m.quoted.message.buttonsResponseMessage
      ? m.quoted.message.buttonsResponseMessage.selectedButtonId
      : m.quoted.message.listResponseMessage
      ? m.quoted.message.listResponseMessage.singleSelectReply.selectedRowId
      : m.quoted.message.templateButtonReplyMessage
      ? m.quoted.message.templateButtonReplyMessage.selectedId
      : m.quoted.message.reactionMessage
      ? m.quoted.message.reactionMessage.text
      : m.quoted.message.locationMessage
      ? m.quoted.message.locationMessage.comment
      : ""
    m.quoted.mentions = m.quoted.message[m.quoted.type]?.contextInfo?.mentionedJid || []
    m.quoted.viewOnce = !!m.message[m.type].contextInfo.quotedMessage?.viewOnceMessage || !!m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2 || !!m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2Extension
    function reply(text: string, quoted = false) {
      return aruga.sendMessage(
        m.from,
        { text, ...(m.quoted.isGroupMsg ? { mentions: [m.quoted.sender] } : {}) },
        {
          ...(quoted ? { quoted: m.quoted } : {}),
          ephemeralExpiration: m.expiration
        }
      )
    }
    m.quoted.reply = reply
  } else m.quoted = null

  return m
}
