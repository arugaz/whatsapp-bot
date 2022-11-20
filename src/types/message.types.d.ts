import type { proto } from '@adiwajshing/baileys';

type MessageSerialize = {
  isGroupMsg?: boolean;
  key: proto.IMessageKey;
  message: proto.IMessage;
  id: string;
  isBotMsg: boolean;
  from: string;
  fromMe: boolean;
  type: string;
  sender: string;
  body: string;
  mentions: string[];
  quoted?: MessageSerialize;
};
