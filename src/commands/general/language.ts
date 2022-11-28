import type { proto } from "@adiwajshing/baileys";
import type { Command } from "../../types/command.types";

// can read there: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// add the language that you enabled in the international.libs directory.
const ListLanguages = [
  {
    iso: "en",
    language: "English",
  },
  {
    iso: "id",
    language: "Indonesian",
  },
];

export default {
  aliases: ["setlanguage"],
  category: "general",
  desc: "Show/Set user language",
  privateOnly: true,
  execute: async ({ aruga, message, prefix, args }) => {
    if (args.length >= 1 && !!ListLanguages.find((value) => value.iso === args[0])) {
      await aruga.DB.user.update({ where: { userId: message.sender }, data: { language: args[0] } });
      return await message.reply(`Language has been changed to ${ListLanguages.find((value) => value.iso === args[0]).language}`, true);
    }

    const sections = [
      {
        title: "List languages",
        rows: ListLanguages.map((value) => {
          return {
            title: value.language,
            rowId: `${prefix}setlanguage ${value.iso}`,
          };
        }),
      },
    ] as proto.Message.ListMessage.ISection[];

    return await aruga.sendMessage(message.from, {
      text: `Hi ${message.pushname}`,
      footer: "Hi there~",
      title: "Hi there",
      buttonText: "LIST LANGUAGES",
      sections,
      viewOnce: true,
    });
  },
} as Command;
