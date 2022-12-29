import cfonts from "cfonts"
import { Cron } from "croner"
import NodeCache from "node-cache"

import * as callHandler from "./handlers/call"
import * as groupHandler from "./handlers/group"
import * as groupParticipantHandler from "./handlers/group-participant"
import * as messageHandler from "./handlers/message"

import WAClient from "./libs/whatsapp"
import Database from "./libs/database"
import { serialize } from "./libs/whatsapp"
import { i18nInit } from "./libs/international"
import config from "./utils/config"

/** Initial Client */
const aruga = new WAClient({
  authType: "multi", // "single" or "multi"
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

/** Handler Events */
setTimeout(() => {
  // handle call events
  aruga.on("call", (call) =>
    serialize
      .call(aruga, call)
      .then((call) => callHandler.execute(aruga, call).catch(() => void 0))
      .catch(() => void 0)
  )

  // handle group events
  aruga.on("group", (message) =>
    serialize
      .group(aruga, message)
      .then((message) => groupHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0)
  )

  // handle group participants events
  aruga.on("group.participant", (message) =>
    serialize
      .groupParticipant(aruga, message)
      .then((message) => groupParticipantHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0)
  )

  // handle message events
  aruga.on("message", (message) =>
    serialize
      .message(aruga, message)
      .then((message) => messageHandler.execute(aruga, message).catch(() => void 0))
      .catch(() => void 0)
  )
}, 0)

/** Cron Job */
// Run CronJob every midnight for reset user limit!
const job1 = new Cron(
  "0 0 0 * * *",
  {
    timezone: config.timeZone
  },
  async () => {
    await Database.user.updateMany({
      where: {
        userId: {
          contains: "s.whatsapp.net"
        }
      },
      data: {
        limit: config.user.limit
      }
    })
  }
)
// Run CronJob every 15mins for reset user prem
const job2 = new Cron(
  "0 */15 * * * *",
  {
    timezone: config.timeZone
  },
  async () => {
    await Database.user.updateMany({
      where: {
        AND: [
          {
            userId: {
              contains: "s.whatsapp.net"
            },
            role: {
              in: ["premium", "vip"]
            },
            expire: {
              lte: Date.now()
            }
          }
        ]
      },
      data: {
        role: "basic",
        expire: 0
      }
    })
  }
)

/** Pretty Sexy :D */
const clearProcess = () => {
  aruga.log("Clear all process", "info")
  job1.stop()
  job2.stop()
  Database.$disconnect()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, clearProcess)

/** Start Client */
setImmediate(async () => {
  try {
    // initialize
    await aruga.startClient()
    process.nextTick(
      () =>
        messageHandler
          .registerCommand("commands")
          .then((size) => aruga.log(`Success Register ${size} commands`))
          .catch(() => void 0),
      i18nInit()
    )

    // logs <3
    cfonts.say("Whatsapp Bot", {
      align: "center",
      colors: ["#8cf57b" as HexColor],
      font: "block",
      space: false
    })
    cfonts.say("'whatsapp-bot' By @arugaz @tobyg74", {
      align: "center",
      font: "console",
      gradient: ["red", "#ee82f8" as HexColor]
    })
  } catch (err: unknown) {
    console.error(err)
    clearProcess()
  }
})
