import type { SocketConfig, WACallEvent, WAMessage, WASocket } from "@adiwajshing/baileys";

declare type Aruga = Partial<WASocket>;

declare type ArugaEvents = {
  call: (call: WACallEvent) => void;
  message: (message: WAMessage) => void;
};

declare type ArugaEventEmitter<Events extends ArugaEvents> = {
  on<E extends keyof Events>(event: E, listener: Events[E]): this;
  off<E extends keyof Events>(event: E, listener: Events[E]): this;
  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>): boolean;
  removeAllListeners<E extends keyof Events>(event?: E): this;
};

declare type ArugaConfig = {
  /** baileys no longer supports single auth, but choose one that you like */
  authType: "single" | "multi";
} & Partial<SocketConfig>;
