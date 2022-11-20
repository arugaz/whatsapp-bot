import type { WAMessage, proto } from '@adiwajshing/baileys';
import Client from '../libs/whatsapp.libs';

export default class MessageHandler {
  constructor(private aruga: Client) {}
  async serialize(msg: WAMessage): Promise<MessageSerialize> {
    msg.message = msg.message?.ephemeralMessage ? msg.message.ephemeralMessage.message : msg.message?.viewOnceMessage ? msg.message.viewOnceMessage.message : msg.message;
    msg.message?.messageContextInfo && delete msg.message.messageContextInfo;
    const m = {} as MessageSerialize;

    m.isGroupMsg = msg.key.remoteJid.endsWith('g.us');

    m.id = msg.key.remoteJid;
    m.isBotMsg = m.id.startsWith('BAE') && m.id.length === 16;
    m.from = this.aruga.decodeJid(msg.key.remoteJid);
    m.fromMe = msg.key.fromMe;
    m.type = Object.keys(msg.message)[0] === 'senderKeyDistributionMessage' ? Object.keys(msg.message)[1] : Object.keys(msg.message)[0] || Object.keys(msg.message)[0];
    m.sender = this.aruga.decodeJid(m.fromMe ? this.aruga.user.id : m.isGroupMsg || m.from === 'status@broadcast' ? msg.key.participant || msg.participant : m.from);
    msg.key.participant = !msg.key.participant || msg.key.participant === 'status_me' ? m.sender : msg.key.participant;
    m.body =
      msg.message.conversation && m.type === 'conversation'
        ? msg.message.conversation
        : msg.message.extendedTextMessage && m.type === 'extendedTextMessage'
        ? msg.message.extendedTextMessage.text
        : msg.message.imageMessage && m.type === 'imageMessage'
        ? msg.message.imageMessage.caption
        : msg.message.videoMessage && m.type === 'videoMessage'
        ? msg.message.videoMessage.caption
        : msg.message.documentMessage && m.type === 'documentMessage'
        ? msg.message.documentMessage.caption
        : msg.message.buttonsResponseMessage && m.type === 'buttonsResponseMessage'
        ? msg.message.buttonsResponseMessage.selectedButtonId
        : msg.message.listResponseMessage && m.type === 'listResponseMessage'
        ? msg.message.listResponseMessage.singleSelectReply.selectedRowId
        : msg.message.templateButtonReplyMessage && m.type === 'templateButtonReplyMessage'
        ? msg.message.templateButtonReplyMessage.selectedId
        : '' || '';
    m.mentions = msg.message[m.type]?.contextInfo?.mentionedJid || [];

    const quoted: proto.IMessage = msg?.message[m.type]?.contextInfo?.quotedMessage
      ? msg.message[m.type].contextInfo.quotedMessage.viewOnceMessage
        ? msg.message[m.type].contextInfo.quotedMessage.viewOnceMessage.message
        : msg.message[m.type].contextInfo.quotedMessage.ephemeralMessage
        ? msg.message[m.type].contextInfo.quotedMessage.ephemeralMessage.message
        : msg.message[m.type].contextInfo.quotedMessage
      : null;
    if (quoted) {
      m.quoted = {} as MessageSerialize;
      m.quoted.id = msg.message[m.type].contextInfo.stanzaId;
      m.quoted.isBotMsg = m.quoted.id.startsWith('BAE') && m.quoted.id.length === 16;
      m.quoted.from = this.aruga.decodeJid(msg?.message[m.type]?.contextInfo?.remoteJid || m.from || m.sender);
      m.quoted.fromMe = this.aruga.user.id === this.aruga.decodeJid(msg.message[m.type]?.contextInfo?.participant);
      m.quoted.type = Object.keys(quoted)[0];
      m.quoted.sender = this.aruga.decodeJid(msg.message[m.type]?.contextInfo?.participant);
      m.quoted.body =
        quoted.conversation && m.quoted.type === 'conversation'
          ? quoted.conversation
          : quoted.extendedTextMessage && m.quoted.type === 'extendedTextMessage'
          ? quoted.extendedTextMessage.text
          : quoted.imageMessage && m.quoted.type === 'imageMessage'
          ? quoted.imageMessage.caption
          : quoted.videoMessage && m.quoted.type === 'videoMessage'
          ? quoted.videoMessage.caption
          : quoted.documentMessage && m.quoted.type === 'documentMessage'
          ? quoted.documentMessage.caption
          : quoted.buttonsResponseMessage && m.quoted.type === 'buttonsResponseMessage'
          ? quoted.buttonsResponseMessage.selectedButtonId
          : quoted.listResponseMessage && m.quoted.type === 'listResponseMessage'
          ? quoted.listResponseMessage.singleSelectReply.selectedRowId
          : quoted.templateButtonReplyMessage && m.quoted.type === 'templateButtonReplyMessage'
          ? quoted.templateButtonReplyMessage.selectedId
          : '';
      m.quoted.mentions = quoted[m.quoted.type]?.contextInfo?.mentionedJid || [];
    }
    console.log(m, msg);
    return m;
  }
}
