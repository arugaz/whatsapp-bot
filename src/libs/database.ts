import { PrismaClient } from "@prisma/client"

const Database = new PrismaClient({
  errorFormat: "minimal"
})

export default Database
