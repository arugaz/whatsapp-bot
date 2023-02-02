import { Cron } from "croner"
import Database from "../libs/database"
import config from "../utils/config"
import { database } from "../libs/whatsapp"

// Run CronJob every midnight for reset user limit
export const resetUserLimit = new Cron(
  "0 0 0 * * *",
  {
    timezone: config.timeZone
  },
  async () => {
    await Promise.all([
      Database.user.updateMany({
        where: {
          userId: {
            contains: "s.whatsapp.net"
          },
          role: {
            in: ["basic"]
          }
        },
        data: {
          limit: config.user.basic.limit
        }
      }),
      Database.user.updateMany({
        where: {
          userId: {
            contains: "s.whatsapp.net"
          },
          role: {
            in: ["premium"]
          }
        },
        data: {
          limit: config.user.premium.limit
        }
      }),
      Database.user.updateMany({
        where: {
          userId: {
            contains: "s.whatsapp.net"
          },
          role: {
            in: ["vip"]
          }
        },
        data: {
          limit: config.user.vip.limit
        }
      })
    ])

    database.user.flushAll()
  }
)

// Run CronJob every 15mins for reset user role
export const resetUserRole = new Cron(
  "0 */15 * * * *",
  {
    timezone: config.timeZone
  },
  async () => {
    await Database.user.updateMany({
      where: {
        userId: {
          contains: "s.whatsapp.net"
        },
        role: {
          in: ["premium", "vip"]
        },
        expire: {
          lte: Date.now()
        }
      },
      data: {
        role: "basic",
        expire: config.user.basic.expires ? config.user.basic.expires : 0
      }
    })
  }
)
