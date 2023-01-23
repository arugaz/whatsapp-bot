import type { Event } from "../../types/command"

export default <Event>{
  execute: async ({ aruga, message, group }) => {
    if (message.isGroupMsg && group.antiviewonce && message.viewOnce) {
      return await aruga.resendMessage(message.from, message, { ephemeralExpiration: message.expiration })
    }
  }
}
