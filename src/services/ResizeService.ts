import sharp from "sharp";

export class ResizeService {

  private static async resizeImage(file: Express.Multer.File, width: number): Promise<Express.Multer.File> {
    const image = sharp(file.buffer)
    image.resize({ width })
    const buffer = await image.toBuffer()
    return { ...file, buffer }
  }

  static checkRatio = async (file: Express.Multer.File, ratio: number) => {
    const image = sharp(file.buffer)
    const metadata = await image.metadata()
    const isRatio = Math.abs(metadata.width! / metadata.height! - ratio) < 0.05
    if (!isRatio) return false
    return true
  }

  static resizeTopicImage = async (cover: Express.Multer.File) => {
    return this.resizeImage(cover, 900)
  }

}
