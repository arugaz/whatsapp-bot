import Format from "@arugaz/formatter"
import { parsePhoneNumber } from "awesome-phonenumber"
import config from "../utils/config"

/**
 * Format string to Upper Case, "test string" becomes "Test String"
 *
 * @param string String that you want to format
 *
 * @param split Split the string, default " "
 *
 * @param join Join the string, default " "
 *
 * @returns Formatted upper string
 *
 */
export const upperFormat = (string: string, split = " ", join = " ") => {
  const chunks = string
    .split(split)
    .reduce((prev, curr) => (prev.charAt(0).toUpperCase() + prev.slice(1) + join + curr.charAt(0).toUpperCase() + curr.slice(1)).trim())

  return chunks
}

/**
 * Format string to Lower Case, "TEST STRING" becomes "tEST sTRING"
 *
 * @param string String that you want to format
 *
 * @param split Split the string, default " "
 *
 * @param join Join the string, default " "
 *
 * @returns Formatted upper string
 *
 */
export const lowerFormat = (string: string, split = " ", join = " ") => {
  const chunks = string
    .split(split)
    .reduce((prev, curr) => (prev.charAt(0).toLowerCase() + prev.slice(1) + join + curr.charAt(0).toLowerCase() + curr.slice(1)).trim())

  return chunks
}

/**
 * Format string to segment of N char string, "teststring" becomes "t e s t s t r i n g"
 *
 * @param string String that you want to format
 *
 * @param count N char count, default 1
 *
 * @param join Join the string, default " "
 *
 * @returns Formatted upper string
 *
 */
export const segmentCharFormat = (string: string, count = 1, join = " ") => {
  const chunks = []
  if (count <= 0) count = 1

  for (let i = 0, charsLength = string.length; i < charsLength; i += count) {
    chunks.push(string.substring(i, i + count))
  }
  return chunks.join(join)
}

/**
 * Format string to segment of N word string, "te st st ri ng" becomes "te st\nst ri\nng"
 *
 * @param string String that you want to format
 *
 * @param count N word count, default 2
 *
 * @param split Split the string, default " "
 *
 * @param join Join the string, default "\n"
 *
 * @returns Formatted upper string
 */
export const segmentWordFormat = (string: string, count = 2, split = " ", join = "\n") => {
  const strings = string.split(split)
  const chunks = []

  while (strings.length) {
    chunks.push(strings.splice(0, count).join(" "))
  }

  return chunks.join(join)
}

const sf = Format.sizeFormatter<string>()
/**
 * Format number to Size KB/MB/GB...
 *
 * @param number Number that you want to format
 *
 * @returns string Formatted Size
 */
export const sizeFormat = (number: number) => {
  return sf(number)
}

const tf = Format.durationFormatter<string>()
/**
 * Format number to Time 1s,2h,3d...
 * @param number Number that you want to format
 *
 * @returns Formatted Time
 */
export const timeFormat = (number: number) => {
  return tf(number)
}

/**
 * Format phone number
 *
 * @param number Number that you want to format
 *
 * @return "{@link PhoneFormat}"
 */
export const phoneFormat = (number: string) => {
  const chunks = parsePhoneNumber(`+${number.replace(/\D+/g, "")}`)

  return {
    countryCode: `${chunks.countryCode}`,
    regionCode: `${chunks.regionCode}`.toLowerCase(),
    international: `${chunks.number.international}`
  } as PhoneFormat
}

const rtf = new Intl.RelativeTimeFormat(config.language, { numeric: "auto" })
/**
 * It is the caller's responsibility to handle cut-off logic
 * such as deciding between displaying "in 7 days" or "in 1 week".
 * This API does not support relative dates involving compound units.
 * e.g "in 5 days and 4 hours".
 *
 * @param value -  Numeric value to use in the internationalized relative time message
 *
 * @param unit - [Unit](https://tc39.es/ecma402/#sec-singularrelativetimeunit) to use in the relative time internationalized message.
 *
 * @return Internationalized relative time message as string
 *
 * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/format).
 */
export const rtfFormat = (value: number, unit: Intl.RelativeTimeFormatUnit) => {
  return rtf.format(value, unit)
}
