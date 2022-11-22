import type { Command } from "../types/command.types";

const Menu: Command = {
  aliases: ["help"],
  category: "general",
  desc: "Landing menu",
  maintenance: false,
  execute: async ({ aruga, message }) => {
    const templateButtons = [{ index: 1, urlButton: { displayText: aruga.user.name, url: "https://wa.me/arugaz" } }];

    return await aruga.sendMessage(message.from, {
      text: `Hi ${message.pushname}`,
      footer: "Hi there~",
      templateButtons,
    });
  },
};

export default Menu;
