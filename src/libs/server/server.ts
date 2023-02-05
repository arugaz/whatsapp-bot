import Fastify, { FastifyServerOptions } from "fastify"
import { config as loadEnvFile } from "dotenv"

import fastifyWebsocket from "@fastify/websocket"

loadEnvFile({
  override: !1
})

const fastifyServer = (fastifyOpts?: FastifyServerOptions) => {
  const fastify = Fastify({ ...fastifyOpts })

  fastify.register(fastifyWebsocket)

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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface ProcessEnv {
      NODE_ENV?: "production"
      PORT: number
    }
  }
}
