import type { GroupMetadata } from "@prisma/client"
import NodeCache from "node-cache"
import Database from "../../database"

export const groupMetadata = new NodeCache({
  stdTTL: 60 * 10, // 10 mins
  useClones: false
})

export const getGroupMetadata = async (groupId: string) => {
  try {
    if (groupMetadata.has(groupId)) return groupMetadata.get(groupId) as GroupMetadata

    const groupMetadataData = await Database.groupMetadata.findUnique({
      where: { groupId }
    })

    if (groupMetadataData) groupMetadata.set(groupId, groupMetadataData)

    return groupMetadataData
  } catch {
    return null
  }
}

export const createGroupMetadata = async (groupId: string, metadata: Partial<Omit<GroupMetadata, "id" | "groupId">>) => {
  try {
    if (groupMetadata.has(groupId)) return groupMetadata.get(groupId) as GroupMetadata

    const groupMetadataData = await Database.groupMetadata.create({
      data: {
        groupId,
        subject: metadata?.subject || "",
        creation: metadata?.creation || Date.now(),
        owner: metadata?.owner || "",
        desc: metadata?.desc || "",
        restrict: metadata?.restrict || false,
        announce: metadata?.announce || false,
        participants: metadata?.participants || []
      }
    })

    if (groupMetadataData) groupMetadata.set(groupId, groupMetadataData)

    return groupMetadataData
  } catch {
    return null
  }
}

export const updateGroupMetadata = async (groupId: string, metadata: Partial<Omit<GroupMetadata, "id" | "groupId">>) => {
  try {
    const groupMetadataData = await Database.groupMetadata.update({
      where: { groupId },
      data: { ...metadata }
    })

    if (groupMetadataData) groupMetadata.set(groupId, groupMetadataData)

    return groupMetadataData
  } catch {
    return null
  }
}

export const deleteGroupMetadata = async (groupId: string) => {
  try {
    if (groupMetadata.has(groupId)) groupMetadata.del(groupId)

    return await Database.groupMetadata.delete({ where: { groupId } })
  } catch {
    return null
  }
}
