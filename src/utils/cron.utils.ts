import { Cron } from "croner";
import config from "../utils/config.utils";
import Database from "../libs/database.libs";

/**
 * Run CronJob every midnight for reset user limit!
 */
const job1 = new Cron(
  "0 0 0 * * *",
  {
    timezone: config.timeZone,
  },
  async () => {
    await Database.user.updateMany({
      where: {
        userId: {
          contains: "s.whatsapp.net",
        },
      },
      data: {
        limit: config.user.limit || 30,
      },
    });
  },
);

const job2 = Cron(
  "0 0 0 * * *",
  {
    timezone: config.timeZone,
  },
  async () => {
    await Database.user.updateMany({
      where: {
        AND: [
          {
            userId: {
              contains: "s.whatsapp.net",
            },
            expire: {
              lte: Date.now(),
            },
          },
        ],
      },
      data: {
        role: "basic",
        expire: 0,
      },
    });
  },
);

process.on("message", (message) => {
  if (message === "suicide") {
    job1.stop();
    job2.stop();
    Database.$disconnect()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
  console.log("%s %s %d%s", message, "with pid", process.pid, "...");
});
