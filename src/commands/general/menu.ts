import os from "os"
import i18n from "../../libs/international"
import config from "../../utils/config"
import { command } from "../../libs/whatsapp"
import { sizeFormat, timeFormat, upperFormat } from "../../utils/format"
import type { Command } from "../../types/command"

export default <Command>{
  aliases: ["help"],
  category: "general",
  desc: "Landing menu",
  maintenance: false,
  execute: async ({ message, prefix, user, args, isOwner }) => {
    if (args.length === 1) {
      const name = args[0].toLowerCase()
      const cmd = command.commands.get(name) ?? command.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name))
      if (!cmd || (cmd.category === "owner" && !isOwner))
        return await message.reply(i18n.translate("commands.general.menu.cmd.zero", {}, user.language), true)
      const text =
        "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
        "┃\n" +
        `┃ *${i18n.translate("commands.general.menu.cmd.one", {}, user.language)} :* ${
          cmd.aliases ? [name].concat(cmd.aliases).join(", ").trim() : name
        }\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.two", {}, user.language)} :* ${cmd.category || "-"}\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.three", {}, user.language)} :* ${cmd.desc || "-"}\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.four", {}, user.language)} :* ${
          cmd.example
            ? cmd.example
                .replace(/@PREFIX/g, prefix)
                .replace(/@CMD/g, name)
                .trimEnd()
                .split(/\r\n|\r|\n/)
                .join("\n┃ ")
                .trimEnd()
            : `${prefix}${name}`
        }\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.five", {}, user.language)} :* ${cmd.groupOnly ? "✔️" : "✖️"}\n` +
        (message.isGroupMsg
          ? `┃ *${i18n.translate("commands.general.menu.cmd.six", {}, user.language)}:* ${cmd.adminGroup ? "✔️" : "✖️"}\n` +
            `┃ *${i18n.translate("commands.general.menu.cmd.seven", {}, user.language)} :* ${cmd.ownerGroup ? "✔️" : "✖️"}\n`
          : "") +
        `┃ *${i18n.translate("commands.general.menu.cmd.eight", {}, user.language)} :* ${cmd.privateOnly ? "✔️" : "✖️"}\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.nine", {}, user.language)} :* ${cmd.premiumOnly ? "✔️" : "✖️"}\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.ten", {}, user.language)} :* ${cmd.ownerOnly ? "✔️" : "✖️"}\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.eleven", {}, user.language)} :* ${cmd.limit ? cmd.limit : "✖️"}\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.twelve", {}, user.language)} :* ${cmd.cd ? (cmd.cd % 1000) + "s" : "3s"}\n` +
        `┃ *${i18n.translate("commands.general.menu.cmd.thirteen", {}, user.language)} :* ${cmd.maintenance ? "✔️" : "✖️"}\n` +
        "┃\n" +
        `┗━━「 ꗥ${config.name}ꗥ 」`
      return await message.reply(text, true)
    }

    let listCmd = ""

    for (const category of [
      ...new Set(
        command.commands
          .map((v) => v.category)
          .filter((v) => (!isOwner && v === "owner" ? null : v && (!message.isGroupMsg && v === "group" ? null : v)))
          .sort()
      )
    ]) {
      listCmd += `┣━━━━━━━━━━━━━━━━━━\n┃\n┃${upperFormat(category + " ")}\n`
      for (const eachCmd of command.commands.map((v) => v.category === category && v).filter((v) => (!isOwner && v.ownerOnly ? null : v))) {
        const title = command.commands.findKey((v) => v === eachCmd)
        listCmd += `┃ ${prefix}menu ${title}\n┃ > ${eachCmd.desc}\n┃\n`
      }
    }

    const text =
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.menu.intro.one", { "@PUSHNAME": message.pushname }, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.intro.two", {}, user.language)}\n` +
      "┃\n" +
      "┣━━━━━━━━━━━━━━━━━━\n" +
      "┃\n" +
      `┃ ${i18n.translate(
        "commands.general.menu.detail.one",
        { "@SZEE": `${sizeFormat(process.memoryUsage().heapTotal)} / ${sizeFormat(os.totalmem())}` },
        user.language
      )}\n` +
      `┃ ${i18n.translate("commands.general.menu.detail.two", { "@CMDS": command.commands.size }, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.detail.three", { "@UPTMS": timeFormat(os.uptime() * 1000) }, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.detail.four", {}, user.language)}\n` +
      "┃\n" +
      "┣━━━━━━━━━━━━━━━━━━\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.menu.info.one", {}, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.info.two", {}, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.info.three", { "@COMMANDS": `${prefix}language` }, user.language)}\n` +
      "┃\n" +
      "┣━━━━━━━━━━━━━━━━━━\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.menu.bottom", {}, user.language)}\n` +
      "┃\n" +
      listCmd +
      `┗━━「 ꗥ${config.name}ꗥ 」`

    return await message.reply(text, true)
  }
}
