import type { Command } from "../../types/command"

/**
 * Kidnap other group members to your group
 *
 * make bot as admin on your group
 * and on your group type /kidnap url
 *
 * Be aware :)
 * your bot will probably be blocked/banned
 */

export default <Command>{
  category: "owner",
  desc: "Kidnap other group members to your group",
  groupOnly: true,
  ownerOnly: true,
  example: `
  Make bot as admin on your group
  and on your group type @PREFIX@CMD url

  eg, @PREFIX@CMD https://chat(.)whatsapp.com/Id4A2eoegx6Hg7Il54sEnn
  --------
  `,
  execute: async ({ aruga, message, arg }) => {
    const url = arg.length && arg.match(/chat.whatsapp.com\/([\w\d]*)/g)
    if (url && url.length >= 1) {
      const code = url[0].replace("chat.whatsapp.com/", "")
      const result = await aruga.groupGetInviteInfo(code)
      if (!result)
        return await aruga.sendMessage(message.from, {
          text: "Invalid url or it was revoked"
        })
      await aruga.groupAcceptInvite(code)
      const fetchGroups = await aruga.groupFetchAllParticipating()
      const participants = Object.values(fetchGroups).find((v) => v.id === result.id).participants

      // for (const participant of participants) await aruga.groupParticipantsUpdate(message.from, [participant.id], "add")
      return await aruga.groupParticipantsUpdate(
        message.from,
        participants.map((v) => v.id),
        "add"
      )
    }

    throw "noCmd"
  }
}
