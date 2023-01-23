import Translate from "@arugaz/translator"
import { join as pathJoin } from "path"
import { lstatSync, readdirSync, readFileSync } from "fs"
import config from "../utils/config"
const i18n = Translate()

// set default language!
i18n.locale(config.language)

export const i18nInit = (): void => {
  const listISO = (
    JSON.parse(readFileSync(pathJoin(__dirname, "..", "..", "database", "languages.json"), { encoding: "utf-8" })) as {
      iso: string
      lang: string
    }[]
  ).map((v) => v.iso)

  const files = readdirSync(pathJoin(__dirname, "..", "..", "languages"))
  for (const file of files) {
    const filePath = pathJoin(__dirname, "..", "..", "languages", file)
    const isDirectory = lstatSync(filePath).isDirectory()
    if (isDirectory || !file.endsWith(".json")) continue
    const iso = file.split(".")[0]
    if (listISO.includes(iso)) i18n.set(iso, JSON.parse(readFileSync(filePath, "utf-8")))
  }
}

export default i18n
