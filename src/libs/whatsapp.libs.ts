import P from "pino";
import cfonts from "cfonts";
import { Boom } from "@hapi/boom";
import { join as pathJoin } from "path";
import { writeFile as fsWriteFile } from "fs/promises";
import makeWASocket, { AuthenticationState, DisconnectReason, downloadContentFromMessage, fetchLatestBaileysVersion, FullJid, jidDecode, proto, toBuffer } from "@adiwajshing/baileys";

import International from "../libs/international.libs";
import Database from "../libs/database.libs";
import color from "../utils/color.utils";
import config from "../utils/config.utils";
import { Aruga, ArugaConfig } from "../types/client.types";

export default class Client implements Aruga {
  private aruga!: Aruga;
  constructor(private cfg: ArugaConfig) {}

  /**
   * Start client
   * @returns {Promise<aruga>} aruga instance
   */
  public async startClient(): Promise<Aruga> {
    const logger = this.cfg.logger || P({ level: "silent" });

    const { saveState, clearState, state } = (this.cfg.authType === "single" ? await require("../libs/auth.libs").useSingleAuthState(this.DB) : await require("../libs/auth.libs").useMultiAuthState(this.DB)) as {
      saveState: () => Promise<void>;
      clearState: () => Promise<void>;
      state: AuthenticationState;
    };
    const { version, isLatest } = await fetchLatestBaileysVersion();

    this.aruga = makeWASocket({
      ...this.cfg,
      auth: state,
      logger,
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
        setTimeout(() => this.startClient(), 1000);
      }

      if (connection === "connecting") {
        this.log("Connecting...", "warning");
      }

      if (connection === "open") {
        cfonts.say("Whatsapp Bot", {
          align: "center",
          colors: [color.cfonts("#8cf57b")],
          font: "block",
          space: false,
        });
        cfonts.say("'whatsapp-bot' By @arugaz @tobyg74", {
          align: "center",
          font: "console",
          gradient: ["red", color.cfonts("#ee82f8")],
        });
        this.log("Connected!");
        this.log(" Name    : " + (this.user?.name || "unknown"));
        this.log(" Number  : " + (this.user?.id?.split(":")[0] || "unknown"));
        this.log(" Version : " + version.join("."));
        this.log(" Latest  : " + `${isLatest ? "yes" : "nah"}`);
      }
    });

    this.ev.on("creds.update", async () => await saveState());
    return this.aruga;
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
  public async downloadAndSaveMediaMessage(message: proto.IMessage, filename: string): Promise<"pathName"> {
    const buffer = await this.downloadMediaMessage(message);
    const filePath = pathJoin(__dirname, "..", "..", "temp", filename);
    await fsWriteFile(filePath, buffer);
    return filePath as "pathName";
  }

  /** Config */
  public config = config;

  /** Database */
  public DB = Database;

  /** Translator helper */
  public translate = International;

  /**
   * @param {string} text:string
   * @param {string} type:'error'|'warning'|'success' = 'success'
   * @returns {void} print logs
   */
  public log(text: string, type: "error" | "warning" | "success" = "success"): void {
    console.log(color[type === "error" ? "red" : type === "warning" ? "yellow" : "green"](`[ ${type === "error" ? "X" : type === "warning" ? "!" : "V"} ]`), text);
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
