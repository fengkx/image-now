import sharp from "../utils/sharp";
import {Duplex} from "stream";
const flopStream: Duplex = sharp().flop();
export default flopStream;
