import { Cron } from "croner"
import Database from "../libs/database"
import config from "../utils/config"

// Run CronJob every midnight for reset user limit
export const resetUserLimit = new Cron(
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

// Run CronJob every 15mins for reset user role
export const resetUserRole = new Cron(
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
