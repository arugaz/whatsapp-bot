import fs from "fs"
import path from "path"
import { inspect } from "util"
import type { Participants } from "@prisma/client"

import International from "../libs/international.libs"
import type WAClient from "../libs/whatsapp.libs"
import type { MessageSerialize } from "../types/serialize.types"
import utilColor from "../utils/color.utils"
import utilConfig from "../utils/config.utils"
import { timeFormat as utilTimeFormat } from "../utils/format.utils"
import { command, database } from "../utils/whatsapp.utils"

// binding import to const so tsc won't change the declaration name <3
const i18n = International
const color = utilColor
const config = utilConfig
const timeFormat = utilTimeFormat
const commands = command.commands
const cooldowns = command.cooldowns
const queues = command.queues
const getUser = database.getUser
const createUser = database.createUser
const getGroup = database.getGroup
const createGroup = database.createGroup

export const execute = async (aruga: WAClient, message: MessageSerialize): Promise<unknown> => {
  // parse
  const prefix = message.body && ([[new RegExp("^[" + (config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-").replace(/[|\\{}()[\]^$+*?.\-^]/g, "\\$&") + "]").exec(message.body), config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-"]].find(p => p[1])[0] || [""])[0]
  const cmd = message.body && !!prefix && message.body.startsWith(prefix) && message.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
  const args = message.body.trim().split(/ +/).slice(1) || []
  const arg = message.body.indexOf(" ") !== -1 ? message.body.trim().substring(message.body.indexOf(" ") + 1) : ""
  const command = commands.get(cmd) ?? commands.find(v => v.aliases && v.aliases.includes(cmd))
  const isOwner = message.sender && config.ownerNumber.includes(message.sender.replace(/\D+/g, ""))

  const group = message.isGroupMsg && ((await getGroup(message.from)) ?? (await createGroup(message.from, { name: message.groupMetadata.subject })))
  const user = message.sender && ((await getUser(message.sender)) ?? (await createUser(message.sender, { name: message.pushname })))

  // ignore user that got banned by bot owner
  if (message.sender && user.ban && !isOwner) return

  // ignore group that got banned by bot owner
  if (message.isGroupMsg && group.ban && !isOwner) return

  // parse group members
  const groupAdmins: Participants[] = message.isGroupMsg && message.groupMetadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, [])
  const isGroupOwner = message.isGroupMsg && !!groupAdmins.find(member => member.admin === "superadmin" && member.id === message.sender)
  const isGroupAdmin = message.isGroupMsg && !!groupAdmins.find(member => member.id === message.sender)
  const isBotGroupAdmin = message.isGroupMsg && !!groupAdmins.find(member => member.id === aruga.decodeJid(aruga.user.id))

  if (command) {
    // avoid spam messages
    if (cooldowns.has(message.sender + cmd)) {
      aruga.log(`${color.yellow("[SPAM]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "warning", message.timestamps)
      return await message.reply(i18n.translate("handlers.message.cooldown", { "@SKNDS": timeFormat((command.cd || 3) - (Date.now() - cooldowns.get(message.sender + cmd))) }, user.language), true)
    }

    // ignore group that got muted by group admin, and only allow group admin to use command for adminGroup
    if (message.isGroupMsg && group.mute && !isOwner && !command.adminGroup && !isGroupAdmin) return

    // maintenance and only can used by the bot owner
    if (command.maintenance && !isOwner) return await message.reply(i18n.translate("handlers.message.maintenance", {}, user.language))

    // only for bot owner
    if (command.ownerOnly && !isOwner) return await message.reply(i18n.translate("handlers.message.ownerOnly", {}, user.language))

    // only for premium users
    if (command.premiumOnly && user.role !== "vip" && user.role !== "premium" && !isOwner) return await message.reply(i18n.translate("handlers.message.premiumOnly", {}, user.language))

    // only for private chats
    if (command.privateOnly && message.isGroupMsg) return await message.reply(i18n.translate("handlers.message.privateOnly", {}, user.language))

    // only for group chats
    if (command.groupOnly && !message.isGroupMsg) return await message.reply(i18n.translate("handlers.message.groupOnly", {}, user.language))

    // only if bot is the group admin
    if (command.botGroupAdmin && message.isGroupMsg && !isBotGroupAdmin) return await message.reply(i18n.translate("handlers.message.botGroupAdmin", {}, user.language))

    // only for group owner
    if (command.ownerGroup && message.isGroupMsg && !isGroupOwner && !isOwner) return await message.reply(i18n.translate("handlers.message.ownerGroup", {}, user.language))

    // only for group admins
    if (command.adminGroup && message.isGroupMsg && !isGroupAdmin && !isOwner) return await message.reply(i18n.translate("handlers.message.adminGroup", {}, user.language))

    try {
      // add cooldown exclude general command, for every user except bot owners and premium users
      if (command.category !== "general" && user.role !== "vip" && user.role !== "premium" && !isOwner) {
        cooldowns.set(message.sender + cmd, Date.now())
        setTimeout(() => cooldowns.delete(message.sender + cmd), (command.cd || 3) * 1000)
      }

      // execute commands with queue priority
      await queues.add(
        async () =>
          await command.execute({
            aruga,
            message,
            command: cmd,
            prefix,
            args,
            arg,
            isGroupOwner,
            isGroupAdmin,
            isBotGroupAdmin,
            isOwner,
            user,
            group
          }),
        {
          priority: isOwner ? 30 : user.role === "vip" ? 20 : user.role === "premium" ? 10 : 0
        }
      )

      return aruga.log(`${color.green("[EXEC]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "success", message.timestamps)
    } catch (e: unknown) {
      await message.reply(typeof e === "string" ? e : (e as Error)?.message || "")
      return aruga.log(`${color.red("[ERRR]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "error", message.timestamps)
    }
  }
  /**
   * Eval command for development purposes, only for bot owner
   * @example
   * >> return 123 // bot will reply 123
   */
  if (message.body.startsWith(">>") && isOwner) {
    return await new Promise((resolve, reject) => {
      try {
        resolve(eval("(async() => {" + arg + "})()"))
      } catch (err: unknown) {
        reject(err)
      }
    })
      .then((res: unknown) => message.reply(inspect(res, false)).catch(err => aruga.log((err as Error).message || (typeof err === "string" && err), "error")))
      .catch((err: unknown) => message.reply(inspect(err, true)).catch(err => aruga.log((err as Error).message || (typeof err === "string" && err), "error")))
      .finally(() => aruga.log(`${color.purple("[EVAL]")} ${color.cyan(`>> [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "info", message.timestamps))
  }
}

export const registerCommand = async (pathname = "commands") => {
  const files = fs.readdirSync(path.join(__dirname, "..", pathname))
  for (const file of files) {
    const filePath = path.join(__dirname, "..", pathname, file)
    const isDirectory = fs.lstatSync(filePath).isDirectory()
    if (isDirectory) await registerCommand(pathname + path.sep + file)
    const baseFilename = path.basename(file, file.includes(".ts") ? ".ts" : ".js").toLowerCase()
    if (!isDirectory && !commands.has(baseFilename)) {
      const importFile = await import(filePath)
      commands.set(baseFilename, importFile?.default || importFile)
    }
  }
  commands.sort()
  return commands.size
}
