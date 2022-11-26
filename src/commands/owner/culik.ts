import type { Command } from "../../types/command.types";

/**
 * Be aware :)
 */

export default {
  category: "owner",
  desc: "Landing menu",
  maintenance: false,
  ownerOnly: true,
  execute: async ({ aruga, message, arg }) => {
    const url = arg.match(/chat.whatsapp.com\/([\w\d]*)/g);
    if (url.length >= 1) {
      const code = url[0].replace("chat.whatsapp.com/", "");
      const result = await aruga.groupGetInviteInfo(code);
      if (!result)
        return await aruga.sendMessage(message.from, {
          text: "Invalid url or it was revoked",
        });
      await aruga.groupAcceptInvite(code);
      const fetchGroups = await aruga.groupFetchAllParticipating();
      const getGroups = Object.entries(fetchGroups)
        .slice(0)
        .map((entry) => entry[1]);
      const participants = getGroups
        .filter((v) => v.id === result.id)
        .map((x) => x.participants)[0]
        .map((v) => v.id);
      await aruga.groupParticipantsUpdate(message.from, participants, "add");
    }
    return null;
  },
} as Command;
