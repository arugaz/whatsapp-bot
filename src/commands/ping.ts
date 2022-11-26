import type { Command } from "../types/command.types";

export default {
  category: "general",
  desc: "Ping bot",
  ownerOnly: true,
  execute: async ({ message, args }) => {
    return await message.reply(`pong! ${args.join(" ")}`, true);
  },
} as Command;
