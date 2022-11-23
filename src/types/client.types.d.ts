import type makeWASocket, { SocketConfig } from "@adiwajshing/baileys";

declare type Aruga = ReturnType<typeof makeWASocket>;

declare type ArugaConfig = {
  authType: "single" | "multi";
} & Partial<SocketConfig>;
