import P from "pino";
import EventEmitter from "events";
import { Boom } from "@hapi/boom";
import { join as pathJoin } from "path";
import { writeFile as fsWriteFile } from "fs/promises";
import makeWASocket, {
  downloadContentFromMessage,
  fetchLatestBaileysVersion,
  FullJid,
  jidDecode,
  proto,
  toBuffer,
} from "@adiwajshing/baileys";
import Database from "../libs/database.libs";
import color from "../utils/color.utils";
import config from "../utils/config.utils";
import type { ArugaAuth } from "../types/auth.types";
import type { Aruga, ArugaConfig, ArugaEventEmitter } from "../types/client.types";

let first = true;
export default class Client extends (EventEmitter as new () => ArugaEventEmitter) implements Aruga {
  #cfg: ArugaConfig;
  constructor(cfg: ArugaConfig) {
    super();
    this.#cfg = cfg;
  }

  /** Start client */
  public async startClient(): Promise<void> {
    const logger = this.#cfg.logger || P({ level: "silent" }).child({ level: "silent" });

    const { saveState, clearState, state }: ArugaAuth =
      this.#cfg.authType === "single"
        ? await require("../libs/auth.libs").useSingleAuthState(Database)
        : await require("../libs/auth.libs").useMultiAuthState(Database);
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
      this[method as keyof Client] = aruga[method as keyof Aruga];

    aruga.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (reason === 401 || reason === 500 || reason === 440 || reason === 403) {
          this.log("Disconnected!", "error");
          this.log("Deleting session...", "error");
          clearState && (await clearState());
          this.log("Session deleted!", "error");
          if (reason === 403) {
            this.log("Your account is blocked? idk tho i got this when i was banned from whatsapp...", "error");
            throw new Error("Error Forbidden, Connection failure");
          }
          this.log("Starting...", "warning");
        } else {
          this.log("Reconnecting...", "warning");
        }
        setTimeout(() => this.startClient(), 1000);
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
          first = false;
          console.log(" ");
        }
      }
    });

    aruga.ev.on("call", (call) => call.length >= 1 && this.emit("call", call[0]));
    aruga.ev.on(
      "messages.upsert",
      (msg) =>
        msg.type === "notify" &&
        msg.messages.length >= 1 &&
        msg.messages[0].message &&
        this.emit("message", msg.messages[0]),
    );

    aruga.ev.on("creds.update", async () => await saveState());
  }

  /**
   * Decode jid to make it correctly formatted
   * @param {string} jid:string user/group jid
   */
  public decodeJid(jid: string): string {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) as FullJid;
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
   * @param {string} filename='random string' | filename
   */
  public async downloadAndSaveMediaMessage<F extends string>(message: proto.IMessage, filename: F): Promise<F> {
    const buffer = await this.downloadMediaMessage(message);
    const filePath = pathJoin(__dirname, "..", "..", "temp", filename) as F;
    await fsWriteFile(filePath, buffer);
    return filePath;
  }

  /**
   * @param {string} text:string
   * @param {string=} type?:string
   * @returns {void} print logs
   */
  public log(text: string, type: "error" | "warning" | "info" | "success" = "success", date: number = 0): void {
    console.log(
      color[type === "error" ? "red" : type === "warning" ? "yellow" : type === "info" ? "blue" : "green"](
        `[ ${type === "error" ? "X" : type === "warning" ? "!" : "V"} ]`,
      ),
      color.hex("#ff7f00")(
        `${new Date(!date ? Date.now() : date).toLocaleString("en-US", { timeZone: config.timeZone })}`,
      ),
      text,
    );
  }

  public getOrderDetails!: Aruga["getOrderDetails"];
  public getCatalog!: Aruga["getCatalog"];
  public getCollections!: Aruga["getCollections"];
  public productCreate!: Aruga["productCreate"];
  public productDelete!: Aruga["productDelete"];
  public productUpdate!: Aruga["productUpdate"];
  public sendMessageAck!: Aruga["sendMessageAck"];
  public sendRetryRequest!: Aruga["sendRetryRequest"];
  public rejectCall!: Aruga["rejectCall"];
  public getPrivacyTokens!: Aruga["getPrivacyTokens"];
  public assertSessions!: Aruga["assertSessions"];
  public relayMessage!: Aruga["relayMessage"];
  public sendReceipt!: Aruga["sendReceipt"];
  public sendReceipts!: Aruga["sendReceipts"];
  public readMessages!: Aruga["readMessages"];
  public refreshMediaConn!: Aruga["refreshMediaConn"];
  public waUploadToServer!: Aruga["waUploadToServer"];
  public fetchPrivacySettings!: Aruga["fetchPrivacySettings"];
  public updateMediaMessage!: Aruga["updateMediaMessage"];
  public sendMessage!: Aruga["sendMessage"];
  public groupMetadata!: Aruga["groupMetadata"];
  public groupCreate!: Aruga["groupCreate"];
  public groupLeave!: Aruga["groupLeave"];
  public groupUpdateSubject!: Aruga["groupUpdateSubject"];
  public groupParticipantsUpdate!: Aruga["groupParticipantsUpdate"];
  public groupUpdateDescription!: Aruga["groupUpdateDescription"];
  public groupInviteCode!: Aruga["groupInviteCode"];
  public groupRevokeInvite!: Aruga["groupRevokeInvite"];
  public groupAcceptInvite!: Aruga["groupAcceptInvite"];
  public groupAcceptInviteV4!: Aruga["groupAcceptInviteV4"];
  public groupGetInviteInfo!: Aruga["groupGetInviteInfo"];
  public groupToggleEphemeral!: Aruga["groupToggleEphemeral"];
  public groupSettingUpdate!: Aruga["groupSettingUpdate"];
  public groupFetchAllParticipating!: Aruga["groupFetchAllParticipating"];
  public processingMutex!: Aruga["processingMutex"];
  public upsertMessage!: Aruga["upsertMessage"];
  public appPatch!: Aruga["appPatch"];
  public sendPresenceUpdate!: Aruga["sendPresenceUpdate"];
  public presenceSubscribe!: Aruga["presenceSubscribe"];
  public profilePictureUrl!: Aruga["profilePictureUrl"];
  public onWhatsApp!: Aruga["onWhatsApp"];
  public fetchBlocklist!: Aruga["fetchBlocklist"];
  public fetchStatus!: Aruga["fetchStatus"];
  public updateProfilePicture!: Aruga["updateProfilePicture"];
  public updateProfileStatus!: Aruga["updateProfileStatus"];
  public updateProfileName!: Aruga["updateProfileName"];
  public updateBlockStatus!: Aruga["updateBlockStatus"];
  public getBusinessProfile!: Aruga["getBusinessProfile"];
  public resyncAppState!: Aruga["resyncAppState"];
  public chatModify!: Aruga["chatModify"];
  public type!: Aruga["type"];
  public authState!: Aruga["authState"];
  public user!: Aruga["user"];
  public generateMessageTag!: Aruga["generateMessageTag"];
  public query!: Aruga["query"];
  public waitForMessage!: Aruga["waitForMessage"];
  public waitForSocketOpen!: Aruga["waitForSocketOpen"];
  public sendRawMessage!: Aruga["sendRawMessage"];
  public sendNode!: Aruga["sendNode"];
  public logout!: Aruga["logout"];
  public end!: Aruga["end"];
  public onUnexpectedError!: Aruga["onUnexpectedError"];
  public uploadPreKeys!: Aruga["uploadPreKeys"];
  public uploadPreKeysToServerIfRequired!: Aruga["uploadPreKeysToServerIfRequired"];
  public waitForConnectionUpdate!: Aruga["waitForConnectionUpdate"];
}
