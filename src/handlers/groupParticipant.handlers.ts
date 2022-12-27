import { WAMessageStubType } from "@adiwajshing/baileys"
import WAClient from "../libs/whatsapp.libs"
import color from "../utils/color.utils"
import { database } from "../utils/whatsapp.utils"
import type { GroupParticipantSerialize } from "../types/serialize.types"

export const execute = async (aruga: WAClient, message: GroupParticipantSerialize): Promise<unknown> => {
  const group = await database.getGroup(message.from)
  const botNumber = aruga.decodeJid(aruga.user.id)
  const isBot = message.body === botNumber || message.sender === botNumber

  try {
    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      console.log(isBot)
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      console.log(isBot)
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_PROMOTE) {
      console.log(isBot)
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_DEMOTE) {
      console.log(isBot)
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_INVITE) {
      console.log(isBot)
    }

    if (message.type === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      console.log(isBot)
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
      "success",
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
