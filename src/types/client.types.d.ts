import makeWASocket, { SocketConfig } from "@adiwajshing/baileys";

declare type Aruga = ReturnType<typeof makeWASocket>;

declare type ArugaConfig = Partial<SocketConfig>;
