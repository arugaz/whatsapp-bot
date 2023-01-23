import type { Command } from "../../types/command"

export const name = "gname"

export default <Command>{
  category: "group",
  aliases: ["gcname", "gtitle", "gctitle"],
  desc: "Change group description",
  groupOnly: true,
  adminGroup: true,
  botGroupAdmin: true,
  example: `
  Change group title
  @PREFIX@CMD <name>
  `.trimEnd(),
  execute: async ({ aruga, message, arg }) => {
    if (!arg) throw "noCmd"

    return await aruga.groupUpdateSubject(message.from, arg)
  }
}
