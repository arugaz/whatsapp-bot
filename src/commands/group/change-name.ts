import i18n from "../../libs/international"
import config from "../../utils/config"
import type { Command } from "../../types/command"

export const name = "gname"

export default <Command>{
  category: "group",
  aliases: ["gcname", "gtitle", "gctitle"],
  desc: "Change group description",
  groupOnly: true,
  adminGroup: true,
  botGroupAdmin: true,
  example: `
  Change group title
  @PREFIX@CMD <name>
  --------
  `.trimEnd(),
  execute: async ({ aruga, message, arg, group }) => {
    if (!arg) throw "noCmd"

    await aruga.groupUpdateSubject(message.from, arg)

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.group.change-name", { "@ADM": `@${message.sender.split("@")[0]}` }, group.language)}\n` +
      `${arg}\n` +
      "┃\n" +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return await message.reply(text, true)
  }
}
