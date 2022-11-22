import { AuthenticationCreds, AuthenticationState, BufferJSON, initAuthCreds, proto, SignalDataTypeMap } from "@adiwajshing/baileys";
import Database from "../libs/database.libs";

export default class Auth {
  constructor(private sessionId: string) {}
  public useDatabaseAuth = async (): Promise<{
    state: AuthenticationState;
    saveState: () => Promise<void>;
    clearState: () => Promise<void>;
  }> => {
    let creds: AuthenticationCreds;
    let keys: unknown = {};

    const storedCreds = await this.DB.getSession(this.sessionId);
    if (storedCreds && storedCreds.session) {
      const parsedCreds = JSON.parse(storedCreds.session, BufferJSON.reviver);
      creds = parsedCreds.creds as AuthenticationCreds;
      keys = parsedCreds.keys;
    } else {
      if (!storedCreds) await this.DB.createSession(this.sessionId);
      creds = initAuthCreds();
    }

    /**
     * Save the session state
     * @returns {Promise<void>}
     */
    const saveState = async (): Promise<void> => {
      const session = JSON.stringify({ creds, keys }, BufferJSON.replacer, 2);
      await this.DB.updateSession(this.sessionId, session);
    };

    /**
     * Remove the session from the database
     * @returns {Promise<void>}
     */
    const clearState = async (): Promise<void> => {
      await this.DB.deleteSession(this.sessionId);
    };

    return {
      state: {
        creds,
        keys: {
          get: (type, ids) => {
            const key = this.KEY_MAP[type];
            return ids.reduce((dict: unknown, id) => {
              let value = keys[key]?.[id];
              if (value) {
                if (type === "app-state-sync-key") value = proto.Message.AppStateSyncKeyData.fromObject(value);
                dict[id] = value;
              }
              return dict;
            }, {});
          },
          set: (data) => {
            for (const _key in data) {
              const key = this.KEY_MAP[_key as keyof SignalDataTypeMap];
              keys[key] = keys[key] || {};
              Object.assign(keys[key], data[_key]);
            }
            saveState();
          },
        },
      },
      saveState,
      clearState,
    };
  };

  private KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
    "pre-key": "preKeys",
    session: "sessions",
    "sender-key": "senderKeys",
    "app-state-sync-key": "appStateSyncKeys",
    "app-state-sync-version": "appStateVersions",
    "sender-key-memory": "senderKeyMemory",
  };

  private DB = new Database();
}
