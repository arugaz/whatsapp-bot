import { FastifyInstance } from "fastify"
import WAClient from "../../libs/whatsapp"

export const whatsappRoutes = (fastify: FastifyInstance, aruga: WAClient) => {
  fastify.register(
    async (child) => {
      child.addHook("onRequest", async (request, reply) => {
        const { secret } = request.query as { secret: string }
        if (!secret || secret !== process.env.SECRET_API) {
          reply.code(403)
          throw new Error("Unauthorized access")
        }
      })

      // http://127.0.0.1:PORT/api/status?secret=yoursecret
      child.get("/status", async () => {
        return {
          message: aruga.status,
          error: "Success",
          statusCode: 200
        }
      })
    },
    { prefix: "/api" }
  )
}
