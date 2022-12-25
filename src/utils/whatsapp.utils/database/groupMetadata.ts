import type { GroupMetadata } from "@prisma/client";
import Database from "../../../libs/database.libs";

const groupMetadata = new Map<string, { metadata: GroupMetadata; timeout: NodeJS.Timeout }>();

const getGroupMetadataFromCache = (groupId: string) => {
  const groupMetadataData = groupMetadata.get(groupId);
  return groupMetadataData.metadata;
};

const addGroupMetadataToCache = (groupId: string, groupData: GroupMetadata) => {
  groupMetadata.set(groupId, {
    metadata: groupData,
    timeout: setTimeout(() => groupMetadata.delete(groupId), 1 * 60 * 60 * 1000), // 1 hours
  });
};

const deleteGroupMetadataFromCache = (groupId: string) => {
  const groupMetadataData = groupMetadata.get(groupId);
  clearTimeout(groupMetadataData.timeout);
  groupMetadata.delete(groupId);
};

export const getGroupMetadata = async (groupId: string) => {
  try {
    if (groupMetadata.has(groupId)) return getGroupMetadataFromCache(groupId);

    const groupMetadataData = await Database.groupMetadata.findUnique({
      where: { groupId },
    });

    if (groupMetadataData) addGroupMetadataToCache(groupId, groupMetadataData);

    return groupMetadataData;
  } catch {
    return null;
  }
};

export const createGroupMetadata = async (
  groupId: string,
  metadata: Partial<Omit<GroupMetadata, "id" | "groupId">>,
) => {
  try {
    if (groupMetadata.has(groupId)) return getGroupMetadataFromCache(groupId);

    const groupMetadataData = await Database.groupMetadata.create({
      data: {
        groupId,
        subject: metadata?.subject || "",
        creation: metadata?.creation || Date.now(),
        owner: metadata?.owner || "",
        desc: metadata?.desc || "",
        restrict: metadata?.restrict || false,
        announce: metadata?.announce || false,
        participants: metadata?.participants || [],
      },
    });

    if (groupMetadataData) addGroupMetadataToCache(groupId, groupMetadataData);

    return groupMetadataData;
  } catch {
    return null;
  }
};

export const updateGroupMetadata = async (
  groupId: string,
  metadata: Partial<Omit<GroupMetadata, "id" | "groupId">>,
) => {
  try {
    if (groupMetadata.has(groupId)) deleteGroupMetadataFromCache(groupId);

    const groupMetadataData = await Database.groupMetadata.update({
      where: { groupId },
      data: { ...metadata },
    });

    if (groupMetadataData) addGroupMetadataToCache(groupId, groupMetadataData);

    return groupMetadataData;
  } catch {
    return null;
  }
};
