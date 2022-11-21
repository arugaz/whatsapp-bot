import type { aruga } from '../types/client.types';
import type { MessageSerialize } from '../types/message.types';

type Command = {
  /**
   * Set commands aliases for match users messages
   * @type {string[]}
   * @example
   * aliases: ['help'] // default match by filename
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
   * cd: 10 // 10 seconds
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
   * Set commands that only bot owners can use
   * @type {boolean}
   * @example
   * ownerOnly: true // default false
   */
  ownerOnly?: boolean;

  /**
   * Set commands that only group admins can use
   * @type {boolean}
   * @example
   * adminGroup: true // default false
   */
  adminGroup?: boolean;

  /**
   * Set commands to maintenance mode that only owner can use
   * @type {boolean}
   * @example
   * maintenance: true // default false
   */
  maintenance?: boolean;

  /**
   * To reduce the limit when the command is success
   * @type {number}
   * @example
   * limit: 3 // 3 limit
   */
  limit?: number;

  /**
   * To write how to use the command
   * @type {string}
   * @example
   * example: "/ping satu"
   */
  example?: string;

  /**
   * Fill it with the features you want
   * @type {CommandObject}
   * @example
   * execute: async ({ aruga, message }) => {
   *  await aruga.sendMessage(message.from, { text: 'pong!' })
   * }
   */
  execute?: (obj: CommandObject) => any;
};

type CommandObject = {
  aruga: aruga;
  message: WAMessage;
  command: string;
  prefix: string;
  args: string[];
};
