import type { Event } from "../../types/command"

export default <Event>{
  execute: async ({ aruga, message, group, isBotGroupAdmin, isOwner, isGroupAdmin }) => {
    if (message.isGroupMsg && group.antilink && isBotGroupAdmin && message.body) {
      const groupCodeRegex = message.body.match(/chat.whatsapp.com\/(?:invite\/)?([\w\d]*)/)
      if (groupCodeRegex && groupCodeRegex.length === 2 && !isOwner && !isGroupAdmin) {
        const groupCode = groupCodeRegex[1]
        const groupNow = await aruga.groupInviteCode(message.from)

        if (groupCode !== groupNow) {
          await aruga.sendMessage(message.from, { delete: message.key })
          return await aruga.groupParticipantsUpdate(message.from, [message.sender], "remove")
        }
      }
    }
  }
}
