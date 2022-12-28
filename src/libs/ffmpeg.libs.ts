import { spawn } from "child_process"
import { removeTEMP, saveTEMP } from "./../utils/helper.utils"

const ffmpeg = (bufferData: Buffer, options: string[]) =>
  new Promise<Buffer>((resolve, reject) => {
    saveTEMP(bufferData, "ffmpeg").then(inFile => {
      options = ["-y", "-hide_banner", "-loglevel", "error", "-i", inFile, ...options, "pipe:1"]
      const spawner = spawn("ffmpeg", options, { windowsHide: true })
      const result: Buffer[] = []

      spawner.stdout.on("data", (data: Buffer) => result.push(data))
      spawner.on("error", reject)
      spawner.on("close", code => {
        process.nextTick(() => removeTEMP(inFile))
        if (code !== 0) {
          return reject(new Error(`Could not complete the process with exit code ${code}`))
        }
        return resolve(Buffer.concat(result))
      })
    })
  })

export default ffmpeg
