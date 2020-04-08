import MimeType from "whatwg-mimetype";
import { Response } from "node-fetch";
function getSuffixName(url: string) {
  const regex = /\.(\w+)$/;
  const matches = url.match(regex);
  if (!matches || matches.length === 1) return undefined;
  return matches[1].toLowerCase();
}

export default (response: Response, url: string) => {
  let result: string | undefined;
  const contentType = response.headers.get("content-type") || "";
  try {
    const mimeType = new MimeType(contentType);
    if (mimeType.type === "image") {
      result = mimeType.subtype;
      return result;
    }
    result = getSuffixName(url);
  } catch (e) {
    result = getSuffixName(url);
  }
  return result;
};
