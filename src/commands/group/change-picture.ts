import type { Command } from "../../types/command"

export const name = "gpicture"

export default <Command>{
  category: "group",
  aliases: ["gcpicture", "gprofile", "gcprofile"],
  desc: "Change group profile picture",
  groupOnly: true,
  adminGroup: true,
  botGroupAdmin: true,
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
  execute: async ({ aruga, message, arg }) => {
    if (message.type.includes("image") || (message.quoted && message.quoted.type.includes("image"))) {
      const imgBuffer: Buffer = message.quoted
        ? await aruga.downloadMediaMessage(message.quoted.message)
        : await aruga.downloadMediaMessage(message.message)
      const crop = arg && arg.toLowerCase() === "crop"

      return await aruga.updateProfilePicture(message.from, imgBuffer, crop)
    }

    throw "noCmd"
  }
}
