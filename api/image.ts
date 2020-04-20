import { NowRequest, NowResponse } from "@now/node";
import setupFetch from "@zeit/fetch";
import nodeFetch from "node-fetch";
import pump from "pump";
import resizeStream from "../streams/resize";
import formatStream from "../streams/format";
import rotateStream from "../streams/rotate";
import flipStream from "../streams/flip";
import flopStream from "../streams/flop";
import getFromat from "../utils/getFromat";
import {Duplex} from "stream";

export default async function(req: NowRequest, res: NowResponse) {
  const fetch = setupFetch(nodeFetch);
  let { url, w, h, q, f, output, ro, rbg } = req.query;

  // normalize arguments
  if (
    Array.isArray(url) ||
    Array.isArray(w) ||
    Array.isArray(h) ||
    Array.isArray(q) ||
    Array.isArray(f) ||
    Array.isArray(output) ||
    Array.isArray(ro) ||
    Array.isArray(rbg)
  ) {
    res.status(400).send("should only have one parameter each");
    return;
  }
  let width, height, quality;
  try {
    if (w) width = parseInt(w, 10);
    if (h) height = parseInt(h, 10);
    if (q) quality = parseInt(q, 10);
    if (
      (width && Number.isNaN(width)) ||
      (height && Number.isNaN(height)) ||
      (quality && Number.isNaN(quality))
    )
      throw new Error("w h quality should be valid number");
    if (quality && (quality <= 0 || quality > 100)) {
      throw new Error("q should be number between 1 to 100");
    }
  } catch (e) {
    res.status(400).send(e.message || "w h should be valid number");
    return;
  }

  const resp = await fetch(url);
  const headers = resp.headers;
  const contentDisposition = headers.get("Content-Disposition");
  const contentType = headers.get("Content-Type");
  const imgStream = await resp.body;
  const streamArr: Array<NodeJS.ReadableStream | NodeJS.WritableStream| Duplex> = [imgStream, resizeStream(width, height)];
  const sourceFormat = getFromat(resp, url);
  const format: string = output || f || sourceFormat || "png"; // fallback png
  streamArr.push(formatStream(format, quality));
  if (contentDisposition) {
    res.setHeader("Content-Disposition", contentDisposition);
  } else if(req.query.filename) {
    const fname = Array.isArray(req.query.filename) ? req.query.filename[0]: req.query.filename;
    res.setHeader("Content-Disposition", `inline; filename="${fname}"`);
  }
  if(ro) {
    const angle = parseInt(ro, 10);
    streamArr.push(rotateStream(isNaN(angle) ? 0: angle, rbg));
  }
  if('flip' in req.query) {
    streamArr.push(flipStream);
  }
  if('flop' in req.query) {
    streamArr.push(flopStream)
  }
  res.setHeader('Content-Type', `image/${format}`);
  res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200);
  pump(...streamArr, res);
}
