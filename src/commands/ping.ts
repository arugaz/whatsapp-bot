import type { Command } from "../types/command.types";

const Ping: Command = {
  category: "general",
  desc: "Ping bot",
  execute: async ({ message, args }) => {
    return await message.reply(`pong! ${args.join(" ")}`, true);
  },
};

export default Ping;
