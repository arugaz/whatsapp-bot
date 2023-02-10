import { rtfFormat } from "../../utils/format"
import type { Command } from "../../types/command"

export default <Command>{
  category: "misc",
  desc: "Ping bot",
  execute: ({ message, arg }) => {
    const ping = Date.now() - message.timestamps // time milliseconds
    return message.reply(`pong!  ${rtfFormat(ping / 1000, "seconds")} ${arg}`, true)
  }
}
