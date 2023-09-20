import { database } from "../../libs/whatsapp"
import type { Command } from "../../types/command"

export default <Command>{
  category: "owner",
  aliases: ["upstatus", "upstory"],
  desc: "Upload bot status",
  ownerOnly: true,
  example: `
  Send a image/video message with caption
  @PREFIX@CMD status caption
  --------
  or Reply a image/video message with text
  @PREFIX@CMD status caption
  --------
  Send a text message
  @PREFIX@CMD status caption
  `.trimEnd(),
  execute: async ({ aruga, message, arg }) => {
    const contactList = await database.getUsers()

    /**
     * just arrange it as you like
     */

    await aruga.sendMessage(
      "status@broadcast",
      {
        ...(message.type === "image" || (message.quoted && message.quoted.type === "image")
          ? {
              image: await aruga.downloadMediaMessage(message.quoted || message),
              caption: message.quoted?.body || arg
            }
          : message.type === "video" || (message.quoted && message.quoted.type === "video")
          ? {
              video: await aruga.downloadMediaMessage(message.quoted || message),
              caption: message.quoted?.body || arg
            }
          : {
              text: arg
            })
      },
      {
        backgroundColor: "#123456",
        font: 3,
        //it is always necessary to inform the list of contacts that will have access to the posted status
        statusJidList: contactList.map((user) => user.userId).concat(aruga.decodeJid(aruga.user.id))
      }
    )

    return await message.reply("Status uploaded successfully", true)
  }
}
