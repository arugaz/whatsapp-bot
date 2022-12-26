import type Client from "../libs/whatsapp.libs";
import type { CallSerialize } from "../types/serialize.types";
import i18n from "../libs/international.libs";
import color from "../utils/color.utils";
import config from "../utils/config.utils";
import { database } from "../utils/whatsapp.utils";

export const execute = async (aruga: Client, call: CallSerialize): Promise<unknown> => {
  if (!call.callFrom.endsWith("g.us") && call.status === "offer" && !config.ownerNumber.includes(call.callFrom.replace(/\D+/g, ""))) {
    const user = await database.getUser(call.callFrom);

    if (config.antiCall.reject) {
      await aruga.rejectCall(call.callId, call.callFrom);
      // check if the user has interacted with the bot before, prevent from being banned
      if (user) await call.reply(i18n.translate("handlers.call.reject", {}, user.language));
    }

    if (config.antiCall.block) {
      await aruga.updateBlockStatus(call.callFrom, "block");
      // check if the user has interacted with the bot before, prevent from being banned
      if (user) await call.reply(i18n.translate("handlers.call.block", {}, user.language));
    }

    if (config.antiCall.ban) {
      if (user) {
        await database.updateUser(call.callFrom, { ban: true });
        // check if the user has interacted with the bot before, prevent from being banned
        await call.reply(i18n.translate("handlers.call.ban", {}, user.language));
      } else await database.createUser(call.callFrom, { name: call.callFrom, ban: true });
    }

    return aruga.log(`${color.hex("#940c9c" as HexColor)("[CALL]")} ${color.cyan(`>> [${call.callId.length}]`)} from ${color.blue(user?.name || call.callFrom)}`.trim(), "info", Date.now());
  }
};
