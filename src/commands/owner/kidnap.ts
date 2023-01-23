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
  `.trimEnd(),
  execute: async ({ aruga, message, arg }) => {
    const url = arg.length && arg.match(/chat.whatsapp.com\/(?:invite\/)?([\w\d]*)/)
    if (url && url.length === 2) {
      const code = url[1]
      const result = await aruga.groupGetInviteInfo(code)
      if (!result) return
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
