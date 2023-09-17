import type { Jimp } from "@jimp/core"
import type { JpegClass } from "@jimp/jpeg"
import type { Scale } from "@jimp/plugin-scale"
import { MIME_JPEG, read, RESIZE_BILINEAR } from "jimp"

export const WAProfile = async (image: Buffer, crop = false) => {
  const jimp = await read(image)
  let cropped: Jimp & JpegClass & Scale
  if (crop) {
    const minSize = Math.min(jimp.getWidth(), jimp.getHeight())
    cropped = jimp.crop(0, 0, minSize, minSize).resize(640, 640, RESIZE_BILINEAR)
  } else {
    cropped = jimp.resize(jimp.getWidth() * 0.7, jimp.getHeight() * 0.7, RESIZE_BILINEAR)
  }

  return cropped
    .scale(Math.abs(cropped.getWidth() <= cropped.getHeight() ? 640 / cropped.getHeight() : 640 / cropped.getWidth()))
    .quality(50)
    .getBufferAsync(MIME_JPEG)
}
