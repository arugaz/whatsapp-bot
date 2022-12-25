import cfonts from "cfonts";
import { fork } from "child_process";
import { join as pathJoin } from "path";

import * as messageHandler from "./handlers/message.handlers";
import * as callHandler from "./handlers/call.handlers";

import Client from "./libs/whatsapp.libs";
import Database from "./libs/database.libs";
import { i18nInit } from "./libs/international.libs";
import color from "./utils/color.utils";
import { serialize } from "./utils/whatsapp.utils";

/** Initial Client */
const aruga = new Client({
  // baileys options
  browser: ["whatsapp-bot", "Safari", "4.0.0"],
  generateHighQualityLinkPreview: true,
});

/** Cron Job */
const CronJob = fork(pathJoin(__dirname, "utils", "cron.utils"));

/** Handler Events */
setTimeout(() => {
  // register commands
  messageHandler.registerCommand();

  // handle call events
  aruga.on("call", (call) =>
    serialize
      .call(aruga, call)
      .then((call) => callHandler.execute(aruga, call).catch(console.error))
      .catch(console.error),
  );

  // handle group events
  aruga.on("group", (msg) => console.log("group", msg));

  // handle group participants events
  aruga.on("group.participant", (msg) => console.log("group.participant", msg));

  // handle message events
  aruga.on("message", (message) =>
    serialize
      .message(aruga, message)
      .then((message) => messageHandler.execute(aruga, message).catch(console.error))
      .catch(console.error),
  );
}, 0);

/** Pretty Sexy :D */
const clearProcess = () => {
  aruga.log("Clear all process", "info");
  CronJob.send("suicide", (gmau) => {
    if (gmau)
      try {
        process.kill(CronJob.pid, "SIGINT");
      } catch {}
    Database.$disconnect()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
};
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, clearProcess);

/** Start Client */
setImmediate(async () => {
  try {
    await aruga.startClient();
    cfonts.say("Whatsapp Bot", {
      align: "center",
      colors: ["#8cf57b" as HexColor],
      font: "block",
      space: false,
    });
    cfonts.say("'whatsapp-bot' By @arugaz @tobyg74", {
      align: "center",
      font: "console",
      gradient: ["red", "#ee82f8" as HexColor],
    });
    CronJob.send("Running CronJob");
    i18nInit();
  } catch (err: unknown) {
    console.error(err);
    clearProcess();
  }
});
