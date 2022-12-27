import fs from "fs"
import { join } from "path"

const configPath = join(__dirname, "..", "..", "config.json")

const config: Config = JSON.parse(fs.readFileSync(configPath, "utf-8"))

export default config
