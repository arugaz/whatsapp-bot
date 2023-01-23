import type { Event } from "../../types/command"

export default <Event>{
  execute: async ({ aruga, message, group, isBotGroupAdmin }) => {
    if (message.isGroupMsg && isBotGroupAdmin && group.antibot && message.isBotMsg && !message.fromMe) {
      return await aruga.groupParticipantsUpdate(message.from, [message.sender], "remove")
    }
  }
}
