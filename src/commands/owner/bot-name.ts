import type { Command } from "../../types/command"
import i18n from "../../libs/international"
import config from "../../utils/config"

export const name = "bname"

export default <Command>{
  category: "owner",
  aliases: ["botname"],
  desc: "Change bot profile name",
  ownerOnly: true,
  example: `
  @PREFIX@CMD name~
  `.trimEnd(),
  execute: async ({ aruga, arg, user, message }) => {
    if (!arg) throw "noCmd"

    await aruga.updateProfileName(arg)

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.owner.bot-name", {}, user.language)}\n` +
      "┃\n" +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return await message.reply(text, true)
  }
}
