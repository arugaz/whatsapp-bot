import { join as pathJoin } from "path";
import Translate from "@arugaz/translator";
import { lstatSync, readdirSync, readFileSync } from "fs";
import config from "../utils/config.utils";
const International = Translate();

const files = readdirSync(pathJoin(__dirname, "..", "..", "languages"));
for (const file of files) {
  const filePath = pathJoin(__dirname, "..", "..", "languages", file);
  const isDirectory = lstatSync(filePath).isDirectory();
  if (isDirectory || !filePath.endsWith(".json")) continue;
  International.set(file.split(".")[0], JSON.parse(readFileSync(filePath, "utf-8")));
}

// set default language!
International.locale(config.language);
export default International;
