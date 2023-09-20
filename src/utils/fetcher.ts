import FormData from "form-data"
import axios, { AxiosRequestConfig } from "axios"
import { generateRandString } from "../utils/filesystem"

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
export const fetcherPOST = <T>(url: string, data: unknown, opts?: AxiosRequestConfig) =>
  new Promise<T>((resolve, reject) =>
    axios
      .post(url, data, Object.assign(fetchDefaultOptions, opts))
      .then(({ data }) => resolve(data as T))
      .catch(reject)
  )

/**
 * Helper HTTP GET Buffer
 * @param url url you want to fetch
 * @param opts axios options
 * @returns [content-type, Buffer]
 */
export const fetcherBuffer = (url: string, opts?: AxiosRequestConfig) =>
  new Promise<[string, Buffer]>((resolve, reject) =>
    axios
      .get(url, Object.assign(fetchDefaultOptions, { ...opts, responseType: "arraybuffer" }))
      .then((res) => {
        resolve([res.headers["content-type"], res.data as Buffer])
      })
      .catch(reject)
  )

/**
 * Upload media to telegraph server
 * @param buffData Buffer you want to upload
 * @param ext Buffer extension, like mp4, m3u8, jpeg etc..
 * @returns telegraph media url
 */
export const uploadMedia = (buffData: Buffer, ext: string) =>
  new Promise<string>((resolve, reject) => {
    const form = new FormData()
    form.append("file", buffData, `temp${generateRandString(16)}.${ext}`)
    fetcherPOST<{ src: string }[]>("https://telegra.ph/upload", form, {
      headers: {
        ...form.getHeaders()
      }
    })
      .then((data) => resolve("https://telegra.ph" + data[0].src))
      .catch(reject)
  })
