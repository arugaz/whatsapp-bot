import type { Prisma, PrismaClient } from "@prisma/client";
import { BufferJSON, initAuthCreds, proto } from "@adiwajshing/baileys";
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from "@adiwajshing/baileys";

const useMultiAuthState = async (
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
  const fixFileName = (fileName?: string): string => fileName?.replace(/\//g, "__")?.replace(/:/g, "-");

  const writeData = async (data: unknown, fileName: string): Promise<void> => {
    const sessionId = fixFileName(fileName);
    const session = JSON.stringify(data, BufferJSON.replacer);
    await Database.session.upsert({
      where: {
        sessionId,
      },
      update: {
        sessionId,
        session,
      },
      create: {
        sessionId,
        session,
      },
    });
  };

  const readData = async (fileName: string): Promise<AuthenticationCreds> => {
    try {
      const sessionId = fixFileName(fileName);
      const data = await Database.session.findFirst({
        where: {
          sessionId,
        },
      });
      return JSON.parse(data.session, BufferJSON.reviver) as AuthenticationCreds;
    } catch {
      return null;
    }
  };

  const removeData = async (fileName: string): Promise<void> => {
    const sessionId = fixFileName(fileName);
    await Database.session.delete({
      where: {
        sessionId,
      },
    });
  };

  const creds: AuthenticationCreds = (await readData("creds")) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [_: string]: SignalDataTypeMap[typeof type] } = {};
          await Promise.all(
            ids.map(async (id) => {
              const value = await readData(`${type}-${id}`);
              type === "app-state-sync-key" && !!value ? (data[id] = proto.Message.AppStateSyncKeyData.fromObject(value)) : (data[id] = value);
            }),
          );
          return data;
        },
        set: async (data) => {
          const tasks: Promise<void>[] = [];
          for (const category in data) {
            for (const id in data[category]) {
              const value: unknown = data[category][id];
              const file = `${category}-${id}`;
              tasks.push(value ? writeData(value, file) : removeData(file));
            }
          }
          await Promise.all(tasks);
        },
      },
    },
    saveState: async (): Promise<void> => {
      await writeData(creds, "creds");
    },
    clearState: async (): Promise<void> => {
      await Database.session.deleteMany();
    },
  };
};

export default useMultiAuthState;
