import cfonts from "cfonts";
import { fork } from "child_process";
import { join as pathJoin } from "path";
import NodeCache from "@arugaz/node-cache";

import * as callHandler from "./handlers/call.handlers";
import * as groupHandler from "./handlers/group.handlers";
import * as groupParticipantHandler from "./handlers/groupParticipant.handlers";
import * as messageHandler from "./handlers/message.handlers";

import Client from "./libs/whatsapp.libs";
import Database from "./libs/database.libs";
import { i18nInit } from "./libs/international.libs";
import { serialize } from "./utils/whatsapp.utils";

/** Initial Client */
const aruga = new Client({
  // baileys options
  generateHighQualityLinkPreview: true,
  mediaCache: new NodeCache({
    stdTTL: 60 * 5, // 5 mins
    useClones: false,
  }),
  syncFullHistory: false,
  userDevicesCache: new NodeCache({
    stdTTL: 60 * 10, // 10 mins
    useClones: false,
  }),
});

/** Cron Job */
const CronJob = fork(pathJoin(__dirname, "utils", "cron.utils"));

/** Handler Events */
setTimeout(() => {
  // handle call events
  aruga.on("call", (call) =>
    serialize
      .call(aruga, call)
      .then((call) => callHandler.execute(aruga, call).catch(() => void 0))
      .catch(() => null),
  );

  // handle group events
  aruga.on("group", (message) =>
    serialize
      .group(aruga, message)
      .then((message) => groupHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => null),
  );

  // handle group participants events
  aruga.on("group.participant", (message) =>
    serialize
      .groupParticipant(aruga, message)
      .then((message) => groupParticipantHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0),
  );

  // handle message events
  aruga.on("message", (message) =>
    serialize
      .message(aruga, message)
      .then((message) => messageHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0),
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
    // initialize
    await aruga.startClient();
    process.nextTick(
      () =>
        messageHandler
          .registerCommand("commands")
          .then((size) => aruga.log(`Success Register ${size} commands`))
          .catch(() => void 0),
      i18nInit(),
    );

    // logs <3
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
  } catch (err: unknown) {
    console.error(err);
    clearProcess();
  }
});
