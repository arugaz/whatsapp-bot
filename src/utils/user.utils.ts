import { User } from "@prisma/client";
import Database from "../libs/database.libs";
import config from "../utils/config.utils";

const user = new Map<string, User>();

export const createOrGetUser = async (userId: string, name: string) => {
  if (user.has(userId)) return user.get(userId);

  const userData = await Database.user.upsert({
    where: { userId },
    create: { userId, name, language: config.language, limit: config.user.limit || 30 },
    update: {},
  });
  user.set(userId, userData);
  setTimeout(() => user.delete(userId), 60 * 60 * 1000); // 1 hours

  return userData;
};
