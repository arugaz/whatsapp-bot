import type {
  proto,
  WACallUpdateType,
  MessageGenerationOptionsFromContent,
} from "@adiwajshing/baileys";
import type { GroupMetadata } from "@prisma/client";

declare type CallSerialize = {
  /** Call Id */
  callId: string;

  /** Call remoteJid */
  callFrom: string;

  /** Call status */
  status: WACallUpdateType;

  /**
   * @param {string} text: Message text
   * @returns {Promise<proto.WebMessageInfo>} if quoted is set to true will reply the message otherwise just typing back..
   */
  reply: (text: string) => Promise<proto.WebMessageInfo>;
};

declare type GroupSerialize = {
  /** Group Jid */
  from: string;

  /** Message sender  */
  sender: string;

  /** Message */
  body: string;

  /** Message type  */
  type: number;

  /** Message Timestamps */
  timestamps: number;
};

declare type GroupParticipantSerialize = GroupSerialize;

declare type MessageSerialize = {
  /** Properties of a Message. */
  message: proto.IMessage;

  /** Properties of a MessageKey. */
  key: proto.IMessageKey;

  /** Message Id */
  id: string;

  /** Is message from Bot? */
  isBotMsg: boolean;

  /** Is message from group chats? */
  isGroupMsg: boolean;

  /** Message remoteJid */
  from: string;

  /** is message fromMe? | bot message ? */
  fromMe: boolean;

  /** Type of a message */
  type: string;

  /** Message sender */
  sender: string;

  /** Body / content message  */
  body: string;

  /** Mentions user list */
  mentions: string[];

  /** Is message viewonce? */
  viewOnce: boolean;

  /**
   * @param {string} text: Message text
   * @param {boolean} quoted?: Wanna reply to client?
   * @returns {Promise<proto.WebMessageInfo>} if quoted is set to true will reply the message otherwise just typing back..
   */
  reply: (text: string, quoted?: boolean) => Promise<proto.WebMessageInfo>;

  /**
   * @param {string} jid: Chat Jid
   * @param {boolean} quoted?: Wanna reply to client?
   * @returns {Promise<proto.WebMessageInfo>} if quoted is set to true will reply the message otherwise just typing back..
   */
  resend: (
    jid?: string,
    opts?: Omit<MessageGenerationOptionsFromContent, "userJid">,
  ) => Promise<proto.WebMessageInfo>;

  /**
   * @param {string} filename?: Filepath to save the message content
   * @returns {Promise<string | Buffer>} if filename is empty return buffers otherwise return file path
   */
  download: {
    (): Promise<Buffer>;
    (filepath: string): Promise<string>;
  };

  // additional properties
  /** Message timestamps */
  timestamps?: number;
  /** Chat expiration for ephemeral message */
  expiration?: number;
  /** Nickname for users */
  pushname?: string;
  /** Group Metadata */
  groupMetadata?: GroupMetadata;

  /** Properties of a Quoted Message. */
  quoted?: MessageSerialize;
};
