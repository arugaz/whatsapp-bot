import makeWASocket, { SocketConfig } from '@adiwajshing/baileys';

type aruga = ReturnType<typeof makeWASocket>;

type arugaConfig = Partial<SocketConfig> & {
  sessionName: string;
};
