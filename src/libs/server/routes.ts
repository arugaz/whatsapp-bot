import { FastifyInstance } from "fastify"
import WAClient from "../../libs/whatsapp"

/**
 * This APP Just an example how to use fastify with aruga
 */

export const whatsappRoutes = (fastify: FastifyInstance, aruga: WAClient) => {
  fastify.register(
    async (instance) => {
      instance.addHook("onRequest", async (request, reply) => {
        const { secret } = request.query as { secret: string }
        if (!secret || secret !== process.env.SECRET_API) {
          reply.code(403)
          throw new Error("Unauthorized access")
        }
      })

      // http://127.0.0.1:PORT/api/status?secret=yoursecret
      instance.get("/status", () => {
        return {
          message: aruga.status,
          error: "Success",
          statusCode: 200
        }
      })

      // http://127.0.0.1:PORT/api/send-message?secret=yoursecret&number=628xxx&message=Hello
      instance.route({
        url: "/send-message",
        method: "GET",
        handler: async (request, reply) => {
          const { number, message } = request.query as { number: string; message: string }
          if (aruga.status !== "open") {
            reply.code(500)
            throw new Error("Client not ready")
          }

          await aruga.sendMessage(number.replace(/[^0-9]/g, "") + "@s.whatsapp.net", { text: message })

          return reply.send({
            message: "Succesfully send message",
            error: "Success",
            statusCode: 200
          })
        }
      })
    },
    { prefix: "/api" }
  )
}
