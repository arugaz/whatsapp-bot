import i18n from "../../libs/international"
import config from "../../utils/config"
import type { Command } from "../../types/command"

export const name = "bpicture"

export default <Command>{
  category: "owner",
  aliases: ["botpicture"],
  desc: "Change bot profile picture",
  ownerOnly: true,
  example: `
  Send a image message with caption
  @PREFIX@CMD
  --------
  or Reply a image message with text
  @PREFIX@CMD
  --------
  If you want to crop the image
  @PREFIX@CMD crop
  --------
  `.trimEnd(),
  execute: async ({ aruga, message, arg, user }) => {
    if (message.type.includes("image") || (message.quoted && message.quoted.type.includes("image"))) {
      const imgBuffer: Buffer = message.quoted ? await aruga.downloadMediaMessage(message.quoted) : await aruga.downloadMediaMessage(message)
      const crop = arg && arg.toLowerCase() === "crop"

      await aruga.updateProfilePicture(aruga.decodeJid(aruga.user.id), imgBuffer, crop)

      const text =
        "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
        "┃\n" +
        `┃ ${i18n.translate("commands.owner.bot-picture", {}, user.language)}\n` +
        "┃\n" +
        `┗━━「 ꗥ${config.name}ꗥ 」`

      return await message.reply(text, true)
    }

    throw "noCmd"
  }
}
