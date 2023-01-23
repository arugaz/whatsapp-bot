import i18n from "../../libs/international"
import { database } from "../../libs/whatsapp"
import config from "../../utils/config"
import type { Command } from "../../types/command"

export default <Command>{
  category: "group",
  aliases: ["antiview", "antionce"],
  desc: "Resend messages that send as view once",
  groupOnly: true,
  adminGroup: true,
  example: `
  Turn on / Activate @CMD
  @PREFIX@CMD on
  --------
  Turn off / Deactivate @CMD
  @PREFIX@CMD off
  --------
  `.trimEnd(),
  execute: async ({ message, args, user, group, command }) => {
    if (args[0] && (args[0].toLowerCase() === "on" || args[0].toLowerCase() === "enable")) {
      if (!group.antiviewonce) {
        await database.updateGroup(message.from, {
          antiviewonce: true
        })
      }

      const text =
        "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
        "┃\n" +
        `┃ ${i18n.translate("commands.group.antiviewonce.enable", { "@CMD": command }, user.language)}\n` +
        "┃\n" +
        `┗━━「 ꗥ${config.name}ꗥ 」`

      return await message.reply(text, true)
    }

    if (args[0] && (args[0].toLowerCase() === "off" || args[0].toLowerCase() === "disable")) {
      if (group.antiviewonce) {
        await database.updateGroup(message.from, {
          antiviewonce: false
        })
      }

      const text =
        "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
        "┃\n" +
        `┃ ${i18n.translate("commands.group.antiviewonce.disable", { "@CMD": command }, user.language)}\n` +
        "┃\n" +
        `┗━━「 ꗥ${config.name}ꗥ 」`

      return await message.reply(text, true)
    }

    throw "noCmd"
  }
}
