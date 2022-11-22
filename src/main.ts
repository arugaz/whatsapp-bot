import { Browsers } from "@adiwajshing/baileys";
import Client from "./libs/whatsapp.libs";
import MessageHandler from "./handlers/message.handler";

const aruga = new Client({
  browser: Browsers.appropriate("Desktop"),
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
});

const start = () => {
  const messageHandler = new MessageHandler(aruga);

  messageHandler.registerCommand();
  aruga.ev.on(
    "messages.upsert",
    (msg) =>
      msg.type === "notify" &&
      msg.messages.length >= 1 &&
      !!msg.messages[0].message &&
      messageHandler
        .serialize(msg.messages[0])
        .then((message) => messageHandler.execute(message).catch((err) => aruga.log((err as Error).message || (typeof err === "string" ? err : "Unexpected error"), "error")))
        // log full error for debugging purposes
        .catch((err) => console.error(err as Error)),
  );

  aruga.ev.on("call", (c) => console.log(c));
};

aruga
  .startClient()
  .then(() => start())
  .catch((err) => {
    // log full error for debugging purposes
    console.error(err as Error);
    aruga.DB.$disconnect().then(process.exit(0)).catch(process.exit(1));
  });
