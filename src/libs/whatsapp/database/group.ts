import type { Prisma, Group } from "@prisma/client"
import NodeCache from "node-cache"
import Database from "../../../libs/database"
import config from "../../../utils/config"

export const group = new NodeCache({
  stdTTL: 60 * 10, // 10 mins
  useClones: false
})

export const getGroup = async (groupId: string) => {
  try {
    if (group.has(groupId)) return group.get(groupId) as Group

    const groupData = await Database.group.findUnique({
      where: { groupId }
    })

    if (groupData) group.set(groupId, groupData)

    return groupData
  } catch {
    return null
  }
}

export const getGroups = async (opts?: Prisma.GroupFindManyArgs) => {
  try {
    const groups = await Database.group.findMany(opts)

    return groups
  } catch {
    return null
  }
}

export const createGroup = async (groupId: string, metadata: Partial<Omit<Group, "id" | "groupId">>) => {
  try {
    if (group.has(groupId)) return group.get(groupId) as Group

    const groupData = await Database.group.create({
      data: {
        groupId,
        ...metadata,
        name: metadata.name ?? "",
        language: config.language,
        anticountry: { number: [], active: false }
      }
    })

    if (groupData) group.set(groupId, groupData)

    return groupData
  } catch {
    return null
  }
}

export const updateGroup = async (groupId: string, metadata: Partial<Omit<Group, "id" | "groupId">>) => {
  try {
    const groupData = await Database.group.update({
      where: { groupId },
      data: { ...metadata }
    })

    if (groupData) group.set(groupId, groupData)

    return groupData
  } catch {
    return null
  }
}

export const deleteGroup = async (groupId: string) => {
  try {
    if (group.has(groupId)) group.del(groupId)

    return await Database.group.delete({ where: { groupId } })
  } catch {
    return null
  }
}
