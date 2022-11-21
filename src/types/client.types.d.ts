import makeWASocket, { SocketConfig } from '@adiwajshing/baileys';

type aruga = ReturnType<typeof makeWASocket>;

type arugaConfig = Partial<SocketConfig> & {
  /**
   * session name for database auth key
   */
  sessionName: string;
};
