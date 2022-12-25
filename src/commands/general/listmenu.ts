import type { proto } from "@adiwajshing/baileys";
import i18n from "../../libs/international.libs";
import config from "../../utils/config.utils";
import { command } from "../../utils/whatsapp.utils";
import { upperFormat } from "../../utils/format.utils";
import type { Command } from "../../types/command.types";

export default <Command>{
  aliases: ["listhelp", "menulist", "helplist"],
  category: "general",
  desc: "To display the menu by list, and see how to use the menu",
  execute: async ({ aruga, message, prefix, args, isOwner, user }) => {
    if (args.length >= 1) {
      const name = args[0].toLowerCase();
      const cmd = command.commands.get(name) ?? command.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
      if ((!cmd || cmd.category === "owner") && !isOwner) return await message.reply(i18n.translate("commands.general.listmenu.info.zero", {}, user.language), true);
      const text =
        `⍟──── *${name}* ────⍟\n\n` +
        `*${i18n.translate("commands.general.listmenu.info.one", {}, user.language)} :* ${cmd.aliases ? [name].concat(cmd.aliases).join(", ").trim() : name}\n` +
        `*${i18n.translate("commands.general.listmenu.info.two", {}, user.language)} :* ${cmd.category || "-"}\n` +
        `*${i18n.translate("commands.general.listmenu.info.three", {}, user.language)} :* ${cmd.desc || "-"}\n` +
        `*${i18n.translate("commands.general.listmenu.info.four", {}, user.language)} :* ${prefix}${name} ${cmd.example || ``}\n` +
        `*${i18n.translate("commands.general.listmenu.info.five", {}, user.language)} :* ${cmd.groupOnly ? "✔️" : "✖️"}\n` +
        (message.isGroupMsg ? `*${i18n.translate("commands.general.listmenu.info.six", {}, user.language)}:* ${cmd.adminGroup ? "✔️" : "✖️"}\n` + `*${i18n.translate("commands.general.listmenu.info.seven", {}, user.language)} :* ${cmd.ownerGroup ? "✔️" : "✖️"}\n` : "") +
        `*${i18n.translate("commands.general.listmenu.info.eight", {}, user.language)} :* ${cmd.privateOnly ? "✔️" : "✖️"}\n` +
        `*${i18n.translate("commands.general.listmenu.info.nine", {}, user.language)} :* ${cmd.premiumOnly ? "✔️" : "✖️"}\n` +
        `*${i18n.translate("commands.general.listmenu.info.ten", {}, user.language)} :* ${cmd.ownerOnly ? "✔️" : "✖️"}\n` +
        `*${i18n.translate("commands.general.listmenu.info.eleven", {}, user.language)} :* ${cmd.limit ? cmd.limit : "✖️"}\n` +
        `*${i18n.translate("commands.general.listmenu.info.twelve", {}, user.language)} :* ${cmd.cd ? (cmd.cd % 1000) + "s" : "3s"}\n` +
        `*${i18n.translate("commands.general.listmenu.info.thirteen", {}, user.language)} :* ${cmd.maintenance ? "✔️" : "✖️"}\n`;
      return await message.reply(text, true);
    }

    const sections = <proto.Message.ListMessage.ISection[]>[];
    for (const category of [
      ...new Set(
        command.commands
          .map((v) => v.category)
          .filter((v) => (!isOwner && v === "owner" ? null : v))
          .sort(),
      ),
    ]) {
      const cmd = command.commands.map((v) => v.category === category && v).filter((v) => (!isOwner && v.ownerOnly ? null : v));
      sections.push({
        title: upperFormat(category),
        rows: cmd.map((value) => {
          const title = command.commands.findKey((v) => v === value);
          return {
            title,
            rowId: `${prefix}listmenu ${title}`,
            description: value.desc,
          };
        }),
      });
    }

    return await aruga.sendMessage(message.from, {
      title: `*${i18n.translate("commands.general.listmenu.title", {}, user.language)}*`,
      text: i18n.translate("commands.general.listmenu.text", {}, user.language),
      footer: config.footer,
      buttonText: "LIST MENU",
      sections,
      viewOnce: true,
    });
  },
};
