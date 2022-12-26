import os from "os";
import i18n from "../../libs/international.libs";
import config from "../../utils/config.utils";
import { command } from "../../utils/whatsapp.utils";
import { sizeFormat, timeFormat } from "../../utils/format.utils";
import type { Command } from "../../types/command.types";

export default <Command>{
  aliases: ["help"],
  category: "general",
  desc: "Landing menu",
  maintenance: false,
  execute: async ({ aruga, message, prefix, user }) => {
    const text =
      "\n\n" +
      "┏━━「 𓆩 𝐻ɪᴅᴅᴇɴ 𝐹ɪɴᴅᴇʀ ⁣𓆪 」\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.menu.intro.one", { "@PUSHNAME": message.pushname }, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.intro.two", {}, user.language)}\n` +
      "┃\n" +
      "┣━━━━━━━━━━━━━━━━━━\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.menu.detail.one", { "@SZEE": `${sizeFormat(os.totalmem() - os.freemem())} / ${sizeFormat(os.totalmem())}` }, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.detail.two", { "@CMDS": command.commands.size }, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.detail.three", { "@UPTMS": timeFormat(os.uptime() * 1000) }, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.detail.four", {}, user.language)}\n` +
      "┃\n" +
      "┣━━━━━━━━━━━━━━━━━━\n" +
      "┃\n" +
      `┃ ${i18n.translate("commands.general.menu.info.one", {}, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.info.two", {}, user.language)}\n` +
      `┃ ${i18n.translate("commands.general.menu.info.three", { "@COMMANDS": `${prefix}language` }, user.language)}\n` +
      "┃\n" +
      `┗━━「 ꗥ${config.name}ꗥ 」` +
      "\n\n";
    return await aruga.sendMessage(message.from, {
      text,
      footer: config.footer,
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: i18n.translate("commands.general.menu.template.one", {}, user.language),
            url: "https://github.com/arugaz/whatsapp-bot",
          },
        },
        {
          index: 2,
          quickReplyButton: {
            displayText: i18n.translate("commands.general.menu.template.two", {}, user.language),
            id: `${prefix}listmenu`,
          },
        },
        !message.isGroupMsg
          ? {
              index: 3,
              quickReplyButton: {
                displayText: i18n.translate("commands.general.menu.template.three", {}, user.language),
                id: `${prefix}language`,
              },
            }
          : {},
      ],
      viewOnce: true,
    });
  },
};
