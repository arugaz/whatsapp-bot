import Fastify, { FastifyServerOptions } from "fastify"

const fastifyServer = (fastifyOpts?: FastifyServerOptions) => {
  const fastify = Fastify({ ...fastifyOpts })

  fastify
    /**
     * Health check
     */
    .get("/healthcheck", () => {
      return {
        message: "I'm healthy!",
        error: "Success",
        statusCode: 200
      }
    })

  return fastify
}

export default fastifyServer
