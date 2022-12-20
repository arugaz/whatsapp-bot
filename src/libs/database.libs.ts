import { PrismaClient } from "@prisma/client";

const Database = new PrismaClient({
  errorFormat: "pretty",
});

export default Database;
