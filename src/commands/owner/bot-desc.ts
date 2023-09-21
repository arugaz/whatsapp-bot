import i18n from "../../libs/international"
import config from "../../utils/config"
import type { Command } from "../../types/command"

export const name = "bdesc"

export default <Command>{
  category: "owner",
  aliases: ["botdesc", "bstatus", "botstatus"],
  desc: "Change bot profile description/status",
  ownerOnly: true,
  example: `
  @PREFIX@CMD desc~
  `.trimEnd(),
  execute: async ({ aruga, arg, user, message }) => {
    if (!arg) throw "noCmd"

    await aruga.updateProfileStatus(arg)

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.owner.bot-desc", {}, user.language)}\n` +
      "┃\n" +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return await message.reply(text, true)
  }
}
