import fs from "fs";
import path from "path";
import { inspect } from "util";
import type { proto, WAMessage } from "@adiwajshing/baileys";

import i18n from "../libs/international.libs";
import type Client from "../libs/whatsapp.libs";
import color from "../utils/color.utils";
import config from "../utils/config.utils";
import { timeFormat } from "../utils/format.utils";
import { commands, cooldowns, queues } from "../utils/command.utils";
import { createOrGetUser } from "../utils/user.utils";
import { createOrGetGroup, createOrGetGroupMetadata } from "../utils/group.utils";
import { MessageSerialize } from "../types/message.types";

export const execute = async (aruga: Client, message: MessageSerialize) => {
  // Parsing the message
  const prefix = message.body && ([[new RegExp("^[" + (config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-").replace(/[|\\{}()[\]^$+*?.\-^]/g, "\\$&") + "]").exec(message.body), config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-"]].find((p) => p[1])[0] || [""])[0];
  const cmd = message.body && !!prefix && message.body.startsWith(prefix) && message.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
  const args = message.body.trim().split(/ +/).slice(1) || [];
  const arg = message.body.indexOf(" ") !== -1 ? message.body.trim().substring(message.body.indexOf(" ") + 1) : "";
  const command = commands.get(cmd) ?? commands.find((v) => v.aliases && v.aliases.includes(cmd));

  if (command) {
    const group = message.isGroupMsg && (await createOrGetGroup(message.from, message.groupMetadata.subject));
    const user = message.sender && (await createOrGetUser(message.sender, message.pushname));

    // avoid spam messages
    if (cooldowns.has(message.sender)) {
      aruga.log(`${color.yellow("[SPAM]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "warning", message.timestamps);
      return await message.reply(i18n.translate("handlers.message.cooldown", { SKNDS: timeFormat((command.cd || 3) - (Date.now() - cooldowns.get(message.sender))) }, user.language), true);
    }

    const botNumber = aruga.decodeJid(aruga.user.id);
    const groupAdmins = message.isGroupMsg && (message.groupMetadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []) as { id: string; admin: string }[]);
    const isGroupOwner = message.isGroupMsg && !!groupAdmins.find((member) => member.admin === "superadmin" && member.id === message.sender);
    const isGroupAdmin = message.isGroupMsg && !!groupAdmins.find((member) => member.id === message.sender);
    const isBotGroupAdmin = message.isGroupMsg && !!groupAdmins.find((member) => member.id === botNumber);
    const isOwner = message.sender && config.ownerNumber.includes(message.sender.replace(/\D+/g, ""));

    // maintenance and only can used by the bot owner
    if (command.maintenance && !isOwner) return await message.reply(i18n.translate("handlers.message.maintenance", {}, user.language));

    // only for bot owner
    if (command.ownerOnly && !isOwner) return await message.reply(i18n.translate("handlers.message.ownerOnly", {}, user.language));

    // only for premium users
    if (command.premiumOnly && !["premium", "vip"].includes(user.role) && !isOwner) return await message.reply(i18n.translate("handlers.message.premiumOnly", {}, user.language));

    // only for private chats
    if (command.privateOnly && message.isGroupMsg) return await message.reply(i18n.translate("handlers.message.privateOnly", {}, user.language));

    // only for group chats
    if (command.groupOnly && !message.isGroupMsg) return await message.reply(i18n.translate("handlers.message.groupOnly", {}, user.language));

    // only if the bot is the group admin
    if (command.botGroupAdmin && message.isGroupMsg && !isBotGroupAdmin) return await message.reply(i18n.translate("handlers.message.botGroupAdmin", {}, user.language));

    // only for group owner
    if (command.ownerGroup && message.isGroupMsg && !isGroupOwner && !isOwner) return await message.reply(i18n.translate("handlers.message.ownerGroup", {}, user.language));

    // only for group admins
    if (command.adminGroup && message.isGroupMsg && !isGroupAdmin && !isOwner) return await message.reply(i18n.translate("handlers.message.adminGroup", {}, user.language));

    try {
      await queues.add(
        async () =>
          await command.execute({
            aruga,
            message,
            command: cmd,
            prefix,
            args,
            arg,
            isGroupOwner,
            isGroupAdmin,
            isBotGroupAdmin,
            isOwner,
            user,
            group,
          }),
        {
          priority: isOwner ? 3 : user.role === "vip" ? 2 : user.role === "premium" ? 1 : 0,
        },
      );

      aruga.log(`${color.green("[EXEC]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "success", message.timestamps);
    } catch (e) {
      console.error(e);
      aruga.log(`${color.red("[ERRR]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "error", message.timestamps);
    } finally {
      // after running the command add cooldown even if there is an error exclude general command, for every user except bot owners and premium users
      if (!["premium", "vip"].includes(user.role) && !isOwner && command.category !== "general") {
        cooldowns.set(message.sender, Date.now());
        setTimeout(() => cooldowns.delete(message.sender), (command.cd || 3) * 1000);
      }
    }
  } else {
    /**
     * Eval command for development purposes, only for bot owner
     * @example
     * >> return 123 // bot will reply 123
     */
    if (message.body.startsWith(">>") && config.ownerNumber.includes(message.sender.replace(/\D+/g, ""))) {
      let evalCmd: unknown;
      // handles errors if you make a typo
      try {
        evalCmd = eval("(async() => {" + arg + "})()");
      } catch (err: unknown) {
        message.reply(inspect(err, true)).catch((err) => aruga.log((err as Error).message || (typeof err === "string" && err), "error"));
      }
      new Promise((resolve, reject) => {
        try {
          resolve(evalCmd);
        } catch (err: unknown) {
          reject(err);
        }
      })
        .then((res: unknown) => message.reply(inspect(res, false)).catch((err) => aruga.log((err as Error).message || (typeof err === "string" && err), "error")))
        .catch((err: unknown) => message.reply(inspect(err, true)).catch((err) => aruga.log((err as Error).message || (typeof err === "string" && err), "error")))
        .finally(() => aruga.log(`${color.purple("[EVAL]")} ${color.cyan(`>> [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "info", message.timestamps));
    }
  }
};

export const serialize = async (aruga: Client, msg: WAMessage) => {
  msg.message = msg.message?.viewOnceMessage
    ? msg.message.viewOnceMessage?.message
    : msg.message?.ephemeralMessage
    ? msg.message.ephemeralMessage?.message
    : msg.message?.documentWithCaptionMessage
    ? msg.message.documentWithCaptionMessage?.message
    : msg.message?.viewOnceMessageV2
    ? msg.message.viewOnceMessageV2?.message
    : msg.message?.editedMessage
    ? msg.message.editedMessage?.message
    : msg.message?.viewOnceMessageV2Extension
    ? msg.message.viewOnceMessageV2Extension?.message
    : msg.message;

  const m = <MessageSerialize>{};
  m.message = msg.message;

  m.key = msg.key;
  m.id = m.key.id;
  m.isBotMsg = (m.id.startsWith("ARUGAZ") && m.id.length === 18) || (m.id.startsWith("BAE5") && m.id.length === 16);
  m.isGroupMsg = m.key.remoteJid.endsWith("g.us");
  m.from = aruga.decodeJid(m.key.remoteJid);
  m.fromMe = m.key.fromMe;
  m.type = Object.keys(m.message).find((x) => x !== "senderKeyDistributionMessage" && x !== "messageContextInfo" && x !== "inviteLinkGroupTypeV2");
  m.sender = aruga.decodeJid(m.fromMe ? aruga.user.id : m.isGroupMsg || m.from === "status@broadcast" ? m.key.participant || msg.participant : m.from);
  m.key.participant = !m.key.participant || m.key.participant === "status_me" ? m.sender : m.key.participant;
  m.body =
    m.message.conversation && m.type === "conversation"
      ? m.message.conversation
      : m.message.extendedTextMessage && m.type === "extendedTextMessage"
      ? m.message.extendedTextMessage.text
      : m.message.imageMessage && m.type === "imageMessage"
      ? m.message.imageMessage.caption
      : m.message.videoMessage && m.type === "videoMessage"
      ? m.message.videoMessage.caption
      : m.message.documentMessage && m.type === "documentMessage"
      ? m.message.documentMessage.caption
      : m.message.buttonsResponseMessage && m.type === "buttonsResponseMessage"
      ? m.message.buttonsResponseMessage.selectedButtonId
      : m.message.listResponseMessage && m.type === "listResponseMessage"
      ? m.message.listResponseMessage.singleSelectReply.selectedRowId
      : m.message.templateButtonReplyMessage && m.type === "templateButtonReplyMessage"
      ? m.message.templateButtonReplyMessage.selectedId
      : m.message.reactionMessage && m.type === "reactionMessage"
      ? m.message.reactionMessage.text
      : "";
  m.expiration = m.message[m.type]?.contextInfo?.expiration || 0;
  m.timestamps = (typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : msg.messageTimestamp.low ? msg.messageTimestamp.low : msg.messageTimestamp.high) * 1000 || Date.now();
  m.mentions = m.message[m.type]?.contextInfo?.mentionedJid || [];
  m.reply = async (text, quoted) => await aruga.sendMessage(m.from, { text, ...(m.isGroupMsg ? { mentions: [m.sender] } : {}) }, { ...(quoted ? { quoted: { key: m.key, message: m.message } } : {}), ephemeralExpiration: m.expiration });

  function download(): Promise<Buffer>;
  function download(filepath: string): Promise<string>;
  function download(filepath?: string): Promise<string | Buffer> {
    if (filepath) return aruga.downloadAndSaveMediaMessage(m.message, filepath);
    else return aruga.downloadMediaMessage(m.message);
  }
  m.download = download;

  m.quoted = <MessageSerialize>{};
  m.quoted.message = m.message[m.type]?.contextInfo?.quotedMessage
    ? m.message[m.type].contextInfo.quotedMessage?.viewOnceMessage
      ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.ephemeralMessage
      ? m.message[m.type].contextInfo.quotedMessage.ephemeralMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.documentWithCaptionMessage
      ? m.message[m.type].contextInfo.quotedMessage.documentWithCaptionMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2
      ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessageV2?.message
      : m.message[m.type].contextInfo.quotedMessage?.editedMessage
      ? m.message[m.type].contextInfo.quotedMessage.editedMessage?.message
      : m.message[m.type].contextInfo.quotedMessage?.viewOnceMessageV2Extension
      ? m.message[m.type].contextInfo.quotedMessage.viewOnceMessageV2Extension?.message
      : m.message[m.type].contextInfo.quotedMessage
    : null;

  if (m.quoted.message) {
    m.quoted.key = {
      participant: aruga.decodeJid(m.message[m.type]?.contextInfo?.participant),
      remoteJid: m?.message[m.type]?.contextInfo?.remoteJid || m.from || m.sender,
      fromMe: aruga.decodeJid(m.message[m.type].contextInfo.participant) === aruga.decodeJid(aruga.user.id),
      id: m.message[m.type].contextInfo.stanzaId,
    };
    m.quoted.id = m.quoted.key.id;
    m.quoted.isBotMsg = (m.quoted.id.startsWith("ARUGAZ") && m.quoted.id.length === 18) || (m.quoted.id.startsWith("BAE5") && m.quoted.id.length === 16);
    m.quoted.isGroupMsg = m.quoted.key.remoteJid.endsWith("g.us");
    m.quoted.from = aruga.decodeJid(m.quoted.key.remoteJid);
    m.quoted.fromMe = m.quoted.key.fromMe;
    m.quoted.type = Object.keys(m.quoted.message).find((x) => x !== "senderKeyDistributionMessage" && x !== "messageContextInfo" && x !== "inviteLinkGroupTypeV2");
    m.quoted.sender = m.quoted.key.participant;
    m.quoted.body =
      m.quoted.message.conversation && m.quoted.type === "conversation"
        ? m.quoted.message.conversation
        : m.quoted.message.extendedTextMessage && m.quoted.type === "extendedTextMessage"
        ? m.quoted.message.extendedTextMessage.text
        : m.quoted.message.imageMessage && m.quoted.type === "imageMessage"
        ? m.quoted.message.imageMessage.caption
        : m.quoted.message.videoMessage && m.quoted.type === "videoMessage"
        ? m.quoted.message.videoMessage.caption
        : m.quoted.message.documentMessage && m.quoted.type === "documentMessage"
        ? m.quoted.message.documentMessage.caption
        : m.quoted.message.buttonsResponseMessage && m.quoted.type === "buttonsResponseMessage"
        ? m.quoted.message.buttonsResponseMessage.selectedButtonId
        : m.quoted.message.listResponseMessage && m.quoted.type === "listResponseMessage"
        ? m.quoted.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.quoted.message.templateButtonReplyMessage && m.quoted.type === "templateButtonReplyMessage"
        ? m.quoted.message.templateButtonReplyMessage.selectedId
        : m.quoted.message.reactionMessage && m.quoted.type === "reactionMessage"
        ? m.quoted.message.reactionMessage.text
        : "";
    m.quoted.mentions = m.quoted.message[m.quoted.type]?.contextInfo?.mentionedJid || [];
    m.quoted.reply = async (text, quoted) => await aruga.sendMessage(m.from, { text, ...(m.quoted.isGroupMsg ? { mentions: [m.quoted.sender] } : {}) }, { ...(quoted ? { quoted: { key: m.quoted.key, message: m.quoted.message } } : {}), ephemeralExpiration: m.expiration });

    function download(): Promise<Buffer>;
    function download(filepath: string): Promise<string>;
    function download(filepath?: string): Promise<Buffer | string> {
      if (filepath) return aruga.downloadAndSaveMediaMessage(m.quoted.message, filepath);
      else return aruga.downloadMediaMessage(m.quoted.message);
    }
    m.quoted.download = download;
  } else m.quoted = null;

  m.pushname = msg.pushName || "unknown";

  // lag anying
  m.groupMetadata = m.type !== "stickerMessage" && m.isGroupMsg && createOrGetGroupMetadata(m.from, await aruga.groupMetadata(m.from));

  return m;
};

export const registerCommand = (pathname: string = "commands") => {
  const files = fs.readdirSync(path.join(__dirname, "..", pathname));
  for (const file of files) {
    const filePath = path.join(__dirname, "..", pathname, file);
    const isDirectory = fs.lstatSync(filePath).isDirectory();
    if (isDirectory) registerCommand(pathname + path.sep + file);
    const baseFilename = path.basename(file, file.includes(".ts") ? ".ts" : ".js").toLowerCase();
    if (!isDirectory && !commands.has(baseFilename)) commands.set(baseFilename, require(filePath).default);
  }
  commands.sort();
};
