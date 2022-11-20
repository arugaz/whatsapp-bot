import type { proto } from '@adiwajshing/baileys';

type MessageSerialize = {
  message: proto.IMessage;
  key: proto.IMessageKey;
  id: string;
  isBotMsg: boolean;
  from: string;
  fromMe: boolean;
  type: string;
  sender: string;
  body: string;
  mentions: string[];
  quoted?: MessageSerialize;
  pushname: string;
  isGroupMsg?: boolean;
};
