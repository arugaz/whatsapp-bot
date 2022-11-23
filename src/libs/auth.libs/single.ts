import type { Prisma, PrismaClient } from "@prisma/client";
import { BufferJSON, initAuthCreds, proto } from "@adiwajshing/baileys";
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from "@adiwajshing/baileys";

const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
  "pre-key": "preKeys",
  session: "sessions",
  "sender-key": "senderKeys",
  "app-state-sync-key": "appStateSyncKeys",
  "app-state-sync-version": "appStateVersions",
  "sender-key-memory": "senderKeyMemory",
};

const useSingleAuthState = async (
  Database: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>,
): Promise<{
  state: AuthenticationState;
  /**
   * Save the session state
   * @returns {Promise<void>}
   */
  saveState: () => Promise<void>;
  /**
   * Remove the session from the database
   * @returns {Promise<void>}
   */
  clearState: () => Promise<void>;
}> => {
  let creds: AuthenticationCreds;
  let keys: unknown = {};

  const storedCreds = await Database.session.findFirst({
    where: {
      sessionId: "creds",
    },
  });
  if (storedCreds && storedCreds.session) {
    const parsedCreds = JSON.parse(storedCreds.session, BufferJSON.reviver);
    creds = parsedCreds.creds as AuthenticationCreds;
    keys = parsedCreds.keys;
  } else {
    if (!storedCreds)
      await Database.session.create({
        data: {
          sessionId: "creds",
        },
      });
    creds = initAuthCreds();
  }

  const saveState = async (): Promise<void> => {
    const session = JSON.stringify({ creds, keys }, BufferJSON.replacer, 2);
    await Database.session.update({ where: { sessionId: "creds" }, data: { session } });
  };

  const clearState = async (): Promise<void> => {
    await Database.session.delete({
      where: { sessionId: "creds" },
    });
  };

  return {
    state: {
      creds,
      keys: {
        get: (type, ids) => {
          const key = KEY_MAP[type];
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
            const key = KEY_MAP[_key as keyof SignalDataTypeMap];
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

export default useSingleAuthState;
