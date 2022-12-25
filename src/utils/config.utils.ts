import { readFileSync } from "fs";
import { join } from "path";

const config: Config = JSON.parse(
  readFileSync(join(__dirname, "..", "..", "config.json"), "utf-8"),
);

export default config;
