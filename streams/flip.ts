import sharp from "../utils/sharp";
import {Duplex} from "stream";
const flipStream: Duplex = sharp().flip();
export default flipStream;
