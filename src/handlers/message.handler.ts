import { inspect } from "util";
import { basename, join } from "path";
import { lstatSync, readdirSync } from "fs";
import type { proto, WAMessage } from "@adiwajshing/baileys";
import type Client from "../libs/whatsapp.libs";
import type { MessageSerialize } from "../types/message.types";
import color from "../utils/color.utils";
import { commands, cooldowns } from "../utils/command.utils";

export default class MessageHandler {
  constructor(private aruga: Client) {}

  async execute(messageTimestamp: number, message: MessageSerialize) {
    // Parsing the message
    const prefix = message.body && ([[new RegExp("^[" + (this.aruga.config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-").replace(/[|\\{}()[\]^$+*?.\-^]/g, "\\$&") + "]").exec(message.body), this.aruga.config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-"]].find((p) => p[1])[0] || [""])[0];
    const cmd = message.body && !!prefix && message.body.startsWith(prefix) && message.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();
    const args = message.body.trim().split(/ +/).slice(1);
    const arg = args.join(" ").trim();
    const command = commands.get(cmd) ?? commands.find((v) => v.aliases && v.aliases.includes(cmd));

    if (command) {
      // avoid spam messages
      if (cooldowns.has(message.sender)) {
        this.aruga.log(`${color.yellow("[SPAM]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "warning", messageTimestamp);
        return await message.reply(`Cmd cooldown! please wait ${((command.cd || 3) - (Date.now() - cooldowns.get(message.sender)) / 1000).toFixed(1)}s`);
      }

      const botNumber = this.aruga.decodeJid(this.aruga.user.id);
      const groupAdmins = message.isGroupMsg && (message.groupMetadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []) as { id: string; admin: string }[]);
      const isGroupOwner = message.isGroupMsg && !!groupAdmins.find((member) => member.admin === "superadmin" && member.id === message.sender);
      const isGroupAdmin = message.isGroupMsg && !!groupAdmins.find((member) => member.id === message.sender);
      const isBotGroupAdmin = message.isGroupMsg && !!groupAdmins.find((member) => member.id === botNumber);
      const isOwner = message.sender && this.aruga.config.ownerNumber.includes(message.sender.replace(/\D+/g, ""));

      const group = message.isGroupMsg && (await this.aruga.DB.group.upsert({ where: { groupId: message.from }, create: { groupId: message.from, name: message.groupMetadata.subject }, update: {} }));
      const user = message.sender && (await this.aruga.DB.user.upsert({ where: { userId: message.sender }, create: { userId: message.sender, name: message.pushname, language: this.aruga.config.language, limit: this.aruga.config.user.limit || 30 }, update: {} }));

      // maintenance and only can used by the bot owner
      if (command.maintenance && !isOwner) return await message.reply("Cmd maintenance");

      // only for bot owner
      if (command.ownerOnly && !isOwner) return await message.reply("Cmd only for owner bot");

      // only for private chats
      if (command.privateOnly && message.isGroupMsg) return await message.reply("Cmd only for private chats");

      // only for group chats
      if (command.groupOnly && !message.isGroupMsg) return await message.reply("Cmd only for group chats");

      // only if the bot is the group admin
      if (command.botGroupAdmin && message.isGroupMsg && !isBotGroupAdmin) return await message.reply("Cmd can only be used when bot is a group admin");

      // only for group owner
      if (command.ownerGroup && message.isGroupMsg && !isGroupOwner) return await message.reply("Cmd only for group owner");

      // only for group admins
      if (command.adminGroup && message.isGroupMsg && !isGroupAdmin) return await message.reply("Cmd only for group admins");

      // only for premium users
      if (command.premiumOnly && !user.premium) return await message.reply("Cmd for premium users");

      try {
        await command.execute({ aruga: this.aruga, message, messageTimestamp, command: cmd, prefix, args, arg });

        this.aruga.log(`${color.green("[EXEC]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(group.name || "unknown")}` : ""}`.trim(), "success", messageTimestamp);
      } catch {
        this.aruga.log(`${color.red("[ERRR]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(group.name || "unknown")}` : ""}`.trim(), "error", messageTimestamp);
      } finally {
        // after running the command add cooldown even if there is an error, for every user except bot owners and premium users
        if (!isOwner && !user.premium) {
          cooldowns.set(message.sender, Date.now());
          setTimeout(() => cooldowns.delete(message.sender), (command.cd || 3) * 1000);
        }
      }
    }

    /**
     * Eval command for development purposes, only for bot owner
     * @example
     * >> return 123 // bot will reply 123
     */
    if (message.body.startsWith(">>") && this.aruga.config.ownerNumber.includes(message.sender.replace(/\D+/g, ""))) {
      const evalCmd: unknown = eval("(async() => {" + arg + "})()");
      new Promise((resolve, reject) => {
        try {
          resolve(evalCmd);
        } catch (err: unknown) {
          reject(err);
        }
      })
        .then((res: unknown) => message.reply(inspect(res, false)).catch((err) => this.aruga.log((err as Error).message || (typeof err === "string" && err), "error")))
        .catch((err: unknown) => message.reply(inspect(err, true)).catch((err) => this.aruga.log((err as Error).message || (typeof err === "string" && err), "error")))
        .finally(() => this.aruga.log(`${color.purple("[EVAL]")} ${color.cyan(`>> [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "info", messageTimestamp));
    }
  }

  async serialize(msg: WAMessage) {
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

    const m = {} as MessageSerialize;
    m.message = msg.message;

    m.key = msg.key;
    m.id = m.key.id;
    m.isBotMsg = m.id.startsWith("BAE") && m.id.length === 16;
    m.isGroupMsg = m.key.remoteJid.endsWith("g.us");
    m.from = this.aruga.decodeJid(m.key.remoteJid);
    m.fromMe = m.key.fromMe;
    m.type = Object.keys(m.message).find((x) => x !== "senderKeyDistributionMessage" && x !== "messageContextInfo");
    m.sender = this.aruga.decodeJid(m.fromMe ? this.aruga.user.id : m.isGroupMsg || m.from === "status@broadcast" ? m.key.participant || msg.participant : m.from);
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
    m.mentions = m.message[m.type]?.contextInfo?.mentionedJid || [];
    m.reply = async (text, quoted): Promise<proto.WebMessageInfo> => await this.aruga.sendMessage(m.from, { text, ...(m.isGroupMsg ? { mentions: [m.sender] } : {}) }, quoted && { quoted: { key: m.key, message: m.message } });
    m.download = async (filename = (Date.now() + Math.floor(Math.random() * 20 + 1)).toString(36).slice(-6)) => (filename ? await this.aruga.downloadAndSaveMediaMessage(m.message, filename) : await this.aruga.downloadMediaMessage(m.message));

    m.quoted = {} as MessageSerialize;
    m.quoted.message = m?.message[m.type]?.contextInfo?.quotedMessage
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
        participant: this.aruga.decodeJid(m.message[m.type]?.contextInfo?.participant),
        remoteJid: m?.message[m.type]?.contextInfo?.remoteJid || m.from || m.sender,
        fromMe: this.aruga.decodeJid(m.message[m.type].contextInfo.participant) === this.aruga.decodeJid(this.aruga.user.id),
        id: m.message[m.type].contextInfo.stanzaId,
      };
      m.quoted.id = m.quoted.key.id;
      m.quoted.isBotMsg = m.quoted.id.startsWith("BAE") && m.quoted.id.length === 16;
      m.quoted.isGroupMsg = m.quoted.key.remoteJid.endsWith("g.us");
      m.quoted.from = this.aruga.decodeJid(m.quoted.key.remoteJid);
      m.quoted.fromMe = m.quoted.key.fromMe;
      m.quoted.type = Object.keys(m.quoted.message).find((x) => x !== "senderKeyDistributionMessage" && x !== "messageContextInfo");
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
      m.quoted.reply = async (text, quoted) => await this.aruga.sendMessage(m.from, { text, ...(m.quoted.isGroupMsg ? { mentions: [m.quoted.sender] } : {}) }, quoted && { quoted: { key: m.quoted.key, message: m.quoted.message } });
      m.quoted.download = async (filename = (Date.now() + Math.floor(Math.random() * 20 + 1)).toString(36).slice(-6)) => (filename ? await this.aruga.downloadAndSaveMediaMessage(m.quoted.message, filename) : await this.aruga.downloadMediaMessage(m.quoted.message));
    } else delete m.quoted;

    m.pushname = msg.pushName;

    // lag anying
    m.groupMetadata = m.type !== "stickerMessage" && m.isGroupMsg && (await this.aruga.groupMetadata(m.from));
    return m;
  }

  registerCommand(pathname: string = "commands") {
    const files = readdirSync(join(__dirname, "..", pathname));
    for (const file of files) {
      const filePath = join(__dirname, "..", pathname, file);
      const isDirectory = lstatSync(filePath ? filePath : "").isDirectory();
      const baseFilename = basename(file, file.includes(".ts") ? ".ts" : ".js").toLowerCase();
      if (isDirectory) {
        this.registerCommand(`${pathname}/${file}`);
      } else if (commands.has(baseFilename)) {
        this.aruga.log(`Command file ${file} already registered`, "warning");
      } else commands.set(baseFilename, require(filePath).default);
    }
    commands.sort();
  }
}
