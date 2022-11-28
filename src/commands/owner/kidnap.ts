import type { Command } from "../../types/command.types";

/**
 * Kidnap other group members to your group
 *
 * make bot as admin on your group
 * and on your group type /kidnap url
 *
 * Be aware :)
 * your bot will probably be blocked/banned
 */

export default {
  category: "owner",
  desc: "Kidnap other group members to your group",
  example: "https://chat.whatsapp.com/code, change with group url",
  ownerOnly: true,
  execute: async ({ aruga, message, prefix, command, arg }) => {
    if (!arg) return await message.reply(`${prefix}info ${command}`);
    const url = arg.match(/chat.whatsapp.com\/([\w\d]*)/g);
    if (url && url.length >= 1) {
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

      return await aruga.groupParticipantsUpdate(message.from, participants, "add");
    } else message.reply("Invalid url", true);
  },
} as Command;
