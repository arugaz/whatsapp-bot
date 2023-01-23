import i18n from "../../libs/international"
import config from "../../utils/config"
import type { Command } from "../../types/command"

export const name = "gdesc"

export default <Command>{
  category: "group",
  aliases: ["gbio", "gcbio", "gcdesc"],
  desc: "Change group description",
  groupOnly: true,
  adminGroup: true,
  botGroupAdmin: true,
  example: `
  Change group description
  @PREFIX@CMD <desc>
  --------
  `.trimEnd(),
  execute: async ({ aruga, message, arg, group }) => {
    if (!arg) throw "noCmd"

    await aruga.groupUpdateDescription(message.from, arg)

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.group.change-description", { "@ADM": `@${message.sender.split("@")[0]}` }, group.language)}\n` +
      `${arg}\n` +
      "┃\n" +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return await message.reply(text, true)
  }
}
