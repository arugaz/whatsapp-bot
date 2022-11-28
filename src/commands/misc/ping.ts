import type { Command } from "../../types/command.types";

export default {
  category: "misc",
  desc: "Ping bot",
  execute: async ({ message, messageTimestamp, arg }) => {
    return await message.reply(`pong! ${(Date.now() - messageTimestamp) / 1000}s ${arg}`, true);
  },
} as Command;
