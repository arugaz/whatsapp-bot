import { Cron } from "croner";
import config from "./config.utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Run CronJob every midnight for reset user limit!
 */
const job = Cron(
  "0 0 0 * * *",
  {
    maxRuns: Infinity,
    timezone: config.timeZone,
  },
  async () => {
    await prisma.user.updateMany({
      where: {
        userId: {
          contains: "@s.whatsapp.net",
        },
      },
      data: {
        limit: config.user.limit || 30,
      },
    });
  },
);

process.on("message", (message) => {
  if (message === "suicide") {
    job.stop();
    prisma
      .$disconnect()
      .then(() => {
        process.exit(0);
      })
      .catch(process.exit(1));
  }
  console.log("%s %s %d%s", message, "with pid", process.pid, "...");
});
