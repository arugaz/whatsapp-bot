import { join } from "path";
import { readFile } from "fs/promises";
import type { proto } from "@adiwajshing/baileys";
import type { Command } from "../../types/command.types";

export default {
  aliases: ["setlanguage"],
  category: "general",
  desc: "Show/Set user language",
  // privateOnly: true,
  execute: async ({ aruga, message, prefix, args }) => {
    const listLanguages: {
      iso: string;
      lang: string;
    }[] = JSON.parse(await readFile(join(__dirname, "..", "..", "..", "database", "languages.json"), "utf-8"));

    if (args.length >= 1 && !!listLanguages.find((value) => value.iso === args[0])) {
      const user = await aruga.DB.user.update({ where: { userId: message.sender }, data: { language: args[0] } });
      return await message.reply(`${aruga.i18n.translate("commands.general.language.changed", { lang: listLanguages.find((value) => value.iso === args[0]).lang }, user.language)}`, true);
    }

    const sections = [
      {
        rows: listLanguages
          .filter((v) => aruga.i18n.listLanguage().includes(v.iso))
          .map((value) => {
            return {
              title: value.lang,
              rowId: `${prefix}setlanguage ${value.iso}`,
            };
          }),
      },
    ] as proto.Message.ListMessage.ISection[];

    return await aruga.sendMessage(message.from, {
      text: `Hi ${message.pushname}`,
      footer: aruga.config.footer,
      title: "Hi there",
      buttonText: "LIST LANGUAGES",
      sections,
      viewOnce: true,
    });
  },
} as Command;
