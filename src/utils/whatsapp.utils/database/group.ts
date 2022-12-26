import type { Group } from "@prisma/client";
import NodeCache from "@arugaz/node-cache";
import Database from "../../../libs/database.libs";

const group = new NodeCache({
  stdTTL: 60 * 10, // 10 mins
  useClones: false,
});

export const getGroup = async (groupId: string) => {
  try {
    if (group.has(groupId)) return group.get(groupId) as Group;

    const groupData = await Database.group.findUnique({
      where: { groupId },
    });

    if (groupData) group.set(groupId, groupData);

    return groupData;
  } catch {
    return null;
  }
};

export const createGroup = async (groupId: string, metadata: Partial<Omit<Group, "id" | "groupId">>) => {
  try {
    if (group.has(groupId)) return group.get(groupId) as Group;

    const groupData = await Database.group.create({
      data: {
        groupId,
        ...metadata,
        name: metadata.name ?? "",
        anticountry: { number: [], active: false },
      },
    });

    if (groupData) group.set(groupId, groupData);

    return groupData;
  } catch {
    return null;
  }
};

export const updateGroup = async (groupId: string, metadata: Partial<Omit<Group, "id" | "groupId">>) => {
  try {
    const groupData = await Database.group.update({
      where: { groupId },
      data: { ...metadata },
    });

    if (groupData) group.set(groupId, groupData);

    return groupData;
  } catch {
    return null;
  }
};
