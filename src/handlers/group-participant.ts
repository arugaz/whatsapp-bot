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
  const isBot = message.body.includes(botNumber) || message.sender === botNumber

  try {
    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_ADD || message.type === WAMessageStubType.GROUP_PARTICIPANT_INVITE) {
      if (group.anticountry.active && groupMetadata.participants.find((member) => member.id === botNumber && member.admin)) {
        process.nextTick(async () => {
          for (const participant of message.body) {
            if (group.anticountry.number.includes(phoneFormat(participant).countryCode)) {
              await aruga.groupParticipantsUpdate(message.from, [participant], "remove")
            }
          }
        })
        await message.reply(
          i18n.translate(
            "handlers.group-participant.anticountry",
            {
              "@PPL": `${message.body
                .map((participant) => `@${participant.replace(/\D+/g, "")}`)
                .join(" ")
                .trimEnd()}`,
              "@NUM": group.anticountry.number.join(", ").trim()
            },
            group.language
          )
        )
      } else {
        for (const participant of message.body) {
          if (!groupMetadata.participants.map((v) => v.id).includes(participant)) {
            groupMetadata.participants.push({ id: participant, admin: null })
          }
        }
        await database.updateGroupMetadata(message.from, { participants: groupMetadata.participants })
      }
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || message.type === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      if (message.body.includes(botNumber)) {
        await Promise.all([database.deleteGroup(message.from), database.deleteGroupMetadata(message.from)])
      } else {
        for (const participant of message.body) {
          if (groupMetadata.participants.map((v) => v.id).includes(participant)) {
            groupMetadata.participants.splice(
              groupMetadata.participants.findIndex((x) => x.id === participant),
              1
            )
          }
        }
        await database.updateGroupMetadata(message.from, { participants: groupMetadata.participants })
      }
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE) {
      if (!isBot && group.notify)
        await message.reply(
          i18n.translate(
            "handlers.group-participant.promote",
            {
              "@ADM": `@${message.sender.replace(/\D+/g, "")}`,
              "@PPL": `${message.body
                .map((participant) => `@${participant.replace(/\D+/g, "")}`)
                .join(" ")
                .trimEnd()}`
            },
            group.language
          )
        )
      for (const participant of message.body) {
        groupMetadata.participants[groupMetadata.participants.findIndex((x) => x.id === participant)].admin = "admin"
      }
      await database.updateGroupMetadata(message.from, { participants: groupMetadata.participants })
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE) {
      if (!isBot && group.notify)
        await message.reply(
          i18n.translate(
            "handlers.group-participant.demote",
            {
              "@ADM": `@${message.sender.replace(/\D+/g, "")}`,
              "@PPL": `${message.body
                .map((participant) => `@${participant.replace(/\D+/g, "")}`)
                .join(" ")
                .trimEnd()}`
            },
            group.language
          )
        )
      for (const participant of message.body) {
        groupMetadata.participants[groupMetadata.participants.findIndex((x) => x.id === participant)].admin = null
      }
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
