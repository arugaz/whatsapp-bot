import { join } from "path";
import { readFile } from "fs/promises";
import Database from "../../libs/database.libs";
import i18n from "../../libs/international.libs";
import config from "../../utils/config.utils";
import type { Command } from "../../types/command.types";

export default {
  aliases: ["setlanguage"],
  category: "general",
  desc: "Show/Set user language",
  privateOnly: true,
  execute: async ({ aruga, message, prefix, args }) => {
    const listLanguages: {
      iso: string;
      lang: string;
    }[] = JSON.parse(await readFile(join(__dirname, "..", "..", "..", "database", "languages.json"), "utf-8"));

    if (args.length >= 1 && !!listLanguages.find((value) => value.iso === args[0])) {
      const lang = listLanguages.find((value) => value.iso === args[0]);
      const user = await Database.user.update({ where: { userId: message.sender }, data: { language: lang.iso } });
      return await message.reply(
        `${i18n.translate("commands.general.language.changed", { LANGUAGE: lang.lang }, user.language)}`,
        true,
      );
    }

    return await aruga.sendMessage(message.from, {
      text: `Hi ${message.pushname}`,
      footer: config.bot.footer,
      title: "Hi there",
      buttonText: "LIST LANGUAGES",
      sections: [
        {
          rows: listLanguages
            .filter((v) => i18n.listLanguage().includes(v.iso))
            .sort((first, last) => first.lang.localeCompare(last.lang))
            .map((value) => {
              return {
                title: value.lang,
                rowId: `${prefix}setlanguage ${value.iso}`,
              };
            }),
        },
      ],
      viewOnce: true,
    });
  },
} as Command;
