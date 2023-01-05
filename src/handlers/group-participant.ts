import { WAMessageStubType } from "@adiwajshing/baileys"
import type WAClient from "../libs/whatsapp"
import { database } from "../libs/whatsapp"
import i18n from "../libs/international"
import color from "../utils/color"
import type { GroupParticipantSerialize } from "../types/serialize"
import { phoneFormat } from "../utils/format"

export const execute = async (aruga: WAClient, message: GroupParticipantSerialize): Promise<unknown> => {
  const groupMetadata = (await database.getGroupMetadata(message.from)) ?? (await database.createGroupMetadata(message.from, (await aruga.groupMetadata(message.from)) as unknown))
  const group = (await database.getGroup(message.from)) ?? (await database.createGroup(message.from, { name: groupMetadata.subject }))
  const botNumber = aruga.decodeJid(aruga.user.id)
  const isBot = message.body === botNumber || message.sender === botNumber

  try {
    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_ADD || message.type === WAMessageStubType.GROUP_PARTICIPANT_INVITE) {
      if (group.anticountry.active && group.anticountry.number.includes(phoneFormat(message.body).countryCode) && !!groupMetadata.participants.find((member) => member.id === botNumber && !!member.admin)) {
        process.nextTick(async () => await aruga.groupParticipantsUpdate(message.from, [aruga.decodeJid(message.body)], "remove"))
        await message.reply(i18n.translate("handlers.group-participant.anticountry", { "@PPL": `@${message.body.replace(/\D+/g, "")}`, "@NUM": group.anticountry.number.join(", ").trim() }, group.language))
      } else {
        groupMetadata.participants.push({ id: message.body, admin: null })
        await database.updateGroupMetadata(message.from, { participants: groupMetadata.participants })
      }
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || message.type === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      if (message.body === botNumber) {
        await Promise.all([database.deleteGroup(message.body), database.deleteGroupMetadata(message.body)])
      } else {
        groupMetadata.participants.splice(
          groupMetadata.participants.findIndex((x) => x.id === message.body),
          1
        )
        await database.updateGroupMetadata(message.from, { participants: groupMetadata.participants })
      }
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE) {
      if (!isBot && group.notify) await message.reply(i18n.translate("handlers.group-participant.promote", { "@ADM": `@${message.sender.replace(/\D+/g, "")}`, "@PPL": `@${message.body.replace(/\D+/g, "")}` }, group.language))
      groupMetadata.participants[groupMetadata.participants.findIndex((x) => x.id === message.body)].admin = "admin"
      await database.updateGroupMetadata(message.from, { participants: groupMetadata.participants })
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE) {
      if (!isBot && group.notify) await message.reply(i18n.translate("handlers.group-participant.demote", { "@ADM": `@${message.sender.replace(/\D+/g, "")}`, "@PPL": `@${message.body.replace(/\D+/g, "")}` }, group.language))
      groupMetadata.participants[groupMetadata.participants.findIndex((x) => x.id === message.body)].admin = null
      await database.updateGroupMetadata(message.from, { participants: groupMetadata.participants })
    }

    return aruga.log(
      `${color.hex("#E0B589" as HexColor)("[EVNT]")} ${color.cyan(
        `${
          message.type === WAMessageStubType.GROUP_PARTICIPANT_ADD
            ? "memberAdd"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
            ? "memberRemove"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE
            ? "memberPromote"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE
            ? "memberDemote"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_INVITE
            ? "memberInvite"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
            ? "memberLeave"
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
          message.type === WAMessageStubType.GROUP_PARTICIPANT_ADD
            ? "memberAdd"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
            ? "memberRemove"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE
            ? "memberPromote"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE
            ? "memberDemote"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_INVITE
            ? "memberInvite"
            : message.type === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
            ? "memberLeave"
            : ""
        } [${message.type}]`
      )} from ${color.blue(message.sender.replace(/\D+/g, "") ?? "unknown")} in ${color.blue(group.name || "unknown")}`.trim(),
      "error",
      message.timestamps
    )
  }
}
