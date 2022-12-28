import os from "os"
import path from "path"
import fs from "fs/promises"
import axios, { AxiosRequestConfig } from "axios"

// filesystem helper functions

/**
 * Generates random temp filename
 * @returns temp filename
 */
export const generateTEMP = () => path.join(os.tmpdir(), (Math.random() * 36 * Date.now()).toString(36).replace(/\./g, ``))

/**
 * i just lazy to write force and recursive
 * @param filename filepath
 * @returns
 */
export const removeTEMP = (filename: string) => fs.rm(filename, { force: true, recursive: true })

/**
 * Saves buffer to temporary file
 * @param data Buffer data
 * @param ext File ext?
 * @returns temp filename
 */
export const saveTEMP = async (data: Buffer, ext?: string) => {
  const random = generateTEMP() + (ext ? `.${ext}` : ``)

  await fs.writeFile(random, data)
  return random
}

// fetcher helper functions
const fetchDefaultOptions: AxiosRequestConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0"
  }
}

/**
 * Helper HTTP GET Functions
 * @param url url you want to fetch
 * @param opts axios options
 */
export const fetcherGET = <T>(url: string, opts?: AxiosRequestConfig) =>
  new Promise<T>((resolve, reject) =>
    axios
      .get(url, Object.assign(fetchDefaultOptions, opts))
      .then(({ data }) => resolve(data as T))
      .catch(reject)
  )

/**
 * Helper HTTP POST Functions
 * @param url url you want to fetch
 * @param opts axios options
 */
export const fetcherPOST = <T>(url: string, opts?: AxiosRequestConfig) =>
  new Promise<T>((resolve, reject) =>
    axios
      .post(url, Object.assign(fetchDefaultOptions, opts))
      .then(({ data }) => resolve(data as T))
      .catch(reject)
  )
