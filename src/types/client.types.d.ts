import type { SocketConfig, WACallEvent, WAMessage, WASocket } from "@adiwajshing/baileys";

declare type Aruga = Partial<WASocket>;

declare type ArugaEvents = {
  call: (call: WACallEvent) => void;
  message: (message: WAMessage) => void;
};

declare type ArugaEventEmitter = {
  on<E extends keyof ArugaEvents>(event: E, listener: ArugaEvents[E]): this;
  off<E extends keyof ArugaEvents>(event: E, listener: ArugaEvents[E]): this;
  emit<E extends keyof ArugaEvents>(event: E, ...args: Parameters<ArugaEvents[E]>): boolean;
  removeAllListeners<E extends keyof ArugaEvents>(event?: E): this;
};

declare type ArugaConfig = {
  /** baileys no longer supports single auth, but choose one that you like */
  authType: "single" | "multi";
} & Partial<SocketConfig>;
