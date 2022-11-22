import type { proto } from "@adiwajshing/baileys";
import type { Command } from "../../types/command.types";
import { commands } from "../../constants/command.contants";

const ListMenu: Command = {
  aliases: ["listhelp", "menulist", "helplist", "info"],
  category: "general",
  desc: "To display the menu by list, and see how to use the menu",
  execute: async ({ aruga, message, prefix, args }) => {
    if (args.length >= 1) {
      const name = args[0].toLowerCase();
      const cmd = commands.get(name) || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));
      if (!cmd || cmd.category === "private") return await message.reply("No command found", true);
      const text =
        `⍟──── *${name}* ────⍟\n\n` +
        `*Alias:* ${cmd.aliases ? cmd.aliases.join(", ").trim() : "-"}\n` +
        `*Category:* ${cmd.category || `-`}\n` +
        `*Description:* ${cmd.desc || "-"}\n` +
        `*Usage:* ${prefix}${name} ${cmd.example || ``}\n` +
        `*Only in groups:* ${cmd.groupOnly ? "Yes" : "No"}\n` +
        `*Only private chat :* ${cmd.privateOnly ? "Yes" : "No"}\n` +
        `*Cooldown :* ${cmd.cd ? (cmd.cd % 1000) + "s" : "5s"}\n` +
        `*Only for premium :* ${cmd.premiumOnly ? "Yes" : "No"}\n` +
        `*Using limit :* ${cmd.limit ? cmd.limit : "No"}\n` +
        `*Maintenance :* ${cmd.maintenance ? "Yes" : "No"}\n`;
      return await message.reply(text, true);
    }

    const sections = [] as proto.Message.ListMessage.ISection[];
    const categories = [...new Set(commands.map((v) => v.category !== "private" && v.category))];
    for (const category of categories) {
      const cmd = commands.map((v) => v.category === category && v);
      sections.push({
        title: category.toUpperCase(),
        rows: cmd.map((value) => {
          const title = commands.findKey((v) => v === value);
          return {
            title,
            rowId: prefix + "info " + title,
            description: value.desc,
          };
        }),
      });
    }

    return await aruga.sendMessage(message.from, {
      text: `Hi ${message.pushname}`,
      footer: "Hi there~",
      title: "Hi there",
      buttonText: "LIST MENU",
      sections,
    });
  },
};

export default ListMenu;
