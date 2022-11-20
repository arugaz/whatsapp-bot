type MessageSerialize = {
  isGroupMsg: boolean;
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
