import P from "pino";
import { Boom } from "@hapi/boom";
import { join as pathJoin } from "path";
import EventEmitter from "@arugaz/eventemitter";
import { writeFile as fsWriteFile } from "fs/promises";
import makeWASocket, {
  BaileysEventMap,
  DisconnectReason,
  downloadContentFromMessage,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  jidDecode,
  MessageGenerationOptionsFromContent,
  proto,
  toBuffer,
  WAMessageStubType,
} from "@adiwajshing/baileys";

// if you want to use single auth, import useSingleAuthState
import { useMultiAuthState } from "../libs/auth.libs";
import Database from "../libs/database.libs";
import color from "../utils/color.utils";
import config from "../utils/config.utils";
import type { Aruga, ArugaConfig, ArugaEventEmitter } from "../types/client.types";
import type { MessageSerialize } from "../types/serialize.types";

let first = !0;
export default class Client
  extends (EventEmitter as new () => ArugaEventEmitter)
  implements Aruga
{
  #cfg: ArugaConfig;
  constructor(cfg: ArugaConfig) {
    super();
    this.#cfg = cfg;
  }

  /** Start Whatsapp Client */
  public async startClient(): Promise<void> {
    const logger = this.#cfg.logger || P({ level: "silent" }).child({ level: "silent" });

    const { saveState, clearState, state } = await useMultiAuthState(Database);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    const aruga = makeWASocket({
      ...this.#cfg,
      auth: state,
      logger,
      patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.listMessage);
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {},
                },
                ...message,
              },
            },
          };
        }
        return message;
      },
      printQRInTerminal: true,
      version,
    });

    for (const method of Object.keys(aruga).filter((v) => v !== "ws" && v !== "ev"))
      (this[method as keyof Client] = aruga[method as keyof Aruga]), delete aruga[method];

    // connection
    aruga.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        this.log("Disconnected!", "error");
        if (
          reason === DisconnectReason.loggedOut ||
          reason === DisconnectReason.multideviceMismatch ||
          reason === DisconnectReason.badSession ||
          reason === DisconnectReason.serviceUnavailable
        ) {
          if (clearState) {
            this.log("Deleting session...", "error");
            await clearState();
            this.log("Session deleted!", "error");
          }
          if (reason === DisconnectReason.serviceUnavailable) {
            throw new Error("Your WhatsApp account has been banned!");
          }
          await aruga.logout();
        } else {
          this.log("Reconnecting...", "warning");
          setTimeout(() => this.startClient().catch(console.error), 1500);
        }
      }

      if (connection === "connecting") {
        this.log("Connecting...", "warning");
      }

      if (connection === "open") {
        this.log("Connected!");
        if (first) {
          console.log(" ");
          this.log("Name    : " + (this.user?.name || "unknown"), "info");
          this.log("Number  : " + (this.user?.id?.split(":")[0] || "unknown"), "info");
          this.log("Version : " + version.join("."), "info");
          this.log("Latest  : " + `${isLatest ? "yes" : "nah"}`, "info");
          first = !first;
          console.log(" ");
        }
      }
    });

    // credentials
    aruga.ev.on("creds.update", saveState);

    /** forwarded to the main event */
    // call events
    aruga.ev.on("call", (call) => call.length >= 1 && this.emit("call", call[0]));
    // message event
    aruga.ev.on(
      "messages.upsert",
      (msg) =>
        msg.type === "notify" &&
        msg.messages.length >= 1 &&
        msg.messages[0].message &&
        this.emit("message", msg.messages[0]),
    );
    // group event
    aruga.ev.on(
      "messages.upsert",
      (msg) =>
        msg.type === "append" &&
        msg.messages.length >= 1 &&
        (msg.messages[0].messageStubType === WAMessageStubType.GROUP_CHANGE_SUBJECT ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_CHANGE_ICON ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_CHANGE_INVITE_LINK ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_CHANGE_RESTRICT ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_CHANGE_ANNOUNCE ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_CHANGE_DESCRIPTION) &&
        this.emit("group", msg.messages[0]),
    );
    // group participant event
    aruga.ev.on(
      "messages.upsert",
      (msg) =>
        msg.type === "append" &&
        msg.messages.length >= 1 &&
        (msg.messages[0].messageStubType === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_PARTICIPANT_INVITE ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
          msg.messages[0].messageStubType === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE) &&
        this.emit("group.participant", msg.messages[0]),
    );

    /** wait, lemme ignore them */
    for (const events of [
      "blocklist.set",
      "blocklist.update",
      "call",
      "connection.update",
      "creds.update",
      "chats.delete",
      "chats.update",
      "chats.upsert",
      "contacts.update",
      "contacts.upsert",
      "group-participants.update",
      "groups.update",
      "groups.upsert",
      "message-receipt.update",
      "messages.delete",
      "messages.media-update",
      "messages.reaction",
      "messages.update",
      "messages.upsert",
      "messaging-history.set",
      "presence.update",
    ]) {
      if (
        events !== "call" &&
        events !== "connection.update" &&
        events !== "creds.update" &&
        events !== "messages.upsert"
      )
        aruga.ev.removeAllListeners(events as keyof BaileysEventMap);
    }
  }

  /**
   * Decode jid to make it correctly formatted
   * @param {string} jid: user/group jid
   */
  public decodeJid(jid: string): string {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid);
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  }

  /**
   * Download media message and return buffer
   * @param {proto.IMessage} message:proto.IMessage
   */
  public async downloadMediaMessage(message: proto.IMessage): Promise<Buffer> {
    const type = Object.keys(message)[0];
    const mime = {
      imageMessage: "image",
      videoMessage: "video",
      stickerMessage: "sticker",
      documentMessage: "document",
      audioMessage: "audio",
    };
    return await toBuffer(await downloadContentFromMessage(message[type], mime[type]));
  }

  /**
   * Download media message and save to local storage
   * @param {proto.IMessage} message:proto.IMessage
   * @param {string} filename=filename
   */
  public async downloadAndSaveMediaMessage(
    message: proto.IMessage,
    filename: string,
  ): Promise<string> {
    const buffer = await this.downloadMediaMessage(message);
    const filePath = pathJoin(__dirname, "..", "..", "temp", filename);
    await fsWriteFile(filePath, buffer);
    return filePath;
  }

  public async resendMessage(
    jid: string,
    message: MessageSerialize,
    opts: Omit<MessageGenerationOptionsFromContent, "userJid">,
  ) {
    message.message = message.message?.viewOnceMessage
      ? message.message.viewOnceMessage?.message
      : message.message?.viewOnceMessageV2
      ? message.message.viewOnceMessage?.message
      : message.message?.viewOnceMessageV2Extension
      ? message.message.viewOnceMessageV2Extension?.message
      : message.message || message.message;
    delete message.message[message.type].viewOnce;
    const content = generateForwardMessageContent(proto.WebMessageInfo.fromObject(message), false);

    if (content.listMessage) content.listMessage.listType = 1;
    const contentType = Object.keys(content).find(
      (x) =>
        x !== "senderKeyDistributionMessage" &&
        x !== "messageContextInfo" &&
        x !== "inviteLinkGroupTypeV2",
    );
    delete content[contentType].contextInfo.forwardingScore as unknown;
    delete content[contentType].contextInfo.isForwarded as unknown;

    const waMessage = generateWAMessageFromContent(jid, content, {
      userJid: this.decodeJid(this.user.id),
      ...opts,
    });

    if (waMessage?.message?.buttonsMessage?.contentText)
      waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.EMPTY;
    if (waMessage?.message?.buttonsMessage?.imageMessage)
      waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.IMAGE;
    if (waMessage?.message?.buttonsMessage?.videoMessage)
      waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.VIDEO;
    if (waMessage?.message?.buttonsMessage?.documentMessage)
      waMessage.message.buttonsMessage.headerType =
        proto.Message.ButtonsMessage.HeaderType.DOCUMENT;
    if (waMessage?.message?.buttonsMessage?.locationMessage)
      waMessage.message.buttonsMessage.headerType =
        proto.Message.ButtonsMessage.HeaderType.LOCATION;

    await this.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
      cachedGroupMetadata: async (jid) =>
        await Database.groupMetadata.findUnique({ where: { groupId: jid } }),
    });
    process.nextTick(() => this.upsertMessage(waMessage, "append"));
    return waMessage;
  }

  /**
   * @param {String} text:message
   * @param {String} type?:"error" | "warning" | "info" | "success"
   * @param {Number} date?:Date.now()
   * @returns {void} print logs
   */
  public log(
    text: string,
    type: "error" | "warning" | "info" | "success" = "success",
    date?: number,
  ): void {
    console.log(
      color[
        type === "error"
          ? "red"
          : type === "warning"
          ? "yellow"
          : type === "info"
          ? "blue"
          : "green"
      ](`[ ${type === "error" ? "X" : type === "warning" ? "!" : "V"} ]`),
      color.hex("#ff7f00" as HexColor)(
        `${new Date(!date ? Date.now() : date).toLocaleString("en-US", {
          timeZone: config.timeZone,
        })}`,
      ),
      text,
    );
  }

  public getOrderDetails: Aruga["getOrderDetails"];
  public getCatalog: Aruga["getCatalog"];
  public getCollections: Aruga["getCollections"];
  public productCreate: Aruga["productCreate"];
  public productDelete: Aruga["productDelete"];
  public productUpdate: Aruga["productUpdate"];
  public sendMessageAck: Aruga["sendMessageAck"];
  public sendRetryRequest: Aruga["sendRetryRequest"];
  public rejectCall: Aruga["rejectCall"];
  public getPrivacyTokens: Aruga["getPrivacyTokens"];
  public assertSessions: Aruga["assertSessions"];
  public relayMessage: Aruga["relayMessage"];
  public sendReceipt: Aruga["sendReceipt"];
  public sendReceipts: Aruga["sendReceipts"];
  public readMessages: Aruga["readMessages"];
  public refreshMediaConn: Aruga["refreshMediaConn"];
  public waUploadToServer: Aruga["waUploadToServer"];
  public fetchPrivacySettings: Aruga["fetchPrivacySettings"];
  public updateMediaMessage: Aruga["updateMediaMessage"];
  public sendMessage: Aruga["sendMessage"];
  public groupMetadata: Aruga["groupMetadata"];
  public groupCreate: Aruga["groupCreate"];
  public groupLeave: Aruga["groupLeave"];
  public groupUpdateSubject: Aruga["groupUpdateSubject"];
  public groupParticipantsUpdate: Aruga["groupParticipantsUpdate"];
  public groupUpdateDescription: Aruga["groupUpdateDescription"];
  public groupInviteCode: Aruga["groupInviteCode"];
  public groupRevokeInvite: Aruga["groupRevokeInvite"];
  public groupAcceptInvite: Aruga["groupAcceptInvite"];
  public groupAcceptInviteV4: Aruga["groupAcceptInviteV4"];
  public groupGetInviteInfo: Aruga["groupGetInviteInfo"];
  public groupToggleEphemeral: Aruga["groupToggleEphemeral"];
  public groupSettingUpdate: Aruga["groupSettingUpdate"];
  public groupFetchAllParticipating: Aruga["groupFetchAllParticipating"];
  public processingMutex: Aruga["processingMutex"];
  public upsertMessage: Aruga["upsertMessage"];
  public appPatch: Aruga["appPatch"];
  public sendPresenceUpdate: Aruga["sendPresenceUpdate"];
  public presenceSubscribe: Aruga["presenceSubscribe"];
  public profilePictureUrl: Aruga["profilePictureUrl"];
  public onWhatsApp: Aruga["onWhatsApp"];
  public fetchBlocklist: Aruga["fetchBlocklist"];
  public fetchStatus: Aruga["fetchStatus"];
  public updateProfilePicture: Aruga["updateProfilePicture"];
  public updateProfileStatus: Aruga["updateProfileStatus"];
  public updateProfileName: Aruga["updateProfileName"];
  public updateBlockStatus: Aruga["updateBlockStatus"];
  public getBusinessProfile: Aruga["getBusinessProfile"];
  public resyncAppState: Aruga["resyncAppState"];
  public chatModify: Aruga["chatModify"];
  public type: Aruga["type"];
  public authState: Aruga["authState"];
  public user: Aruga["user"];
  public generateMessageTag: Aruga["generateMessageTag"];
  public query: Aruga["query"];
  public waitForMessage: Aruga["waitForMessage"];
  public waitForSocketOpen: Aruga["waitForSocketOpen"];
  public sendRawMessage: Aruga["sendRawMessage"];
  public sendNode: Aruga["sendNode"];
  public logout: Aruga["logout"];
  public end: Aruga["end"];
  public onUnexpectedError: Aruga["onUnexpectedError"];
  public uploadPreKeys: Aruga["uploadPreKeys"];
  public uploadPreKeysToServerIfRequired: Aruga["uploadPreKeysToServerIfRequired"];
  public waitForConnectionUpdate: Aruga["waitForConnectionUpdate"];
}
