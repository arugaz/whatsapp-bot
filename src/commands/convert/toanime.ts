import AI2D from "@arugaz/ai2d"
import type { Command } from "../../types/command"

export default <Command>{
  category: "convert",
  cd: 10,
  desc: "Generate a hyper-realistic photo an anime style",
  example: `
  Send a image message with caption
  @PREFIX@CMD
  --------
  or Reply a image message with text
  @PREFIX@CMD
  --------
  `.trimEnd(),
  execute: async ({ aruga, message }) => {
    if (message.type.includes("image") || (message.quoted && message.quoted.type.includes("image"))) {
      const buffer = message.quoted ? await aruga.downloadMediaMessage(message.quoted) : await aruga.downloadMediaMessage(message)
      // if it doesnt work in your country/server you may need a proxy
      // refer to https://www.npmjs.com/package/@arugaz/ai2d#tldr
      const result = await AI2D(buffer, {
        crop: "SINGLE"
        // proxy: "socks5://111.222.333.444:1234"
      })
      return await aruga.sendMessage(message.from, { image: result }, { quoted: message, ephemeralExpiration: message.expiration })
    }

    throw "noCmd"
  }
}
