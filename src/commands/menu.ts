import type { Command } from "../types/command.types";

const Menu: Command = {
  aliases: ["help"],
  category: "general",
  desc: "Landing menu",
  maintenance: false,
  execute: async ({ aruga, message, prefix }) => {
    return await aruga.sendMessage(message.from, {
      text: `Hi ${message.pushname}`,
      footer: "Hi there~",
      templateButtons: [
        { index: 1, urlButton: { displayText: aruga.user.name, url: "https://wa.me/arugaz" } },
        { index: 2, quickReplyButton: { displayText: "Click here to see the menu list!", id: prefix + "info" } },
      ],
    });
  },
};

export default Menu;
