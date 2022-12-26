import { WAMessage } from "@adiwajshing/baileys";
import Client from "../../../libs/whatsapp.libs";
import { GroupSerialize } from "../../../types/serialize.types";

export const group = async (aruga: Client, msg: WAMessage): Promise<GroupSerialize> => {
  const m = <GroupSerialize>{};
  m.from = aruga.decodeJid(msg.key.remoteJid);
  m.sender = aruga.decodeJid(msg.key.fromMe ? aruga.user.id : m.from.endsWith("g.us") || m.from === "status@broadcast" ? msg.key?.participant || msg.participant : m.from);
  m.body = [msg.messageStubParameters[1] ?? msg.messageStubParameters[0]].join("");
  m.type = msg.messageStubType;
  m.timestamps = (typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : msg.messageTimestamp.low ? msg.messageTimestamp.low : msg.messageTimestamp.high) * 1000 || Date.now();

  return m;
};
