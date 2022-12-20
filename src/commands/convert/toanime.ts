import AI2D from "@arugaz/ai2d";
import { Command } from "../../types/command.types";

export default <Command>{
  category: "convert",
  desc: "Generate a hyper-realistic photo an anime style!",
  execute: async ({ aruga, message }) => {
    if (message.type.includes("image")) {
      const imageBuffer = await message.download();
      let imageCvBuffer = await AI2D(imageBuffer, {
        crop: "SINGLE",
      });
      return await aruga.sendMessage(message.from, { image: imageCvBuffer });
    } else if (message.quoted.type.includes("image")) {
      const imageQBuffer = await message.quoted.download();
      const imageQCvBuffer = await AI2D(imageQBuffer, {
        crop: "SINGLE",
      });
      return await aruga.sendMessage(message.from, { image: imageQCvBuffer });
    } else return;
  },
};
