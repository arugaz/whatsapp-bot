import Format from "@arugaz/formatter"
import { parsePhoneNumber } from "awesome-phonenumber"

/**
 * Format string to Upper Case, "test string" becomes "Test String"
 * @param string String that you want to format
 * @param split Split the string, default " "
 * @param join Join the string, default " "
 * @returns Formatted upper string
 */
export const upperFormat = (string: string, split = " ", join = " ") => {
  const chunks = string
    .split(split)
    .reduce((prev, curr) => (prev.charAt(0).toUpperCase() + prev.slice(1) + join + curr.charAt(0).toUpperCase() + curr.slice(1)).trim())

  return chunks
}

/**
 * Format string to Lower Case, "TEST STRING" becomes "tEST sTRING"
 * @param string String that you want to format
 * @param split Split the string, default " "
 * @param join Join the string, default " "
 * @returns Formatted upper string
 */
export const lowerFormat = (string: string, split = " ", join = " ") => {
  const chunks = string
    .split(split)
    .reduce((prev, curr) => (prev.charAt(0).toLowerCase() + prev.slice(1) + join + curr.charAt(0).toLowerCase() + curr.slice(1)).trim())

  return chunks
}

/**
 * Format string to segment of N char string, "teststring" becomes "t e s t s t r i n g"
 * @param string String that you want to format
 * @param count N char count, default 1
 * @param join Join the string, default " "
 * @returns Formatted upper string
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
 * @param string String that you want to format
 * @param count N word count, default 2
 * @param split Split the string, default " "
 * @param join Join the string, default "\n"
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

/**
 * Format number to Size KB/MB/GB...
 * @param number Number that you want to format
 * @returns string Formatted Size
 */
export const sizeFormat = (number: number) => {
  const chunks = Format.sizeFormatter<string>()

  return chunks(number)
}

/**
 * Format number to Time 1s,2h,3d...
 * @param number Number that you want to format
 * @returns Formatted Time
 */
export const timeFormat = (number: number) => {
  const chunks = Format.durationFormatter<string>()

  return chunks(number)
}

/**
 * Format phone number
 * @param number Number that you want to format
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
