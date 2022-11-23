import P from "pino";
import cfonts from "cfonts";
import { Boom } from "@hapi/boom";
import { join as pathJoin } from "path";
import { writeFile as fsWriteFile } from "fs/promises";
import makeWASocket, { DisconnectReason, downloadContentFromMessage, fetchLatestBaileysVersion, FullJid, jidDecode, makeCacheableSignalKeyStore, proto, toBuffer } from "@adiwajshing/baileys";

// import AuthSingle from "../libs/auth-single.libs";
import AuthMulti from "../libs/auth-multi.libs";

import International from "../libs/international.libs";
import Database from "../libs/database.libs";
import Color from "../utils/color.utils";
import { Aruga, ArugaConfig } from "../types/client.types";

export default class Client implements Aruga {
  private aruga!: Aruga;
  constructor(private config: ArugaConfig) {}

  /**
   * Start client
   * @returns {Promise<aruga>} aruga instance
   */
  public startClient = async (): Promise<Aruga> => {
    const logger = this.config.logger || P({ level: "silent" });

    // use multiple auth instead of single auth
    // const { useDatabaseAuth } = new AuthSingle();
    const { useDatabaseAuth } = new AuthMulti();

    const { saveState, state, clearState } = await useDatabaseAuth();
    const cacheState = makeCacheableSignalKeyStore(state.keys, logger);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    this.aruga = makeWASocket({
      ...this.config,
      auth: {
        creds: state.creds,
        keys: cacheState,
      },
      logger,
      patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.listMessage || message.templateMessage);
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

    for (const method of Object.keys(this.aruga)) this[method as keyof Client] = this.aruga[method as keyof Aruga];

    this.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (reason !== (DisconnectReason.loggedOut || DisconnectReason.badSession || DisconnectReason.connectionReplaced)) {
          this.log("Reconnecting...", "warning");
        } else {
          this.log("Disconnected.", "error");
          this.log("Deleting session and restarting", "error");
          await clearState();
          this.log("Session deleted", "error");
          this.log("Starting...", "warning");
        }
        cacheState.clear && (await cacheState.clear());
        setTimeout(() => this.startClient(), 1000);
      }

      if (connection === "connecting") {
        this.log("Connecting...", "warning");
      }

      if (connection === "open") {
        cfonts.say("Whatsapp Bot", {
          align: "center",
          colors: [Color.cfonts("#8cf57b")],
          font: "block",
          space: false,
        });
        cfonts.say(`'whatsapp-bot' By @arugaz @tobyg74`, {
          align: "center",
          font: "console",
          gradient: ["red", Color.cfonts("#ee82f8")],
        });
        this.log(" Success Connected! ");
        this.log(" Name    : " + (this.user?.name ? this.user.name : "unknown"));
        this.log(" Number  : " + (this.user?.id ? this.user.id.split(":")[0] : "unknown"));
        this.log(" Version : " + version.join("."));
        this.log(" Latest  : " + `${isLatest ? "yes" : "nah"}`);
      }
    });

    this.ev.on("creds.update", async () => await saveState());
    return this.aruga;
  };

  /**
   * Decode jid to make it correctly formatted
   * @param {any} jid:string user/group jid
   */
  public decodeJid = (jid: string): string => {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) as FullJid;
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };

  /**
   * Download message and return buffer
   * @param {proto.IMessage} message:proto.IMessage
   */
  public downloadMediaMessage = async (message: proto.IMessage): Promise<Buffer> => {
    const type = Object.keys(message)[0];
    const mime = {
      imageMessage: "image",
      videoMessage: "video",
      stickerMessage: "sticker",
      documentMessage: "document",
      audioMessage: "audio",
    };
    return await toBuffer(await downloadContentFromMessage(message[type], mime[type]));
  };

  /**
   * Download message and save to local storage
   * @param {proto.IMessage} message:proto.IMessage
   * @param {string} filename='random string'
   */
  public downloadAndSaveMediaMessage = async (message: proto.IMessage, filename: string = (Date.now() + Math.floor(Math.random() * 20 + 1)).toString(36).slice(-6)): Promise<"pathName"> => {
    const buffer = await this.downloadMediaMessage(message);
    const filePath = pathJoin(__dirname, "..", "..", "temp", filename);
    await fsWriteFile(filePath, buffer);
    return filePath as "pathName";
  };

  /** Database */
  public DB = new Database();

  /** Translator helper */
  public translate = International.t;

  /**
   * @param {string} text:string
   * @param {string} type:'error'|'warning'|'success' = 'success'
   * @returns {void} print logs
   */
  public log = (text: string, type: "error" | "warning" | "success" = "success"): void => {
    console.log(Color[type === "error" ? "red" : type === "warning" ? "yellow" : "green"](`[ ${type === "error" ? "X" : type === "warning" ? "!" : "V"} ]`), text);
  };

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
  public ws!: Aruga["ws"];
  public ev!: Aruga["ev"];
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
