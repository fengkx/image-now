import sharp from "sharp";

export default (
  width: number | undefined,
  height: number | undefined
): NodeJS.ReadableStream => {
  return sharp().resize({ width, height });
};
