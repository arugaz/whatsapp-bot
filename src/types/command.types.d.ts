import type { Aruga } from "../types/client.types";
import type { MessageSerialize } from "../types/message.types";

declare type Command = {
  /**
   * Set commands aliases for match users messages
   * @type {string[]}
   * @example
   * aliases: ['menu'] // default match message by filename /menu === menu.ts
   */
  aliases?: string[];

  /**
   * Set commands category
   * @type {string}
   * @example
   * category: 'general'
   */
  category: string;

  /**
   * Set commands coldown for users, in seconds value
   * @type {boolean}
   * @example
   * cd: 10 // default 5 seconds :)
   */
  cd?: number;

  /**
   * Set commands description
   * @type {string}
   * @example
   * desc: "Ping bot!"
   */
  desc?: string;

  /**
   * Set commands that only can be used in group chats
   * @type {boolean}
   * @example
   * groupOnly: true // default false
   */
  groupOnly?: boolean;

  /**
   * Set commands that only can be used in private chats
   * @type {boolean}
   * @example
   * privateOnly: true // default false
   */
  privateOnly?: boolean;

  /**
   * Set commands that only premium users can use
   * @type {boolean}
   * @example
   * premiumOnly: true // default false
   */
  premiumOnly?: boolean;

  /**
   * Set commands that only group admins can use
   * @type {boolean}
   * @example
   * adminGroup: true // default false
   */
  adminGroup?: boolean;

  /**
   * Set commands that only group owner can use
   * @type {boolean}
   * @example
   * ownerGroup: true // default false
   */
  ownerGroup?: boolean;

  /**
   * Set commands that can only be used when the bot is a group admin
   * @type {boolean}
   * @example
   * maintenance: true // default false
   */
  botGroupAdmin?: boolean;

  /**
   * Set commands to maintenance mode that only owner can use
   * @type {boolean}
   * @example
   * maintenance: true // default false
   */
  maintenance?: boolean;

  /**
   * Set commands that only bot owners can use
   * @type {boolean}
   * @example
   * ownerOnly: true // default false
   */
  ownerOnly?: boolean;

  /**
   * To reduce the limit when the command is success
   * @type {number}
   * @example
   * limit: 3 // default 0
   */
  limit?: number;

  /**
   * To write how to use the command
   * @type {string}
   * @example
   * example: "/ping 69"
   */
  example?: string;

  /**
   * Fill it with the features you want
   * @type {CommandObject}
   * @example
   * execute: async ({ aruga, message, command, prefix, args }) => {
   *  await aruga.sendMessage(message.from, { text: `pong! ${args.join(' ')}` })
   * }
   */
  execute?: (obj: CommandObject) => unknown;
};

declare type CommandObject = {
  aruga: Aruga;
  message: MessageSerialize;
  command: string;
  prefix: string;
  arg: string;
  args: string[];
};
