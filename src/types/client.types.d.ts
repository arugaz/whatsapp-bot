import makeWASocket, { SocketConfig } from "@adiwajshing/baileys";

declare type aruga = ReturnType<typeof makeWASocket>;

declare type arugaConfig = Partial<SocketConfig>;
