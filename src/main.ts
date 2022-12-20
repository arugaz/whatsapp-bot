import cfonts from "cfonts";
import { fork } from "child_process";
import { join as pathJoin } from "path";
import { Browsers } from "@adiwajshing/baileys";
import * as messageHandler from "./handlers/message.handlers";
import Client from "./libs/whatsapp.libs";
import Database from "./libs/database.libs";
import { i18nInit } from "./libs/international.libs";
import color from "./utils/color.utils";

const aruga = new Client({
  // baileys options
  browser: Browsers.appropriate("Desktop"),
  syncFullHistory: true,
});

const start = () => {
  messageHandler.registerCommand();
  aruga.on("message", (msg) =>
    messageHandler
      .serialize(aruga, msg)
      .then((message) => messageHandler.execute(aruga, message).catch((err) => console.error(err)))
      .catch((err) => console.error(err)),
  );

  aruga.on("call", (call) => console.log(call));
};

const CronJob = fork(pathJoin(__dirname, "utils", "cron.utils"));

aruga
  .startClient()
  .then(() => {
    cfonts.say("Whatsapp Bot", {
      align: "center",
      colors: [color.cfonts("#8cf57b")],
      font: "block",
      space: false,
    });
    cfonts.say("'whatsapp-bot' By @arugaz @tobyg74", {
      align: "center",
      font: "console",
      gradient: ["red", color.cfonts("#ee82f8")],
    });
    CronJob.send("Running CronJob");
    i18nInit();
    start();
  })
  .catch((err) => {
    console.error(err);
    clearProcess();
  });

// pretty sexy :D
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
