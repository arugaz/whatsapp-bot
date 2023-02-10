import os from "os"
import path from "path"
import fs from "fs/promises"

/**
 * Generates random string
 *
 * @returns string
 */
export const generateRandString = () => (Math.random() * 36 * Date.now()).toString(36).replace(/\./g, ``)

/**
 * Generates random temp filename
 *
 * @returns temp filename
 */
export const generateTEMP = () => path.join(os.tmpdir(), generateRandString())

/**
 * i just lazy to write force and recursive
 *
 * @param filename filepath
 *
 * @returns
 */
export const removeTEMP = (filename: string) => fs.rm(filename, { force: true, recursive: true })

/**
 * Saves buffer to temporary file
 *
 * @param data Buffer data
 *
 * @param ext File ext?
 *
 * @returns temp filename
 */
export const saveTEMP = async (data: Buffer, ext?: string) => {
  const random = generateTEMP() + (ext ? `.${ext}` : ``)

  await fs.writeFile(random, data)
  return random
}
