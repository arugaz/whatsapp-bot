import { spawn } from "child_process"

/**
 * FFMPEG Spawner functions
 * @param bufferData Input BUffer
 * @param options FFMPEG Options
 * @returns Result Buffer
 */
const ffmpeg = (bufferData: Buffer, options: string[]) =>
  new Promise<Buffer>((resolve, reject) => {
    const result = new Array<Uint8Array>()
    options = ["-hide_banner", "-loglevel", "error", "-i", "pipe:0", ...options, "-y", "pipe:1"]
    const spawner = spawn("ffmpeg", options, { windowsHide: true })
    spawner.stdout.on("data", (data: Uint8Array) => result.push(data))
    spawner.on("error", reject)
    spawner.on("close", (code, signal) => {
      process.nextTick(() => spawner.stdin.destroy())
      if (code !== 0) {
        return reject(new Error(`Could not complete the process with exit code ${code} & signal ${signal}`))
      }
      return resolve(Buffer.concat(result))
    })
    spawner.stdin.write(bufferData)
    spawner.stdin.end(() => bufferData.fill(0))
  })

export default ffmpeg
