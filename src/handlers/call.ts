import type WAClient from "../libs/whatsapp"
import type { CallSerialize } from "../types/serialize"
import i18n from "../libs/international"
import { database } from "../libs/whatsapp"
import color from "../utils/color"
import config from "../utils/config"

export const execute = async (aruga: WAClient, call: CallSerialize): Promise<unknown> => {
  if (!call.callFrom.endsWith("g.us") && call.status === "offer" && !config.ownerNumber.includes(call.callFrom.replace(/\D+/g, ""))) {
    const user = await database.getUser(call.callFrom)
    try {
      if (config.antiCall.reject) {
        await aruga.rejectCall(call.callId, call.callFrom)

        await call.reply(i18n.translate("handlers.call.reject", {}, user.language))
      }

      if (config.antiCall.block) {
        await aruga.updateBlockStatus(call.callFrom, "block")

        await call.reply(i18n.translate("handlers.call.block", {}, user.language))
      }

      if (config.antiCall.ban) {
        user ? await database.updateUser(call.callFrom, { ban: true }) : await database.createUser(call.callFrom, { name: call.callFrom, ban: true })

        await call.reply(i18n.translate("handlers.call.ban", {}, user.language))
      }

      return aruga.log(`${color.hex("#940c9c" as HexColor)("[CALL]")} ${color.cyan(`>> [${call.callId.length}]`)} from ${color.blue(user?.name || call.callFrom)}`.trim(), "info", Date.now())
    } catch {
      return aruga.log(`${color.hex("#940c9c" as HexColor)("[CALL]")} ${color.cyan(`>> [${call.callId.length}]`)} from ${color.blue(user?.name || call.callFrom)}`.trim(), "error", Date.now())
    }
  }
}
