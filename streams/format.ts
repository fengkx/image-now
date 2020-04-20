import sharp from "../utils/sharp";
import {Duplex} from "stream";
export const supportedFormat = ["jpeg", "png", "webp", "tiff", "heiff", "raw"];
export default (
  format: string,
  quality: number | undefined
): Duplex => {
  if (supportedFormat.includes(format)) {
    return sharp().toFormat(format, { quality });
  } else {
    throw new Error("foramt not support");
  }
};
