import sharp from "../utils/sharp";

export default (
  width: number | undefined,
  height: number | undefined
): NodeJS.ReadableStream => {
  return sharp().resize({ width, height, fit: 'fill' });
};
