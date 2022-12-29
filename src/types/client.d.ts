import type { SocketConfig, WACallEvent, WAMessage, WASocket } from "@adiwajshing/baileys"

declare type Aruga = Partial<WASocket>

declare type ArugaConfig = {
  authType: "single" | "multi"
} & Partial<Omit<SocketConfig, "auth" | "browser" | "patchMessageBeforeSending" | "printQRInTerminal" | "version">>

declare type ArugaEvents = {
  call: (call: WACallEvent) => void
  group: (message: WAMessage) => void
  "group.participant": (message: WAMessage) => void
  message: (message: WAMessage) => void
}

declare type ArugaEventEmitter = {
  on<E extends keyof ArugaEvents>(event: E, listener: ArugaEvents[E]): this
  off<E extends keyof ArugaEvents>(event: E, listener: ArugaEvents[E]): this
  emit<E extends keyof ArugaEvents>(event: E, ...args: Parameters<ArugaEvents[E]>): boolean
  removeAllListeners<E extends keyof ArugaEvents>(event?: E): this
}
