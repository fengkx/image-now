import sharp from "../utils/sharp";
export const supportedFormat = ["jpeg", "png", "webp", "tiff", "heiff", "raw"];
export default (
  format: string,
  quality: number | undefined
): NodeJS.ReadableStream => {
  if (supportedFormat.includes(format)) {
    return sharp().toFormat(format, { quality });
  } else {
    throw new Error("foramt not support");
  }
};
