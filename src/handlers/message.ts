import { readdirSync as readDir, lstatSync as lStat } from "fs"
import { join as pathJoin, sep as pathSep, basename as pathBasename } from "path"
import { inspect as utilInspect } from "util"
import { exec as childExec } from "child_process"
import { TimeoutError } from "@arugaz/queue"
import { setImmediate as timerImmediate, setTimeout as timerTimeout } from "timers"
import type { Participants } from "@prisma/client"

import International from "../libs/international"
import type WAClient from "../libs/whatsapp"
import type { MessageSerialize } from "../types/serialize"
import utilColor from "../utils/color"
import utilConfig from "../utils/config"
import { rtfFormat as utilRTFormat } from "../utils/format"
import { command, database } from "../libs/whatsapp"
import type { Command, Event } from "../types/command"

/**
 * For eval command purpose!
 */
const readdirSync = readDir
const lstatSync = lStat
const join = pathJoin
const sep = pathSep
const basename = pathBasename
const inspect = utilInspect
const exec = childExec
const setImmediate = timerImmediate
const setTimeout = timerTimeout
const i18n = International
const color = utilColor
const config = utilConfig
const timeFormat = utilRTFormat
const commands = command.commands
const events = command.events
const cooldowns = command.cooldowns
const commandQueues = command.commandQueues
const getUser = database.getUser
const createUser = database.createUser
const getGroup = database.getGroup
const createGroup = database.createGroup

export const execute = async (aruga: WAClient, message: MessageSerialize): Promise<unknown> => {
  const group = message.isGroupMsg && ((await getGroup(message.from)) ?? (await createGroup(message.from, { name: message.groupMetadata.subject })))
  const user = message.sender && ((await getUser(message.sender)) ?? (await createUser(message.sender, { name: message.pushname })))
  const isOwner = message.sender && (config.self ? config.ownerNumber.concat([aruga.decodeJid(aruga.user.id).split("@")[0]]) : config.ownerNumber).includes(message.sender.replace(/\D+/g, ""))

  // ignore user that got banned by bot owner
  if (message.sender && user.ban && !isOwner) return

  // ignore group that got banned by bot owner
  if (message.isGroupMsg && group.ban && !isOwner) return

  // parse
  const prefix = message.body && ([[new RegExp("^[" + (config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-").replace(/[|\\{}()[\]^$+*?.\-^]/g, "\\$&") + "]").exec(message.body), config.prefix || "/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-"]].find((p) => p[1])[0] || [""])[0]
  const cmd = message.body && !!prefix && message.body.startsWith(prefix) && message.body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
  const args = message.body.trim().split(/ +/).slice(1) || []
  const arg = message.body.indexOf(" ") !== -1 ? message.body.trim().substring(message.body.indexOf(" ") + prefix.length) : ""
  const command = commands.get(cmd) ?? commands.find((v) => v.aliases && v.aliases.includes(cmd))

  // parse group members
  const groupAdmins: Participants[] = message.isGroupMsg && message.groupMetadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, [])
  const isGroupOwner = message.isGroupMsg && !!groupAdmins.find((member) => member.admin === "superadmin" && member.id === message.sender)
  const isGroupAdmin = message.isGroupMsg && !!groupAdmins.find((member) => member.id === message.sender)
  const isBotGroupAdmin = message.isGroupMsg && !!groupAdmins.find((member) => member.id === aruga.decodeJid(aruga.user.id))

  // handle events
  setImmediate(() =>
    events.forEach((event, key) => {
      try {
        typeof event.execute === "function" && event.execute({ aruga, message, command: cmd, prefix, args, arg, isGroupOwner, isGroupAdmin, isBotGroupAdmin, isOwner, user, group })
      } catch {
        aruga.log(`${color.red("[ERRS]")} ${color.cyan(`${key} [${message.body.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "error", message.timestamps)
      }
    })
  )

  // handle commands
  if (command) {
    // avoid spam messages
    if (cooldowns.has(message.sender + cmd)) {
      await message.reply(i18n.translate("handlers.message.cooldown", { "@SKNDS": timeFormat(Math.abs((command.cd || 3) - (Date.now() - cooldowns.get(message.sender + cmd)) / 1000), "seconds").replace(/-/g, "") }, user.language), true)
      return aruga.log(`${color.yellow("[SPAM]")} ${color.cyan(`${cmd} [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "warning", message.timestamps)
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
      typeof command.execute === "function" &&
        (await commandQueues.add(() => command.execute({ aruga, message, command: cmd, prefix, args, arg, isGroupOwner, isGroupAdmin, isBotGroupAdmin, isOwner, user, group }), {
          priority: isOwner ? 30 : user.role === "vip" ? 20 : user.role === "premium" ? 10 : 0
        }))

      return aruga.log(`${color.green("[CMDS]")} ${color.cyan(`${commands.findKey((v) => v === command)} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "success", message.timestamps)
    } catch (e: unknown) {
      if (typeof e === "string" && e === "noCmd") {
        await message.reply(i18n.translate("handlers.message.errorMessage.noCmd", { "@CMD": `"${prefix}menu ${cmd}"` }, user.language), true)
      } else if (e instanceof TimeoutError) {
        await message.reply(i18n.translate("handlers.message.errorMessage.timeout", {}, user.language), true)
      } else if (typeof e === "string" || e instanceof Error) {
        await message.reply(i18n.translate("handlers.message.errorMessage.error", { "@ERRMSG": typeof e === "string" ? e : e.message }, user.language), true)
      } else {
        await message.reply(i18n.translate("handlers.message.errorMessage.unknown", {}, user.language), true)
      }
      return aruga.log(`${color.red("[ERRS]")} ${color.cyan(`${commands.findKey((v) => v === command)} [${arg.length}]`)} from ${color.blue(user.name)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "error", message.timestamps)
    }
  }

  /**
   * Eval command for development purposes, only for bot owner | self bot
   * @example
   * >> return 123 // bot will reply 123
   */
  if (message.body.startsWith(">>") && isOwner) {
    new Promise((resolve, reject) => {
      try {
        resolve(eval("(async() => {" + arg + "})()"))
      } catch (err: unknown) {
        reject(err)
      }
    })
      .then((res) => message.reply(inspect(res, true)))
      .catch((err) => message.reply(inspect(err, true)))
      .finally(() => aruga.log(`${color.purple("[EVAL]")} ${color.cyan(`>> [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "info", message.timestamps))
  }

  /**
   * Exec command for development purposes, only for bot owner | self bot
   * @example
   * $ cat LICENSE
   */
  if (message.body.startsWith("$") && isOwner) {
    new Promise<string>((resolve, reject) => {
      exec(`${arg}`, { windowsHide: true }, (err, stdout, stderr) => {
        if (err) return reject(err)
        if (stderr) return reject(stderr)
        resolve(stdout)
      })
    })
      .then((res) => message.reply(inspect(res, true)))
      .catch((err) => message.reply(inspect(err, true)))
      .finally(() => aruga.log(`${color.purple("[EXEC]")} ${color.cyan(`$ [${arg.length}]`)} from ${color.blue(message.pushname)} ${message.isGroupMsg ? `in ${color.blue(message.groupMetadata.subject || "unknown")}` : ""}`.trim(), "info", message.timestamps))
  }
}

export const registerCommand = async (pathname = "commands") => {
  const files = readdirSync(join(__dirname, "..", pathname))
  for (const file of files) {
    const filePath = join(__dirname, "..", pathname, file)
    const isDirectory = lstatSync(filePath).isDirectory()
    if (isDirectory) await registerCommand(pathname + sep + file)
    const baseFilename = basename(file, file.includes(".ts") ? ".ts" : ".js").toLowerCase()
    if (!isDirectory) {
      const importFile = await import(filePath)
      const name: string = importFile?.name || baseFilename
      if (!commands.has(name) && !name.endsWith("_")) {
        const cmd: Command = importFile?.default || importFile
        commands.set(name, cmd)
      }
      if (!events.has(name) && name.endsWith("_")) {
        const evt: Event = importFile?.default || importFile
        events.set(name, evt)
      }
    }
  }
  commands.sort()
  return commands.size + events.size
}
