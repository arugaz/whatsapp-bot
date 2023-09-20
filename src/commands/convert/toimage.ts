import type { Command } from "../../types/command"
import { ffmpeg } from "../../utils/cli"

export default <Command>{
  category: "convert",
  aliases: ["toimg"],
  cd: 5,
  desc: "Convert a sticker message to image",
  example: `
  Reply a sticker message with text
  @PREFIX@CMD
  --------
  `.trimEnd(),
  execute: async ({ aruga, message }) => {
    if (message.quoted && message.quoted.type.includes("sticker")) {
      if (message.quoted.message.stickerMessage.isAnimated) throw "Not supported yet!"
      const buffer = await aruga.downloadMediaMessage(message.quoted)

      const result = await ffmpeg(buffer, ["-f", "image2"])

      return await aruga.sendMessage(message.from, { image: result }, { quoted: message, ephemeralExpiration: message.expiration })
    }

    throw "noCmd"
  }
}
