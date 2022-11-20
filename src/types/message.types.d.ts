import type { proto } from '@adiwajshing/baileys';

type MessageSerialize = {
  message: proto.IMessage;
  key: proto.IMessageKey;
  id: string;
  isBotMsg: boolean;
  isGroupMsg: boolean;
  from: string;
  fromMe: boolean;
  type: string;
  sender: string;
  body: string;
  mentions: string[];
  download: (filename?: string | null) => Promise<'pathName' | Buffer>;
  quoted?: MessageSerialize;
  pushname: string;
};
