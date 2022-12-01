import type { proto } from "@adiwajshing/baileys";
import type { Command } from "../../types/command.types";
import config from "../../utils/config.utils";
import { commands } from "../../utils/command.utils";
import { upperFormat } from "../../utils/helper.utils";

export default {
  aliases: ["listhelp", "menulist", "helplist", "info"],
  category: "general",
  desc: "To display the menu by list, and see how to use the menu",
  execute: async ({ aruga, message, prefix, args, isOwner }) => {
    if (args.length >= 1) {
      const name = args[0].toLowerCase();
      const cmd = commands.get(name) || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
      if ((!cmd || cmd.category === "owner") && !isOwner) return await message.reply("No command found", true);
      const text =
        `⍟──── *${name}* ────⍟\n\n` +
        `*Alias :* ${cmd.aliases ? [name].concat(cmd.aliases).join(", ").trim() : name}\n` +
        `*Category :* ${cmd.category || `-`}\n` +
        `*Description :* ${cmd.desc || "-"}\n` +
        `*Usage :* ${prefix}${name} ${cmd.example || ``}\n` +
        `*Only in group chat :* ${cmd.groupOnly ? "Yes" : "No"}\n` +
        (message.isGroupMsg
          ? `*Only for group admins :* ${cmd.adminGroup ? "Yes" : "No"}\n` +
            `*Only for group owner :* ${cmd.ownerGroup ? "Yes" : "No"}\n`
          : "") +
        `*Only in private chat :* ${cmd.privateOnly ? "Yes" : "No"}\n` +
        `*Only for premium :* ${cmd.premiumOnly ? "Yes" : "No"}\n` +
        `*Only for bot owner :* ${cmd.ownerOnly ? "Yes" : "No"}\n` +
        `*Using limit :* ${cmd.limit ? cmd.limit : "No"}\n` +
        `*Cooldown :* ${cmd.cd ? (cmd.cd % 1000) + "s" : "3s"}\n` +
        `*Maintenance :* ${cmd.maintenance ? "Yes" : "No"}\n`;
      return await message.reply(text, true);
    }

    const sections = [] as proto.Message.ListMessage.ISection[];
    const categories = [
      ...new Set(commands.map((v) => (!isOwner ? v.category !== "owner" && v.category : v.category)).sort()),
    ];
    for (const category of categories) {
      const cmd = commands.map((v) => v.category === category && v).filter((v) => v);
      sections.push({
        title: upperFormat(category),
        rows: cmd.map((value) => {
          const title = commands.findKey((v) => v === value);
          return {
            title,
            rowId: `${prefix}listmenu ${title}`,
            description: value.desc,
          };
        }),
      });
    }

    await aruga.sendMessage(message.isGroupMsg ? message.sender : message.from, {
      text: `Hi ${message.pushname}`,
      footer: config.bot.footer,
      title: "Hi there",
      buttonText: "LIST MENU",
      sections,
      viewOnce: true,
    });
    return message.isGroupMsg && (await message.reply("Check private chats", true));
  },
} as Command;
