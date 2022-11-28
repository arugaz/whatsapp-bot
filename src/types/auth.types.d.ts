import type { AuthenticationState } from "@adiwajshing/baileys";

declare type ArugaAuth = {
  state: AuthenticationState;
  saveState: () => Promise<void>;
  clearState: () => Promise<void>;
};
