import type { WAMessage } from '@adiwajshing/baileys';
import Client from '../libs/whatsapp.libs';
import { MessageSerialize } from '../types/message.types';

export default class MessageHandler {
  constructor(private aruga: Client) {}
  async serialize(msg: WAMessage): Promise<MessageSerialize> {
    msg.message = msg.message?.viewOnceMessage
      ? msg.message.viewOnceMessage.message
      : msg.message?.ephemeralMessage
      ? msg.message.ephemeralMessage.message
      : msg.message?.documentWithCaptionMessage
      ? msg.message.documentWithCaptionMessage.message
      : msg.message?.viewOnceMessageV2
      ? msg.message.viewOnceMessageV2.message
      : msg.message?.editedMessage
      ? msg.message.editedMessage.message
      : msg.message?.viewOnceMessageV2Extension
      ? msg.message.viewOnceMessageV2Extension.message
      : msg.message;

    const m = {} as MessageSerialize;
    m.message = msg.message;

    m.key = msg.key;
    m.id = m.key.id;
    m.isBotMsg = m.id.startsWith('BAE') && m.id.length === 16;
    m.isGroupMsg = m.key.remoteJid.endsWith('g.us');
    m.from = this.aruga.decodeJid(m.key.remoteJid);
    m.fromMe = m.key.fromMe;
    m.type = Object.keys(m.message).find((x) => x !== 'senderKeyDistributionMessage' && x !== 'messageContextInfo');
    m.sender = this.aruga.decodeJid(m.fromMe ? this.aruga.user.id : m.isGroupMsg || m.from === 'status@broadcast' ? m.key.participant || msg.participant : m.from);
    msg.key.participant = !m.key.participant || m.key.participant === 'status_me' ? m.sender : m.key.participant;
    m.body =
      m.message.conversation && m.type === 'conversation'
        ? m.message.conversation
        : m.message.extendedTextMessage && m.type === 'extendedTextMessage'
        ? m.message.extendedTextMessage.text
        : m.message.imageMessage && m.type === 'imageMessage'
        ? m.message.imageMessage.caption
        : m.message.videoMessage && m.type === 'videoMessage'
        ? m.message.videoMessage.caption
        : m.message.documentMessage && m.type === 'documentMessage'
        ? m.message.documentMessage.caption
        : m.message.buttonsResponseMessage && m.type === 'buttonsResponseMessage'
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.message.listResponseMessage && m.type === 'listResponseMessage'
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.message.templateButtonReplyMessage && m.type === 'templateButtonReplyMessage'
        ? m.message.templateButtonReplyMessage.selectedId
        : m.message.reactionMessage && m.type === 'reactionMessage'
        ? m.message.reactionMessage.text
        : '';
    m.mentions = m.message[m.type]?.contextInfo?.mentionedJid || [];

    m.quoted = {} as MessageSerialize;
    m.quoted.message = m?.message[m.type]?.contextInfo?.quotedMessage
      ? m.message[m.type].contextInfo.quotedMessage?.viewOnceMessage
        ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessage.message
        : m.message[m.type].contextInfo.quotedMessage?.ephemeralMessage
        ? m.message[m.type].contextInfo.quotedMessage.ephemeralMessage.message
        : m.message[m.type].contextInfo.quotedMessage?.documentWithCaptionMessage
        ? m.message[m.type].contextInfo.quotedMessage.documentWithCaptionMessage.message
        : m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2
        ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessageV2.message
        : m.message[m.type].contextInfo.quotedMessage?.editedMessage
        ? m.message[m.type].contextInfo.quotedMessage.editedMessage.message
        : m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2Extension
        ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessageV2Extension.message
        : m.message[m.type].contextInfo.quotedMessage
      : null;

    if (m.quoted.message) {
      m.quoted.key = {
        participant: this.aruga.decodeJid(m.message[m.type]?.contextInfo?.participant),
        remoteJid: m?.message[m.type]?.contextInfo?.remoteJid || m.from || m.sender,
        fromMe: this.aruga.decodeJid(m.message[m.type].contextInfo.participant) === this.aruga.decodeJid(this.aruga.user.id),
        id: m.message[m.type].contextInfo.stanzaId,
      };
      m.quoted.id = m.quoted.key.id;
      m.quoted.isBotMsg = m.quoted.id.startsWith('BAE') && m.quoted.id.length === 16;
      m.quoted.isGroupMsg = m.quoted.key.remoteJid.endsWith('g.us');
      m.quoted.from = this.aruga.decodeJid(m.quoted.key.remoteJid);
      m.quoted.fromMe = m.quoted.key.fromMe;
      m.quoted.type = Object.keys(m.quoted.message).find((x) => x !== 'senderKeyDistributionMessage' && x !== 'messageContextInfo');
      m.quoted.sender = m.quoted.key.participant;
      m.quoted.body =
        m.quoted.message.conversation && m.quoted.type === 'conversation'
          ? m.quoted.message.conversation
          : m.quoted.message.extendedTextMessage && m.quoted.type === 'extendedTextMessage'
          ? m.quoted.message.extendedTextMessage.text
          : m.quoted.message.imageMessage && m.quoted.type === 'imageMessage'
          ? m.quoted.message.imageMessage.caption
          : m.quoted.message.videoMessage && m.quoted.type === 'videoMessage'
          ? m.quoted.message.videoMessage.caption
          : m.quoted.message.documentMessage && m.quoted.type === 'documentMessage'
          ? m.quoted.message.documentMessage.caption
          : m.quoted.message.buttonsResponseMessage && m.quoted.type === 'buttonsResponseMessage'
          ? m.quoted.message.buttonsResponseMessage.selectedButtonId
          : m.quoted.message.listResponseMessage && m.quoted.type === 'listResponseMessage'
          ? m.quoted.message.listResponseMessage.singleSelectReply.selectedRowId
          : m.quoted.message.templateButtonReplyMessage && m.quoted.type === 'templateButtonReplyMessage'
          ? m.quoted.message.templateButtonReplyMessage.selectedId
          : m.quoted.message.reactionMessage && m.quoted.type === 'reactionMessage'
          ? m.quoted.message.reactionMessage.text
          : '';
      m.quoted.mentions = m.quoted.message[m.quoted.type]?.contextInfo?.mentionedJid || [];
    } else delete m.quoted;

    m.pushname = msg.pushName;

    return m;
  }
}
