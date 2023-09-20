import { inspect } from "util"

import cfonts from "cfonts"
import qrcode from "qrcode"
import NodeCache from "node-cache"

import fastifyServer, { whatsappRoutes } from "./libs/server"
import WAClient, { serialize } from "./libs/whatsapp"
import Database from "./libs/database"
import { i18nInit } from "./libs/international"

import * as callHandler from "./handlers/call"
import * as groupHandler from "./handlers/group"
import * as groupParticipantHandler from "./handlers/group-participant"
import * as messageHandler from "./handlers/message"

import { resetUserLimit, resetUserRole } from "./utils/cron"

/** Initial Server */
const fastify = fastifyServer({
  // fastify options
  trustProxy: true
})

/** Initial Whatsapp Client */
const aruga = new WAClient({
  // auth type "single" or "multi"
  authType: "single",
  // baileys options
  generateHighQualityLinkPreview: true,
  mediaCache: new NodeCache({
    stdTTL: 60 * 5, // 5 mins
    useClones: false
  }),
  syncFullHistory: false,
  userDevicesCache: new NodeCache({
    stdTTL: 60 * 10, // 10 mins
    useClones: false
  })
})

/** Handler Event */
;(() => {
  // handle call event
  aruga.on("call", (call) =>
    serialize
      .call(aruga, call)
      .then((call) => callHandler.execute(aruga, call).catch(() => void 0))
      .catch(() => void 0)
  )

  // handle group event
  aruga.on("group", (message) =>
    serialize
      .group(aruga, message)
      .then((message) => groupHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0)
  )

  // handle group participants event
  aruga.on("group.participant", (message) =>
    serialize
      .groupParticipant(aruga, message)
      .then((message) => groupParticipantHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0)
  )

  // handle message event
  aruga.on("message", (message) =>
    serialize
      .message(aruga, message)
      .then((message) => messageHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0)
  )

  // handle qr code event
  aruga.on("qr", (qrCode) =>
    qrcode
      .toString(qrCode, { type: "terminal", small: true })
      .then((qrResult) => console.log(qrResult))
      .catch(() => void 0)
  )
})()

/** Pretty Sexy :D */
const clearProcess = async () => {
  aruga.log("Clear all process", "info")
  try {
    resetUserLimit.stop()
    resetUserRole.stop()
    await fastify.close()
    await Database.$disconnect()
    process.exit(0)
  } catch {
    process.exit(1)
  }
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, clearProcess)
for (const signal of ["unhandledRejection", "uncaughtException"]) process.on(signal, (reason: unknown) => aruga.log(inspect(reason, true), "error"))

/** Start Client */
setImmediate(async () => {
  try {
    /** api routes */
    whatsappRoutes(fastify, aruga)

    // initialize
    await aruga.startClient()
    await fastify.ready()

    process.nextTick(
      () =>
        messageHandler
          .registerCommand("commands")
          .then((size) => aruga.log(`Success Register ${size} commands`))
          .catch((err) => {
            aruga.log(inspect(err, true), "error")
            clearProcess()
          }),
      fastify
        .listen({ host: "127.0.0.1", port: process.env.PORT || 3000 })
        .then((address) => aruga.log(`Server run on ${address}`))
        .catch((err) => {
          aruga.log(inspect(err, true), "error")
          clearProcess()
        }),
      i18nInit()
    )

    // logs <3
    cfonts.say("Whatsapp Bot", {
      align: "center",
      colors: ["#8cf57b" as HexColor],
      font: "block",
      space: false
    })
    cfonts.say("'whatsapp-bot' By @hidden-finder", {
      align: "center",
      font: "console",
      gradient: ["red", "#ee82f8" as HexColor]
    })
  } catch (err: unknown) {
    aruga.log(inspect(err, true), "error")
    clearProcess()
  }
})
