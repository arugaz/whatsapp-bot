import { WAMessage } from "@whiskeysockets/baileys"
import WAClient from "../../../libs/whatsapp"
import config from "../../../utils/config"
import type { GroupParticipantSerialize } from "../../../types/serialize"

export const groupParticipant = async (aruga: WAClient, msg: WAMessage): Promise<GroupParticipantSerialize> => {
  const m = <GroupParticipantSerialize>{}
  m.from = aruga.decodeJid(msg.key.remoteJid)
  m.sender = aruga.decodeJid(msg.key.fromMe ? aruga.user.id : m.from.endsWith("g.us") || m.from === "status@broadcast" ? msg.key?.participant || msg.participant : m.from)
  m.body = msg.messageStubParameters
  m.type = msg.messageStubType
  m.timestamps = (typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : msg.messageTimestamp.low ? msg.messageTimestamp.low : msg.messageTimestamp.high) * 1000 || Date.now()

  function reply(text: string) {
    return aruga.sendMessage(m.from, {
      text: "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" + "┃\n" + `┃ ${text}\n` + "┃\n" + `┗━━「 ꗥ${config.name}ꗥ 」`,
      mentions: (m.body[1] || m.body[0]).includes("@") ? [m.sender].concat(m.body) : [m.sender]
    })
  }
  m.reply = reply

  return m
}
