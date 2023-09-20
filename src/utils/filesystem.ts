import os from "os"
import path from "path"
import fs from "fs"

/**
 * Generates random string
 * @param length the length of the string
 *
 * @returns the generated string
 */
export const generateRandString = (length = 10) => {
  let text = ""
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

/**
 * i just lazy to write force and recursive
 *
 * @param filename filepath
 *
 * @returns
 */
export function removeTEMP(filename: string): void
export function removeTEMP(filename: string, callback?: (err: Error | null) => void): void
export function removeTEMP(filename: string, callback?: (err: Error | null) => void) {
  if (callback) return fs.rm(filename, { force: true, recursive: true }, callback)

  fs.rmSync(filename, { force: true, recursive: true })
}
/**
 * i just lazy to write force and recursive
 *
 * @param filename filepath
 *
 * @returns
 */
export function removeTEMPAsync(filename: string) {
  return new Promise<void>((resolve, reject) => removeTEMP(filename, (err) => (err ? reject(err) : resolve())))
}

/**
 * Saves buffer to temporary file
 *
 * @param data buffer data
 *
 * @param ext file ext?
 *
 * @returns temp filename
 */
export function saveTEMP(data: Buffer, ext?: string): string
export function saveTEMP(data: Buffer, ext?: string, callback?: (name: string, err: Error | null) => void): void
export function saveTEMP(data: Buffer, ext?: string, callback?: (name: string, err: Error | null) => void) {
  const random = path.join(os.tmpdir(), generateRandString(17) + (ext ? `.${ext}` : ``))

  if (callback) return fs.writeFile(path.join(os.tmpdir(), generateRandString(17)), data, (err) => callback(random, err))

  fs.writeFileSync(path.join(os.tmpdir(), generateRandString(17)), data)

  return random
}
/**
 * Saves buffer to temporary file
 *
 * @param data buffer data
 *
 * @param ext file ext?
 *
 * @returns temp filename
 */
export async function saveTEMPAsync(data: Buffer, ext?: string) {
  return new Promise<string>((resolve, reject) => saveTEMP(data, ext, (name, err) => (err ? reject(err) : resolve(name))))
}
