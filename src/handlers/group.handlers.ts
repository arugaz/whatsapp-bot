import { WAMessageStubType } from "@adiwajshing/baileys";
import Client from "../libs/whatsapp.libs";
import Database from "../libs/database.libs";
import { GroupSerialize } from "../types/serialize.types";
import color from "../utils/color.utils";

export const execute = async (aruga: Client, message: GroupSerialize): Promise<unknown> => {
  const group = await Database.group.findUnique({ where: { groupId: message.from } });
  const botNumber = aruga.decodeJid(aruga.user.id);
  const isBot = message.body === botNumber || message.sender === botNumber;

  try {
    if (message.type === WAMessageStubType.GROUP_CHANGE_SUBJECT) {
      if (!isBot && group.notify) await aruga.sendMessage(message.from, { text: "Seseorang telah mengganti group title" });
      await Promise.all([
        Database.group.update({
          where: { groupId: message.from },
          data: { name: message.body },
        }),
        Database.groupMetadata.update({
          where: { groupId: message.from },
          data: { subject: message.body },
        }),
      ]);
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_ICON) {
      if (!isBot && group.notify) await aruga.sendMessage(message.from, { text: "Seseorang telah mengganti group profile" });
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_INVITE_LINK) {
      console.log(message);
      if (!isBot && group.notify) await aruga.sendMessage(message.from, { text: "Seseorang telah mengganti group link" });
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_DESCRIPTION) {
      if (!isBot && group.notify) await aruga.sendMessage(message.from, { text: "Seseorang telah mengganti group desc" });
      await Database.groupMetadata.update({
        where: { groupId: message.from },
        data: { desc: message.body },
      });
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_RESTRICT) {
      if (!isBot && group.notify) await aruga.sendMessage(message.from, { text: "Seseorang telah mengganti group restrict (hanya admin yg sabi edit)" });
      await Database.groupMetadata.update({
        where: { groupId: message.from },
        data: { restrict: message.body === "on" },
      });
    }

    if (message.type === WAMessageStubType.GROUP_CHANGE_ANNOUNCE) {
      if (!isBot && group.notify) await aruga.sendMessage(message.from, { text: "Seseorang telah mengganti group announce (hanya admin yg sabi chat)" });
      await Database.groupMetadata.update({
        where: { groupId: message.from },
        data: { announce: message.body === "on" },
      });
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
        } [${message.type}]`,
      )} from ${color.blue(message.sender.replace(/\D+/g, "") ?? "unknown")} in ${color.blue(group.name || "unknown")}`.trim(),
      "success",
      message.timestamps,
    );
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
        } [${message.type}]`,
      )} from ${color.blue(message.sender.replace(/\D+/g, "") ?? "unknown")} in ${color.blue(group.name || "unknown")}`.trim(),
      "error",
      message.timestamps,
    );
  }
};
