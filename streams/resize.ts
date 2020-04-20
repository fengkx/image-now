import sharp from "../utils/sharp";
import {FitEnum} from 'sharp';
const knownFits = ['cover', 'contain', 'fill', 'inside', 'outside'] as const;
export default (
  width: number | undefined,
  height: number | undefined,
  fit: keyof FitEnum = 'fill'
): NodeJS.ReadableStream => {
  if(!knownFits.includes(fit)) {
    fit = 'fill';
  }
  return sharp().resize({ width, height, fit });
};
