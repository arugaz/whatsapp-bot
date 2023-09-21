import webpmux from "node-webpmux"
import { ffmpeg } from "../../utils/cli"
import type { StickerOptions, StickerCategories } from "../../types/sticker"

export const WebpToImage = (webp: Buffer) => {
  return new Promise<Buffer>((resolve, reject) => {
    ffmpeg(webp, ["-f", "image2"]).then(resolve).catch(reject)
  })
}

const defaultStickerOptions: StickerOptions = {
  author: "arugaz",
  pack: "whatsapp-bot",
  id: "arugaz",
  width: 256,
  fps: 25,
  loop: true,
  compress: 0
}

export class WASticker {
  #opts: StickerOptions
  #exif: Buffer | null

  constructor(opts?: StickerOptions) {
    this.#opts = Object.assign(defaultStickerOptions, opts || {})
    this.#exif = null
  }

  #$_createExif() {
    const data = JSON.stringify({
      "sticker-pack-id": this.#opts.id,
      "sticker-pack-name": this.#opts.pack,
      "sticker-pack-publisher": this.#opts.author,
      "sticker-pack-publisher-email": "arugaastri@gmail.com",
      "sticker-pack-publisher-website": "https://github.com/ArugaZ/whatsapp-bot",
      ...(this.#opts.categories && this.#opts.categories?.length >= 1 ? { emojis: this.#opts.categories } : {}),
      "android-app-store-link": "https://play.google.com/store/apps/details?id=com.supercell.clashofclans",
      "is-first-party-sticker": 1,
      "ios-app-store-link": "https://apps.apple.com/id/app/clash-of-clans/id529479190"
    })
    const exif = Buffer.concat([Buffer.from([73, 73, 42, 0, 8, 0, 0, 0, 1, 0, 65, 87, 7, 0, 0, 0, 0, 0, 22, 0, 0, 0]), Buffer.from(data)])
    exif.writeUIntLE(new TextEncoder().encode(data).length, 14, 4)
    return exif
  }

  #$_convert(bufferData: Buffer, type: string) {
    const bufferSize = bufferData.byteLength
    return new Promise<Buffer>((resolve, reject) =>
      ffmpeg(bufferData, [
        "-vf",
        `scale='min(${this.#opts.width},iw)':min'(${this.#opts.width},ih)':force_original_aspect_ratio=decrease,fps=${this.#opts.fps}, pad=${this.#opts.width}:${this.#opts.width}:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
        "-loop",
        this.#opts.loop ? "0" : "1",
        "-lossless",
        type === "image" ? "1" : "0",
        "-compression_level",
        `${this.#opts.compress}`,
        "-quality",
        type === "image" ? "75" : `${bufferSize < 300000 ? 30 : bufferSize < 400000 ? 20 : 15}`,
        "-preset",
        "picture",
        "-an",
        "-vsync",
        "0",
        "-f",
        "webp"
      ])
        .then((bufferResult) => resolve(this.ConvertExif(bufferResult)))
        .catch(reject)
    )
  }

  /**
   * Extends options pack
   * @param pack Packname
   */
  public setPack(pack: string): this {
    this.#opts.pack = pack
    this.#exif = this.#$_createExif()
    return this
  }

  /**
   * Extends options author
   * @param author Author name
   */
  public setAuthor(author: string): this {
    this.#opts.author = author
    this.#exif = this.#$_createExif()
    return this
  }

  /**
   * Extends options ID
   * @param id Sticker ID
   */
  public setID(id: string): this {
    this.#opts.id = id
    this.#exif = this.#$_createExif()
    return this
  }

  /**
   * Extends options Categories
   * @param categories Sticker Categories
   */
  public setCategories(categories: StickerCategories[]): this {
    this.#opts.categories = categories
    this.#exif = this.#$_createExif()
    return this
  }

  /**
   * Convert media to buffer
   * @param bufferData Media Buffer
   * @returns Webp Buffer
   */
  public async ConvertMedia(bufferData: Buffer, type: "image" | "video" = "image"): Promise<Buffer> {
    this.#exif = this.#exif ? this.#exif : this.#$_createExif()
    const result = await this.#$_convert(bufferData, type)
    return result
  }

  /**
   * Set exif to buffer
   * @param bufferData WEBP Buffer
   * @returns
   */
  public async ConvertExif(bufferData: Buffer) {
    this.#exif = this.#exif ? this.#exif : this.#$_createExif()
    const image = new webpmux.Image()
    await image.load(bufferData)
    image.exif = this.#exif
    return image.save(null)
  }
}
