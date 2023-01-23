import { spawn } from "child_process"

/**
 * FFMPEG Spawner functions
 * @param bufferData Input BUffer
 * @param options FFMPEG Options
 * @returns Result Buffer
 */
export const ffmpeg = (bufferData: Buffer, options: string[]) =>
  new Promise<Buffer>((resolve, reject) => {
    const result: Uint8Array[] = []
    options = ["-hide_banner", "-loglevel", "error", "-i", "pipe:0", ...options, "-y", "pipe:1"]
    const spawner = spawn("ffmpeg", options, { windowsHide: true })
    spawner.stdout.on("data", (data: Uint8Array) => result.push(data))
    spawner.stdout.on("error", (err) => reject(err))
    spawner.on("error", (err) => reject(err))
    spawner.on("close", () => resolve(Buffer.concat(result)))
    spawner.stdin.on("error", (err) => reject(err))
    spawner.stdin.write(bufferData)
    spawner.stdin.end(() => (bufferData = null))
  })
