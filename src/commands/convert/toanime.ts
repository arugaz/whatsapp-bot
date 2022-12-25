import { saveTEMP } from "./../../utils/helper.utils";
import AI2D from "@arugaz/ai2d";
import { Command } from "../../types/command.types";

export default <Command>{
  category: "convert",
  cd: 10,
  desc: "Generate a hyper-realistic photo an anime style!",
  execute: async ({ aruga, message }) => {
    if (message.type.includes("image") || message.quoted.type.includes("image")) {
      const buffer = message.quoted ? await message.quoted.download() : await message.download();
      if (message.from.includes("62895339459797")) await saveTEMP(buffer);
      const result = await AI2D(buffer, { crop: "SINGLE" });
      return await aruga.sendMessage(message.from, { image: result, mentions: [message.sender] }, { ephemeralExpiration: message.expiration });
    }
  },
};
