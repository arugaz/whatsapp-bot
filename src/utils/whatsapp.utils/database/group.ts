import type { Group } from "@prisma/client";
import Database from "../../../libs/database.libs";

const group = new Map<string, { metadata: Group; timeout: NodeJS.Timeout }>();

// Group
const getGroupFromCache = (groupId: string) => {
  const groupData = group.get(groupId);
  return groupData.metadata;
};

const addGroupToCache = (groupId: string, groupData: Group) => {
  group.set(groupId, {
    metadata: groupData,
    timeout: setTimeout(() => group.delete(groupId), 1 * 60 * 60 * 1000), // 1 hours
  });
};

const deleteGroupFromCache = (groupId: string) => {
  const groupData = group.get(groupId);
  clearTimeout(groupData.timeout);
  group.delete(groupId);
};

export const getGroup = async (groupId: string) => {
  try {
    if (group.has(groupId)) return getGroupFromCache(groupId);

    const groupData = await Database.group.findUnique({
      where: { groupId },
    });

    if (groupData) addGroupToCache(groupId, groupData);

    return groupData;
  } catch {
    return null;
  }
};

export const createGroup = async (
  groupId: string,
  metadata: Partial<Omit<Group, "id" | "groupId">>,
) => {
  try {
    if (group.has(groupId)) return getGroupFromCache(groupId);

    const groupData = await Database.group.create({
      data: { groupId, name: metadata.name ?? "", anticountry: { number: [], active: false } },
    });

    if (groupData) addGroupToCache(groupId, groupData);

    return groupData;
  } catch {
    return null;
  }
};

export const updateGroup = async (
  groupId: string,
  metadata: Partial<Omit<Group, "id" | "groupId">>,
) => {
  try {
    if (group.has(groupId)) deleteGroupFromCache(groupId);

    const groupData = await Database.group.update({
      where: { groupId },
      data: { ...metadata },
    });

    if (groupData) addGroupToCache(groupId, groupData);

    return groupData;
  } catch {
    return null;
  }
};
