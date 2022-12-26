import { WACallEvent, WA_DEFAULT_EPHEMERAL } from "@adiwajshing/baileys";
import Client from "../../../libs/whatsapp.libs";
import { CallSerialize } from "../../../types/serialize.types";

/** Call Serialize */
export const call = async (aruga: Client, call: WACallEvent): Promise<CallSerialize> => {
  const c = <CallSerialize>{};
  c.callFrom = aruga.decodeJid(call.from);
  c.callId = call.id;
  c.status = call.status;
  c.reply = async (text: string) => {
    return await aruga.sendMessage(call.from, { text }, { ephemeralExpiration: WA_DEFAULT_EPHEMERAL });
  };

  return c;
};
