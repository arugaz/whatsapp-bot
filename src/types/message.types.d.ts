import type { proto, GroupMetadata } from "@adiwajshing/baileys";

declare type MessageSerialize = {
  /** Properties of a Message. */
  message: proto.IMessage;

  /** Properties of a MessageKey. */
  key: proto.IMessageKey;

  /** MessageKey id */
  id: string;

  /** Is message from Bot? */
  isBotMsg: boolean;

  /** Is message from group chats? */
  isGroupMsg: boolean;

  /** MessageKey remoteJid */
  from: string;

  /** MessageKey fromMe */
  fromMe: boolean;

  /** Type of a message */
  type: string;

  /** MessageKey sender */
  sender: string;

  /** Body / content message  */
  body: string;

  /** Mentions user list */
  mentions: string[];

  /**
   * @param {string} text:string
   * @param {boolean} quoted?:boolean
   * @returns {Promise<proto.WebMessageInfo>} if quoted is set to true will reply the message otherwise just typing back..
   */
  reply: (text: string, quoted?: boolean) => Promise<proto.WebMessageInfo>;

  /**
   * @param {string|null} filename?:string|null
   * @returns {Promise<'pathName' | Buffer>} if filename is empty return buffers otherwise return filename
   */
  download: (filename?: string | null) => Promise<"pathName" | Buffer>;

  /** Properties of a Quoted Message. */
  quoted?: MessageSerialize;

  /** Nickname for users */
  pushname?: string;

  /** Group Metadata */
  groupMetadata?: GroupMetadata;
};
