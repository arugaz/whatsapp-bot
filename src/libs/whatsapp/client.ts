import P from "pino"
import { Boom } from "@hapi/boom"
import EventEmitter from "@arugaz/eventemitter"
import makeWASocket, {
  BaileysEventMap,
  BinaryNode,
  DisconnectReason,
  downloadMediaMessage,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  getBinaryNodeChild,
  jidDecode,
  makeCacheableSignalKeyStore,
  MessageGenerationOptionsFromContent,
  proto,
  toBuffer,
  WAMediaUpload,
  WAMessageStubType
} from "baileys"

import { auth, database } from "../../libs/whatsapp"
import Database from "../../libs/database"
import { WAProfile } from "../../libs/convert"
import color from "../../utils/color"
import config from "../../utils/config"
import type { Aruga, ArugaConfig, ArugaEventEmitter } from "../../types/client"
import type { MessageSerialize } from "../../types/serialize"

let first = !0
class WAClient extends (EventEmitter as new () => ArugaEventEmitter) implements Aruga {
  #cfg: ArugaConfig
  #status: "close" | "idle" | "open"

  constructor(cfg: ArugaConfig) {
    super()
    this.#cfg = cfg
    this.#status = "close"
  }

  public decodeJid(jid: string): string {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid)
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid
    } else return jid
  }

  public async downloadMediaMessage(message: proto.IWebMessageInfo): Promise<Buffer> {
    return (await downloadMediaMessage(message, "buffer", {}, { logger: this.#cfg.logger, reuploadRequest: this.updateMediaMessage })) as Buffer
  }

  public async resendMessage(jid: string, message: Partial<MessageSerialize>, opts?: Omit<MessageGenerationOptionsFromContent, "userJid">) {
    message.message = message.message?.viewOnceMessage ? message.message.viewOnceMessage?.message : message.message?.viewOnceMessageV2 ? message.message.viewOnceMessage?.message : message.message?.viewOnceMessageV2Extension ? message.message.viewOnceMessageV2Extension?.message : message.message
    if (message.message[message.type]?.viewOnce) delete message.message[message.type].viewOnce
    const content = generateForwardMessageContent(proto.WebMessageInfo.fromObject(message), false)

    if (content.listMessage) content.listMessage.listType = 1
    const contentType = Object.keys(content).find((x) => x !== "senderKeyDistributionMessage" && x !== "messageContextInfo" && x !== "inviteLinkGroupTypeV2")
    if (content[contentType]?.contextInfo) {
      delete content[contentType]?.contextInfo.forwardingScore
      delete content[contentType]?.contextInfo.isForwarded
    }
    content[contentType].contextInfo = {
      ...(message.message[message.type]?.contextInfo ? message.message[message.type].contextInfo : {}),
      ...content[contentType].contextInfo
    }

    const waMessage = generateWAMessageFromContent(jid, content, {
      userJid: this.decodeJid(this.user.id),
      ...opts
    })

    if (waMessage?.message?.buttonsMessage?.contentText) waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.EMPTY
    if (waMessage?.message?.buttonsMessage?.imageMessage) waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.IMAGE
    if (waMessage?.message?.buttonsMessage?.videoMessage) waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.VIDEO
    if (waMessage?.message?.buttonsMessage?.documentMessage) waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.DOCUMENT
    if (waMessage?.message?.buttonsMessage?.locationMessage) waMessage.message.buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.LOCATION

    process.nextTick(() => this.upsertMessage(waMessage, "append"))
    await this.relayMessage(jid, waMessage.message, {
      ...opts,
      messageId: waMessage.key.id,
      cachedGroupMetadata: (jid) => database.getGroupMetadata(jid)
    })
    return waMessage
  }

  public async updateProfilePicture(jid: string, content: WAMediaUpload, crop = false) {
    let bufferOrFilePath: Buffer | string
    if (Buffer.isBuffer(content)) {
      bufferOrFilePath = content
    } else if ("url" in content) {
      bufferOrFilePath = content.url.toString()
    } else {
      bufferOrFilePath = await toBuffer(content.stream)
    }

    const img = WAProfile(bufferOrFilePath as Buffer, crop)

    await this.query({
      tag: "iq",
      attrs: {
        to: this.decodeJid(jid),
        type: "set",
        xmlns: "w:profile:picture"
      },
      content: [
        {
          tag: "picture",
          attrs: { type: "image" },
          content: await img
        }
      ]
    })
  }

  public async sendAcceptInviteV4(jid: string, node: BinaryNode, participants: string, caption = "Invitation to join my WhatsApp group") {
    if (!jid.endsWith("g.us")) throw new TypeError("Invalid jid")
    const result = getBinaryNodeChild(node, "add_request")
    const inviteCode = result.attrs.code
    const inviteExpiration = result.attrs.expration
    const groupName = (await database.getGroup(jid)).name

    const content = proto.Message.fromObject({
      groupInviteMessage: proto.Message.GroupInviteMessage.fromObject({
        inviteCode,
        inviteExpiration,
        groupJid: jid,
        groupName: groupName,
        caption
      })
    })

    const waMessage = generateWAMessageFromContent(participants, content, {
      userJid: this.decodeJid(this.user.id),
      ephemeralExpiration: 3 * 24 * 60 * 60
    })

    process.nextTick(() => this.upsertMessage(waMessage, "append"))
    await this.relayMessage(participants, waMessage.message, {
      messageId: waMessage.key.id,
      cachedGroupMetadata: (jid) => database.getGroupMetadata(jid)
    })
    return waMessage
  }

  /** Start Whatsapp Client */
  public async startClient(): Promise<void> {
    const logger = this.#cfg.logger || P({ level: "silent" }).child({ level: "silent" })
    this.#cfg.logger = logger

    const { saveState, clearState, state } = (this.#cfg.authType === "single" && (await auth.useSingleAuthState(Database))) || (this.#cfg.authType === "multi" && (await auth.useMultiAuthState(Database)))
    const { version, isLatest } = await fetchLatestBaileysVersion()

    const aruga: Aruga = makeWASocket({
      ...this.#cfg,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      browser: ["whatsapp-bot", "Safari", "3.0.0"],
      logger,
      patchMessageBeforeSending: (message) => {
        if (message.buttonsMessage || message.templateMessage || message.listMessage) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {}
                },
                ...message
              }
            }
          }
        }
        return message
      },
      printQRInTerminal: false,
      version: version
    })

    // connection
    aruga.ev.on("connection.update", async ({ qr, connection, lastDisconnect }) => {
      if (qr) {
        this.emit("qr", qr)
      }

      if (connection === "close") {
        this.#status = "close"
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
        this.log("Disconnected!", "error")
        if (reason === DisconnectReason.loggedOut || reason === DisconnectReason.multideviceMismatch || reason === DisconnectReason.badSession) {
          this.log("Deleting session...", "error")
          await clearState()
          this.log("Session deleted!", "error")

          throw new Error("You have to re-scan QR Code! code: " + reason)
        } else {
          this.log("Reconnecting...", "warning")
          setTimeout(() => this.startClient().catch(() => this.startClient()), 1500)
        }
      }

      if (connection === "connecting") {
        this.#status = "idle"
        this.log("Connecting...", "warning")
      }

      if (connection === "open") {
        this.#status = "open"
        this.log("Connected!")
        if (first) {
          console.log(" ")
          this.log("Name    : " + (this.user?.name || "unknown"), "info")
          this.log("Number  : " + (this.user?.id?.split(":")[0] || "unknown"), "info")
          this.log("Version : " + version.join("."), "info")
          this.log("Latest  : " + `${isLatest ? "yes" : "nah"}`, "info")
          first = !first
          console.log(" ")
        }
      }
    })

    aruga.ev.on("creds.update", saveState)

    aruga.ev.on("call", (calls) => {
      for (const call of calls) {
        this.emit("call", call)
      }
    })

    aruga.ev.on("messages.upsert", (msg) => {
      for (const message of msg.messages) {
        if (message.message) this.emit("message", message)
      }
    })

    aruga.ev.on("messages.upsert", (msg) => {
      for (const message of msg.messages) {
        if (
          message.messageStubType === WAMessageStubType.GROUP_CHANGE_SUBJECT ||
          message.messageStubType === WAMessageStubType.GROUP_CHANGE_ICON ||
          message.messageStubType === WAMessageStubType.GROUP_CHANGE_INVITE_LINK ||
          message.messageStubType === WAMessageStubType.GROUP_CHANGE_DESCRIPTION ||
          message.messageStubType === WAMessageStubType.GROUP_CHANGE_RESTRICT ||
          message.messageStubType === WAMessageStubType.GROUP_CHANGE_ANNOUNCE
        )
          this.emit("group", message)
      }
    })

    // group participant event
    aruga.ev.on("messages.upsert", (msg) => {
      for (const message of msg.messages) {
        if (
          message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD ||
          message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
          message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE ||
          message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE ||
          message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_INVITE ||
          message.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
        )
          this.emit("group.participant", message)
      }
    })

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
      "presence.update"
    ]) {
      if (events !== "call" && events !== "connection.update" && events !== "creds.update" && events !== "messages.upsert") aruga.ev.removeAllListeners(events as keyof BaileysEventMap)
    }

    // Set client functionality
    for (const method of Object.keys(aruga)) {
      if (method !== "ev") {
        if (method !== "ws" && method !== "updateProfilePicture") this[method] = aruga[method]
        delete aruga[method]
      }
    }
  }

  /**
   * @param {String} text:message
   * @param {String} type?:"error" | "warning" | "info" | "success"
   * @param {Number} date?:Date.now()
   * @returns {void} print logs
   */
  public log(text: string, type: "error" | "warning" | "info" | "success" = "success", date?: number): void {
    console.log(
      color[type === "error" ? "red" : type === "warning" ? "yellow" : type === "info" ? "blue" : "green"](`[ ${type === "error" ? "X" : type === "warning" ? "!" : "V"} ]`),
      color.hex("#ff7f00" as HexColor)(
        `${new Date(!date ? Date.now() : date).toLocaleString("en-US", {
          timeZone: config.timeZone
        })}`
      ),
      text
    )
  }

  /**
   * Connection status
   */
  public get status() {
    return this.#status
  }

  // I will comment out the functions I dont use
  public getOrderDetails: Aruga["getOrderDetails"]
  public getCatalog: Aruga["getCatalog"]
  public getCollections: Aruga["getCollections"]
  public productCreate: Aruga["productCreate"]
  public productDelete: Aruga["productDelete"]
  public productUpdate: Aruga["productUpdate"]
  public sendMessageAck: Aruga["sendMessageAck"]
  public sendRetryRequest: Aruga["sendRetryRequest"]
  public rejectCall: Aruga["rejectCall"]
  public getPrivacyTokens: Aruga["getPrivacyTokens"]
  public assertSessions: Aruga["assertSessions"]
  public relayMessage: Aruga["relayMessage"]
  public sendReceipt: Aruga["sendReceipt"]
  public sendReceipts: Aruga["sendReceipts"]
  public readMessages: Aruga["readMessages"]
  public refreshMediaConn: Aruga["refreshMediaConn"]
  public waUploadToServer: Aruga["waUploadToServer"]
  public fetchPrivacySettings: Aruga["fetchPrivacySettings"]
  public updateMediaMessage: Aruga["updateMediaMessage"]
  public sendMessage: Aruga["sendMessage"]
  public groupMetadata: Aruga["groupMetadata"]
  public groupCreate: Aruga["groupCreate"]
  public groupLeave: Aruga["groupLeave"]
  public groupUpdateSubject: Aruga["groupUpdateSubject"]
  public groupParticipantsUpdate: Aruga["groupParticipantsUpdate"]
  public groupUpdateDescription: Aruga["groupUpdateDescription"]
  public groupInviteCode: Aruga["groupInviteCode"]
  public groupRevokeInvite: Aruga["groupRevokeInvite"]
  public groupAcceptInvite: Aruga["groupAcceptInvite"]
  public groupAcceptInviteV4: Aruga["groupAcceptInviteV4"]
  public groupGetInviteInfo: Aruga["groupGetInviteInfo"]
  public groupToggleEphemeral: Aruga["groupToggleEphemeral"]
  public groupSettingUpdate: Aruga["groupSettingUpdate"]
  public groupFetchAllParticipating: Aruga["groupFetchAllParticipating"]
  public processingMutex: Aruga["processingMutex"]
  public upsertMessage: Aruga["upsertMessage"]
  public appPatch: Aruga["appPatch"]
  public sendPresenceUpdate: Aruga["sendPresenceUpdate"]
  public presenceSubscribe: Aruga["presenceSubscribe"]
  public profilePictureUrl: Aruga["profilePictureUrl"]
  public onWhatsApp: Aruga["onWhatsApp"]
  public fetchBlocklist: Aruga["fetchBlocklist"]
  public fetchStatus: Aruga["fetchStatus"]
  // public updateProfilePicture: Aruga["updateProfilePicture"]
  public updateProfileStatus: Aruga["updateProfileStatus"]
  public updateProfileName: Aruga["updateProfileName"]
  public updateBlockStatus: Aruga["updateBlockStatus"]
  public getBusinessProfile: Aruga["getBusinessProfile"]
  public resyncAppState: Aruga["resyncAppState"]
  public chatModify: Aruga["chatModify"]
  public type: Aruga["type"]
  // public ws: Aruga["ws"];
  // public ev: Aruga["ev"];
  public authState: Aruga["authState"]
  public user: Aruga["user"]
  public generateMessageTag: Aruga["generateMessageTag"]
  public query: Aruga["query"]
  public waitForMessage: Aruga["waitForMessage"]
  public waitForSocketOpen: Aruga["waitForSocketOpen"]
  public sendRawMessage: Aruga["sendRawMessage"]
  public sendNode: Aruga["sendNode"]
  public logout: Aruga["logout"]
  public end: Aruga["end"]
  public onUnexpectedError: Aruga["onUnexpectedError"]
  public uploadPreKeys: Aruga["uploadPreKeys"]
  public uploadPreKeysToServerIfRequired: Aruga["uploadPreKeysToServerIfRequired"]
  public waitForConnectionUpdate: Aruga["waitForConnectionUpdate"]
}

export default WAClient
