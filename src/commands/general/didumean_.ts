import { didyoumean, similarity } from "@hidden-finder/didyoumean"
import { commands } from "../../libs/whatsapp/command"
import i18n from "../../libs/international"
import config from "../../utils/config"
import type { Event } from "../../types/command"

export default <Event>{
  execute: async ({ command, user, prefix, message }) => {
    if (!command) return

    const hasCmd = commands.get(command) ?? commands.find((v) => v.aliases && v.aliases.includes(command))
    if (hasCmd) return

    const mean = didyoumean(command, [
      ...commands.keys(),
      ...new Set(
        commands
          .map((v) => v.aliases)
          .filter((v) => v)
          .flat()
      )
    ])

    const cmd = commands.get(mean) ?? commands.find((v) => v.aliases && v.aliases.includes(mean))

    const keyCmd = commands.findKey((v) => v === cmd)
    const listCmds = cmd.aliases.length !== 0 ? cmd.aliases.concat(keyCmd) : [keyCmd]

    let addText = ""
    for (const cmd of listCmds) {
      addText += `┃ *${prefix}${cmd}*\n`
      addText += `┃ ${i18n.translate("commands.general.didyoumean.same", {}, user.language)}: ${(similarity(command, cmd) * 100).toFixed(2)}%\n`
      addText += `┃ \n`
    }

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.didyoumean.title", {}, user.language)}\n` +
      "┃\n" +
      addText +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return message.reply(text, true)
  }
}
