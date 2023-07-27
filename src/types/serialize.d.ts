import type { proto, WACallUpdateType } from "@whiskeysockets/baileys"
import type { GroupMetadata } from "@prisma/client"

/**
 * Call serialize
 */
declare type CallSerialize = {
  /** Call Id */
  callId: string

  /** Call remoteJid */
  callFrom: string

  /** Call status */
  status: WACallUpdateType

  /**
   * Reply a message
   * @param {string} text: Message text
   * @returns {Promise<proto.WebMessageInfo>} send messages
   */
  reply: (text: string) => Promise<proto.WebMessageInfo>
}

/**
 * Group serialize
 */
declare type GroupSerialize = {
  /** Group Jid */
  from: string

  /** Message sender  */
  sender: string

  /** Message */
  body: string

  /** Message type  */
  type: number

  /** Message Timestamps */
  timestamps: number

  /**
   * Reply a message
   * @param {string} text: Message text
   * @returns {Promise<proto.WebMessageInfo>} send messages
   */
  reply: (text: string) => Promise<proto.WebMessageInfo>
}

/**
 * Group Participant serialize
 */
declare type GroupParticipantSerialize = {
  /** Group Jid */
  from: string

  /** Message sender  */
  sender: string

  /** Message */
  body: string[]

  /** Message type  */
  type: number

  /** Message Timestamps */
  timestamps: number

  /**
   * Reply a message
   * @param {string} text: Message text
   * @returns {Promise<proto.WebMessageInfo>} send messages
   */
  reply: (text: string) => Promise<proto.WebMessageInfo>
}

/**
 * Message serialize
 */
declare type MessageSerialize = {
  /** Properties of a Message. */
  message: proto.IMessage

  /** Properties of a MessageKey. */
  key: proto.IMessageKey

  /** Message Id */
  id: string

  /** Is message from Bot? */
  isBotMsg: boolean

  /** Is message from group chats? */
  isGroupMsg: boolean

  /** Message remoteJid */
  from: string

  /** is message fromMe? | bot message ? */
  fromMe: boolean

  /** Type of a message */
  type: string

  /** Message sender */
  sender: string

  /** Body / content message  */
  body: string

  /** Mentions user list */
  mentions: string[]

  /** Is message viewonce? */
  viewOnce: boolean

  /**
   * Reply a message
   * @param {string} text: Message text
   * @param {boolean} quoted?: Wanna reply to client?
   * @returns {Promise<proto.WebMessageInfo>} if quoted is set to true will reply the message otherwise just typing back..
   */
  reply: (text: string, quoted?: boolean) => Promise<proto.WebMessageInfo>

  // additional properties
  /** Message timestamps */
  timestamps?: number
  /** Chat expiration for ephemeral message */
  expiration?: number
  /** Nickname for users */
  pushname?: string
  /** WebMessageInfo status */
  status?: number
  /** Group Metadata */
  groupMetadata?: GroupMetadata

  /** Properties of a Quoted Message. */
  quoted: MessageSerialize | null
}
