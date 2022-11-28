import cfonts from "cfonts";
import { fork } from "child_process";
import { join as pathJoin } from "path";
import { Browsers } from "@adiwajshing/baileys";
import MessageHandler from "./handlers/message.handler";
import Client from "./libs/whatsapp.libs";
import color from "./utils/color.utils";

const aruga = new Client({
  authType: "multi", // "single" or "multi"
  browser: Browsers.appropriate("Desktop"),
  syncFullHistory: true,
});

const start = () => {
  const messageHandler = new MessageHandler(aruga);

  messageHandler.registerCommand();
  aruga.on("message", (msg) =>
    messageHandler
      .serialize(msg)
      .then((message) =>
        messageHandler
          .execute((msg?.messageTimestamp as number) * 1000 || Date.now(), message)
          // log full error for debugging purposes
          .catch((err) => console.error(err)),
      )
      // log full error for debugging purposes
      .catch((err) => console.error(err)),
  );

  aruga.on("call", (c) => console.log(c));
};

const CronJob = fork(pathJoin(__dirname, "utils", "cron.utils"));
const clearProcess = () => {
  aruga.log(`${color.hex("#ff7f00")(`${new Date(Date.now()).toLocaleString("en-US", { timeZone: aruga.config.timeZone })}`) + " " + "Clear all process"}`, "info");
  CronJob.send("suicide", (err) => {
    if (err) process.kill(CronJob.pid, "SIGINT");
    aruga.DB.$disconnect().then(process.exit(0)).catch(process.exit(1));
  });
};

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
    CronJob.send(color.blue("[ V ]") + ` ${color.hex("#ff7f00")(`${new Date(Date.now()).toLocaleString("en-US", { timeZone: aruga.config.timeZone })}`) + " " + "Running CronJob"}`);
    start();
  })
  .catch((err) => {
    // log full error for debugging purposes
    console.error(err);
    clearProcess();
  });

process.on("SIGINT", clearProcess);
process.on("SIGTERM", clearProcess);
