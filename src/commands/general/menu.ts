import type { Command } from "../../types/command.types";

export default {
  aliases: ["help"],
  category: "general",
  desc: "Landing menu",
  maintenance: false,
  execute: async ({ aruga, message, prefix }) => {
    return await aruga.sendMessage(message.from, {
      text: `Hi ${message.pushname}`,
      footer: aruga.config.footer,
      templateButtons: [
        { index: 1, urlButton: { displayText: "Source Code", url: "https://github.com/arugaz/whatsapp-bot" } },
        { index: 2, quickReplyButton: { displayText: "Change your language!", id: `${prefix}language` } },
        { index: 5, quickReplyButton: { displayText: "Click here to see the menu list!", id: prefix + "listmenu" } },
      ],
      viewOnce: true,
    });
  },
} as Command;
