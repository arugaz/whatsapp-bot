import path from "path";
import fs from "fs/promises";

export const generateTEMP = () =>
  path.join(__dirname, "..", "..", "temp", (Math.random() * 36 * Date.now()).toString(36));

/**
 *  Temporary directory
 */
export const saveTEMP = async (data: Buffer, ext?: string) => {
  const random = generateTEMP() + (ext ? "." + ext : "");

  await fs.writeFile(random, data);
  return random;
};

export const removeTEMP = async (filename: string) => {
  return await fs.rm(filename, { force: true, recursive: true });
};

export const readTEMP = async (filename: string) => {
  return await fs.readFile(filename);
};
