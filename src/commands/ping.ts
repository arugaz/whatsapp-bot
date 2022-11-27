import type { Command } from "../types/command.types";

export default {
  category: "general",
  desc: "Ping bot",
  ownerOnly: true,
  execute: async ({ message, arg }) => {
    return await message.reply(`pong! ${arg}`, true);
  },
} as Command;
