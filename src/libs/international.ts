import Translate from "@arugaz/translator"
import { join as pathJoin } from "path"
import { lstatSync, readdirSync, readFileSync } from "fs"
import config from "../utils/config"
const i18n = Translate()

// set default language!
i18n.locale(config.language)

export const i18nInit = (): void => {
  const files = readdirSync(pathJoin(__dirname, "..", "..", "languages"))
  for (const file of files) {
    const filePath = pathJoin(__dirname, "..", "..", "languages", file)
    const isDirectory = lstatSync(filePath).isDirectory()
    if (isDirectory || !file.endsWith(".json")) continue
    i18n.set(file.split(".")[0], JSON.parse(readFileSync(filePath, "utf-8")))
  }
}

export default i18n
