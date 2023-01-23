import type { Command } from "../../types/command"

export const name = "gdesc"

export default <Command>{
  category: "group",
  aliases: ["gbio", "gcbio", "gcdesc"],
  desc: "Change group description",
  groupOnly: true,
  adminGroup: true,
  botGroupAdmin: true,
  example: `
  Change group description
  @PREFIX@CMD <desc>
  `.trimEnd(),
  execute: async ({ aruga, message, arg }) => {
    if (!arg) throw "noCmd"

    return await aruga.groupUpdateDescription(message.from, arg)
  }
}
