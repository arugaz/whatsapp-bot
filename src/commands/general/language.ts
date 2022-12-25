import { readFile } from "fs/promises";
import { join as pathJoin } from "path";
import i18n from "../../libs/international.libs";
import config from "../../utils/config.utils";
import { database } from "../../utils/whatsapp.utils";
import type { Command } from "../../types/command.types";

export default <Command>{
  aliases: ["setlanguage"],
  category: "general",
  desc: "Show/Set user language",
  privateOnly: true,
  execute: async ({ aruga, message, prefix, args, user }) => {
    const listLanguages: {
      iso: string;
      lang: string;
    }[] = JSON.parse(await readFile(pathJoin(__dirname, "..", "..", "..", "database", "languages.json"), "utf-8"));

    if (args.length >= 1 && !!listLanguages.find((value) => value.iso === args[0])) {
      const lang = listLanguages.find((value) => value.iso === args[0]);
      const user = await database.updateUser(message.sender, { language: lang.iso });
      return await message.reply(`${i18n.translate("commands.general.language.changed", { "@LANGUAGE": lang.lang }, user.language)}`, true);
    }

    return await aruga.sendMessage(message.from, {
      title: `*${i18n.translate("commands.general.language.title", {}, user.language)}*`,
      text: i18n.translate("commands.general.language.text", {}, user.language),
      footer: config.footer,
      buttonText: i18n.translate("commands.general.language.buttonText", {}, user.language),
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
};
