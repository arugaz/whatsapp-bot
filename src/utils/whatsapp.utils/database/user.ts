import type { User } from "@prisma/client";
import Database from "../../../libs/database.libs";
import config from "../../config.utils";

const user = new Map<string, { metadata: User; timeout: NodeJS.Timeout }>();

const getUserFromCache = (userId: string) => {
  const userData = user.get(userId);
  return userData.metadata;
};

const addUserToCache = (userId: string, userData: User) => {
  user.set(userId, {
    metadata: userData,
    timeout: setTimeout(() => user.delete(userId), 1 * 60 * 60 * 1000), // 1 hours
  });
};

const deleteUserFromCache = (userId: string) => {
  const userData = user.get(userId);
  clearTimeout(userData.timeout);
  user.delete(userId);
};

export const getUser = async (userId: string) => {
  try {
    if (user.has(userId)) return getUserFromCache(userId);

    const userData = await Database.user.findUnique({
      where: { userId },
    });

    if (userData) addUserToCache(userId, userData);

    return userData;
  } catch {
    return null;
  }
};

export const createUser = async (
  userId: string,
  metadata: Partial<Omit<User, "id" | "userId">>,
) => {
  try {
    if (user.has(userId)) return getUserFromCache(userId);

    const userData = await Database.user.create({
      data: {
        userId,
        name: metadata?.name || "",
        language: config.language,
        limit: config.user.limit || 30,
        ban: metadata?.ban || false,
      },
    });

    if (userData) addUserToCache(userId, userData);

    return userData;
  } catch {
    return null;
  }
};

export const updateUser = async (
  userId: string,
  userInput: Partial<Omit<User, "id" | "userId">>,
) => {
  try {
    if (user.has(userId)) deleteUserFromCache(userId);

    const userData = await Database.user.update({
      where: { userId },
      data: { ...userInput },
    });

    if (userData) addUserToCache(userId, userData);

    return userData;
  } catch {
    return null;
  }
};
