import { readFile } from "fs/promises"
import { join as pathJoin } from "path"
import i18n from "../../libs/international"
import config from "../../utils/config"
import { database } from "../../libs/whatsapp"
import type { Command } from "../../types/command"

export default <Command>{
  category: "general",
  aliases: ["lang"],
  desc: "Show/Set user language",
  privateOnly: true,
  execute: async ({ message, prefix, args, user, command }) => {
    const listLanguages: {
      iso: string
      lang: string
    }[] = JSON.parse(await readFile(pathJoin(__dirname, "..", "..", "..", "database", "languages.json"), "utf-8"))

    if (args.length >= 1 && !!listLanguages.find((value) => value.iso === args[0])) {
      const lang = listLanguages.find((value) => value.iso === args[0])
      const user = await database.updateUser(message.sender, { language: lang.iso })
      return await message.reply(i18n.translate("commands.general.language.changed", { "@LANGUAGE": lang.lang }, user.language), true)
    }

    let listLang = ""

    for (const lang of listLanguages.filter((v) => i18n.listLanguage().includes(v.iso)).sort((first, last) => first.lang.localeCompare(last.lang))) {
      listLang += `┃ > ${lang.lang}\n┃ ${prefix}${command} ${lang.iso}\n┃\n`
    }

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.language.text", {}, user.language)}\n` +
      "┃\n" +
      "┣━━━━━━━━━━━━━━━━━━\n" +
      "┃\n" +
      listLang +
      "┣━━━━━━━━━━━━━━━━━━\n" +
      "┃\n" +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return await message.reply(text, true)
  }
}
