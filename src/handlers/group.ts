import { WAMessageStubType } from "@whiskeysockets/baileys"
import type WAClient from "../libs/whatsapp"
import { database } from "../libs/whatsapp"
import i18n from "../libs/international"
import color from "../utils/color"
import type { GroupSerialize } from "../types/serialize"

export const execute = async (aruga: WAClient, message: GroupSerialize): Promise<unknown> => {
  const group = (await database.getGroup(message.from)) ?? (await database.createGroup(message.from, { name: ((await database.getGroupMetadata(message.from)) ?? (await database.createGroupMetadata(message.from, (await aruga.groupMetadata(message.from)) as unknown))).subject }))
  const botNumber = aruga.decodeJid(aruga.user.id)
  const isBot = message.body === botNumber || message.sender === botNumber
  const senderNumber = message.sender.replace(/\D+/g, "")

  try {
    if (message.type === WAMessageStubType.GROUP_CHANGE_SUBJECT) {
      if (!isBot && group.notify) await message.reply(i18n.translate("handlers.group.subject", { "@PPL": `@${senderNumber}`, "@TTL": `\n\n${message.body}` }, group.language))
      await Promise.all([database.updateGroup(message.from, { name: message.body }), database.updateGroupMetadata(message.from, { subject: message.body })])
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_ICON) {
      if (!isBot && group.notify) await message.reply(i18n.translate(`handlers.group.icon.${message.body ? "change" : "remove"}`, { "@PPL": `@${senderNumber}` }, group.language))
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_INVITE_LINK) {
      if (!isBot && group.notify) await message.reply(i18n.translate("handlers.group.invite_link", { "@PPL": `@${senderNumber}` }, group.language))
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_DESCRIPTION) {
      if (!isBot && group.notify) await message.reply(i18n.translate("handlers.group.description", { "@PPL": `@${senderNumber}`, "@TTL": `\n\n${message.body}` }, group.language))
      await database.updateGroupMetadata(message.from, { desc: message.body })
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_RESTRICT) {
      if (!isBot && group.notify) await message.reply(i18n.translate(`handlers.group.restrict.${message.body}`, { "@PPL": `@${senderNumber}` }, group.language))
      await database.updateGroupMetadata(message.from, { restrict: message.body === "on" })
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_ANNOUNCE) {
      if (!isBot && group.notify) await message.reply(i18n.translate(`handlers.group.announce.${message.body}`, { "@PPL": `@${senderNumber}` }, group.language))
      await database.updateGroupMetadata(message.from, { announce: message.body === "on" })
    }

    return aruga.log(
      `${color.hex("#E0B589" as HexColor)("[EVNT]")} ${color.cyan(
        `${
          message.type === WAMessageStubType.GROUP_CHANGE_ANNOUNCE
            ? "groupAnnounce"
            : message.type === WAMessageStubType.GROUP_CHANGE_RESTRICT
            ? "groupRestrict"
            : message.type === WAMessageStubType.GROUP_CHANGE_DESCRIPTION
            ? "groupDescription"
            : message.type === WAMessageStubType.GROUP_CHANGE_INVITE_LINK
            ? "groupInviteLink"
            : message.type === WAMessageStubType.GROUP_CHANGE_ICON
            ? "groupProfile"
            : message.type === WAMessageStubType.GROUP_CHANGE_SUBJECT
            ? "groupName"
            : ""
        } [${message.type}]`
      )} from ${color.blue(message.sender.replace(/\D+/g, "") ?? "unknown")} in ${color.blue(group.name || "unknown")}`.trim(),
      "info",
      message.timestamps
    )
  } catch {
    return aruga.log(
      `${color.red("[EVNT]")} ${color.cyan(
        `${
          message.type === WAMessageStubType.GROUP_CHANGE_ANNOUNCE
            ? "groupAnnounce"
            : message.type === WAMessageStubType.GROUP_CHANGE_RESTRICT
            ? "groupRestrict"
            : message.type === WAMessageStubType.GROUP_CHANGE_DESCRIPTION
            ? "groupDescription"
            : message.type === WAMessageStubType.GROUP_CHANGE_INVITE_LINK
            ? "groupInviteLink"
            : message.type === WAMessageStubType.GROUP_CHANGE_ICON
            ? "groupProfile"
            : message.type === WAMessageStubType.GROUP_CHANGE_SUBJECT
            ? "groupName"
            : ""
        } [${message.type}]`
      )} from ${color.blue(message.sender.replace(/\D+/g, "") ?? "unknown")} in ${color.blue(group.name || "unknown")}`.trim(),
      "error",
      message.timestamps
    )
  }
}
