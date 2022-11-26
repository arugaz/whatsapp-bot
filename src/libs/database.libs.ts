import { PrismaClient } from "@prisma/client";

const Database = new PrismaClient({
  log: ["warn", "error"],
  errorFormat: "pretty",
});

export default Database;
