import { GroupMetadata } from "@adiwajshing/baileys";
import { Group } from "@prisma/client";
import Database from "../libs/database.libs";

const group = new Map<string, Group>();
const groupMetadata = new Map<string, GroupMetadata>();

export const createOrGetGroup = async (groupId: string, name: string) => {
  if (group.has(groupId)) return group.get(groupId);

  const groupData = await Database.group.upsert({
    where: { groupId },
    create: { groupId, name },
    update: {},
  });
  group.set(groupId, groupData);
  setTimeout(() => group.delete(groupId), 60 * 60 * 1000); // 1 hours

  return groupData;
};

export const createOrGetGroupMetadata = (groupId: string, metadata: GroupMetadata): GroupMetadata => {
  if (groupMetadata.has(groupId)) return groupMetadata.get(groupId);

  groupMetadata.set(groupId, metadata);
  setTimeout(() => groupMetadata.delete(groupId), 60 * 60 * 1000); // 1 hours

  return metadata;
};
