import WASticker from "@arugaz/wasticker"
import { Command } from "../../types/command.types"

const wasticker = WASticker({
  categories: ["👋", "❤️"]
})

export default <Command>{
  category: "convert",
  cd: 10,
  desc: "Create sticker from photo or video!",
  execute: async ({ aruga, message }) => {
    if (message.type.includes("image") || message.quoted.type.includes("image")) {
      const buffer = message.quoted ? await message.quoted.download() : await message.download()
      const result = await wasticker.Load(buffer).ToBuffer()

      return await aruga.sendMessage(message.from, { sticker: result }, { quoted: message, ephemeralExpiration: message.expiration })
    }

    if (message.type.includes("video") || message.quoted.type.includes("video")) {
      const duration = message.quoted
        ? (message.quoted.message[message.quoted.type].seconds as number)
        : (message.message[message.type].seconds as number)
      if (duration && duration > 30) throw "Video duration is too long! Maximum duration of 30 seconds"

      const buffer = message.quoted ? await message.quoted.download() : await message.download()
      const result = await wasticker.Load(buffer).ToBuffer()

      return await aruga.sendMessage(message.from, { sticker: result }, { quoted: message, ephemeralExpiration: message.expiration })
    }
  }
}
