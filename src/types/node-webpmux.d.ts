declare module "node-webpmux" {
  export class Image {
    constructor()
    exif: Buffer
    load(buffer: Buffer | string): Promise<void>
    save(...args: unknown[]): Promise<Buffer>
  }
}
