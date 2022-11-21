import type { Command } from '../types/command.types';

const Ping: Command = {
  category: 'general',
  desc: `Ping bot!`,
  execute: async ({ aruga, message, args }) => {
    await aruga.sendMessage(message.from, { text: `pong! ${args.join(' ')}` });
  },
};

export default Ping;
