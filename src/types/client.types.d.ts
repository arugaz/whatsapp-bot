import type { SocketConfig, WASocket } from "@adiwajshing/baileys";

declare type Aruga = Partial<WASocket>;

declare type ArugaConfig = {
  /** baileys no longer supports single auth, but choose what you like */
  authType: "single" | "multi";
} & Partial<SocketConfig>;
