import sharp from "../utils/sharp";
import {Duplex} from "stream";
export default (
    angle: number,
    background?: string
): Duplex => {
    return sharp().rotate(angle, {background});
};
