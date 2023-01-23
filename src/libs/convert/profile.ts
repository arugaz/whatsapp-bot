import type { Jimp } from "@jimp/core"
import type { JpegClass } from "@jimp/jpeg"
import type { Scale } from "@jimp/plugin-scale"
import { MIME_JPEG, read, RESIZE_BILINEAR, RESIZE_NEAREST_NEIGHBOR } from "jimp"

export const WAProfile = async (image: Buffer, crop = false) => {
  const jimp = await read(image)
  let cropped: Jimp & JpegClass & Scale
  if (crop) {
    cropped = jimp.crop(0, 0, Math.min(jimp.getWidth(), jimp.getHeight()), Math.min(jimp.getWidth(), jimp.getHeight())).resize(640, 640, RESIZE_BILINEAR).scale(0.7)
  } else {
    cropped = jimp
      .crop(0, 0, jimp.getWidth(), jimp.getHeight())
      .resize(jimp.getWidth() * 0.7, jimp.getHeight() * 0.7, RESIZE_NEAREST_NEIGHBOR)
      .scale(0.7)
  }

  return cropped
    .scale(Math.abs(cropped.getWidth() <= cropped.getHeight() ? cropped.getWidth() / 640 : 640 / cropped.getWidth()))
    .quality(77)
    .getBufferAsync(MIME_JPEG)
}
