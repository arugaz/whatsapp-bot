import i18n from "../../libs/international"
import config from "../../utils/config"
import type { Command } from "../../types/command"

export const name = "gurl"

export default <Command>{
  category: "group",
  aliases: ["gcurl", "glink", "gclink"],
  desc: "Get group invite url",
  groupOnly: true,
  adminGroup: true,
  botGroupAdmin: true,
  execute: async ({ aruga, message, group }) => {
    const code = await aruga.groupInviteCode(message.from)

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.group.group-url", { "@URL": `https://chat.whatsapp.com/${code}` }, group.language)}\n` +
      "┃\n" +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return await message.reply(text, true)
  }
}
