import type { Prisma, User } from "@prisma/client"
import NodeCache from "node-cache"
import Database from "../../../libs/database"
import config from "../../../utils/config"

export const user = new NodeCache({
  stdTTL: 60 * 10, // 10 mins
  useClones: false
})

export const getUser = async (userId: string) => {
  try {
    if (user.has(userId)) return user.get(userId) as User

    const userData = await Database.user.findUnique({
      where: { userId }
    })

    if (userData) user.set(userId, userData)

    return userData
  } catch {
    return null
  }
}

export const getUsers = async (opts?: Prisma.UserFindManyArgs) => {
  try {
    const userData = await Database.user.findMany(opts)

    return userData
  } catch {
    return null
  }
}

export const createUser = async (userId: string, metadata: Partial<Omit<User, "id" | "userId">>) => {
  try {
    if (user.has(userId)) return user.get(userId) as User

    const userData = await Database.user.create({
      data: {
        userId,
        name: metadata?.name || "",
        language: config.language,
        limit: config.user.basic.limit || 30,
        ban: metadata?.ban || false
      }
    })

    if (userData) user.set(userId, userData)

    return userData
  } catch {
    return null
  }
}

export const updateUser = async (userId: string, metadata: Partial<Omit<User, "id" | "userId">>) => {
  try {
    const userData = await Database.user.update({
      where: { userId },
      data: { ...metadata }
    })

    if (userData) user.set(userId, userData)

    return userData
  } catch {
    return null
  }
}

export const deleteUser = async (userId: string) => {
  try {
    if (user.has(userId)) user.del(userId)

    return await Database.user.delete({ where: { userId } })
  } catch {
    return null
  }
}
